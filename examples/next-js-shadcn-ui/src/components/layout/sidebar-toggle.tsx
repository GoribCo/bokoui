"use client";

import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface SidebarToggleProps {
  labels: { collapse: string; expand: string; openMenu: string };
}

/**
 * The button at the left of the header. From `md` up it collapses or expands the sidebar rail; below
 * that the sidebar is a sheet, so it opens the sheet instead (`toggleSidebar` does both) (FR-2.3, FR-6.3).
 */
export function SidebarToggle({ labels }: SidebarToggleProps) {
  const { state, isMobile, openMobile, toggleSidebar } = useSidebar();
  const expanded = isMobile ? openMobile : state === "expanded";
  const label = isMobile ? labels.openMenu : expanded ? labels.collapse : labels.expand;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} aria-expanded={expanded} onClick={toggleSidebar}>
          <PanelLeft aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
