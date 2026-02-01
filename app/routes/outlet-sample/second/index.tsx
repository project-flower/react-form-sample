import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import {
  useLoaderData,
  type ClientLoaderFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { decryptSavedInformation } from "../decrypt.server";
import { KEY_OUTLET_SAMPLE } from "~/constants";

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  const arg = params.v;

  if (arg) {
    // クエリパラメータ v があれば、ローカル ストレージに保存する。
    localStorage.setItem(KEY_OUTLET_SAMPLE, arg);
  }
}

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
  const { name, telephone, address } = useLoaderData();

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
          <CustomTableRow name="名前" value={name} />
          <CustomTableRow name="電話番号" value={telephone} />
          <CustomTableRow name="住所" value={address} />
        </TableBody>
      </Table>
    </Box>
  );
}
