import { SET_DIAL_STATE } from "../action/action";

const initialState = {
  phoneNumber: "",
  caseId: "",
  fetchCalls: false,
  isModalOpen: false,
};

const dialStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DIAL_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default dialStateReducer;
