import {
  init,
  RematchDispatch,
  RematchRootState,
  RematchStore,
} from "@rematch/core";
import createLoadingPlugin from "@rematch/loading";
import createRematchPersist from "@rematch/persist";
import * as models from "./models";
import selectPlugin from "@rematch/select";

const loading = createLoadingPlugin();

const persistPlugin = createRematchPersist({
  whitelist: [
    "authModel",
  ],
  version: 3,
});

const store: RematchStore<Models> = init({
  models,
  plugins: [loading, persistPlugin, selectPlugin()],
});

export type Store = typeof store;
export type Models = typeof models;
export type RootState = RematchRootState<Models>;
// @ts-ignore
export type RootDispatch = RematchDispatch<Models>;

export default store;
