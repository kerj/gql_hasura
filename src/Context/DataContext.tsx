import { createContext, useReducer, useCallback, useEffect } from "react";
import axios from 'axios'

type DataProviderProps<T> = {
  requestMetas: { url: string, options: any };
  children: JSX.Element;
  initialData?: T
}

export type DataState<T> = {
  data: T | null
  isLoading: boolean,
  error: Error | null,
}

export type DataActions<T> =
  | { type: 'fetchStarted' }
  | { type: 'fetchSuccess'; data: T; }
  | { type: 'fetchError'; error: Error; };

// need to pass this T value
type DataContextValue<T> = {
  data: DataState<T>['data'],
  isLoading: DataState<T>['isLoading'],
  error: DataState<T>['error'],
}

const dataReducer = <T,>(state: DataState<T>, action: DataActions<T>): DataState<T> => {
  console.log(state, action)
  switch (action.type) {
    case 'fetchStarted':
      return { ...state, isLoading: true, error: null }
    case 'fetchSuccess':
      return { ...state, isLoading: false, error: null, data: action.data };
    case 'fetchError':
      return { ...state, isLoading: false, error: action.error }
    default:
      throw new Error(`Unhandled action type: ${action}`)
  }
}

export const DataContext = createContext<DataContextValue<any>>({
  data: null,
  isLoading: false,
  error: null,
})

export const DataProvider = <T,>({ requestMetas, children, initialData }: DataProviderProps<T>) => {
  const [state, dispatch] = useReducer(dataReducer, {
    data: null,
    isLoading: false,
    error: null
  });

  const fetchData = useCallback(async (signal: AbortSignal) => {

    dispatch({ type: "fetchStarted" });
    try {
      const result = await axios(requestMetas.url, { ...requestMetas.options, signal }).then(res => {
        return res.data
      });
      dispatch({ type: "fetchSuccess", data: result });
    } catch (e) {
      console.log('error')
      dispatch({ type: "fetchError", error: e as Error })
    }

  }, [requestMetas])

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetchData(signal);

    return () => {
      abortController.abort();
    }
  }, [fetchData])


  return (
    <DataContext.Provider value={state}>{children}</DataContext.Provider>
  )
}