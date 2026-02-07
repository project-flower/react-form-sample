import React, { type ReactNode } from "react";
import { FormControl, FormHelperText, InputLabel, Select } from "@mui/material";
import {
  Controller,
  useFormContext,
  type ControllerRenderProps,
} from "react-hook-form";

/** カスタム Select のプロパティ */
type CustomSelectProps = {
  children: ReactNode;
  className?: string;
  field?: ControllerRenderProps[];
  helperText?: string;
  label: string;
  name: string;
  required?: boolean;
};

/** カスタム Select コンポーネント */
export const CustomSelect = ({
  children,
  className,
  helperText,
  label,
  name,
  required,
}: CustomSelectProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render={({ field, formState: { errors, isValid } }) => (
        <FormControl error={!!errors[name]} fullWidth sx={{ mt: 1 }}>
          <InputLabel id="custom-select">{label}</InputLabel>
          <Select
            className={className}
            fullWidth
            id="select"
            labelId="custom-select"
            required={required}
            variant="standard"
            {...field}
            {...control.register(name)}
          >
            {children}
          </Select>
          <FormHelperText>
            {(errors[name]?.message as string) || helperText}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};
