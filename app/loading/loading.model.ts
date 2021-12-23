/* eslint-disable no-underscore-dangle,no-useless-constructor */
/**
 * Wraps around the typical data objects we write for success, error, loading, and empty state. This convenience
 * wrapper consolidates all of that logic into a handy wrapper.
 */
export class LoadingModel<T = {}> {
  static empty = <T>() => new LoadingModel<T>(false, false, false, undefined);

  static success = <T>(success?: T): LoadingModel<T> =>
    new LoadingModel(false, false, true, success);

  static error = <T>(error?: Error, optionalSuccess?: T): LoadingModel<T> =>
    new LoadingModel<T>(false, true, false, optionalSuccess, error);

  loading = (success: T | null = this.success) =>
    new LoadingModel(
      true,
      false,
      !!success && this.hasSuccess,
      !success ? undefined : success
    );

  public get success(): T {
    return this._success as T;
  }

  public get optionalSuccess(): T | undefined {
    return this._success;
  }

  constructor(
    public isLoading: boolean,
    private hasError: boolean,
    private hasSuccess: boolean,
    private _success?: T,
    public error?: Error
  ) {}

  isEmpty = () => !this.isSuccess() && !this.isError();

  hasLoaded = () => !this.isEmpty() && !this.isLoading;

  isSuccess = () => this.hasSuccess;

  isError = () => this.hasError;

  shouldLoad = () => !this.isSuccess() && !this.isLoading;

  public toString = () =>
    `Loading: ${this.isLoading}, Success: ${this.hasSuccess}:**${this._success}**, ` +
    `Error: ${this.hasError}:${this.error}`;
}

/**
 * Wraps an object that conforms to LoadingModel to restore object loss from
 * hydrating state during development.
 */
export const wrapLoading = <T extends any>(loading: any): LoadingModel<T> => {
  if (loading instanceof LoadingModel) {
    return loading;
  } else {
    if (!loading) {
      return LoadingModel.empty();
    } else {
      return new LoadingModel(
        loading.isLoading || false,
        loading.hasError || false,
        loading.hasSuccess || false,
        loading._success,
        loading.error
      );
    }
  }
};
