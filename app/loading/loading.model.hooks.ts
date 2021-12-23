/**
 * A hook that runs on first successful load from a loading model.
 */
import { DependencyList, useEffect, useState } from "react";
import { LoadingModel, wrapLoading } from "./loading.model";

const useLoadingModelEffect = <T = {}>(
  model: LoadingModel<T>,
  /**
   * Return the condition to flip the state and trigger a callback
   */
  modelTester: (value: LoadingModel<T>) => boolean,
  callback: (value: LoadingModel<T>) => void,
  deps?: DependencyList
) => {
  const [triggered, setTriggered] = useState(false);
  const defaultDeps = deps || [];
  return useEffect(() => {
    const compare = modelTester(wrapLoading(model));
    if (!triggered && compare) {
      callback(model);
      setTriggered(true);
    } else if (!compare) {
      setTriggered(false);
    }
  }, [model, triggered, defaultDeps, callback, modelTester]);
};

/**
 * Will execute a callback only on a {@link LoadingModel.success}.
 * Useful for providing initial state when loading from API.
 */
export const useRenderSuccessfulLoad = <T = {}>(
  model: LoadingModel<T>,
  callback: (value: any) => void,
  deps?: DependencyList
) =>
  useLoadingModelEffect(
    wrapLoading(model),
    value => value.isSuccess() && !value.isLoading,
    value => callback(value.success),
    deps
  );

/**
 * Will execute a callback only on a change to {@link LoadingModel.error}.
 * Useful for providing error state setting.
 */
export const useRenderErrorLoad = (
  model: LoadingModel<any>,
  callback: (error: Error | undefined) => void,
  deps?: DependencyList
) =>
  useLoadingModelEffect(
    wrapLoading(model),
    value => value.isError() && !value.isLoading,
    value => callback(value.error),
    deps
  );
