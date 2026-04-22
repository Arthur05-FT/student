import { classesStatistics } from "@/lib/data";
import React from "react";

const ClassesStatisticsComponent = () => {
  return (
    <div className="flex p-4 justify-between">
      {classesStatistics?.map((item, i) => (
        <div key={i}>
          <h2 className="text-sm text-chart-3">{item.name}</h2>
          <p className="text-4xl">{item.number}</p>
        </div>
      ))}
    </div>
  );
};

export default ClassesStatisticsComponent;
