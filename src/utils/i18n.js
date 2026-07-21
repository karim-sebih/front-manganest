import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

const API_URL = import.meta.env.VITE_API_URL;

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        lng: "fr",
        fallbackLng: "fr",
        debug: true,

        interpolation: {
            escapeValue: false,
        },

        backend: {
            loadPath: `${API_URL}/translations/{{lng}}`,
            requestOptions: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
            },
        },

    });

export default i18n;