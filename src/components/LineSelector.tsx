import { motion } from 'framer-motion';
import { useMetro } from '@/context/MetroContext';
import { METRO_LINE_COLORS } from '@/types/metro';
import { cn, isLightColor } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

export const LineSelector = () => {
  const { lines, selectedLine, setSelectedLine, setSelectedStations, setSelectedDirection } = useMetro();

  const handleLineSelect = (line: typeof lines[0]) => {
    setSelectedLine(line);
    setSelectedStations([]);
    setSelectedDirection('');

    trackEvent('line_select', {
      line_id: line.id,
      line_name: line.name
    });
  };

  return (
    <div className="py-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Hat Seç</h3>
      <div className="flex flex-wrap gap-2 pb-2 justify-center">
        {lines.map((line, index) => {
          const isSelected = selectedLine?.id === line.id;
          const lineColor = METRO_LINE_COLORS[line.id] || '220 15% 50%';
          const useDarkText = isLightColor(lineColor);

          return (
            <motion.button
              key={line.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
              onClick={() => handleLineSelect(line)}
              className={cn(
                "flex-shrink-0 px-4 py-2.5 font-semibold text-sm transition-all duration-300",
                "border-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
                isSelected
                  ? "scale-105 border-transparent bg-[hsl(var(--line-color))] text-[var(--text-color)] shadow-[0_4px_20px_hsl(var(--line-color)/0.4)]"
                  : "bg-card text-foreground border-border hover:border-transparent hover:bg-[hsl(var(--line-color)/0.1)]"
              )}
              style={{
                borderRadius: '0.75rem',
                '--line-color': lineColor,
                '--text-color': useDarkText ? 'hsl(220 20% 10%)' : 'white',
              } as React.CSSProperties}
              whileHover={{
                scale: isSelected ? 1.05 : 1.02,
              }}
              whileTap={{ scale: 0.98 }}
            >
              {line.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
