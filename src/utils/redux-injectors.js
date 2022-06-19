import {
  useInjectReducer as useReducer,
  useInjectSaga as useSaga,
} from 'redux-injectors';

/* Wrap redux-injectors with stricter types */

export function useInjectReducer(params) {
  return useReducer(params);
}

export function useInjectSaga(params) {
  return useSaga(params);
}
