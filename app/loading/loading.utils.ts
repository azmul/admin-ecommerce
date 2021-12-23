import { CapturedState, LoadingInjectedRequest } from "./loading.types";
import isEqual from "lodash/isEqual";
import moment from "moment";
import { UtilHelper } from "../utils/utilHelper";

export const LOADING_META_KEY = "_loading_data";

export const DEFAULT_TIMEOUT_MILLIS = 5 * 1000 * 60;

/**
 * Checks if object a map, otherwise returns a new map from the object provided.
 * This is useful when the Rematch persist plugin does not properly return
 * state types out of persistence.
 * @param map
 */
export const wrapMap = <TKey, TValue>(
  map: Map<TKey, TValue>
): Map<TKey, TValue> => {
  // It may be a plain JS object from persistence.
  if (map instanceof Map) {
    return map;
  }
  return new Map<TKey, TValue>(Object.entries(map) as any);
};

export const extractClearFromPayload = (payload: any) =>
  payload?.[LOADING_META_KEY]?.clear;

export const addClearParam = <TRequest>(
  payload: TRequest,
  shouldAdd: boolean
): LoadingInjectedRequest<TRequest> => {
  const isPrimitive = typeof payload !== "object";
  return {
    ...payload,
    [LOADING_META_KEY]: shouldAdd
      ? {
          clear: true,
          isPrimitive,
        }
      : undefined,
  };
};

/**
 * Removes the {@link LOADING_META_KEY} from the payload so it doesn't pollute the callers.
 * @param payload
 */
export const extractClearParam = <TRequest>(
  payload: LoadingInjectedRequest<TRequest> | undefined
) => {
  let newPayLoad: any;
  if (payload?._loading_data?.isPrimitive) {
    // directly extract out the clear param.
    newPayLoad = (payload as any)[0];
  } else if (typeof payload !== "object") {
    // payload is not an object, but a primitive.
    newPayLoad = payload;
  } else {
    newPayLoad = { ...payload };
    // remove the payload from object
    delete newPayLoad._loading_data;
  }
  return newPayLoad as TRequest;
};

export const injectClearParams = <TRequest>(
  existing: LoadingInjectedRequest<TRequest> | undefined,
  payload: TRequest
) => {
  UtilHelper.removeUndefined(payload);
  // when comparing existing to new params check if data is same or different.
  const existingParams = extractClearParam(existing);
  const isParamsEqual = isEqual(existingParams, payload);
  // inject clear state
  const mappedPayload = addClearParam(payload, !isParamsEqual);
  return {
    isParamsEqual,
    mappedPayload,
  };
};

/**
 * Returns true if caller should re-request information when previous {@link CapturedState}
 * was called further than the specified timeout.
 */
export const shouldRequest = (
  existing: CapturedState<any, any> | undefined,
  timeout = DEFAULT_TIMEOUT_MILLIS
) =>
  !existing?.calledAt ||
  Math.abs(moment(existing.calledAt).diff(moment(), "milliseconds")) > timeout;
