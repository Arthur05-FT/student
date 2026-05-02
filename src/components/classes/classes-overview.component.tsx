import { OverviewShellEmpty } from "../shared/overview-shell.component";
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
    return <OverviewShellEmpty message="Sélectionnez une classe pour voir ses détails." />;
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
