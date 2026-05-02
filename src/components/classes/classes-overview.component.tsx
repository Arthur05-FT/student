import type { ClassesListItem } from "@/lib/api/types";
import { capitalize } from "@/lib/utils";
import { BookOpen, Building2, MapPin, Users } from "lucide-react";

const ClassesOverviewComponent = ({
  selectedClass,
}: {
  selectedClass: ClassesListItem | null;
}) => {
  if (!selectedClass) {
    return (
      <div className="flex-none w-72 border-l flex flex-col items-center justify-center gap-2 text-muted-foreground p-6">
        <p className="text-sm text-center">
          Sélectionnez une classe pour voir ses détails.
        </p>
      </div>
    );
  }

  const { level, name, code, headTeacher, room, building, capacity, _count } =
    selectedClass;

  const displayName = [level, name]
    .filter((v): v is string => Boolean(v))
    .map(capitalize)
    .join(" — ");

  const teacherName = headTeacher
    ? `${capitalize(headTeacher.firstname)} ${capitalize(headTeacher.lastname)}`
    : null;

  return (
    <div className="flex-none w-72 border-l flex flex-col gap-6 p-6 overflow-y-auto">
      <div>
        <h2 className="font-bold text-base">{displayName}</h2>
        {code && (
          <span className="inline-block mt-1 text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
            {code}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <Row icon={<Users size={14} />} label="Élèves" value={`${_count.students}${capacity ? ` / ${capacity}` : ""}`} />

        {teacherName && (
          <Row icon={<BookOpen size={14} />} label="Prof. principal" value={teacherName} />
        )}

        {room && (
          <Row icon={<MapPin size={14} />} label="Salle" value={capitalize(room)} />
        )}

        {building && (
          <Row icon={<Building2 size={14} />} label="Bâtiment" value={capitalize(building)} />
        )}
      </div>
    </div>
  );
};

const Row = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-2">
    <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  </div>
);

export default ClassesOverviewComponent;
