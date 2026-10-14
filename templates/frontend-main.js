import { createApp, h } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { createI18n } from "vue-i18n";
import { createRouter, createWebHashHistory, RouterView } from "vue-router";
import routes from "./standalone-routes";

function rejectExternalRequests() {
  throw new Error("External services are disabled in standalone prototype mode");
}

async function startStandalone() {
  // Some shared UI modules access Pinia during import: activate it first.
  const pinia = createPinia();
  setActivePinia(pinia);

  const ui = await import("@2enapps/ui");
  await import("@2enapps/ui/styles.css");

  const i18n = createI18n({
    legacy: true,
    locale: "en",
    fallbackLocale: "en",
    messages: { en: {} }
  });
  const root = {
    render() {
      if (!routes.length) {
        return h("p", "Scaffold only: configure a submodule before reviewing screens.");
      }

      return h(RouterView);
    }
  };
  const app = createApp(root);
  app.use(pinia);
  app.use(i18n);
  app.use(ui.default, {
    hostAdapter: {
      getAuthHeaders: rejectExternalRequests,
      upload: rejectExternalRequests,
      uploadAttachment: rejectExternalRequests,
      uploadAttachmentTus: rejectExternalRequests,
      deleteAttachment: rejectExternalRequests,
      recordAudit: rejectExternalRequests,
      fetchLookupList: rejectExternalRequests,
      getUploadClient() {
        return null;
      },
      getMenuBreadcrumbs() {
        return [];
      }
    }
  });

  if (routes.length) {
    const router = createRouter({
      history: createWebHashHistory(),
      routes
    });
    app.use(router);
    await router.isReady();
  }

  app.mount("#app");
}

// Vue CLI owns serving/building; no secondary runner or webpack override.
export const standaloneReady = startStandalone();
