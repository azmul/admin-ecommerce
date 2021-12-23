import { LoadingModel } from "./loading.model";
import { LOADING_META_KEY } from "./loading.utils";

export interface CapturedState<TParams, TSuccess> {
  params: TParams;
  response: TSuccess;
  // the last time the action was called.
  calledAt: number;
}

export interface LoadingMeta {
  [LOADING_META_KEY]?: {
    clear: boolean;
    isPrimitive: boolean;
  };
}

export type LoadingInjectedRequest<TRequest> = TRequest & LoadingMeta;

export interface RematchMappers<TState, TPayload, TKeyState, TAction> {
  success: PayloadMapper<TPayload, TState, TKeyState>;
  error: PayloadMapper<TPayload, TState, TKeyState>;
  loading: PayloadMapper<TAction | undefined, TState, TKeyState>;
  clear: PayloadMapper<TPayload | undefined, TState, TKeyState>;
}

export type PayloadMapper<TPayload, TState, TKeyState> = (
  payload: TPayload,
  state: TState
) => TKeyState;

export type KeyedState<TKey, TValue> = Map<TKey, LoadingModel<TValue>>;

export interface LoadingRematchModelState<TSuccess> {
  model: LoadingModel<TSuccess>;
}

export interface KeyedLoadingRematchModelState<TKey, TValue> {
  model: KeyedState<TKey, TValue>;
}

export interface KeyAction<TKey, TValue> {
  key: TKey;
  data: TValue;
}
