import { motion } from 'framer-motion';
import { Ear, Instagram } from 'lucide-react';
import { useMetro } from '@/context/MetroContext';
import { trackEvent } from '@/lib/analytics';

export const Header = () => {
  const { selectedLine, activeColor } = useMetro();

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
            <h1 className="text-lg font-bold tracking-tight">kulakmetrofiri</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">kulak misafiri ama istanbul metro hesaaaaabı</p>
          </div>
        </div>

        <motion.a
          href="https://instagram.com/kulakmetrofiri"
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
    </motion.header>
  );
};
