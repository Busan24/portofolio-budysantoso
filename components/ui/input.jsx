import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-[48px], rounded-md border border-gray-300 dark:border-white/10 focus:border-accent font-light bg-white dark:bg-primary px-4 py-5 text-base placeholder:text-gray-400 dark:placeholder:text-white/60 text-gray-900 dark:text-white outline-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
