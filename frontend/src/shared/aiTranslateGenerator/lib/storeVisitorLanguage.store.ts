import { create } from "zustand";

type LanguageState = {
  language: string;
  setLanguage: (lang: string) => void;
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: localStorage.getItem("webonday:lang") ?? "it",

  setLanguage: (lang) => {
    localStorage.setItem("webonday:lang", lang);
    set({ language: lang });
  },
}));
