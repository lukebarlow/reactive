import { useEffect, useMemo, useReducer, useRef } from "react";
import { Observer, reactive } from "@reactivedata/reactive";

export function useReactive<T>(stateObject: T, deps?: React.DependencyList): T {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);

  const observer = useRef<Observer>();
  const mounted = useRef(false);
  if (!observer.current) {
    observer.current = new Observer(() => {
      if (mounted.current) {
        forceUpdate();
      }
    });
  }

  const ret = useMemo(() => {
    observer.current.removeObservers();
    return reactive(stateObject, observer.current);
  }, deps || []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      observer.current.removeObservers();
    };
  }, []);
  return ret;
}

export function useReactives<T extends any[]>(stateObjects: T, deps?: React.DependencyList): T {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);

  const observer = useRef<Observer>();
  const mounted = useRef(false);
  if (!observer.current) {
    observer.current = new Observer(() => {
      if (mounted.current) {
        forceUpdate();
      }
    });
  }

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      observer.current.removeObservers();
    };
  }, []);

  return useMemo(() => {
    return stateObjects.map((stateObject) => {
      return reactive(stateObject, observer.current);
    });
  }, deps || []) as T;
}
