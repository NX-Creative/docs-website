#!/usr/bin/env node
// Publishes the latest version block of every changelog.mdx under
// content/docs/scripts/<resource>/changelog.mdx to a Discord webhook.
//
// State is stored in scripts/discord-messages.json:
//   { "<resource>@<version>": { "messageId": "...", "hash": "..." } }
//
// First run for a (resource, version) → POST a new webhook message.
// Re-run with same version + same content hash → no-op.
// Re-run with same version + changed content → PATCH the existing message.
// New version → POST a new message (and remember its id).

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const SCRIPTS_DIR = join(REPO_ROOT, 'content/docs/scripts');
const STATE_FILE = join(__dirname, 'discord-messages.json');

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const DOCS_SITE = process.env.DOCS_SITE_URL || 'https://docs.nxcreative.tech';
const EMBED_COLOR = 0x6366f1;
const DESC_LIMIT = 4096;
const READ_MORE_SUFFIX = '\n\n[Read full changelog →]({url})';

if (!WEBHOOK_URL) {
    console.error('DISCORD_WEBHOOK_URL is not set.');
    process.exit(1);
}

function loadState() {
    if (!existsSync(STATE_FILE)) return {};
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
}

function saveState(state) {
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n');
}

function hash(s) {
    return createHash('sha256').update(s).digest('hex').slice(0, 16);
}

function findChangelogs() {
    const out = [];
    for (const entry of readdirSync(SCRIPTS_DIR, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const path = join(SCRIPTS_DIR, entry.name, 'changelog.mdx');
        if (existsSync(path)) out.push({ resource: entry.name, path });
    }
    return out;
}

// Parse latest version block from MDX. Strips frontmatter, splits on `\n## `
// version headings, and returns the first one. We split rather than regex to
// avoid `m`-flag end-of-line vs. end-of-string ambiguity.
function parseLatestVersion(mdx) {
    const body = mdx.replace(/^---\n[\s\S]*?\n---\n/, '');
    const sections = body.split(/\n(?=##\s+\d+\.\d+\.\d+)/);
    for (const section of sections) {
        const head = section.match(/^##\s+(\d+\.\d+\.\d+)(?:\s+\(([^)]+)\))?\s*\n/);
        if (!head) continue;
        return {
            version: head[1],
            date: head[2] || null,
            body: section.slice(head[0].length).trim(),
        };
    }
    return null;
}

function buildEmbed({ resource, version, date, body, changelogUrl }) {
    const title = `nx_${resource.replace(/^nx_/, '')} v${version}`;
    const suffix = READ_MORE_SUFFIX.replace('{url}', changelogUrl);

    let description = body;
    if (description.length > DESC_LIMIT) {
        const budget = DESC_LIMIT - suffix.length;
        const truncated = description.slice(0, budget);
        const lastNewline = truncated.lastIndexOf('\n');
        description = truncated.slice(0, lastNewline > 0 ? lastNewline : budget) + suffix;
    }

    const embed = {
        title,
        url: changelogUrl,
        description,
        color: EMBED_COLOR,
        footer: { text: 'NX Creative' },
    };
    if (date && /^\d{4}-\d{2}-\d{2}/.test(date)) {
        embed.timestamp = new Date(date).toISOString();
    }
    return embed;
}

async function postWebhook(embed) {
    const url = `${WEBHOOK_URL}?wait=true`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
    });
    if (!res.ok) throw new Error(`POST failed: ${res.status} ${await res.text()}`);
    return (await res.json()).id;
}

async function patchWebhook(messageId, embed) {
    const res = await fetch(`${WEBHOOK_URL}/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
    });
    if (res.status === 404) return null; // message was deleted in Discord; caller falls back to POST
    if (!res.ok) throw new Error(`PATCH failed: ${res.status} ${await res.text()}`);
    return messageId;
}

async function main() {
    const state = loadState();
    let stateChanged = false;

    for (const { resource, path } of findChangelogs()) {
        const mdx = readFileSync(path, 'utf8');
        const latest = parseLatestVersion(mdx);
        if (!latest) {
            console.log(`[skip] ${resource} — no version heading found`);
            continue;
        }

        const key = `${resource}@${latest.version}`;
        const contentHash = hash(latest.body);
        const prev = state[key];

        if (prev?.hash === contentHash) {
            console.log(`[noop] ${key} — unchanged`);
            continue;
        }

        const changelogUrl = `${DOCS_SITE}/docs/scripts/${resource}/changelog`;
        const embed = buildEmbed({ ...latest, resource, changelogUrl });

        let messageId = prev?.messageId;
        if (messageId) {
            console.log(`[edit] ${key} → PATCH ${messageId}`);
            messageId = await patchWebhook(messageId, embed);
        }
        if (!messageId) {
            console.log(`[post] ${key} → new message`);
            messageId = await postWebhook(embed);
        }

        state[key] = { messageId, hash: contentHash };
        stateChanged = true;
    }

    if (stateChanged) {
        saveState(state);
        console.log('[state] discord-messages.json updated');
    } else {
        console.log('[state] no changes');
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
