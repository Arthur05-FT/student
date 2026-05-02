import OverviewPanel from "./classes-overview-panel.component";
import type { ClassesListItem, TeacherItem } from "@/lib/api/types";

const ClassesOverviewComponent = ({
  selectedClass,
  teachers,
  onClassUpdated,
  onClassDeleted,
}: {
  selectedClass: ClassesListItem | null;
  teachers: TeacherItem[];
  onClassUpdated: (updated: ClassesListItem) => void;
  onClassDeleted: (id: string) => void;
}) => {
  if (!selectedClass) {
    return (
      <div className="flex-none w-md border-l flex flex-col items-center justify-center gap-2 text-muted-foreground p-6">
        <p className="text-sm text-center">
          Sélectionnez une classe pour voir ses détails.
        </p>
      </div>
    );
  }

  return (
    <OverviewPanel
      selectedClass={selectedClass}
      teachers={teachers}
      onClassUpdated={onClassUpdated}
      onClassDeleted={onClassDeleted}
    />
  );
};

export default ClassesOverviewComponent;
