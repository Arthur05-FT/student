import { BookOpen, Building2, GraduationCap, MapPin, Users } from "lucide-react";
import { capitalize } from "@/lib/utils";
import type { ClassesListItem } from "@/lib/api/types";

// ─── Shared Row ───────────────────────────────────────────────────────────────

export const Row = ({
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
      <span className="text-sm font-medium capitalize">{value}</span>
    </div>
  </div>
);

// ─── Tab contents ─────────────────────────────────────────────────────────────

export const ApercuTab = ({
  selectedClass,
  teacherName,
}: {
  selectedClass: ClassesListItem;
  teacherName: string | null;
}) => {
  const { room, building, capacity, _count } = selectedClass;
  const hasExtra = teacherName || room || building;

  return (
    <div className="flex flex-col gap-3">
      <Row
        icon={<Users size={14} />}
        label="Élèves inscrits"
        value={`${_count.students}${capacity ? ` / ${capacity}` : ""}`}
      />
      {teacherName && (
        <Row icon={<BookOpen size={14} />} label="Prof. principal" value={teacherName} />
      )}
      {room && (
        <Row icon={<MapPin size={14} />} label="Salle" value={capitalize(room)} />
      )}
      {building && (
        <Row icon={<Building2 size={14} />} label="Bâtiment" value={capitalize(building)} />
      )}
      {!hasExtra && (
        <p className="text-xs text-muted-foreground">Aucune information complémentaire.</p>
      )}
    </div>
  );
};

export const ElevesTab = ({ count }: { count: number }) => (
  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
    <GraduationCap size={24} />
    <p className="text-xs text-center">
      {count === 0
        ? "Aucun élève inscrit dans cette classe."
        : `${count} élève(s) — liste disponible prochainement.`}
    </p>
  </div>
);

export const ProfesseurTab = ({ teacherName }: { teacherName: string | null }) =>
  teacherName ? (
    <div className="flex flex-col gap-3">
      <Row icon={<BookOpen size={14} />} label="Professeur principal" value={teacherName} />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
      <BookOpen size={24} />
      <p className="text-xs text-center">Aucun professeur principal assigné.</p>
    </div>
  );

export const CoursTab = () => (
  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
    <BookOpen size={24} />
    <p className="text-xs text-center">Les cours seront disponibles prochainement.</p>
  </div>
);
