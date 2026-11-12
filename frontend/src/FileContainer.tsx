import "./FileContainer.css";
import type { ReactNode } from "react";
import type { Language } from "./App";

interface FileContainerProps {
    isNight: boolean;
    onToggleTheme: () => void;
    language: Language;
    onToggleLanguage: () => void;
    isMobile: boolean;
    onToggleMobile: () => void;
    children?: ReactNode;
}

export default function FileContainer({
    isNight,
    onToggleTheme,
    language,
    onToggleLanguage,
    isMobile,
    onToggleMobile,
    children,
}: FileContainerProps) {

    const translations = {
        en: {
            subtitle: "My files",
            light: "Light mode",
            dark: "Dark mode",
            language: "Français",
            mobile: "Phone view",
            desktop: "Desktop view",
        },
        fr: {
            subtitle: "Mes fichiers",
            light: "Mode clair",
            dark: "Mode sombre",
            language: "English",
            mobile: "Vue mobile",
            desktop: "Vue ordinateur",
        },
    };

    const t = translations[language];

    return (
        <main className={`file-container ${isNight ? "night-mode" : "day-mode"}`}>

            <div className="file-container__heading">

                <h1 className="file-container__title">
                    WebFileSystem
                </h1>

                <div className="file-container__settings">

                    <button
                        className="language-toggle"
                        onClick={onToggleLanguage}
                    >
                        {t.language}
                    </button>

                    <button
                        className="theme-toggle"
                        onClick={onToggleTheme}
                    >
                        {isNight ? t.light : t.dark}
                    </button>

                    <button
                        className="mobile-toggle"
                        onClick={onToggleMobile}
                        aria-pressed={isMobile}
                    >
                        {isMobile ? t.desktop : t.mobile}
                    </button>

                </div>

            </div>

            <section className={`file-container__panel ${isMobile ? "mobile-preview" : ""}`}>

                <h2 className="file-container__subtitle">
                    {t.subtitle}
                </h2>

                <div className="file-container__content">
                    {children}
                </div>

            </section>

        </main>
    );
}
