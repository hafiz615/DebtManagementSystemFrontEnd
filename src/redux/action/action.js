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
export const get_payments = (text) => async (dispatch) => {
  try {
    dispatch({
      type: "payments",
      payload: text,
    });
  } catch (err) {
    return err;
  }
};
