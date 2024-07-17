import { CREDITOR_ID } from "../action/action";

const initialState = {
  id: null,
};

const caseCreditorIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREDITOR_ID:
      return {
        ...state,
        id: action.payload,
      };
    default:
      return state;
  }
};

export default caseCreditorIdReducer;
