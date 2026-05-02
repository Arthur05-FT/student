"use client";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Plus, Search } from "lucide-react";

const ClassesSearch = ({
  globalFilter,
  setGlobalFilter,
}: {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
}) => {
  return (
    <div className="flex p-4 items-center gap-4">
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
      <div className="border-x px-4">
        <span className="font-light text-chart-4 text-xs">Aucun filtre</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="font-light text-chart-4 rounded-sm"
            size={"xs"}
            variant="outline"
          >
            Ajouter un filtre <Plus />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuGroup />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ClassesSearch;
