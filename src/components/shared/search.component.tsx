import { Field } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search } from "lucide-react";

const SearchComponent = ({
  placeholder = "Rechercher...",
}: {
  placeholder?: string;
}) => {
  return (
    <Field className="max-w-sm pl-2 pt-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <Search className="h-4 w-4 opacity-60" />
        </InputGroupAddon>
        <InputGroupInput
          id="search-input"
          type="search"
          placeholder={placeholder}
        />
      </InputGroup>
    </Field>
  );
};

export default SearchComponent;
