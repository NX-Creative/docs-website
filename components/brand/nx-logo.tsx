/**
 * NX Creative monogram, loaded from the branded PNG shipped with the
 * marketing site (white glyph on transparent). Used in the nav and
 * footer — read the file directly from /public so Next's static export
 * doesn't try to optimize it at build time.
 */
export function NxLogo({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src="/logo.png"
      alt="NX Creative"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
