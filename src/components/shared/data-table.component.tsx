"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type DataTableProps<T extends { id: string }> = {
  data: T[];
  columns: ColumnDef<T>[];
  selectedId?: string;
  onRowClick?: (row: T) => void;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onBulkDeleted?: (ids: string[]) => void;
  emptyMessage?: string;
  toolbar?: React.ReactNode;
  globalFilter?: string;
  columnFilters?: ColumnFiltersState;
  onGlobalFilterChange?: OnChangeFn<string>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
};

export function DataTable<T extends { id: string }>({
  data,
  columns,
  selectedId,
  onRowClick,
  onBulkDelete,
  onBulkDeleted,
  emptyMessage = "Aucun résultat.",
  toolbar,
  globalFilter,
  columnFilters,
  onGlobalFilterChange,
  onColumnFiltersChange,
}: DataTableProps<T>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: !!onBulkDelete,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange,
    onColumnFiltersChange,
    state: {
      rowSelection,
      ...(globalFilter !== undefined && { globalFilter }),
      ...(columnFilters !== undefined && { columnFilters }),
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const visibleRows = table.getRowModel().rows;

  const handleBulkDelete = async () => {
    if (!onBulkDelete) return;
    const ids = selectedRows.map((r) => r.original.id);
    setIsBulkDeleting(true);
    try {
      await onBulkDelete(ids);
      onBulkDeleted?.(ids);
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

      {toolbar}

      <table className="w-full">
        <thead className="border-t border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 text-sm text-chart-4">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {visibleRows.length > 0 ? (
            visibleRows.map((row) => (
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
                  <td key={cell.id} className="p-2 border capitalize text-sm text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
