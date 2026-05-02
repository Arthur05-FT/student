import { ColumnDef, FilterFn } from "@tanstack/react-table";
import type { ClassesListItem } from "@/lib/api/types";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

const levelFilterFn: FilterFn<ClassesListItem> = (row, _, filterValues: string[]) =>
  filterValues.includes(row.original.level ?? "");

const headTeacherFilterFn: FilterFn<ClassesListItem> = (
  row,
  _,
  filterValue: "with" | "without",
) =>
  filterValue === "with"
    ? row.original.headTeacherId !== null
    : row.original.headTeacherId === null;

export const columnClasses: ColumnDef<ClassesListItem>[] = [
  {
    id: "select",
    header: ({ table }) =>
      React.createElement(Checkbox, {
        checked: table.getIsAllPageRowsSelected()
          ? true
          : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false,
        onCheckedChange: (checked) => table.toggleAllPageRowsSelected(!!checked),
        "aria-label": "Tout sélectionner",
      }),
    cell: ({ row }) =>
      React.createElement(
        "div",
        { onClick: (e: React.MouseEvent) => e.stopPropagation() },
        React.createElement(Checkbox, {
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          onCheckedChange: (checked) => row.toggleSelected(!!checked),
          "aria-label": "Sélectionner la ligne",
        }),
      ),
    enableSorting: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => row.original.code ?? "—",
  },
  {
    accessorKey: "level",
    header: "Niveau",
    cell: ({ row }) => row.original.level ?? "—",
    filterFn: levelFilterFn,
  },
  {
    accessorKey: "name",
    header: "Classe",
  },
  {
    id: "headTeacher",
    header: "Prof. principal",
    accessorFn: (row) =>
      row.headTeacher
        ? `${row.headTeacher.firstname} ${row.headTeacher.lastname}`
        : "—",
    filterFn: headTeacherFilterFn,
  },
  {
    accessorKey: "room",
    header: "Salle",
    cell: ({ row }) => row.original.room ?? "—",
  },
  {
    accessorKey: "capacity",
    header: "Capacité",
    cell: ({ row }) => row.original.capacity ?? "—",
  },
  {
    id: "students",
    header: "Élèves",
    accessorFn: (row) => row._count.students,
  },
];
