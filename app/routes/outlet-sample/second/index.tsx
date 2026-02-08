import React, { useEffect } from "react";
import {
  Box,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { decryptSavedInformation } from "../decrypt.server";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "~/routes/local-storage.client";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const arg = searchParams.get("v");

  if (arg) {
    // クエリパラメータ v があれば、復号する。

    try {
      const result = decryptSavedInformation(arg);
      return result;
    } catch {
      //
    }
  }

  // クエリパラメータ v がないか、復号に失敗した場合はエラー
  throw new Error("不正なアクセスです。");
}

/** このページのテーブルに表示する行 */
const CustomTableRow = (props: { name: string; value?: string }) => {
  return (
    <TableRow>
      <TableCell>
        <Typography className="m-1" variant="body1">
          {props.name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography className="m-1" variant="body1">
          {props.value || ""}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

/** 2 つ目のページ */
export default function Second() {
  const inClient = typeof window !== "undefined";
  const loaderData = useLoaderData<typeof loader>();
  const localStorageValue = inClient ? loadFromLocalStorage() : undefined;

  useEffect(() => {
    const encrypted = new URL(location.href).searchParams.get("v");

    if (encrypted) {
      // クエリパラメータ v があれば、ローカル ストレージに保存する。
      // additional はクエリパラメータにはないので、既存の値を読み込む。
      const saved = loadFromLocalStorage();
      saveToLocalStorage({ encrypted, additional: saved?.additional });
    }
  });

  return (
    <Box
      alignItems="center"
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      margin="5em"
    >
      <Typography className="m-1" variant="h5">
        Second
      </Typography>
      <Table sx={{ width: "auto" }}>
        <TableBody>
          <CustomTableRow name="名前" value={loaderData?.name} />
          <CustomTableRow name="電話番号" value={loaderData?.telephone} />
          <CustomTableRow name="住所" value={loaderData?.address} />
          <CustomTableRow
            name="任意情報"
            value={localStorageValue?.additional}
          />
        </TableBody>
      </Table>
      <Link href="." marginTop={2}>
        戻る
      </Link>
    </Box>
  );
}
