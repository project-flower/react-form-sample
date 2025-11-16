import React from "react";
import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

/** カスタム Select のプロパティ */
type CustomSelectProps = {
  children: any;
  className?: string;
  field?: any[];
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
