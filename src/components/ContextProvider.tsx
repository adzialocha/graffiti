import { createContext, useState, useMemo } from 'react';

import type React from 'react';

interface IContextValues {
  active: boolean;
  target: HTMLElement | undefined;
}

interface IContext extends IContextValues {
  setState: (newState: Partial<IContextValues>) => void;
}

type Props = {
  children?: React.ReactNode;
};

const initialState: IContextValues = {
  active: false,
  target: undefined,
};

export const Context = createContext<IContext>({
  ...initialState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setState: () => {
    return;
  },
});

const ContextProvider = ({ children }: Props) => {
  const [state, setState] = useState(initialState);

  const value = useMemo(() => {
    return {
      ...state,
      setState: (newState: Partial<IContextValues>) => {
        // Update all new values while keeping untouched ones in place
        setState({
          ...state,
          ...newState,
        });

        return;
      },
    };
  }, [state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ContextProvider;
