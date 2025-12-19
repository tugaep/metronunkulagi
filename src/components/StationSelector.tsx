import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { useMetro } from '@/context/MetroContext';
import { cn } from '@/lib/utils';
import { Station, METRO_LINE_COLORS } from '@/types/metro';
import { trackEvent } from '@/lib/analytics';

export const StationSelector = () => {
  const { selectedLine, selectedStations, setSelectedStations, selectedDirection, setSelectedDirection } = useMetro();

  if (!selectedLine) return null;

  const stations = selectedLine.stations;
  const firstStation = stations[0];
  const lastStation = stations[stations.length - 1];

  const directions = [
    { id: 'forward', label: lastStation?.Description, icon: ArrowRight },
    { id: 'backward', label: firstStation?.Description, icon: ArrowLeft },
  ];

  const handleStationSelect = (station: Station) => {
    trackEvent('station_select', {
      station_name: station.Description,
      line_id: selectedLine.id
    });

    const isSelected = selectedStations.some(s => s.Id === station.Id);

    if (isSelected) {
      setSelectedStations(selectedStations.filter(s => s.Id !== station.Id));
    } else {
      if (selectedStations.length === 1) {
        // Check adjacency
        const currentStation = selectedStations[0];
        const isAdjacent = Math.abs(currentStation.Order - station.Order) === 1;

        if (isAdjacent) {
          const newSelection = [...selectedStations, station].sort((a, b) => a.Order - b.Order);
          setSelectedStations(newSelection);
        } else {
          // If not adjacent, switch to the new one (assume user wants to select a different station)
          setSelectedStations([station]);
        }
      } else if (selectedStations.length === 0) {
        setSelectedStations([station]);
      } else {
        // Reset to new single selection if already 2 selected
        setSelectedStations([station]);
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedLine.id}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* Direction Selector (Target Destination) */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">yön seç (ne tarafa gidiyon)</h3>
          <div className="grid grid-cols-2 gap-2">
            {directions.map((dir) => {
              const isSelected = selectedDirection === dir.label;
              return (
                <motion.button
                  key={dir.id}
                  onClick={() => {
                    setSelectedDirection(dir.label || '');
                    trackEvent('direction_select', {
                      direction: dir.label || 'unknown'
                    });
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    "border-2",
                    isSelected
                      ? "metro-gradient text-primary-foreground border-transparent metro-glow"
                      : "bg-card border-border hover:metro-border"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <dir.icon className="w-4 h-4" />
                  <span className="truncate">{dir.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Station Selector */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            {selectedStations.length === 2 ? 'iki istasyon arası metroda' : 'istasyon seç'}
          </h3>
          <div className="relative">
            {/* Metro line visual */}
            <div className="absolute left-5 top-4 bottom-4 w-0.5 metro-gradient rounded-full" />

            <div
              className="space-y-1 max-h-48 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[hsl(var(--scrollbar-color))] [&::-webkit-scrollbar-thumb]:rounded-full"
              style={{
                '--scrollbar-color': selectedLine ? (METRO_LINE_COLORS[selectedLine.id] || '220 15% 50%') : '220 15% 50%'
              } as React.CSSProperties}
            >
              {stations.map((station, index) => {
                const isSelected = selectedStations.some(s => s.Id === station.Id);
                return (
                  <motion.button
                    key={station.Id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleStationSelect(station)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 metro-border border"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="relative z-10">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 transition-all duration-200",
                        isSelected
                          ? "bg-primary border-primary scale-125"
                          : "bg-card border-muted-foreground/30"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium truncate transition-colors duration-200",
                        isSelected ? "metro-text" : "text-foreground"
                      )}>
                        {station.Description}
                      </p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <MapPin className="w-4 h-4 metro-text" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
