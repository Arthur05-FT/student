import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  items: string[];
  control: Control<T>;
  errors?: string;
  placeholder: string;
};

const ComboboxComponent = <T extends FieldValues>({
  name,
  items,
  control,
  errors,
  placeholder,
}: Props<T>) => {
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
              <ComboboxEmpty>Aucun résultat.</ComboboxEmpty>
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
