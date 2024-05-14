export const sign_In = (text) => async (dispatch) => {
  try {
    dispatch({
      type: "signIn",
      payload: text,
    });
  } catch (err) {
    return err;
  }
};
