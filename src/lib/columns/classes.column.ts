import { ColumnDef } from "@tanstack/react-table";

type classesTypeColumns = {
  code: string;
  name: string;
  sector: string;
  capacity: number;
  nextCourses: string;
  headTeacher: string;
};

export const columnClasses: ColumnDef<classesTypeColumns>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Classe",
  },
  {
    accessorKey: "sector",
    header: "Filière",
  },
  {
    accessorKey: "class",
    header: "Salle",
  },
  {
    accessorKey: "capacity",
    header: "Capacité",
  },
  {
    accessorKey: "nextCourses",
    header: "Prochain cours",
  },
];
