import React, { useEffect, type FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import {
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import z from "zod";
import { decryptSavedInformation } from "../decrypt.server";
import { encrypt } from "~/.server/crypto";
import { commonSchema } from "~/common/schemas";
import { CustomTextField } from "~/components/custom-text-field";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "~/routes/local-storage.client";

/** フォーム スキーマ */
const formSchema = z.object({
  name: commonSchema.required(),
  telephone: commonSchema.required(),
  address: commonSchema.required(),
  additional: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const encrypted = encrypt(
    JSON.stringify({
      name: formData.get("name") as string,
      telephone: formData.get("telephone") as string,
      address: formData.get("address") as string,
    }),
  );

  // Form から取得した情報を暗号化し、次のページのクエリパラメータに渡す。
  return redirect(`/outlet-sample/second?v=${encrypted}`);
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
      // additional: localStorageValue?.additional,
      additional: "",
    },
    mode: "onBlur",
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    // ローカル ストレージの内容は、クライアントサイドで読み込む。
    const localStorageValue = loadFromLocalStorage();
    const additional = localStorageValue?.additional;

    if (additional) {
      form.setValue("additional", additional);
    }
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as typeof event.target & {
      additional: { value?: string };
    };

    const saved = loadFromLocalStorage();

    // ローカルストレージに暗号化しない情報を保存する。
    saveToLocalStorage({
      encrypted: saved?.encrypted,
      additional: target.additional.value,
    });
  };

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
          // React Router の action を呼び出すので form.handleSubmit は利用しない
          onSubmit={onSubmit}
        >
          <Typography className="m-1" variant={"h5"}>
            First
          </Typography>
          <CustomTextField label="名前" name="name" required />
          <CustomTextField label="電話番号" name="telephone" required />
          <CustomTextField label="住所" name="address" required />
          <CustomTextField label="任意情報" name="additional" />
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
