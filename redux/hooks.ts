import { Store } from "./store";
import { useStore as useReduxStore } from "react-redux";

export const useStore = (): Store => useReduxStore() as Store;
