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
export const permissions = (text) => async (dispatch) => {
  try {
    dispatch({
      type: "permissions",
      payload: text,
    });
  } catch (err) {
    return err;
  }
};

export const OPEN_DRAWER = "OPEN_DRAWER";
export const CLOSE_DRAWER = "CLOSE_DRAWER";

export const openDrawer = () => ({
  type: OPEN_DRAWER,
});

export const closeDrawer = () => ({
  type: CLOSE_DRAWER,
});
