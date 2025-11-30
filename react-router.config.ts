import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  basename: import.meta.env.PROD ? "/<repo>/" : "/",
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
} satisfies Config;
