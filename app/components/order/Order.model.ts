import { createModel } from "@rematch/core";

const INITIAL_STATE = {
  medicineList: null
};

const orderModel = createModel({
  state: INITIAL_STATE,
  reducers: {
    /**
     * Set medicine state
     */
    setMedicineList: (state: Object, payload: any) => {
      return {
        ...state,
        medicineList: payload,
      };
    },

    clear() {
      return INITIAL_STATE;
    },
  },
});

export default orderModel;
