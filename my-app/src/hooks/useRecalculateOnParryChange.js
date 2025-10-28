import { useEffect } from "react";

/**
 * Automatically triggers a recalculation when `isParry` changes.
 * 
 * @param {boolean} isParry - The current parry toggle state.
 * @param {Function} calc - The calculation function to run.
 */
export function useRecalculateOnParryChange(isParry, calc) {
  useEffect(() => {
    if (typeof calc === "function") {
      console.log("Parry state changed → recalculating...");
      calc();
    }
  }, [isParry, calc]);
}
