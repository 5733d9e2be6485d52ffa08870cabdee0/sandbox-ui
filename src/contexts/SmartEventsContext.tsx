import React, { createContext, useContext } from "react";

type AppContextType = {
  getToken: () => Promise<string>;
  getUsername: () => Promise<string>;
  apiBaseUrl: string;
};

type AppContextProviderProps = AppContextType & {
  children: React.ReactNode;
};

const SmartEventsContext = createContext<AppContextType | null>(null);

export const SmartEventsContextProvider = ({
  getToken,
  getUsername,
  apiBaseUrl,
  children,
}: AppContextProviderProps): JSX.Element => (
  <SmartEventsContext.Provider
    value={{
      getToken,
      getUsername,
      apiBaseUrl,
    }}
  >
    {children}
  </SmartEventsContext.Provider>
);

export const useSmartEvents = (): AppContextType => {
  const context = useContext(SmartEventsContext);
  if (!context)
    throw new Error(
      "useSmartEvents must be used inside an SmartEventsContextProvider"
    );

  return {
    ...context,
  };
};
