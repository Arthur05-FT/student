import React from "react";
import { cn } from "@/lib/utils";

export const SidePanel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "relative flex-none w-md border-l flex flex-col overflow-hidden",
      className,
    )}
  >
    {children}
  </div>
);

export const SidePanelEmpty = ({
  message,
  className,
}: {
  message: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex-none w-md border-l flex flex-col items-center justify-center gap-2 text-muted-foreground p-6",
      className,
    )}
  >
    <p className="text-sm text-center">{message}</p>
  </div>
);
