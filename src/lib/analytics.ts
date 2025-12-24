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


