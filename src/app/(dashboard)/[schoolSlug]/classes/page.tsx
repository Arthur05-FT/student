import { ClassesDataTableComponent } from "@/components/classes/classes-data-table.component";
import ClassesOverviewComponent from "@/components/classes/classes-overview.component";
import ClassesSearch from "@/components/classes/classes-search";
import ClassesStatisticsComponent from "@/components/classes/classes-statistics.component";
import { columnClasses } from "@/lib/columns/classes.column";

const ClassesPage = () => {
  return (
    <div className="w-full flex">
      <div className="flex flex-col flex-2">
        <ClassesStatisticsComponent />
        <div>
          <div className="flex p-4">
            <ClassesSearch />
          </div>
          <ClassesDataTableComponent columns={columnClasses} data={[]} />
        </div>
      </div>
      <ClassesOverviewComponent />
    </div>
  );
};

export default ClassesPage;
