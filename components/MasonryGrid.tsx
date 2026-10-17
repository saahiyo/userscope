'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiscoveredProfile } from '@/lib/osint/types';
import { ProfileCard } from '@/components/ProfileCard';
import { springs } from '@/lib/motion';

interface MasonryGridProps {
  profiles: DiscoveredProfile[];
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ profiles }) => {
  const [columnCount, setColumnCount] = useState(3);

  // Responsive column count listener matching Tailwind breakpoints:
  // < 640px (mobile): 1 column
  // 640px - 1023px (tablet): 2 columns
  // >= 1024px (desktop): 3 columns
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumnCount(1);
      } else if (width < 1024) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adapt to small number of profiles
  const effectiveCols = useMemo(() => {
    if (profiles.length === 0) return 1;
    return Math.min(columnCount, profiles.length);
  }, [columnCount, profiles.length]);

  // Distribute profiles into columns round-robin to preserve natural reading order
  const columns = useMemo(() => {
    const cols: DiscoveredProfile[][] = Array.from({ length: effectiveCols }, () => []);
    profiles.forEach((profile, index) => {
      cols[index % effectiveCols].push(profile);
    });
    return cols;
  }, [profiles, effectiveCols]);

  if (profiles.length === 0) return null;

  return (
    <motion.div
      layout
      transition={springs.smooth}
      className="w-full flex gap-5 lg:gap-6 items-start pt-1"
    >
      {columns.map((colProfiles, colIndex) => (
        <motion.div
          key={`col-${colIndex}`}
          layout
          transition={springs.smooth}
          className="flex-1 flex flex-col gap-5 lg:gap-6 min-w-0"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {colProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
};
