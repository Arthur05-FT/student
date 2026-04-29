"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  table,
}: {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  table: any;
}) => {
  const [filter, setFilter] = useState<string[]>([]);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showActivityBar, setShowActivityBar] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  return (
    <div className="flex p-4 items-center gap-4">
      <InputGroup className="max-w-xs">
        <InputGroupInput
          placeholder="Rechercher une salle..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <div className="border-x px-4">
        {filter ? (
          <span className="font-light text-chart-4 text-xs">Aucun filtre</span>
        ) : (
          <span className="font-light text-chart-4 text-sm">Aucun filtre</span>
        )}
      </div>
      <div>
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
            <DropdownMenuGroup>
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={showStatusBar ?? false}
                onCheckedChange={setShowStatusBar}
              >
                Status Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showActivityBar}
                onCheckedChange={setShowActivityBar}
                disabled
              >
                Activity Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showPanel}
                onCheckedChange={setShowPanel}
              >
                Panel
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ClassesSearch;
