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

export const SET_ID = "SET_ID";

export const setCaseId = (id) => ({
  type: SET_ID,
  payload: id,
});

export const CREDITOR_ID = "CREDITOR_ID";

export const setCaseCreditorId = (id) => ({
  type: CREDITOR_ID,
  payload: id,
});

export const SET_COUNTS = "SET_COUNTS";

export const setCounts = (smsCount, emailCount) => ({
  type: SET_COUNTS,
  payload: { smsCount, emailCount },
});
