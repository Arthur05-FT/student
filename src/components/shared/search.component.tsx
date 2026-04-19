import React from "react";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search } from "lucide-react";

const SearchComponent = () => {
  return (
    <Field className="max-w-sm pl-2 pt-4">
      <InputGroup>
        <InputGroupInput
          id="inline-end-input"
          type="password"
          placeholder="Rechercher..."
        />
      </InputGroup>
    </Field>
  );
};

export default SearchComponent;
