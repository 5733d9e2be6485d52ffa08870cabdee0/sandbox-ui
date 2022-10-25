import { useEffect, useRef } from "react";

export function usePolling(callback: () => void, delay: number): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay <= 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return (): void => clearInterval(id);
  }, [delay]);
}
