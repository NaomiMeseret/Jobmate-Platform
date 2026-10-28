export function AfricaMapSVG({
  className,
  decorative = true,
}: {
  className?: string;
  decorative?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 160 180"
      fill="none"
      className={className}
      aria-hidden={decorative}
      role={decorative ? undefined : "img"}
    >
      {!decorative && <title>Stylized map of Africa</title>}
      <path
        d="M78 8C62 14 51 27 43 42L27 48L18 66L28 82L25 99L38 110L46 134L62 138L70 160L88 172L99 151L116 136L123 116L141 98L134 76L119 66L112 49L98 42L91 25L78 8Z"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default AfricaMapSVG;
