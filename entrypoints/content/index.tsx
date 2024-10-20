import ReactDOM from "react-dom/client";
import App from "./App";
import "../../assets/global.css";

export default defineContentScript({
  matches: ["*://www.linkedin.com/*"],
  // matches: ["https://developers.google.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    console.log("content script");
    const ui = await createShadowRootUi(ctx, {
      name: "example-ui",
      position: "inline",
      onMount: (container) => {
        // Container is a body, and React warns when creating a root on the body, so create a wrapper div
        const app = document.createElement("div");
        container.append(app);

        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(app);
        root.render(<App />);
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount();
      },
    });

    const observer = new MutationObserver((mutations) => {
      const targetElement = document.querySelector(
        ".msg-form__contenteditable"
      );
      if (targetElement) {
        // The target element is available, stop observing
        observer.disconnect();
        // Execute your logic here
        ui.mount();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  },
});
