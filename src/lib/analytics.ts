// Google Analytics 4 custom event tracking helper

// Declare the global gtag function
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (
            command: 'event' | 'config' | 'js' | 'set',
            targetId: string,
            config?: Record<string, any>
        ) => void;
    }
}

/**
 * Sends a custom event to Google Analytics 4
 * @param eventName The name of the event (e.g., 'select_content', 'button_click')
 * @param params Optional parameters for the event
 */
export const trackEvent = (eventName: string, params?: Record<string, string | number | boolean>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    } else {
        // Optional: Log to console in development if GA is not loaded
        if (import.meta.env.DEV) {
            console.log(`[Analytics] Event: ${eventName}`, params);
        }
    }
};

/**
 * Initializes Google Analytics 4
 * Checks for VITE_GOOGLE_ANALYTICS_ID in environment variables
 */
export const initializeAnalytics = () => {
    // Check for VITE_GOOGLE_TAG first (user preference), then fallback to VITE_GOOGLE_ANALYTICS_ID
    const gaId = import.meta.env.VITE_GOOGLE_TAG || import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

    if (!gaId) {
        if (import.meta.env.DEV) {
            console.warn('[Analytics] VITE_GOOGLE_TAG or VITE_GOOGLE_ANALYTICS_ID is missing in .env file');
        }
        return;
    }

    // Prevent duplicate initialization
    if (document.getElementById('google-analytics-script')) return;

    // Inject GA script
    const script = document.createElement('script');
    script.id = 'google-analytics-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
        window.dataLayer.push(args);
    }
    // @ts-ignore
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId);

    if (import.meta.env.DEV) {
        console.log(`[Analytics] Initialized with ID: ${gaId}`);
    }
};
