"use client";

import { useState } from "react";
import { PencilLine, Trash } from "lucide-react";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { SidePanel, SidePanelEmpty } from "./side-panel.component";
import { ApiError } from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = {
  value: string;
  label: string;
  content: React.ReactNode;
};

type OverviewShellProps = {
  title: string;
  subtitle?: React.ReactNode;
  editDrawer?: (closeEdit: () => void) => React.ReactNode;
  onDelete?: () => Promise<void>;
  deleteDescription?: string;
  tabs: Tab[];
};

// ─── Main component ───────────────────────────────────────────────────────────

const OverviewShell = ({
  title,
  subtitle,
  editDrawer,
  onDelete,
  deleteDescription = "Cette action est irréversible.",
  tabs,
}: OverviewShellProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirming, setDeleteConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDelete();
    } catch (err) {
      setDeleteError(
        err instanceof ApiError ? err.message : "Une erreur inattendue est survenue.",
      );
      setIsDeleting(false);
    }
  };

  return (
    <SidePanel>
      {/* Header */}
      <div className="p-3 flex justify-between items-start border-b shrink-0">
        <div className="min-w-0 flex-1 pr-2">
          <h2 className="text-sm font-bold truncate">{title}</h2>
          {subtitle && (
            <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          {editDrawer && (
            <Drawer direction="right" open={editOpen} onOpenChange={setEditOpen}>
              <DrawerTrigger asChild>
                <button className="border border-muted-foreground/40 p-1.5 rounded hover:bg-muted transition-colors">
                  <PencilLine size={10} />
                </button>
              </DrawerTrigger>
              {editDrawer(() => setEditOpen(false))}
            </Drawer>
          )}
          {onDelete && (
            <button
              onClick={() => {
                setDeleteConfirming(true);
                setDeleteError(null);
              }}
              className="border border-red-400/50 text-red-500 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <Trash size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={tabs[0]?.value} className="flex-1 overflow-hidden flex flex-col">
        <TabsList variant="line" className="px-3 border-b w-full rounded-none shrink-0">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="flex-1 overflow-y-auto p-4"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>

      {/* Delete overlay */}
      {deleteConfirming && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/40">
              <Trash size={20} className="text-red-500" />
            </div>
            <p className="text-sm font-semibold text-center">Supprimer {title} ?</p>
            <p className="text-xs text-muted-foreground text-center">{deleteDescription}</p>
          </div>
          {deleteError && (
            <p className="text-xs text-destructive text-center">{deleteError}</p>
          )}
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setDeleteConfirming(false)}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner /> : "Supprimer"}
            </Button>
          </div>
        </div>
      )}
    </SidePanel>
  );
};

export { OverviewShell, SidePanelEmpty as OverviewShellEmpty };
export type { OverviewShellProps };
