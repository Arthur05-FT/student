"use client";

import { useRouter } from "next/navigation";
import { OverviewShell } from "../shared/overview-shell.component";
import ClasseEditComponent from "./classe-edit.component";
import {
  ApercuTab,
  CoursTab,
  ElevesTab,
  ProfesseurTab,
} from "./classes-overview-tabs.component";
import { classesApi } from "@/lib/api/classes.api";
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

  const displayName = [selectedClass.level, selectedClass.name]
    .filter((v): v is string => Boolean(v))
    .map(capitalize)
    .join(" — ");

  const teacherName = selectedClass.headTeacher
    ? `${capitalize(selectedClass.headTeacher.firstname)} ${capitalize(selectedClass.headTeacher.lastname)}`
    : null;

  const handleDelete = async () => {
    await classesApi.remove(school.slug, selectedClass.id);
    router.refresh();
    onClassDeleted(selectedClass.id);
  };

  return (
    <OverviewShell
      title={displayName}
      subtitle={
        selectedClass.code ? (
          <span>
            <span className="font-mono">{selectedClass.code}</span>
            {selectedClass.capacity && ` · ${selectedClass.capacity} élèves max`}
          </span>
        ) : undefined
      }
      editDrawer={(closeEdit) => (
        <ClasseEditComponent
          classe={selectedClass}
          teachers={teachers}
          onSuccess={(updated) => {
            onClassUpdated(updated);
            closeEdit();
          }}
        />
      )}
      onDelete={handleDelete}
      deleteDescription="Cette action est irréversible. Tous les élèves associés seront désaffectés."
      tabs={[
        {
          value: "apercu",
          label: "Aperçu",
          content: <ApercuTab selectedClass={selectedClass} teacherName={teacherName} />,
        },
        {
          value: "eleves",
          label: "Élèves",
          content: <ElevesTab count={selectedClass._count.students} />,
        },
        {
          value: "professeur",
          label: "Professeur",
          content: <ProfesseurTab teacherName={teacherName} />,
        },
        {
          value: "cours",
          label: "Cours",
          content: <CoursTab />,
        },
      ]}
    />
  );
};

export default OverviewPanel;
