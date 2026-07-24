/* eslint-disable @next/next/no-img-element */
// Logo oficial de Evox Entrepreneur (la máscara EVOX con rayo), usado tal cual.
// El archivo real debe estar en: public/evox-logo.png
// mix-blend-lighten funde el fondo negro del logo con el tema oscuro.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/evox-logo.png"
      alt="Evox Entrepreneur"
      className={`object-contain mix-blend-lighten ${className}`}
    />
  );
}
