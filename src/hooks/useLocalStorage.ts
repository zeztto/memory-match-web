import { useState, useCallback, useEffect } from 'react';
import { BestRecords, BestRecord, Difficulty } from '@/types/game';
import {writeStorage,removeStorage,loadBestRecords} from '@/lib/storage';

const STORAGE_KEY = 'card-puzzle-best-records';

interface UseLocalStorageReturn {
  bestRecords: BestRecords;
  storageAvailable: boolean;
  getBestRecord: (difficulty: Difficulty) => BestRecord | undefined;
  saveBestRecord: (difficulty: Difficulty, time: number, moves: number) => boolean;
  clearRecords: () => void;
}

export function useLocalStorage(): UseLocalStorageReturn {
  const [initialStorage] = useState(loadBestRecords);
  const [bestRecords, setBestRecords] = useState<BestRecords>(initialStorage.records);
  const [storageAvailable, setStorageAvailable] = useState(initialStorage.writable);

  useEffect(() => {
    if (initialStorage.writable) setStorageAvailable(writeStorage(STORAGE_KEY, JSON.stringify(bestRecords)));
  }, [bestRecords, initialStorage.writable]);

  const getBestRecord = useCallback((difficulty: Difficulty): BestRecord | undefined => {
    return bestRecords[difficulty];
  }, [bestRecords]);

  const saveBestRecord = useCallback((difficulty: Difficulty, time: number, moves: number): boolean => {
    const currentBest = bestRecords[difficulty];
    
    // Check if this is a new best (lower time wins, if same time, lower moves wins)
    const isNewBest = !currentBest || 
      time < currentBest.time || 
      (time === currentBest.time && moves < currentBest.moves);

    if (isNewBest) {
      const newRecord: BestRecord = {
        time,
        moves,
        date: new Date().toISOString()
      };

      setBestRecords(prev => ({
        ...prev,
        [difficulty]: newRecord
      }));

      return true;
    }

    return false;
  }, [bestRecords]);

  const clearRecords = useCallback(() => {
    setBestRecords({});
    if (initialStorage.writable) setStorageAvailable(removeStorage(STORAGE_KEY));
  }, [initialStorage.writable]);

  return {
    bestRecords,
    storageAvailable,
    getBestRecord,
    saveBestRecord,
    clearRecords
  };
}
