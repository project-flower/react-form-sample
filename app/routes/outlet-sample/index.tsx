import React from "react";
import { Typography } from "@mui/material";
import { Outlet, useLoaderData } from "react-router";

export function loader() {
  return { result: "outlet-sample/" };
}

export default function OutletSample() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <Typography>{loaderData.result}</Typography>
      <Outlet />
    </>
  );
}
