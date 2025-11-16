import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, MenuItem, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { optional, commonSchema as schema } from "~/common/schemas";
import { CustomSelect } from "~/components/custom-select";
import { CustomTextField } from "~/components/custom-text-field";

/** フォーム スキーマ */
const formSchema = z
  .object({
    input1: optional(schema.maxWithName("入力 1", 10)),
    input2: optional(schema.minWithName("入力 2", 10)),
    input3: optional(schema.max10),
    telephone1: optional(schema.telephone),
    telephone2: optional(schema.telephone),
    telephone3: optional(schema.telephone),
    select1: schema.required(),
    select2: z.string(),
    select3: z.string(),
  })
  .refine(
    (arg) => {
      const { select1, select2 } = arg;
      return !select2 || select2 != select1;
    },
    { message: "選択 2 は 選択 1 と同じです。", path: ["select2"] }
  )
  .refine(
    (arg) => {
      const { select2, select3 } = arg;
      return !select3 || select2;
    },
    {
      message: "選択 3 を入力する場合は、選択 2 を入力してください。",
      path: ["select3"],
    }
  )
  .refine(
    (arg) => {
      const { select2, select3 } = arg;
      return !select3 || select3 != select2;
    },
    { message: "選択 3 は 選択 2 と同じです。", path: ["select3"] }
  )
  .refine(
    (arg) => {
      const { select1, select3 } = arg;
      return !select3 || select3 != select1;
    },
    { message: "選択 3 は 選択 1 と同じです。", path: ["select3"] }
  );

type FormValues = z.infer<typeof formSchema>;

/** Welcome ページ */
export function Welcome() {
  const form = useForm<FormValues>({
    defaultValues: {
      input1: "これは初期値です",
      input2: "",
      input3: "",
      telephone1: "",
      telephone2: "",
      telephone3: "",
      select1: "",
      select2: "",
      select3: "",
    },
    mode: "onBlur",
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {};

  return (
    <Container>
      <FormProvider {...form}>
        <Box
          alignItems="center"
          component="form"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          margin="5em"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Typography className="m-1" variant={"h5"}>
            入力してください
          </Typography>
          <CustomTextField label="入力 1" name="input1" />
          <CustomTextField label="入力 2" name="input2" />
          <CustomTextField label="入力 3" name="input3" />
          <CustomTextField label="電話番号 1" name="telephone1" />
          <CustomTextField label="電話番号 2" name="telephone2" />
          <CustomTextField label="電話番号 3" name="telephone3" />
          <CustomSelect label="選択 1" name="select1" required>
            <MenuItem value={"1"}>1</MenuItem>
            <MenuItem value={"2"}>2</MenuItem>
            <MenuItem value={"3"}>3</MenuItem>
          </CustomSelect>
          <CustomSelect label="選択 2" name="select2">
            <MenuItem value={"1"}>1</MenuItem>
            <MenuItem value={"2"}>2</MenuItem>
            <MenuItem value={"3"}>3</MenuItem>
          </CustomSelect>
          <CustomSelect label="選択 3" name="select3">
            <MenuItem value={"1"}>1</MenuItem>
            <MenuItem value={"2"}>2</MenuItem>
            <MenuItem value={"3"}>3</MenuItem>
          </CustomSelect>
          <Button
            color="primary"
            className=""
            disabled={!form.formState.isValid}
            type="submit"
            variant="contained"
            sx={{ margin: "1.5rem 0" }}
          >
            送信
          </Button>
        </Box>
      </FormProvider>
    </Container>
  );
}
