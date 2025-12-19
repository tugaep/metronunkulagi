import { useEffect, useRef } from 'react';
import { Neko } from 'neko-ts';
import { CatData } from '../contexts/CatContext';

export const RoamingCat = ({ cat }: { cat: CatData }) => {
    const nekoInstance = useRef<Neko | null>(null);

    useEffect(() => {
        // Initialize Neko with some random parameters for variety in movement
        const neko = new Neko({
            nekoId: cat.id,
            speed: 10 + Math.random() * 15, // Varied speed 10-25
            origin: {
                x: cat.startX ?? Math.random() * window.innerWidth,
                y: cat.startY ?? Math.random() * window.innerHeight
            }
        });

        nekoInstance.current = neko;

        // Apply the visual variant (CSS filter) to the generated element
        // We use a timeout to ensure the DOM element is created
        setTimeout(() => {
            const el = document.getElementById(`neko-${cat.id}`);
            if (el) {
                el.style.filter = cat.variant;
                el.style.zIndex = "9999"; // Ensure it's on top

                // If the user wanted specific skins, we could replace backgroundImage here
                // if we had the assets.
                // el.style.backgroundImage = "url(/cats/dog.gif)"; 
            }
        }, 100);

        return () => {
            if (nekoInstance.current) {
                // The library's destroy method might require the ID sometimes dependent on version
                try {
                    nekoInstance.current.destroy(cat.id);
                } catch (error) {
                    console.warn("Failed to destroy neko instance:", error);
                    // Fallback manual cleanup if library fails
                    const el = document.getElementById(`neko-${cat.id}`);
                    if (el) el.remove();
                }
            }
        };
    }, [cat.id, cat.variant]);

    return null; // This component does not render React DOM, it manages the external Neko DOM
};
