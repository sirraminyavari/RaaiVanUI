import { createContext, useContext, useEffect, useState } from 'react';
import * as dashboardAPI from './DashboardApiCalls';

interface IDashboardContext {
  dashboards?: Awaited<ReturnType<typeof dashboardAPI.fetchDashboards>>;
  isLoading: boolean;
  reloadDashboards: () => Promise<void>;
}

export const DashboardContext = createContext<IDashboardContext>({
  isLoading: true,
  reloadDashboards: () => new Promise((res) => res()),
});

export function DashboardStepContextProvider({ children }) {
  const [dashboards, setDashboards] =
    useState<Awaited<ReturnType<typeof dashboardAPI.fetchDashboards>>>();
  const [isLoading, setIsLoading] = useState(true);

  const reloadDashboards = async () => {
    setIsLoading(true);
    const result = await dashboardAPI.fetchDashboards();
    setDashboards(result);
    setIsLoading(false);
  };

  useEffect(() => {
    reloadDashboards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardContext.Provider
      value={{ dashboards, isLoading, reloadDashboards }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboardContext = () => useContext(DashboardContext);
