import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Only track if analytics are initialized
        const gaId = import.meta.env.VITE_GOOGLE_TAG || import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

        if (typeof window.gtag !== "undefined" && gaId) {
            window.gtag("config", gaId, {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    return null;
};
