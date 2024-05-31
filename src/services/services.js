import axios from "axios";
import { baseUrl } from "../constants/appConstants";
import { setHeaders } from "../common";

const BASE_URL = baseUrl();

export const SignIn = async (payload) => {
  try {
    return await axios.post(BASE_URL + "/v1/user/signIn", payload);
  } catch (error) {
    return error;
  }
};

export const GetAllUsers = async () => {
  try {
    return await axios.get(BASE_URL + "/v1/user/getAllUsers", setHeaders());
  } catch (error) {
    return error;
  }
};

export const CreateUser = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/user/createUser",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetUserById = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/user/getUserById/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const UpdateUser = async (payload) => {
  try {
    return await axios.put(
      BASE_URL + "/v1/user/updateUser",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const DeleteUserById = async (id) => {
  try {
    return await axios.delete(
      BASE_URL + `/v1/user/deleteUserById/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const DeleteCustomField = async (id) => {
  try {
    return await axios.delete(
      BASE_URL + `/v1/settings/deleteCustomField/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};


export const VerifyLink = async (token) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/user/verifyInvitationLink?token=${token}`,
      ""
    );
  } catch (error) {
    return error;
  }
};

export const UpdateUserPassword = async (payload, token) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/user/updatePassword?token=${token}`,
      payload
    );
  } catch (error) {
    return error;
  }
};

export const ResetUserPassword = async (payload) => {
  try {
    return await axios.put(BASE_URL + `/v1/user/resetPassword`, payload, setHeaders());
  } catch (error) {
    return error;
  }
};

export const CreateCase = async (payload, bulk = false) => {
  try {
    const queryParams = `?bulk=${bulk}`;
    const url = BASE_URL + "/v1/case/createCase" + queryParams;

    return await axios.post(url, payload, setHeaders());
  } catch (error) {
    return error;
  }
};

export const UploadFiles = async (data) => {
  const formData = new FormData();
  for (let i = 0; i < data.length; i++) {
    formData.append("files", data[i]);
  }
  try {
    return await axios.post(
      BASE_URL + "/v1/upload/files",
      formData,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetDebtorSearch = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/debtor/getDebtor",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetCreditorSearch = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/creditor/getCreditor",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetCaseById = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/case/getCaseById/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetCasePaymentById = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/payment/getCasePayments/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetAllClients = async () => {
  try {
    return await axios.get(
      BASE_URL + "/v1/debtor/listing/search",
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetClientById = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/debtor/listing/details/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetAllSettings = async () => {
  try {
    return await axios.get(BASE_URL + "/v1/settings/getSettings", setHeaders());
  } catch (error) {
    return error;
  }
};

export const SaveSettings = async (payload) => {
  try {
    return await axios.patch(BASE_URL + "/v1/settings/addSettings", payload, setHeaders());
  } catch (error) {
    return error;
  }
};

export const EditCustomField = async (payload) => {
  try {
    const modifiedPayload = {
      "name": payload.name,
      "type": payload.type,
      "target": payload.target,
      "description": payload.description,
      "shared": payload.shared
    }
    return await axios.put(BASE_URL + `/v1/settings/editCustomField/${payload._id}`, modifiedPayload, setHeaders());
  } catch (error) {
    return error;
  }
};

export const CreateCustomField = async (payload) => {
  try {
    return await axios.post(BASE_URL + `/v1/settings/addCustomField`, payload, setHeaders());
  } catch (error) {
    return error;
  }
};


