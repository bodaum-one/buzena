import { cn } from "@/lib/utils";

export function BuzenaLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-bold text-2xl", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <path d="M10.22 6.34 4.5 12l5.72 5.66" />
        <path d="M16.5 12H4.5" />
        <path d="M7.5 12h12.5a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4.5" />
      </svg>
      <span className="text-inherit font-headline">Buzena</span>
    </div>
  );
}
