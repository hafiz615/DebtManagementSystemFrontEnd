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

export const GetAllUsers = async (page, search, filter, payload) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/user/getAllUsers?page=${page}&limit=5&search=${search}&filter=${filter}`,
      payload,
      setHeaders()
    );
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
    return await axios.put(
      BASE_URL + `/v1/user/resetPassword`,
      payload,
      setHeaders()
    );
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

export const UploadFilesAi = async (data) => {
  const formData = new FormData();
  formData.append("MCA_pdf", data[0]);
  console.log(localStorage.getItem("aiToken"), "token");

  try {
    const token1 = await axios.get(
      "https://dms-ai.hpdemos.co/get-auth-token?username=test&partner_token=test"
    );
    const response = await axios.post(
      "https://dms-ai.hpdemos.co/extract-fields",
      formData,
      {
        headers: {
          accept: "application/json",
          token: token1?.auth_token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error uploading PDF:", error);
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

export const GetAllClients = async ({
  search,
  filter,
  page,
  limit,
  payload,
}) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/debtor/listing/search?search=${search}&filter=${filter}&page=${page}&limit=${limit}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetClientById = async (
  id,
  search,
  filter,
  limit,
  pages,
  payload
) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/debtor/listing/details/${id}?search=${search}&filter=${filter}&page=${pages}&limit=${limit}`,
      payload,
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
    return await axios.post(
      BASE_URL + "/v1/settings/addSettings",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const EditSettings = async (payload, type) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/settings/editNotificationTemplate?type=${type} `,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const DeleteSettings = async (payload, type) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/settings/deleteNotificationTemplate?type=${type} `,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const EditCustomField = async (payload) => {
  try {
    const modifiedPayload = {
      name: payload.name,
      type: payload.type,
      target: payload.target,
      description: payload.description,
      shared: payload.shared,
    };
    return await axios.put(
      BASE_URL + `/v1/settings/editCustomField/${payload._id}`,
      modifiedPayload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const CreateCustomField = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/settings/addCustomField`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const UpdateDebtor = async (id, payload) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/debtor/updateDebtor/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const UpdateCreditor = async (id, payload) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/creditor/updateCreditor/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetHomePayments = async (
  count,
  page,
  arrayName,
  search,
  filters,
  payload
) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/payment/getHomePayments?days=${count}&page=${page}&limit=5&arrayName=${arrayName}&search=${search}&filters=${filters}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const AddCustomFieldsByTarget = async (target, payload, id) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/settings/addCustomFieldByTarget?target=${target}&caseId=${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const EditCustomFieldsByTarget = async (target, payload, id) => {
  try {
    return await axios.put(
      BASE_URL +
        `/v1/settings/updateCustomFieldByTarget?target=${target}&caseId=${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetCustomFieldsByTarget = async (target) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/settings/getCustomFieldsByTarget?target=${target}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetAllCreditors = async ({
  search,
  filter,
  page,
  limit,
  payload,
}) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/creditor/listing?search=${search}&filter=${filter}&page=${page}&limit=${limit}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetCreditorById = async (
  id,
  search,
  filter,
  limit,
  pages,
  payload
) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/creditor/listing/details/${id}?search=${search}&filter=${filter}&page=${pages}&limit=${limit}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const UpdateCaseAbout = async (payload, id) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/case/updateCaseAbout/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetDashboard = async (filter, payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/user/dashboard?filter=${filter}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const Logout = async () => {
  try {
    return await axios.post(BASE_URL + "/v1/user/logout", {}, setHeaders());
  } catch (error) {
    return error;
  }
};

export const RetryAuth = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/debtor/retryAuth/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const RetryCapture = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/debtor/retryCapture/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetAllStatuses = async () => {
  try {
    return await axios.get(
      BASE_URL + "/v1/status/getCaseStatuses",
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const AddStatus = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/status/addStatus",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const UpdateStatus = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/status/updateStatus/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const DeleteAndReplaceStatus = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/status/deleteStatus/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const ReArrangedStatuses = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/status/updateStatusArray/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetAllPipelines = async () => {
  try {
    return await axios.get(
      BASE_URL + "/v1/pipeline/getAllPipelines",
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const CreatePipeline = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/pipeline/createPipeline",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const EditStatusPipeline = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/pipeline/updatePipeline/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const DeletePipeLine = async (id) => {
  try {
    return await axios.delete(
      BASE_URL + `/v1/pipeline/deletePipeline/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const AddStatusPipeline = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/pipeline/addStatusPipeline/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetPipelinesByID = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/pipeline/getPipelineById/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const UpdateStatusPipeline = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/pipeline/updateStatusPipeline/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const DeleteStatusesPipeline = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/pipeline/deleteStatusPipeline/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetPipelinesDetails = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/pipeline/getPipelineDetails/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const DeleteCase = async (id) => {
  try {
    return await axios.delete(
      BASE_URL + `/v1/case/deleteCase/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const UpdateCase = async (payload, id) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/case/updateCase/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetAllDebtors = async () => {
  try {
    return await axios.get(BASE_URL + `/v1/debtor/getAllDebtors`, setHeaders());
  } catch (error) {
    return error;
  }
};

export const GetSettlementRange = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/case/getSettlementRange/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetAiToken = async () => {
  try {
    return await axios.get(BASE_URL + `/v1/case/getAiToken`, setHeaders());
  } catch (error) {
    return error;
  }
};
