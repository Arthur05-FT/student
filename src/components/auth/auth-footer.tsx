export function AuthFooter() {
  return (
    <div className="flex w-full justify-between text-xs">
      <span>v3.4.1 · Build 2026.05.12</span>
      <div className="flex gap-6">
        <a href="/help" className="hover:underline">Aide</a>
        <a href="/legal" className="hover:underline">Mentions légales</a>
      </div>
    </div>
  );
}
