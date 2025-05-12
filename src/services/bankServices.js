// services/bankService.js

import axios from "axios";

const BASE_URL = "https://sandbox.seamlesschex.com";
const SECRET_KEY = "sk_test_01en8e264mt148md2f8xkx6afs";

const setSecureHeaders = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: SECRET_KEY,
  },
});

export const GetBankInfo = async (routingNumber) => {
  try {
    return await axios.get(
      `${BASE_URL}/v1/check/bankinfo?bank_routing=${routingNumber}`,
      setSecureHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const TokenizeAccount = async (payload) => {
  try {
    return await axios.post(
      `${BASE_URL}/v1/account/tokenization`,
      payload,
      setSecureHeaders()
    );
  } catch (error) {
    return error;
  }
};
