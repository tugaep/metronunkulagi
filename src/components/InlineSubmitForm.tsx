import { useState } from 'react';
import { Send, Users, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { useMetro } from '@/context/MetroContext';
import { StationSelector } from '@/components/StationSelector';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const SwipeableDigit = ({
    value,
    onChange,
    max,
    activeColor
}: {
    value: string;
    onChange: (val: string) => void;
    max: number;
    activeColor: string;
}) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (isEditing) return;
        const threshold = 10;
        const current = parseInt(value);

        if (info.offset.y < -threshold) {
            // Swipe Up -> Increment
            const next = current + 1 > max ? 0 : current + 1;
            onChange(next.toString().padStart(2, '0'));
        } else if (info.offset.y > threshold) {
            // Swipe Down -> Decrement
            const prev = current - 1 < 0 ? max : current - 1;
            onChange(prev.toString().padStart(2, '0'));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsEditing(false);
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 0;
        // Clamp to max (e.g., 23 or 59)
        if (val > max) val = max;
        if (val < 0) val = 0;
        onChange(val.toString().padStart(2, '0'));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    return (
        <div className="relative flex flex-col items-center">
            <ChevronUp className="w-4 h-4 text-muted-foreground/50 mb-1" />

            <div
                className="relative w-24 h-24" // Fixed container size
            >
                {isEditing ? (
                    <div
                        className="w-full h-full flex items-center justify-center rounded-xl bg-card border-2 shadow-sm"
                        style={{ borderColor: `hsl(${activeColor})` }}
                    >
                        <Input
                            autoFocus
                            type="number"
                            defaultValue={value}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            className="w-full h-full text-5xl font-bold text-center p-0 border-none focus-visible:ring-0 bg-transparent caret-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            style={{ color: `hsl(${activeColor})` }}
                        />
                    </div>
                ) : (
                    <motion.div
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        onClick={() => setIsEditing(true)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-card border-2 cursor-grab active:cursor-grabbing touch-none shadow-sm"
                        style={{ borderColor: `hsl(${activeColor})` }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span
                            className="text-5xl font-bold select-none pointer-events-none"
                            style={{ color: `hsl(${activeColor})` }}
                        >
                            {value}
                        </span>
                    </motion.div>
                )}
            </div>

            <ChevronDown className="w-4 h-4 text-muted-foreground/50 mt-1" />
        </div>
    );
};

export const InlineSubmitForm = () => {
    const {
        selectedLine,
        setSelectedLine,
        selectedStations,
        setSelectedStations,
        selectedDirection,
        setSelectedDirection,
        addConversation
    } = useMetro();
    const [content, setContent] = useState('');
    const [who, setWho] = useState('');

    // Initialize with current time
    const now = new Date();
    const [hour, setHour] = useState(now.getHours().toString().padStart(2, '0'));
    const [minute, setMinute] = useState(now.getMinutes().toString().padStart(2, '0'));

    const isMetroOpen = (h: number) => {
        const currentDate = new Date();
        const currentHour = h;

        // Metro is closed between 01:00 and 06:00
        if (currentHour >= 1 && currentHour < 6) {
            const day = currentDate.getDay(); // 0 is Sunday, 6 is Saturday

            // Checks for Night Metro exceptions
            // Saturday morning (Friday night) -> OPEN
            // Sunday morning (Saturday night) -> OPEN
            if (day === 6 || day === 0) {
                return true;
            }
            return false;
        }
        return true;
    };

    const isTimeValid = isMetroOpen(parseInt(hour));

    const activeLineColor = selectedLine?.color || '220 15% 50%';

    const handleSubmit = async () => {
        if (!content.trim()) {
            toast.error('ne duydun yazsana olm');
            return;
        }
        if (!selectedLine) {
            toast.error('hat seçmeden olmaz knk');
            return;
        }
        if (selectedStations.length === 0) {
            toast.error('bi istasyon zorunlu agaparator');
            return;
        }

        if (!isTimeValid) {
            toast.error('kanka bu saatte metro yok, rüyanda mı gördün?', {
                description: 'Gece metrosu sadece Cuma ve Cumartesi geceleri var.'
            });
            return;
        }

        const locationType: 'between_stations' | 'station' = selectedStations.length > 1 ? 'between_stations' : 'station';
        const primaryStation = selectedStations[0];
        const secondaryStation = selectedStations.length > 1 ? selectedStations[1]?.Description : null;

        // Calculate time
        const happenedAt = new Date();
        happenedAt.setHours(parseInt(hour), parseInt(minute));

        const payload = {
            content: content.trim(),
            line_id: selectedLine.id,
            location_type: locationType,
            station_primary: primaryStation.Description,
            station_secondary: secondaryStation,
            direction: selectedDirection || '',
            people_attributes: who.trim() ? [who.trim()] : ['Bilinmeyen'],
            happened_at: happenedAt.toISOString(),
        };

        try {
            const { error } = await supabase
                .from('submissions')
                .insert([
                    {
                        metro_line: selectedLine.id,
                        from_station: primaryStation.Description,
                        to_station: secondaryStation || primaryStation.Description, // Fallback if single station
                        direction: selectedDirection || '',
                        message: content.trim(),
                        timestamp: happenedAt.toISOString(),
                        people_attributes: who.trim() ? [who.trim()] : ['Bilinmeyen'],
                        location_type: locationType,
                    }
                ]);

            if (error) {
                console.error('Supabase error:', error);
                toast.error('Gönderilemedi, bi sıkıntı var.');
                return;
            }

        } catch (err) {
            console.error('Failed to save submission:', err);
            toast.error('Gönderilemedi, bi sıkıntı var.');
            return;
        }

        addConversation(payload);

        toast.success('eyw', {
            description: 'insta @kulakmetrofiri',
            style: {
                backgroundColor: `hsl(${activeLineColor})`,
                color: 'white',
                border: 'none',
            },
            descriptionClassName: '!text-white',
            duration: 10000,
        });

        // Reset form
        setContent('');
        setWho('');
        const current = new Date();
        setHour(current.getHours().toString().padStart(2, '0'));
        setMinute(current.getMinutes().toString().padStart(2, '0'));

        // Reset state to return to "Ne duydun?" initial view
        setSelectedLine(null);
        setSelectedStations([]);
        setSelectedDirection('');

        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="mt-4">
            <AnimatePresence mode="wait">
                {!selectedLine ? (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center justify-center py-12"
                    >
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 select-none">
                            Ne duydun?
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2 select-none">
                            Paylaşmak için bir hat seçin
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        {/* 2. Text Input (What was heard) */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                Ne duydun?
                            </label>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="meraktan ölcem"
                                className="min-h-[80px] resize-none rounded-xl border-border focus:ring-primary transition-all duration-300"
                            />
                        </div>

                        {/* 3. Station Selector (Direction/Context) */}
                        <StationSelector />

                        {/* 4. Time Log */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Ne zaman?
                            </label>
                            <div className="flex items-center gap-2 select-none">
                                <div className="relative">
                                    <SwipeableDigit
                                        value={hour}
                                        onChange={setHour}
                                        max={23}
                                        activeColor={activeLineColor}
                                    />
                                </div>

                                <span className="text-4xl font-bold text-muted-foreground pb-2">:</span>

                                <div className="relative">
                                    <SwipeableDigit
                                        value={minute}
                                        onChange={setMinute}
                                        max={59}
                                        activeColor={activeLineColor}
                                    />
                                </div>
                            </div>
                            {!isTimeValid && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-xs text-destructive mt-2"
                                >
                                    yarma bu saatte metro çalışmıyor
                                </motion.p>
                            )}
                        </div>

                        {/* 5. Who? (Text Input) */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Kimler konuşuyordu?
                            </label>
                            <Input
                                value={who}
                                onChange={(e) => setWho(e.target.value)}
                                placeholder="Örn: iki lavuk, bir diva..."
                                className="rounded-xl border-border focus:ring-primary"
                            />
                        </div>

                        {/* 5. Submit Button */}
                        <Button
                            onClick={handleSubmit}
                            disabled={!content.trim() || !selectedLine || selectedStations.length === 0}
                            className="w-full h-12 rounded-xl text-base font-semibold metro-gradient metro-glow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5 mr-2" />
                            gönder
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
