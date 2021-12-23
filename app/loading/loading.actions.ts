import { Action } from "redux";
import { LoadingModel, wrapLoading } from "./loading.model";
import {
  createModel,
  ModelConfig,
  ModelEffects,
  ModelReducers,
  RematchDispatch,
} from "@rematch/core";
import {
  selectHasLoaded,
  selectIsEmpty,
  selectIsLoading,
  selectOptionalError,
  selectOptionalSuccess,
  selectSuccess,
} from "./loading.selectors";
import {
  ModelSelectorsFactory,
  Selector,
  SelectorCreator,
  Slicer,
} from "@rematch/select";
import {
  addClearParam,
  extractClearFromPayload,
  extractClearParam,
  injectClearParams,
  shouldRequest,
} from "./loading.utils";
import {
  CapturedState,
  LoadingRematchModelState,
  RematchMappers,
} from "./loading.types";
import moment from "moment";

const defaultMappers = <TAction, TSuccess>(): RematchMappers<
  LoadingModel<TSuccess>,
  any,
  LoadingModel<TSuccess>,
  TAction
> => ({
  success: payload => LoadingModel.success<TSuccess>(payload),
  error: payload => LoadingModel.error<TSuccess>(payload),
  loading: (payload, state) => {
    const loadingModel = wrapLoading<TSuccess>(state);
    // if contains a special key in the payload, clear previous data.
    const clear = extractClearFromPayload(payload);
    return clear ? loadingModel.loading(null) : loadingModel.loading();
  },
  clear: () => LoadingModel.empty<TSuccess>(),
});

export class RematchState<
  TAction,
  TState,
  TPayload,
  TSuccess,
  TRequest = {},
  TError extends Error | undefined = Error,
  TKeyState = LoadingModel<TSuccess>
> {
  constructor(
    private key: keyof TState,
    private mappers: RematchMappers<TKeyState, TPayload, TKeyState, TAction>
  ) {}

  loadingEffect = async (
    effects: { [key: string]: (payload?: any, meta?: any) => Action },
    action: TRequest,
    caller: (action: TRequest) => Promise<TSuccess>,
    errorConverter: (e: any) => TPayload
  ) => {
    effects[`request${this.key}`](action);
    try {
      const response = await caller(action);
      effects[`set${this.key}Success`](response);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(e);
      }
      effects[`set${this.key}Error`](errorConverter(e));
    }
  };

  /**
   * Returns a reducer map to place into the rematch model.
   */
  reducers = (): ModelReducers<TState> => {
    const object: ModelReducers<TState> = {};
    // success reducer
    object[`set${this.key}Success`] = (state: TState, payload: TPayload) => {
      return {
        ...state,
        [this.key]: this.mappers.success(payload, state[this.key] as any),
      };
    };
    object[`set${this.key}Error`] = (state: TState, payload: TPayload) => {
      return {
        ...state,
        [this.key]: this.mappers.error(payload, state[this.key] as any),
      };
    };
    object[`clear${this.key}`] = (state: TState, payload?: TPayload) => ({
      ...state,
      [this.key]: this.mappers.clear(payload, state[this.key] as any),
    });
    object[`request${this.key}`] = (state: TState, payload?: TAction) => {
      return {
        ...state,
        [this.key]: this.mappers.loading(payload, state[this.key] as any),
      };
    };
    return object;
  };
}

export class LoadingRematchState<
  TAction,
  TState,
  TSuccess,
  TRequest = {},
  TError extends Error | undefined = Error
> extends RematchState<TAction, TState, any, TSuccess, TRequest, TError> {
  constructor(key: keyof TState) {
    super(key, defaultMappers());
  }
}

export interface LoadingRematchOptions<S> {
  selectors?: ModelSelectorsFactory<S>;
  effects?: (dispatch: RematchDispatch) => ModelEffects<any>;
  reducers?: ModelReducers<S>;
}

/**
 * Constructs a rematch model fully baked in for loading state, with selectors,
 * effects, and state handling.
 * @param caller - the async action to perform that returns data.
 * @param options - a set of options to supply extra data to the created model.
 */
export const loadingRematchModel = <
  TSuccess,
  TRequest = {},
  TError extends Error | undefined = Error
>(
  caller: (
    action: TRequest,
    rootState: any,
    dispatch: any
  ) => Promise<TSuccess>,
  options?: LoadingRematchOptions<LoadingRematchModelState<TSuccess>>
): ModelConfig<LoadingRematchModelState<TSuccess>> => {
  const initial_state: LoadingRematchModelState<TSuccess> = {
    model: LoadingModel.empty<TSuccess>(),
  };
  const rematchState = new LoadingRematchState<
    TRequest,
    LoadingRematchModelState<TSuccess>,
    TSuccess,
    TRequest,
    TError
  >("model");
  return createModel({
    state: initial_state,
    reducers: {
      ...rematchState.reducers(),
      ...options?.reducers,
    },
    selectors: (
      slice: Slicer<LoadingRematchModelState<TSuccess>>,
      createSelector: SelectorCreator,
      hasProps
    ) => {
      const selector: Selector<
        LoadingRematchModelState<TSuccess>,
        LoadingModel<TSuccess>,
        LoadingModel<TSuccess>
      > = createSelector<
        any,
        LoadingRematchModelState<TSuccess>,
        LoadingModel<TSuccess>
      >(slice, state => wrapLoading<TSuccess>(state.model));
      return {
        /**
         * Returns the LoadingModel<TSuccess>
         */
        model() {
          return selector;
        },
        /**
         * Returns the TSuccess
         */
        success() {
          return createSelector(selector, selectSuccess);
        },
        /**
         * Returns the TSuccess | undefined.
         */
        optionalSuccess() {
          return createSelector(selector, selectOptionalSuccess);
        },
        /**
         * Returns the TError | undefined.
         */
        error() {
          return createSelector(selector, selectOptionalError);
        },
        /**
         * Returns true if loading.
         */
        isLoading() {
          return createSelector(selector, selectIsLoading);
        },
        /**
         * Returns true if has loaded..
         */
        hasLoaded() {
          return createSelector(selector, selectHasLoaded);
        },
        /**
         * Returns true if loading state in empty/initial state (prior to loading data).
         */
        isEmpty() {
          return createSelector(selector, selectIsEmpty);
        },
        ...((options?.selectors &&
          options.selectors(slice, createSelector, hasProps)) ||
          {}),
      };
    },
    effects: (dispatch: any) => ({
      clear() {
        this.clearmodel();
      },
      async request(params: TRequest, rootState: any) {
        return rematchState.loadingEffect(
          this,
          params,
          a => caller(extractClearParam(a), rootState, dispatch),
          e => e
        );
      },
      async requestClear(params: TRequest, rootState: any) {
        return rematchState.loadingEffect(
          this,
          addClearParam(params, true),
          // @ts-ignore
          a => caller(extractClearParam(a), rootState, dispatch),
          e => e
        );
      },
      ...((options?.effects && options.effects(dispatch)) || {}),
    }),
  });
};

/**
 * A loading rematch model that captures the input parameters from the caller
 * param and can request to clear previous state if the value changes.
 */
export const capturedLoadingRematchModel = <
  TSuccess,
  TRequest = {},
  TError extends Error | undefined = Error
>(
  globalKey: string,
  caller: (
    action: TRequest,
    rootState: any,
    dispatch: any
  ) => Promise<TSuccess>,
  options?: LoadingRematchOptions<
    LoadingRematchModelState<CapturedState<TRequest, TSuccess>>
  > & {
    timeout?: number;
  }
) => {
  // Maps the original caller combined with action so that the consumer
  // does not need to manually do it.
  const mappedCaller = async (
    action: TRequest,
    rootState: any,
    dispatch: any
  ): Promise<CapturedState<TRequest, TSuccess>> => {
    const response = await caller(action, rootState, dispatch);
    return {
      response,
      params: action,
      calledAt: moment().valueOf(),
    };
  };

  const getExistingRequest = (rootState: any) =>
    wrapLoading<CapturedState<TRequest, TSuccess>>(rootState[globalKey].model);

  return loadingRematchModel<
    CapturedState<TRequest, TSuccess>,
    TRequest,
    TError
  >(mappedCaller, {
    ...options,
    selectors: (slice, createSelector, hasProps) => {
      const selector: Selector<
        LoadingRematchModelState<CapturedState<TRequest, TSuccess>>,
        LoadingModel<CapturedState<TRequest, TSuccess>>,
        LoadingModel<CapturedState<TRequest, TSuccess>>
      > = createSelector<
        any,
        LoadingRematchModelState<CapturedState<TRequest, TSuccess>>,
        LoadingModel<CapturedState<TRequest, TSuccess>>
      >(slice, state =>
        wrapLoading<CapturedState<TRequest, TSuccess>>(state.model)
      );
      return {
        /**
         * Returns unwrapped response from the data, ignoring params and assumed undefine-able.
         */
        optionalResponse() {
          return createSelector(
            selector,
            state => state.optionalSuccess?.response
          );
        },
        /**
         * Returns unwrapped response from the data, ignoring params and assumed
         * non-null and defined.
         */
        response() {
          return createSelector(selector, state => state.success.response);
        },
        /**
         * Returns the parameters of the previous action request.
         */
        params() {
          return createSelector(
            selector,
            state => state.optionalSuccess?.params
          );
        },
        /**
         * Returns the last time this action was called.
         */
        calledAt() {
          return createSelector(
            selector,
            state => state.optionalSuccess?.calledAt
          );
        },
        ...((options?.selectors &&
          options.selectors(slice, createSelector, hasProps)) ||
          {}),
      };
    },
    effects: dispatch => ({
      /**
       * This method will check previous state params to determine whether
       * the request should clear existing data when loading. This is useful
       * for single-viewing redux state.
       */
      requestClear(payload, rootState): boolean {
        const { optionalSuccess, isLoading } = getExistingRequest(rootState);
        const { isParamsEqual, mappedPayload } = injectClearParams(
          optionalSuccess?.params,
          payload
        );
        // only request if the params are not equal, or its not currently loading.
        if (!isParamsEqual || !isLoading) {
          this.request(mappedPayload);
        }
        return isParamsEqual;
      },
      /**
       * Checks previous {@link CapturedState#calledAt} param and determines
       * whether it should update or not based on {@link #options.timeout}
       * @param payload
       * @param rootState
       */
      requestTimed(payload, rootState): boolean {
        const { optionalSuccess, isLoading } = getExistingRequest(rootState);
        // if params are not equal, request new data.
        const { isParamsEqual, mappedPayload } = injectClearParams(
          optionalSuccess?.params,
          payload
        );
        if (!isLoading && shouldRequest(optionalSuccess, options?.timeout)) {
          this.request(payload);
          return true;
        }

        if (!isParamsEqual) {
          this.request(mappedPayload);
          return true;
        }
        return false;
      },
      ...((options?.effects && options.effects(dispatch)) || {}),
    }),
  });
};
