"use client";

import { PencilLine, Trash } from "lucide-react";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import ClasseEditComponent from "./classe-edit.component";
import type { ClassesListItem, TeacherItem } from "@/lib/api/types";

const OverviewHeader = ({
  displayName,
  code,
  capacity,
  editOpen,
  onEditOpenChange,
  selectedClass,
  teachers,
  onClassUpdated,
  onDeleteClick,
}: {
  displayName: string;
  code: string | null | undefined;
  capacity: string | null | undefined;
  editOpen: boolean;
  onEditOpenChange: (open: boolean) => void;
  selectedClass: ClassesListItem;
  teachers: TeacherItem[];
  onClassUpdated: (updated: ClassesListItem) => void;
  onDeleteClick: () => void;
}) => (
  <div className="p-3 flex justify-between items-start border-b shrink-0">
    <div className="min-w-0 flex-1 pr-2">
      <h2 className="text-sm font-bold truncate">{displayName}</h2>
      {code && (
        <div className="flex gap-1 text-xs text-muted-foreground items-center mt-0.5">
          <span className="font-mono">{code}</span>
          {capacity && <span>· {capacity} élèves max</span>}
        </div>
      )}
    </div>
    <div className="flex gap-1 shrink-0">
      <Drawer direction="right" open={editOpen} onOpenChange={onEditOpenChange}>
        <DrawerTrigger asChild>
          <button className="border border-muted-foreground/40 p-1.5 rounded hover:bg-muted transition-colors">
            <PencilLine size={10} />
          </button>
        </DrawerTrigger>
        <ClasseEditComponent
          classe={selectedClass}
          teachers={teachers}
          onSuccess={(updated) => {
            onClassUpdated(updated);
            onEditOpenChange(false);
          }}
        />
      </Drawer>
      <button
        onClick={onDeleteClick}
        className="border border-red-400/50 text-red-500 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
      >
        <Trash size={10} />
      </button>
    </div>
  </div>
);

export default OverviewHeader;
