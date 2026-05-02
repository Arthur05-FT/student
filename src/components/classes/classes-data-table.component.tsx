"use client";

import React from "react";
import { type ColumnFiltersState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import ClassesSearch, { HeadTeacherFilter } from "./classes-search";
import { columnClasses } from "@/lib/columns/classes.column";
import { classesApi } from "@/lib/api/classes.api";
import { useCurrentSchool } from "@/lib/contexts/school-context";
import { DataTable } from "../shared/data-table.component";
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

  const handleBulkDelete = async (ids: string[]) => {
    await Promise.all(ids.map((id) => classesApi.remove(school.slug, id)));
    router.refresh();
  };

  return (
    <DataTable
      data={data}
      columns={columnClasses}
      selectedId={selectedId}
      onRowClick={onRowClick}
      onBulkDelete={handleBulkDelete}
      onBulkDeleted={onBulkDeleted}
      emptyMessage="Aucune classe trouvée pour l'instant."
      globalFilter={globalFilter}
      columnFilters={columnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onColumnFiltersChange={setColumnFilters}
      toolbar={
        <ClassesSearch
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
          headTeacherFilter={headTeacherFilter}
          setHeadTeacherFilter={setHeadTeacherFilter}
          levels={levels}
        />
      }
    />
  );
}

export default ClassesDataTableComponent;
