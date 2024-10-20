import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  runner: {
    startUrls: ["https://in.linkedin.com/"],
    // startUrls: ["https://developers.google.com/"],
    openDevtools: true,
    // openConsole: true,
  },
  manifest: {
    // host_permissions: ["*://*.google.com/*"],
    permissions: ["activeTab", "scripting", "tabs"],
  },
});
