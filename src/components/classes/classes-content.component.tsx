"use client";

import { useState } from "react";
import ClassesDataTableComponent from "./classes-data-table.component";
import ClassesOverviewComponent from "./classes-overview.component";
import ClassesStatisticsComponent from "./classes-statistics.component";
import type { ClassesListItem } from "@/lib/api/types";

const ClassesContent = ({ classes }: { classes: ClassesListItem[] }) => {
  const [selectedClass, setSelectedClass] = useState<ClassesListItem | null>(null);

  return (
    <div className="w-full flex">
      <div className="flex flex-col flex-1">
        <ClassesStatisticsComponent classes={classes} />
        <ClassesDataTableComponent
          data={classes}
          selectedId={selectedClass?.id}
          onRowClick={setSelectedClass}
        />
      </div>
      <ClassesOverviewComponent selectedClass={selectedClass} />
    </div>
  );
};

export default ClassesContent;
