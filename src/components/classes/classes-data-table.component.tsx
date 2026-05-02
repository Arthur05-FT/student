"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import ClassesSearch from "./classes-search";
import { columnClasses } from "@/lib/columns/classes.column";
import type { ClassesListItem } from "@/lib/api/types";

export function ClassesDataTableComponent({
  data,
  selectedId,
  onRowClick,
}: {
  data: ClassesListItem[];
  selectedId?: string;
  onRowClick?: (row: ClassesListItem) => void;
}) {
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const table = useReactTable({
    data,
    columns: columnClasses,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: { globalFilter },
  });

  return (
    <div className="pt-4">
      <ClassesSearch
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table className="w-full">
        <thead className="border-t border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-2 font-light text-xs text-chart-4"
                >
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
                row.original.id === selectedId ? "bg-muted" : ""
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
