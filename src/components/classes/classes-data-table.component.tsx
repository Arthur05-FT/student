"use client";

import {
  ColumnFiltersState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { useRouter } from "next/navigation";
import ClassesSearch, { HeadTeacherFilter } from "./classes-search";
import { columnClasses } from "@/lib/columns/classes.column";
import { classesApi } from "@/lib/api/classes.api";
import { useCurrentSchool } from "@/lib/contexts/school-context";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Trash } from "lucide-react";
import type { ClassesListItem } from "@/lib/api/types";

export function ClassesDataTableComponent({
  data,
  selectedId,
  onRowClick,
  onBulkDeleted,
}: {
  data: ClassesListItem[];
  selectedId?: string;
  onRowClick?: (row: ClassesListItem) => void;
  onBulkDeleted?: (ids: string[]) => void;
}) {
  const school = useCurrentSchool();
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);

  const levels = React.useMemo(
    () =>
      [
        ...new Set(
          data.map((c) => c.level).filter((l): l is string => l !== null),
        ),
      ].sort(),
    [data],
  );

  const levelFilter =
    (columnFilters.find((f) => f.id === "level")?.value as string[]) ?? [];

  const headTeacherFilter =
    (columnFilters.find((f) => f.id === "headTeacher")
      ?.value as HeadTeacherFilter) ?? "all";

  const setLevelFilter = (values: string[]) =>
    setColumnFilters((prev) => {
      const rest = prev.filter((f) => f.id !== "level");
      return values.length ? [...rest, { id: "level", value: values }] : rest;
    });

  const setHeadTeacherFilter = (value: HeadTeacherFilter) =>
    setColumnFilters((prev) => {
      const rest = prev.filter((f) => f.id !== "headTeacher");
      return value !== "all" ? [...rest, { id: "headTeacher", value }] : rest;
    });

  const table = useReactTable({
    data,
    columns: columnClasses,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    state: { globalFilter, columnFilters, rowSelection },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const handleBulkDelete = async () => {
    const deletedIds = selectedRows.map((row) => row.original.id);
    setIsBulkDeleting(true);
    try {
      await Promise.all(
        deletedIds.map((id) => classesApi.remove(school.slug, id)),
      );
      onBulkDeleted?.(deletedIds);
      router.refresh();
      setRowSelection({});
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <div className="pt-4">
      {selectedCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-muted border-t border-b text-sm">
          <span className="text-xs text-muted-foreground">
            {selectedCount} ligne{selectedCount > 1 ? "s" : ""} sélectionnée
            {selectedCount > 1 ? "s" : ""}
          </span>
          <Button
            size="xs"
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
            className="gap-1"
          >
            {isBulkDeleting ? (
              <Spinner />
            ) : (
              <>
                <Trash size={12} />
                Supprimer ({selectedCount})
              </>
            )}
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => table.resetRowSelection()}
            disabled={isBulkDeleting}
          >
            Annuler
          </Button>
        </div>
      )}

      <ClassesSearch
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        headTeacherFilter={headTeacherFilter}
        setHeadTeacherFilter={setHeadTeacherFilter}
        levels={levels}
      />

      <table className="w-full">
        <thead className="border-t border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 text-sm text-chart-4">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row.original)}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                row.original.id === selectedId
                  ? "border-l-2 border-orange-500 bg-muted"
                  : ""
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-2 border capitalize text-xs text-center"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassesDataTableComponent;
