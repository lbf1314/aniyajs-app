import { useState, useEffect, useRef } from 'react';

function useStateWithCallback<T>(
  initialState: T
): [T, (newState: T | ((prevState: T) => T), callback?: (newState: T) => void) => void] {
  const [state, setState] = useState<T>(initialState);
  const callbackRef = useRef<((newState: T) => void) | null>(null);

  const setStateWithCallback = (
    newState: T | ((prevState: T) => T),
    callback?: (newState: T) => void
  ) => {
    callbackRef.current = callback || null;
    setState(newState as T); // TypeScript 会自动推断函数式更新
  };

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state);
      callbackRef.current = null;
    }
  }, [state]);

  return [state, setStateWithCallback];
}

export default useStateWithCallback;