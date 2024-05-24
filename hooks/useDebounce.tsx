import { useEffect } from "react";

export const useDebounce = (
  callback: () => void,
  delay: number = 500,
  deps: any[]
) => {
  useEffect(() => {
    // Set a timer that executes the callback after the specified delay
    const handler = setTimeout(() => {
      callback();
    }, delay);

    // Clean up the timer if the dependencies change or on component unmount
    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay]); // Ensure the effect runs when any dependency changes
};
