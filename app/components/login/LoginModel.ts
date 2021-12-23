import { createModel } from "@rematch/core";

const INITIAL_STATE = {
  profile: null,
  token: null,
  role: 0,
};

const authModel = createModel({
  state: INITIAL_STATE,
  reducers: {
    /**
     * Set profile state
     */
    setProfile: (state: Object, payload: any) => {
      return {
        ...state,
        profile: payload,
      };
    },
    /**
     * Set token
     */
    setToken: (state: Object, payload: any) => {
      return {
        ...state,
        token: payload,
      };
    },
   
    clear() {
      return INITIAL_STATE;
    },
  },
});

export default authModel;
