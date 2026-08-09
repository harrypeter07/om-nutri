import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  rating,
  count,
  className,
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={cn(
              "size-3.5",
              i <= Math.round(rating) ? "fill-warning text-warning" : "text-border",
            )}
          />
        ))}
      </span>
      <span className="text-xs font-semibold text-muted-foreground">
        {rating.toFixed(1)}
        {count !== undefined ? ` (${count})` : ""}
      </span>
    </span>
  );
}
