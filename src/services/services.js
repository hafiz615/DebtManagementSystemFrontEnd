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

export const CreateCase = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/case/createCase",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
