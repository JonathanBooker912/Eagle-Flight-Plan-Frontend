/**
 * Vuetify3 Plugin
 */
import { createVuetify } from "vuetify";
import { VFileUpload } from "vuetify/labs/components";

// Misc
import { loadFonts } from "./webfontloader";
loadFonts();

// Styles
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "darkTheme",
    themes: {
      lightTheme: {
        dark: false,
        colors: {
          primary: "#2684BB",
          secondary: "#353841",
          accent: "#FCA311",
          danger: "#E04125",
          warning: "#FCA311",
          background: "#D5E6ED",
          backgroundDarken: "#BDD2DE",
          black: "#1A1A1A",
          white: "#E8E8E8",
          text: "#1A1A1A",
          textInverted: "#E8E8E8",
        },
      },
      darkTheme: {
        dark: true,
        colors: {
          primary: "#2684BB",
          secondary: "#DCDCDC",
          accent: "#FCA311",
          danger: "#E04125",
          warning: "#FCA311",
          background: "#42444C",
          backgroundDarken: "#32343A",
          black: "#1A1A1A",
          white: "#E8E8E8",
          text: "#E8E8E8",
          textInverted: "#1A1A1A",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
  },
  components: {
    VFileUpload,
  },
});

export default vuetify;
