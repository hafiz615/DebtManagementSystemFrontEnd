const initialState = {
  payments: [],
};

const paymentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "payments":
      return {
        ...state,
        payments: [action.payload],
      };
    default:
      return state;
  }
};
export default paymentsReducer;
