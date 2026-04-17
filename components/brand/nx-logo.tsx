import type { SVGProps } from 'react';

/**
 * NX Creative monogram — geometric "NX" lockup, stroked in currentColor so
 * it picks up the surrounding text color (and therefore the brand red on
 * hover when used as a link).
 */
export function NxLogo({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* N */}
      <path d="M5 26 V6 L14 26 V6" />
      {/* X */}
      <path d="M18 6 L28 26" />
      <path d="M28 6 L18 26" />
    </svg>
  );
}
