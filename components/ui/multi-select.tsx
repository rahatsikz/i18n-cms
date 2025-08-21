"use client";

import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Separator } from "./separator";
import { PopoverClose } from "@radix-ui/react-popover";
import type { FieldValues, ControllerRenderProps } from "react-hook-form";

// option definition
export type OptionProps = {
  value: string;
  label: string;
  acronym?: string;
  id: string | number;
};

// base props just like ComboBox (form integration)
type FormProps<TFieldValues extends FieldValues> = Pick<
  ControllerRenderProps<TFieldValues>,
  "value" | "onChange" | "disabled"
>;

// custom props (your extras)
type CustomProps = {
  options: OptionProps[];
  placeholder?: string;
  icon?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

// combine all
export type MultiSelectProps<TFieldValues extends FieldValues> =
  FormProps<TFieldValues> &
    CustomProps &
    Omit<
      React.HTMLAttributes<HTMLDivElement>,
      keyof FormProps<TFieldValues> | keyof CustomProps
    >;

export const MultiSelect = React.forwardRef(
  <TFieldValues extends FieldValues>(
    {
      options,
      placeholder,
      icon,
      value,
      onChange,
      open,
      onOpenChange,
      ...props
    }: MultiSelectProps<TFieldValues>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const popoverOpen = open !== undefined ? open : internalOpen;
    const setPopoverOpen =
      onOpenChange !== undefined ? onOpenChange : setInternalOpen;

    const selectedOptions =
      (value as OptionProps[] | undefined)?.filter(
        (item) => item?.value !== undefined
      ) ?? [];

    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen} modal>
        <PopoverTrigger asChild>
          <Button
            id={props.id}
            variant='outline'
            className={cn(
              "w-full justify-start bg-transparent px-2 ",
              "data-[state=open]:ring-[3px] data-[state=open]:ring-ring/50",
              props.className
            )}
            style={props.style}
          >
            {selectedOptions.length > 0 ? (
              <div className='flex items-center gap-2 flex-wrap'>
                {selectedOptions.map((option) => (
                  <span
                    key={option.id}
                    className='text-[10px] border bg-accent rounded-full size-6 flex items-center justify-center text-foreground'
                  >
                    {option.acronym || option.label}
                  </span>
                ))}
              </div>
            ) : (
              <span className='text-muted-foreground'>
                {icon}
                {placeholder && <span className='pl-1'>{placeholder}</span>}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className='w-full p-0'
          align='start'
          ref={ref}
          sideOffset={12}
        >
          <OptionList
            onChange={(selected) => onChange(selected as any)}
            options={options}
            checkedState={selectedOptions}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

function OptionList({
  onChange,
  options,
  checkedState,
}: {
  onChange: (item: OptionProps[] | undefined) => void;
  options: OptionProps[];
  checkedState: OptionProps[];
}) {
  return (
    <Command>
      <CommandInput placeholder='Filtering...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((item) => {
            const isSelected = checkedState.some(
              (s) => s.id.toString() === item.id.toString()
            );
            return (
              <label key={item.id} htmlFor={item.value}>
                <CommandItem className='flex items-center justify-between cursor-pointer'>
                  <div className='flex items-center gap-2'>
                    <span className='text-[10px] border bg-accent rounded-full size-7 flex items-center justify-center text-foreground'>
                      {item.acronym}
                    </span>
                    <span className='capitalize'>{item.label}</span>
                  </div>
                  <Checkbox
                    id={item.value}
                    checked={isSelected}
                    onClick={() => {
                      if (isSelected) {
                        onChange(
                          checkedState.filter(
                            (s) => s.id.toString() !== item.id.toString()
                          )
                        );
                      } else {
                        onChange([...checkedState, item]);
                      }
                    }}
                    className='border-0 shadow-none data-[state=checked]:bg-transparent data-[state=checked]:text-secondary-foreground'
                  />
                </CommandItem>
              </label>
            );
          })}
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup>
          <div className='flex items-center justify-between'>
            {checkedState.length > 0 && (
              <>
                <CommandItem
                  onSelect={() => onChange([])}
                  className='w-full flex items-center justify-center'
                >
                  Clear
                </CommandItem>
                <Separator
                  orientation='vertical'
                  className='flex min-h-6 h-full'
                />
              </>
            )}
            <PopoverClose className='w-full'>
              <CommandItem className='w-full flex items-center justify-center'>
                Close
              </CommandItem>
            </PopoverClose>
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
