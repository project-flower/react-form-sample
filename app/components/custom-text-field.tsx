import React from "react";
import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

/** カスタム TextField のプロパティ */
type CustomTextFieldProps = {
  className?: string;
  field?: any[];
  label: string;
  name: string;
  required?: boolean;
};

/** カスタム TextField コンポーネント */
export const CustomTextField = ({
  className,
  label,
  name,
  required,
}: CustomTextFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState: { errors, isValid } }) => (
        <TextField
          className={className}
          error={!!errors[name]}
          fullWidth
          helperText={errors[name]?.message as string}
          id={name}
          label={label}
          required={required}
          variant="standard"
          {...field}
          {...control.register(name)}
        />
      )}
      rules={{
        required: { value: !!required, message: "入力してください" },
      }}
    />
  );
};
