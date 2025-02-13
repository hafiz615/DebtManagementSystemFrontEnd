import { SET_COUNTS } from "../action/action";

const initialState = {
  smsCount: 0,
  emailCount: 0,
};

const countsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COUNTS:
      return {
        ...state,
        smsCount: action.payload.smsCount,
        emailCount: action.payload.emailCount,
      };
    default:
      return state;
  }
};

export default countsReducer;
