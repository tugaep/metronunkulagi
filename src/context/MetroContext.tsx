import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Station, MetroLine, METRO_LINE_COLORS, Conversation } from '@/types/metro';
import metroData from '@/data/istanbulMetroStations.json';

interface MetroContextType {
  lines: MetroLine[];
  selectedLine: MetroLine | null;
  selectedStations: Station[];
  selectedDirection: string;
  setSelectedLine: (line: MetroLine | null) => void;
  setSelectedStations: (stations: Station[]) => void;
  setSelectedDirection: (direction: string) => void;
  conversations: Conversation[];
  addConversation: (conversation: Omit<Conversation, 'id' | 'created_at'>) => void;
  activeColor: string;
}

const MetroContext = createContext<MetroContextType | null>(null);

export const useMetro = () => {
  const context = useContext(MetroContext);
  if (!context) throw new Error('useMetro must be used within MetroProvider');
  return context;
};



export const MetroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLine, setSelectedLine] = useState<MetroLine | null>(null);
  const [selectedStations, setSelectedStations] = useState<Station[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const lines = useMemo(() => {
    const data = metroData as { Data: Station[] };
    const lineMap = new Map<string, Station[]>();

    data.Data.forEach((station) => {
      const existing = lineMap.get(station.LineName) || [];
      existing.push(station);
      lineMap.set(station.LineName, existing);
    });

    return Array.from(lineMap.entries())
      .map(([name, stations]) => ({
        id: name,
        name,
        color: METRO_LINE_COLORS[name] || '220 15% 50%',
        stations: stations.sort((a, b) => a.Order - b.Order),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const activeColor = selectedLine?.color || '220 15% 50%';

  useEffect(() => {
    document.documentElement.style.setProperty('--metro-line', activeColor);
  }, [activeColor]);

  const addConversation = (conv: Omit<Conversation, 'id' | 'created_at'>) => {
    // Fallback UUID generator for non-secure contexts (like mobile local network testing)
    const generateUUID = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const newConv: Conversation = {
      ...conv,
      id: generateUUID(),
      created_at: new Date().toISOString(),
    };
    setConversations((prev) => [newConv, ...prev]);
  };

  return (
    <MetroContext.Provider
      value={{
        lines,
        selectedLine,
        selectedStations,
        selectedDirection,
        setSelectedLine,
        setSelectedStations,
        setSelectedDirection,
        conversations,
        addConversation,
        activeColor,
      }}
    >
      {children}
    </MetroContext.Provider>
  );
};
