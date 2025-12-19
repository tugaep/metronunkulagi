import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a Cat object
export interface CatData {
    id: number;
    variant: string; // CSS filter string for visual variety
    startX?: number;
    startY?: number;
}

interface CatContextType {
    cats: CatData[];
    addCat: (coords?: { x: number; y: number }) => void;
    removeCat: (id: number) => void;
}

const CatContext = createContext<CatContextType | undefined>(undefined);

export const CatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cats, setCats] = useState<CatData[]>([]);

    const addCat = (coords?: { x: number; y: number }) => {
        const newCat: CatData = {
            id: Date.now(),
            variant: getRandomVariant(),
            startX: coords?.x,
            startY: coords?.y,
        };
        setCats((prev) => [...prev, newCat]);
    };

    const removeCat = (id: number) => {
        setCats((prev) => prev.filter((cat) => cat.id !== id));
    };

    return (
        <CatContext.Provider value={{ cats, addCat, removeCat }}>
            {children}
        </CatContext.Provider>
    );
};

export const useCats = () => {
    const context = useContext(CatContext);
    if (!context) {
        throw new Error('useCats must be used within a CatProvider');
    }
    return context;
};

// Helper to generate random CSS filters for variety
const getRandomVariant = () => {
    const filters = [
        'none', // Standard
        'hue-rotate(90deg)', // Greenish
        'hue-rotate(180deg)', // Blueish
        'hue-rotate(270deg)', // Purpleish
        'invert(1)', // Black cat (roughly)
        'sepia(1)', // Old timey
        'grayscale(1)', // Grey
        'invert(1) hue-rotate(180deg)', // Orange/Reddish inverted
    ];
    return filters[Math.floor(Math.random() * filters.length)];
};
