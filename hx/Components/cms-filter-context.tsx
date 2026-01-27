import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type ComponentType,
} from "react";

interface FilterContextValue {
  filterVersion: number;
  notifyFilterChange: () => void;
  registerSwiper: (id: string) => void;
  unregisterSwiper: (id: string) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

function FilterProviderComponent({ children }: { children: ReactNode }) {
  const [filterVersion, setFilterVersion] = useState(0);
  const [swipers, setSwipers] = useState<Set<string>>(new Set());

  const notifyFilterChange = useCallback(() => {
    setFilterVersion((prev) => prev + 1);
  }, []);

  const registerSwiper = useCallback((id: string) => {
    setSwipers((prev) => new Set(prev).add(id));
  }, []);

  const unregisterSwiper = useCallback((id: string) => {
    setSwipers((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <FilterContext.Provider
      value={{
        filterVersion,
        notifyFilterChange,
        registerSwiper,
        unregisterSwiper,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// Export as code override wrapper
export function FilterProvider(Component: ComponentType): ComponentType {
  return (props) => {
    return (
      <FilterProviderComponent>
        <Component {...props} />
      </FilterProviderComponent>
    );
  };
}

export function useFilterContext() {
  return useContext(FilterContext);
}
