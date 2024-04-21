import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export type DivProps = {
  className?: string;
  children: React.ReactNode;
};

const InputGroup = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, children }, ref) => {
    return (
      <div
        className={cn("relative mt-2 rounded-md shadow-sm", className)}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

InputGroup.displayName = "InputGroup";

const InputLeftElement = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, children }, ref) => {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3",
          className,
        )}
        ref={ref}
      >
        <span className="mb-1 text-gray-500 sm:text-sm">{children}</span>
      </div>
    );
  },
);

InputLeftElement.displayName = "InputLeftElement";

export { Input, InputLeftElement, InputGroup };
