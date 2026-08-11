import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[70px] w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-black shadow-2xs placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
