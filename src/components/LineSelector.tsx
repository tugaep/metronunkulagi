import { motion } from 'framer-motion';
import { useMetro } from '@/context/MetroContext';
import { METRO_LINE_COLORS } from '@/types/metro';
import { cn } from '@/lib/utils';

export const LineSelector = () => {
  const { lines, selectedLine, setSelectedLine, setSelectedStations, setSelectedDirection } = useMetro();

  const handleLineSelect = (line: typeof lines[0]) => {
    setSelectedLine(line);
    setSelectedStations([]);
    setSelectedDirection('');
  };

  return (
    <div className="py-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Hat Seç</h3>
      <div className="flex flex-wrap gap-2 pb-2 justify-center">
        {lines.map((line, index) => {
          const isSelected = selectedLine?.id === line.id;
          const lineColor = METRO_LINE_COLORS[line.id] || '220 15% 50%';

          return (
            <motion.button
              key={line.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
              onClick={() => handleLineSelect(line)}
              className={cn(
                "flex-shrink-0 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300",
                "border-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
                isSelected
                  ? "text-primary-foreground scale-105"
                  : "bg-card text-foreground border-border hover:border-transparent"
              )}
              style={{
                ...(isSelected && {
                  background: `hsl(${lineColor})`,
                  borderColor: `hsl(${lineColor})`,
                  boxShadow: `0 4px 20px hsl(${lineColor} / 0.4)`,
                }),
                ...(!isSelected && {
                  '--hover-bg': `hsl(${lineColor} / 0.1)`,
                } as React.CSSProperties),
              }}
              whileHover={{
                scale: isSelected ? 1.05 : 1.02,
                backgroundColor: isSelected ? undefined : `hsl(${lineColor} / 0.1)`,
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
