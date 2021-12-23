import { LoadingModel, wrapLoading } from "./loading.model";

export const selectSuccess = <T>(state: LoadingModel<T>) =>
  wrapLoading<T>(state).success;
export const selectOptionalSuccess = <T>(state: LoadingModel<T>) =>
  wrapLoading<T>(state).optionalSuccess;
export const selectIsLoading = <T>(state: LoadingModel<T>) =>
  wrapLoading<T>(state).isLoading;
export const selectIsSuccess = <T>(state: LoadingModel<T>) =>
  wrapLoading<T>(state).isSuccess();
export const selectOptionalError = (state: LoadingModel<any>) =>
  wrapLoading<any>(state).error;
export const selectIsError = <T>(state: LoadingModel<T>) =>
  wrapLoading<T>(state).isError();
export const selectHasLoaded = <T>(state: LoadingModel<T>) =>
  wrapLoading<T>(state).hasLoaded();
export const selectIsEmpty = <T>(state: LoadingModel<T>) =>
  wrapLoading<T>(state).isEmpty();
