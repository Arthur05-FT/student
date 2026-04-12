import React from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { Control, Controller, FieldValues } from "react-hook-form";
import { CreateSchoolForm } from "@/lib/schemas/school.schema";

const ComboboxComponent = ({
  name,
  items,
  control,
  errors,
  placeholder,
}: {
  name: string;
  items: string[];
  control: any;
  errors: string;
  placeholder: string;
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Combobox
            items={items}
            value={field.value}
            onValueChange={field.onChange}
          >
            <ComboboxInput placeholder={placeholder} />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        )}
      />
      {errors && <p className="text-red-500 text-sm">{errors}</p>}
    </>
  );
};

export default ComboboxComponent;
