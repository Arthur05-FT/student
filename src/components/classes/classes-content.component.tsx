"use client";

import { useEffect, useState } from "react";
import ClassesDataTableComponent from "./classes-data-table.component";
import ClassesOverviewComponent from "./classes-overview.component";
import ClassesStatisticsComponent from "./classes-statistics.component";
import type { ClassesListItem, TeacherItem } from "@/lib/api/types";

const ClassesContent = ({
  classes,
  teachers,
}: {
  classes: ClassesListItem[];
  teachers: TeacherItem[];
}) => {
  const [localClasses, setLocalClasses] = useState(classes);
  const [selectedClass, setSelectedClass] = useState<ClassesListItem | null>(
    null,
  );

  useEffect(() => {
    setLocalClasses(classes);
  }, [classes]);

  const handleClassUpdated = (updated: ClassesListItem) => {
    setLocalClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setSelectedClass(updated);
  };

  const handleClassDeleted = (deletedId: string) => {
    setLocalClasses((prev) => prev.filter((c) => c.id !== deletedId));
    setSelectedClass(null);
  };

  const handleBulkDeleted = (deletedIds: string[]) => {
    setLocalClasses((prev) => prev.filter((c) => !deletedIds.includes(c.id)));
    if (selectedClass && deletedIds.includes(selectedClass.id)) {
      setSelectedClass(null);
    }
  };

  return (
    <div className="w-full flex">
      <div className="flex flex-col flex-1 min-w-0">
        <ClassesStatisticsComponent classes={localClasses} />
        <ClassesDataTableComponent
          data={localClasses}
          selectedId={selectedClass?.id}
          onRowClick={setSelectedClass}
          onBulkDeleted={handleBulkDeleted}
        />
      </div>
      <ClassesOverviewComponent
        selectedClass={selectedClass}
        teachers={teachers}
        onClassUpdated={handleClassUpdated}
        onClassDeleted={handleClassDeleted}
      />
    </div>
  );
};

export default ClassesContent;
