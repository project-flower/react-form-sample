import React from "react";
import { Link } from "@mui/material";
import { loadFromLocalStorage } from "../local-storage.client";

export function clientLoader() {
  const encrypted = loadFromLocalStorage()?.encrypted;
  let params = "";

  if (encrypted) {
    // ローカルストレージに保存値があれば、バックエンドで復号させるため
    // クエリパラメータに値を渡す。
    params = `/?v=${encrypted}`;
  }

  location.replace(`${location.origin}/outlet-sample/first${params}`);
}

export default function Index() {
  return <Link href="./first">入力へ</Link>;
}
