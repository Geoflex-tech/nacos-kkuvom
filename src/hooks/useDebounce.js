import { useState, useEffect } from "react";

/**
 * useDebounce — delays updating a value until after `delay` ms of inactivity.
 *
 * Useful for search inputs: prevents firing a Supabase query on every keystroke.
 *
 * @param {*}      value - the value to debounce (typically an input string)
 * @param {number} delay - debounce delay in milliseconds (default: 400)
 * @returns the debounced value
 *
 * @example
 *   const [query, setQuery] = useState("");
 *   const debouncedQuery = useDebounce(query, 400);
 *
 *   useEffect(() => {
 *     if (debouncedQuery) fetchResults(debouncedQuery);
 *   }, [debouncedQuery]);
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
