import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, InputLabel, Select, FormHelperText, TextField, Container, Box, Typography, MenuItem, Button } from "@mui/material";
import { useFormContext, Controller, useForm, FormProvider } from "react-hook-form";
import z from "zod";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const commonSchema = {
  max10: z.string().max(10, { message: "10文字以内で入力してください" }),
  maxWithName: (item, maximum) => {
    return z.string().max(maximum, {
      message: `${item} は ${maximum} 文字以内で入力してください`
    });
  },
  min10: z.string().min(10, { message: "10文字以上で入力してください" }),
  minWithName: (item, minimum) => {
    return z.string().min(minimum, {
      message: `${item} は ${minimum} 文字以上で入力してください`
    });
  },
  required: () => {
    return z.string().min(1, { message: "入力してください" });
  },
  telephone: z.string().regex(/(^$)|([0-9]{10-11})/, {
    message: "数値 10 桁または 11 桁を入力してください"
  })
};
const optional = (value) => {
  return value.or(z.literal(""));
};
const CustomSelect = ({
  children,
  className,
  helperText,
  label,
  name,
  required
}) => {
  const { control } = useFormContext();
  return /* @__PURE__ */ jsx(
    Controller,
    {
      control,
      name,
      render: ({ field, formState: { errors, isValid } }) => /* @__PURE__ */ jsxs(FormControl, { error: !!errors[name], fullWidth: true, sx: { mt: 1 }, children: [
        /* @__PURE__ */ jsx(InputLabel, { id: "custom-select", children: label }),
        /* @__PURE__ */ jsx(
          Select,
          {
            className,
            fullWidth: true,
            id: "select",
            labelId: "custom-select",
            required,
            variant: "standard",
            ...field,
            ...control.register(name),
            children
          }
        ),
        /* @__PURE__ */ jsx(FormHelperText, { children: errors[name]?.message || helperText })
      ] })
    }
  );
};
const CustomTextField = ({
  className,
  label,
  name,
  required
}) => {
  const { control } = useFormContext();
  return /* @__PURE__ */ jsx(
    Controller,
    {
      control,
      name,
      render: ({ field, formState: { errors, isValid } }) => /* @__PURE__ */ jsx(
        TextField,
        {
          className,
          error: !!errors[name],
          fullWidth: true,
          helperText: errors[name]?.message,
          id: name,
          label,
          required,
          variant: "standard",
          ...field,
          ...control.register(name)
        }
      ),
      rules: {
        required: { value: !!required, message: "入力してください" }
      }
    }
  );
};
const formSchema = z.object({
  input1: optional(commonSchema.maxWithName("入力 1", 10)),
  input2: optional(commonSchema.minWithName("入力 2", 10)),
  input3: optional(commonSchema.max10),
  telephone1: optional(commonSchema.telephone),
  telephone2: optional(commonSchema.telephone),
  telephone3: optional(commonSchema.telephone),
  select1: commonSchema.required(),
  select2: z.string(),
  select3: z.string()
}).refine(
  (arg) => {
    const { select1, select2 } = arg;
    return !select2 || select2 != select1;
  },
  { message: "選択 2 は 選択 1 と同じです。", path: ["select2"] }
).refine(
  (arg) => {
    const { select2, select3 } = arg;
    return !select3 || select2;
  },
  {
    message: "選択 3 を入力する場合は、選択 2 を入力してください。",
    path: ["select3"]
  }
).refine(
  (arg) => {
    const { select2, select3 } = arg;
    return !select3 || select3 != select2;
  },
  { message: "選択 3 は 選択 2 と同じです。", path: ["select3"] }
).refine(
  (arg) => {
    const { select1, select3 } = arg;
    return !select3 || select3 != select1;
  },
  { message: "選択 3 は 選択 1 と同じです。", path: ["select3"] }
);
function Welcome() {
  const form = useForm({
    defaultValues: {
      input1: "これは初期値です",
      input2: "",
      input3: "",
      telephone1: "",
      telephone2: "",
      telephone3: "",
      select1: "",
      select2: "",
      select3: ""
    },
    mode: "onBlur",
    resolver: zodResolver(formSchema)
  });
  const onSubmit = async (data) => {
  };
  return /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsx(FormProvider, { ...form, children: /* @__PURE__ */ jsxs(
    Box,
    {
      alignItems: "center",
      component: "form",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      margin: "5em",
      onSubmit: form.handleSubmit(onSubmit),
      children: [
        /* @__PURE__ */ jsx(Typography, { className: "m-1", variant: "h5", children: "入力してください" }),
        /* @__PURE__ */ jsx(CustomTextField, { label: "入力 1", name: "input1" }),
        /* @__PURE__ */ jsx(CustomTextField, { label: "入力 2", name: "input2" }),
        /* @__PURE__ */ jsx(CustomTextField, { label: "入力 3", name: "input3" }),
        /* @__PURE__ */ jsx(CustomTextField, { label: "電話番号 1", name: "telephone1" }),
        /* @__PURE__ */ jsx(CustomTextField, { label: "電話番号 2", name: "telephone2" }),
        /* @__PURE__ */ jsx(CustomTextField, { label: "電話番号 3", name: "telephone3" }),
        /* @__PURE__ */ jsxs(CustomSelect, { label: "選択 1", name: "select1", required: true, children: [
          /* @__PURE__ */ jsx(MenuItem, { value: "1", children: "1" }),
          /* @__PURE__ */ jsx(MenuItem, { value: "2", children: "2" }),
          /* @__PURE__ */ jsx(MenuItem, { value: "3", children: "3" })
        ] }),
        /* @__PURE__ */ jsxs(CustomSelect, { label: "選択 2", name: "select2", children: [
          /* @__PURE__ */ jsx(MenuItem, { value: "1", children: "1" }),
          /* @__PURE__ */ jsx(MenuItem, { value: "2", children: "2" }),
          /* @__PURE__ */ jsx(MenuItem, { value: "3", children: "3" })
        ] }),
        /* @__PURE__ */ jsxs(CustomSelect, { label: "選択 3", name: "select3", children: [
          /* @__PURE__ */ jsx(MenuItem, { value: "1", children: "1" }),
          /* @__PURE__ */ jsx(MenuItem, { value: "2", children: "2" }),
          /* @__PURE__ */ jsx(MenuItem, { value: "3", children: "3" })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            color: "primary",
            className: "",
            disabled: !form.formState.isValid,
            type: "submit",
            variant: "contained",
            sx: { margin: "1.5rem 0" },
            children: "送信"
          }
        )
      ]
    }
  ) }) });
}
function meta({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Welcome, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/<repo>/assets/entry.client-BU9c1-cN.js", "imports": ["/<repo>/assets/chunk-UIGDSWPH-EipvR-pc.js", "/<repo>/assets/index-8LGnz1Vl.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/<repo>/assets/root-D6yqQuZl.js", "imports": ["/<repo>/assets/chunk-UIGDSWPH-EipvR-pc.js", "/<repo>/assets/index-8LGnz1Vl.js"], "css": ["/<repo>/assets/root-DfzJO9Lq.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/<repo>/assets/home-qftCzsXH.js", "imports": ["/<repo>/assets/chunk-UIGDSWPH-EipvR-pc.js", "/<repo>/assets/index-8LGnz1Vl.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/<repo>/assets/manifest-179de62c.js", "version": "179de62c", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/<repo>/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/<repo>/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
