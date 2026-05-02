import { ColumnDef } from "@tanstack/react-table";
import type { ClassesListItem } from "@/lib/api/types";

export const columnClasses: ColumnDef<ClassesListItem>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => row.original.code ?? "—",
  },
  {
    accessorKey: "level",
    header: "Niveau",
    cell: ({ row }) => row.original.level ?? "—",
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
