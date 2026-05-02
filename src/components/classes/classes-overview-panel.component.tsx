"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import OverviewHeader from "./classes-overview-header.component";
import DeleteConfirmOverlay from "./classes-overview-delete.component";
import {
  ApercuTab,
  CoursTab,
  ElevesTab,
  ProfesseurTab,
} from "./classes-overview-tabs.component";
import { classesApi } from "@/lib/api/classes.api";
import { ApiError } from "@/lib/api/client";
import { useCurrentSchool } from "@/lib/contexts/school-context";
import { capitalize } from "@/lib/utils";
import type { ClassesListItem, TeacherItem } from "@/lib/api/types";

const OverviewPanel = ({
  selectedClass,
  teachers,
  onClassUpdated,
  onClassDeleted,
}: {
  selectedClass: ClassesListItem;
  teachers: TeacherItem[];
  onClassUpdated: (updated: ClassesListItem) => void;
  onClassDeleted: (id: string) => void;
}) => {
  const school = useCurrentSchool();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirming, setDeleteConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const displayName = [selectedClass.level, selectedClass.name]
    .filter((v): v is string => Boolean(v))
    .map(capitalize)
    .join(" — ");

  const teacherName = selectedClass.headTeacher
    ? `${capitalize(selectedClass.headTeacher.firstname)} ${capitalize(selectedClass.headTeacher.lastname)}`
    : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await classesApi.remove(school.slug, selectedClass.id);
      router.refresh();
      onClassDeleted(selectedClass.id);
    } catch (err) {
      setDeleteError(
        err instanceof ApiError ? err.message : "Une erreur inattendue est survenue.",
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative flex-none w-md border-l flex flex-col overflow-hidden">
      <OverviewHeader
        displayName={displayName}
        code={selectedClass.code}
        capacity={selectedClass.capacity}
        editOpen={editOpen}
        onEditOpenChange={setEditOpen}
        selectedClass={selectedClass}
        teachers={teachers}
        onClassUpdated={onClassUpdated}
        onDeleteClick={() => {
          setDeleteConfirming(true);
          setDeleteError(null);
        }}
      />

      <Tabs defaultValue="apercu" className="flex-1 overflow-hidden flex flex-col">
        <TabsList variant="line" className="px-3 border-b w-full rounded-none shrink-0">
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="eleves">Élèves</TabsTrigger>
          <TabsTrigger value="professeur">Professeur</TabsTrigger>
          <TabsTrigger value="cours">Cours</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu" className="flex-1 overflow-y-auto p-4">
          <ApercuTab selectedClass={selectedClass} teacherName={teacherName} />
        </TabsContent>
        <TabsContent value="eleves" className="flex-1 overflow-y-auto p-4">
          <ElevesTab count={selectedClass._count.students} />
        </TabsContent>
        <TabsContent value="professeur" className="flex-1 overflow-y-auto p-4">
          <ProfesseurTab teacherName={teacherName} />
        </TabsContent>
        <TabsContent value="cours" className="flex-1 overflow-y-auto p-4">
          <CoursTab />
        </TabsContent>
      </Tabs>

      {deleteConfirming && (
        <DeleteConfirmOverlay
          displayName={displayName}
          isDeleting={isDeleting}
          deleteError={deleteError}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirming(false)}
        />
      )}
    </div>
  );
};

export default OverviewPanel;
