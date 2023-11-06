import { createI18n } from "vue-i18n";
import ua from "@/locals/ua.json";
import en from "@/locals/en.json";

const messages = {
  ua,
  en,
};

export default createI18n({
  legacy: false,
  locale: "ua",
  fallbackLocale: "en",
  messages,
});
