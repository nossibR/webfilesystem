import { useState } from "react";

import FileContainer from "./FileContainer";
import FilesList from "./FilesList";

export type Language = "en" | "fr";

function App() {
    const [isNight, setIsNight] = useState(false);
    const [language, setLanguage] = useState<Language>("en");
    const [isMobile, setIsMobile] = useState(false);

    function toggleTheme() {
        setIsNight(previous => !previous);
    }

    function toggleLanguage() {
        setLanguage(previous => previous === "en" ? "fr" : "en");
    }

    function toggleMobile() {
        setIsMobile(previous => !previous);
    }

    return (
        <FileContainer
            isNight={isNight}
            onToggleTheme={toggleTheme}
            language={language}
            onToggleLanguage={toggleLanguage}
            isMobile={isMobile}
            onToggleMobile={toggleMobile}
        >
            <FilesList language={language} />
        </FileContainer>
    );
}

export default App;
