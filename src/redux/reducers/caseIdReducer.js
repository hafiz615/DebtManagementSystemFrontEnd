import { SET_ID } from "../action/action";

const initialState = {
  id: null,
};

const caseIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ID:
      return {
        ...state,
        id: action.payload,
      };
    default:
      return state;
  }
};

export default caseIdReducer;
