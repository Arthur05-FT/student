"use client";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Plus, Search, X } from "lucide-react";
import { capitalize } from "@/lib/utils";

export type HeadTeacherFilter = "all" | "with" | "without";

const ClassesSearch = ({
  globalFilter,
  setGlobalFilter,
  levelFilter,
  setLevelFilter,
  headTeacherFilter,
  setHeadTeacherFilter,
  levels,
}: {
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  levelFilter: string[];
  setLevelFilter: (v: string[]) => void;
  headTeacherFilter: HeadTeacherFilter;
  setHeadTeacherFilter: (v: HeadTeacherFilter) => void;
  levels: string[];
}) => {
  const hasFilters = levelFilter.length > 0 || headTeacherFilter !== "all";

  const toggleLevel = (level: string) =>
    setLevelFilter(
      levelFilter.includes(level)
        ? levelFilter.filter((l) => l !== level)
        : [...levelFilter, level],
    );

  const clearAll = () => {
    setLevelFilter([]);
    setHeadTeacherFilter("all");
  };

  return (
    <div className="flex p-4 items-center gap-3 flex-wrap">
      <InputGroup className="max-w-xs">
        <InputGroupInput
          placeholder="Rechercher une classe..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <div className="border-x px-3 flex items-center gap-2 flex-wrap min-h-6">
        {!hasFilters && (
          <span className="font-light text-chart-4 text-xs">Aucun filtre</span>
        )}

        {levelFilter.map((level) => (
          <FilterBadge
            key={level}
            label={`Niveau : ${capitalize(level)}`}
            onRemove={() => toggleLevel(level)}
          />
        ))}

        {headTeacherFilter !== "all" && (
          <FilterBadge
            label={
              headTeacherFilter === "with" ? "Avec prof. principal" : "Sans prof. principal"
            }
            onRemove={() => setHeadTeacherFilter("all")}
          />
        )}

        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Tout effacer
          </button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="font-light text-chart-4 rounded-sm"
            size="xs"
            variant="outline"
          >
            Ajouter un filtre <Plus />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuGroup>
            {/* Niveau — multi-select */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Niveau</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                  Sélectionner un ou plusieurs niveaux
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {levels.length === 0 && (
                  <DropdownMenuLabel className="text-xs italic text-muted-foreground font-normal">
                    Aucun niveau disponible
                  </DropdownMenuLabel>
                )}
                {levels.map((level) => (
                  <DropdownMenuCheckboxItem
                    key={level}
                    checked={levelFilter.includes(level)}
                    onCheckedChange={() => toggleLevel(level)}
                  >
                    {capitalize(level)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Prof. principal — radio */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Prof. principal</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={headTeacherFilter}
                  onValueChange={(v) => setHeadTeacherFilter(v as HeadTeacherFilter)}
                >
                  <DropdownMenuRadioItem value="all">Tous</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="with">Avec prof. principal</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="without">Sans prof. principal</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const FilterBadge = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
    {label}
    <X
      size={10}
      className="cursor-pointer hover:opacity-70 transition-opacity"
      onClick={onRemove}
    />
  </span>
);

export default ClassesSearch;
