import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search } from "lucide-react";

const ClassesSearch = () => {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Rechercher une salle..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default ClassesSearch;
