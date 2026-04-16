export function AvatarComponent({ name }) {
  // Extract initials
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "??";

  return (
    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-4 border-background shadow-md">
      <span className="text-3xl font-bold text-primary">{initials}</span>
    </div>
  );
}
