const initialState = {
  permissions: {},
};

const permissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "permissions":
      return {
        ...state,
        permissions: { ...state.permissions, ...action.payload },
      };
    default:
      return state;
  }
};

export default permissionReducer;
