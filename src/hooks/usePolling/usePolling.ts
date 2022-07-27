import { useEffect, useRef } from "react";

export function usePolling(
  callback: () => void,
  delay: number,
  startImmediately?: boolean
): void | (() => void) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay <= 0) {
      return;
    }

    function tick(): void {
      savedCallback.current && savedCallback.current();
    }
    if (startImmediately) {
      tick();
    }
    const id = setInterval(tick, delay);

    return (): void => clearInterval(id);
  }, [delay, startImmediately]);
}
