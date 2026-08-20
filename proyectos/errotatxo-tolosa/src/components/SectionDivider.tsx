export default function SectionDivider() {
  return (
    <div className="container-edge">
      <div className="flex items-center gap-4 py-1">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-madera/40 to-transparent" />
        <div className="h-1.5 w-1.5 rotate-45 bg-madera/60" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-madera/40 to-transparent" />
      </div>
    </div>
  );
}
