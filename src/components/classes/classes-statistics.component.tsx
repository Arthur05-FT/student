import type { ClassesListItem } from "@/lib/api/types";

const ClassesStatisticsComponent = ({
  classes,
}: {
  classes: ClassesListItem[];
}) => {
  const totalStudents = classes.reduce((acc, c) => acc + c._count.students, 0);

  const stats = [
    { name: "Nombre de classes", number: classes.length },
    { name: "Élèves inscrits", number: totalStudents },
  ];

  return (
    <div className="flex p-4 gap-8 border-b">
      {stats.map((item, i) => (
        <div key={i}>
          <h2 className="text-sm text-chart-3">{item.name}</h2>
          <p className="text-4xl">{item.number}</p>
        </div>
      ))}
    </div>
  );
};

export default ClassesStatisticsComponent;
