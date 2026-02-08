import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { isRouteErrorResponse, Outlet, useLoaderData } from "react-router";
import type { Route } from "./+types";

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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="center"
      minHeight="100vh"
    >
      <Stack display="flex">
        {isRouteErrorResponse(error) ? (
          <>
            <TitleTypography title={`${error.status} ${error.statusText}`} />
            <DescriptionTypography message={error.data} />
          </>
        ) : error instanceof Error ? (
          <>
            <TitleTypography title="エラー" />
            <DescriptionTypography message={error.message} />
          </>
        ) : (
          <TitleTypography title="不明なエラー" />
        )}
      </Stack>
    </Box>
  );
}

const DescriptionTypography = (props: { message?: string }) => {
  return <Typography variant="body1">{props.message}</Typography>;
};

const TitleTypography = (props: { title?: string }) => {
  return <Typography variant="h5">{props.title}</Typography>;
};
