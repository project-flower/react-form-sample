import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("form-sample", "routes/form-sample/index.tsx"),
  layout("routes/outlet-sample/layout.tsx", [
    route("outlet-sample", "routes/outlet-sample/index.tsx"),
    route("outlet-sample/first", "routes/outlet-sample/first/index.tsx"),
    route("outlet-sample/second", "routes/outlet-sample/second/index.tsx"),
  ]),
] satisfies RouteConfig;
