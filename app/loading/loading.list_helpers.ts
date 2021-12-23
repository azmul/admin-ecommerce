import { LoadingModel } from "./loading.model";
import { CapturedState } from "./loading.types";
import { ApiResponse } from "../api/models";
import { sortBy } from "lodash";

const filterItemByKey = <T, P>(
  response: T[] | undefined,
  idKey: keyof T,
  payload: CapturedState<P, T>,
  payloadKey: keyof P,
  sortKey?: keyof T
) => {
  let items =
    response?.map(c => {
      // @ts-ignore
      if (c[idKey] === payload.params[payloadKey]) {
        return payload.response;
      }
      return c;
    }) || [];
  // if created, append to end.
  if (!payload.params[payloadKey]) {
    items.push(payload.response);
  }
  if (sortKey) {
    items = sortBy(items, sortKey);
  }
  return items;
};

/**
 * Updates or adds a an object to the {@link LoadingModel} that is a list of {@link T}
 * and {@link CapturedState}.
 * @param model - the loading model from state.
 * @param idKey - the key used to check ID.
 * @param payload - the payload used to check against
 * @param payloadKey - the payloadId key to check against.
 * @param sortKey - sorts the returned list by a key if specified.
 */
export const updateCapturedLoadingModel = <T, P>(
  model: LoadingModel<CapturedState<any, T[]>>,
  idKey: keyof T,
  payload: CapturedState<P, T>,
  payloadKey: keyof P,
  sortKey?: keyof T
) => {
  const captured = model.optionalSuccess;
  const response = captured?.response;
  const items = filterItemByKey(response, idKey, payload, payloadKey, sortKey);
  return LoadingModel.success({
    calledAt: captured?.calledAt || 0,
    params: captured?.params || {},
    response: items,
  });
};

/**
 * Updates or adds a an object to the {@link LoadingModel} that is a list of {@link T}
 * and {@link CapturedState}.
 * @param model - the loading model from state.
 * @param idKey - the key used to check ID.
 * @param payload - the payload used to check against
 * @param payloadKey - the payloadId key to check against.
 * @param sortKey - sorts the returned list by a key if specified.
 */
export const updateCapturedApiLoadingModel = <T, P>(
  model: LoadingModel<CapturedState<any, ApiResponse<T[]>>>,
  idKey: keyof T,
  payload: CapturedState<P, T>,
  payloadKey: keyof P,
  sortKey?: keyof T
) => {
  const captured = model.optionalSuccess;
  const response = captured?.response?.data;
  const items = filterItemByKey(response, idKey, payload, payloadKey, sortKey);
  return LoadingModel.success<CapturedState<any, ApiResponse<T[]>>>({
    calledAt: captured?.calledAt || 0,
    params: captured?.params || {},
    response: {
      meta: captured?.response?.meta,
      data: items,
    },
  });
};

/**
 * Finds the specified item of the payload from the model and filters it out.
 */
export const removeCapturedListItem = <T, P>(
  model: LoadingModel<CapturedState<any, T[]>>,
  idKey: keyof T,
  payload: T[typeof idKey]
) => {
  const captured = model.optionalSuccess;
  const items = captured?.response?.filter(c => c[idKey] !== payload) || [];
  return LoadingModel.success({
    calledAt: captured?.calledAt || 0,
    params: captured?.params || {},
    response: items,
  });
};

/**
 * Finds the specified item of the payload from the model and filters it out.
 */
export const removeCapturedApiListItem = <T, P>(
  model: LoadingModel<CapturedState<any, ApiResponse<T[]>>>,
  idKey: keyof T,
  payload: T[typeof idKey]
) => {
  const captured = model.optionalSuccess;
  const items =
    captured?.response?.data?.filter(c => c[idKey] !== payload) || [];
  return LoadingModel.success<CapturedState<any, ApiResponse<T[]>>>({
    calledAt: captured?.calledAt || 0,
    params: captured?.params || {},
    response: {
      meta: captured?.response?.meta,
      data: items,
    },
  });
};
