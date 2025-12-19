import { useRef } from 'react';
import { useCats } from "@/contexts/CatContext";
import { trackEvent } from '@/lib/analytics';

export const Footer = () => {
    const { addCat } = useCats();
    const footerRef = useRef<HTMLElement>(null);

    const handleSpawnCat = () => {
        trackEvent('spawn_cat');

        if (footerRef.current) {
            const rect = footerRef.current.getBoundingClientRect();
            // Spawn just above the footer, random X within viewport
            addCat({
                x: Math.random() * (window.innerWidth - 50),
                y: rect.top - 50
            });
        } else {
            addCat();
        }
    };

    return (
        <footer
            ref={footerRef}
            className="py-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-4"
        >
            <div className="space-y-1">
                <p>no copyright just for fun</p>
                <p>thanks to <a href="https://instagram.com/overheardbogazici" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('footer_credit_click')} className="underline hover:text-foreground transition-colors">@overheardbogazici</a> for the idea</p>
            </div>

            <button
                onClick={handleSpawnCat}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                aria-label="add a cat"
            >
                pisi pisi
            </button>

            <div className="space-y-1">
                <p className="font-medium">free imamson</p>
                <p className="font-medium">tugaep</p>
            </div>
        </footer>
    );
};
