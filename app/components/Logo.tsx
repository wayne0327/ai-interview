import { Sparkles } from "lucide-react";

export default function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-6 w-6 rounded-lg" : "h-8 w-8 rounded-xl";
  const icon = size === "sm" ? 14 : 18;

  return (
    <span
      className={`flex items-center justify-center bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-sm shadow-indigo-500/30 ${box}`}
    >
      <Sparkles size={icon} strokeWidth={2.25} />
    </span>
  );
}
