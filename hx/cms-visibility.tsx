import { useState, useEffect } from "react";
import type { ComponentType } from "react";

const useChildCountStore = (() => {
  let count = 0;
  let listeners = new Set<(count: number) => void>();

  return {
    getCount: () => count,
    setCount: (newCount: number) => {
      count = newCount;
      listeners.forEach((listener) => listener(count));
    },
    subscribe: (listener: (count: number) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
})();

export function onCMS(Component: ComponentType): ComponentType {
  return (props) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      setTimeout(() => {
        const layer = document.querySelector(`.${props.className}`);
        if (layer) {
          const itemCount = layer.children.length;
          setCount(itemCount);
          useChildCountStore.setCount(itemCount);
        }
      }, 0);
    }, [props.className]);

    return <Component {...props} />;
  };
}

export function onLayer(Component: ComponentType): ComponentType {
  return (props) => {
    const [isVisible, setIsVisible] = useState(true);
    const [count, setCount] = useState(() => useChildCountStore.getCount());

    useEffect(() => {
      const unsubscribe = useChildCountStore.subscribe((newCount) => {
        setCount(newCount);
        setIsVisible(newCount > 0);
      });

      return () => unsubscribe();
    }, []);

    if (!isVisible) return null;

    return <Component {...props} />;
  };
}

export function onEmpty(Component: ComponentType): ComponentType {
  return (props) => {
    const [isVisible, setIsVisible] = useState(
      () => useChildCountStore.getCount() === 0,
    );
    const [count, setCount] = useState(() => useChildCountStore.getCount());

    useEffect(() => {
      const unsubscribe = useChildCountStore.subscribe((newCount) => {
        setCount(newCount);
        setIsVisible(newCount === 0);
      });

      return () => unsubscribe();
    }, []);

    if (!isVisible) return null;

    return <Component {...props} />;
  };
}
