import { motion } from 'framer-motion';
import { Ear, Instagram, Moon, Sun } from 'lucide-react';
import { useMetro } from '@/context/MetroContext';
import { trackEvent } from '@/lib/analytics';
import { useTheme } from '@/components/ThemeProvider';

export const Header = () => {
  const { selectedLine, activeColor } = useMetro();
  const { theme, setTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass border-b border-border/50"
    >
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, hsl(${activeColor}), hsl(${activeColor} / 0.8))`,
                boxShadow: `0 0 24px hsl(${activeColor} / 0.3)`,
              }}
            >
              <Ear className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">metronunkulağı</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">kulak misafiri ama istanbul metro hesaaaaabı</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </motion.button>

          <motion.a
            href="https://instagram.com/metronunkulagi"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('header_instagram_click')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #FCAF45)',
              boxShadow: '0 4px 15px rgba(253, 29, 29, 0.3)'
            }}
          >
            <Instagram className="w-4 h-4" />
            <span>neler duyulmuş?</span>
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
};
