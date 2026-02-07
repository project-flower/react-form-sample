import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import {
  redirect,
  useLoaderData,
  type ClientLoaderFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import z from "zod";
import { decryptSavedInformation } from "../decrypt.server";
import type { Route } from "../../+types/home";
import { encrypt } from "~/.server/crypto";
import { commonSchema } from "~/common/schemas";
import { CustomTextField } from "~/components/custom-text-field";
import { KEY_OUTLET_SAMPLE } from "~/constants";

/** フォーム スキーマ */
const formSchema = z.object({
  name: commonSchema.required(),
  telephone: commonSchema.required(),
  address: commonSchema.required(),
});

type FormValues = z.infer<typeof formSchema>;

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const encrypted = encrypt(
    JSON.stringify({
      name: formData.get("name") as string,
      telephone: formData.get("telephone") as string,
      address: formData.get("address") as string,
    }),
  );

  return redirect(`/outlet-sample/second?v=${encrypted}`);
}

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const value = localStorage.getItem(KEY_OUTLET_SAMPLE);

  if (value) {
    window.location.replace(
      `${request.headers.get("origin")}/outlet-sample/first/?v=${value}`,
    );
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const arg = searchParams.get("v");

  if (arg) {
    try {
      return decryptSavedInformation(arg);
    } catch {
      //
    }

    throw new Error();
  }

  return { name: undefined, telephone: undefined, address: undefined };
}

/** 1 つ目のページ */
export default function First() {
  const loaderData = useLoaderData<typeof loader>();

  const form = useForm<FormValues>({
    defaultValues: {
      name: loaderData?.name || "",
      telephone: loaderData?.telephone || "",
      address: loaderData?.address || "",
    },
    mode: "onBlur",
    resolver: zodResolver(formSchema),
  });

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
          method="POST"
        >
          <Typography className="m-1" variant={"h5"}>
            First
          </Typography>
          <CustomTextField label="名前" name="name" required />
          <CustomTextField label="電話番号" name="telephone" required />
          <CustomTextField label="住所" name="address" required />
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
