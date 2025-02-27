import axios from "axios";
import { baseUrl } from "../constants/appConstants";
import { setHeaders } from "../common";
import { isEmpty } from "lodash";
// import { extractContractDataResponse } from "../testData/stepper_call_response";
import { PDFDocument } from "pdf-lib";

const BASE_URL = baseUrl();
const URL = process.env.REACT_APP_AI_URL;

// Utility function to convert JPG to PDF
const convertJpgToPdf = async (file) => {
  const imgBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const img = await pdfDoc.embedJpg(imgBytes);
  const { width, height } = img.scale(1);
  page.setSize(width, height);
  page.drawImage(img, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });
  const pdfBytes = await pdfDoc.save();
  const pdfFile = new File([pdfBytes], file.name.replace(/\.[^/.]+$/, ".pdf"), {
    type: "application/pdf",
  });
  return pdfFile;
};

export const ExtractContractData = async (files) => {
  try {
    const apiUrl = `${URL}/extract-fields-multiple-files?enable_cache=false`;
    const formData = new FormData();

    files.map(async (file) => {
      let processedFile = file.file;
      if (file.file.type === "image/jpeg") {
        processedFile = await convertJpgToPdf(file.file);
      }
      const originalFileName = processedFile.name;
      const cleanedFileName = originalFileName.replace("MCA Contracts/", "");
      const cleanedFile = new File([processedFile], cleanedFileName, {
        type: processedFile.type,
      });

      formData.append("MCA_pdf", cleanedFile);
    });

    const response = await axios.post(apiUrl, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    return response?.data?.extracted_fields;
  } catch (error) {
    console.error(`Error uploading`, error);
    return {};
  }

  // return results;
};

export const SignIn = async (payload) => {
  try {
    return await axios.post(BASE_URL + "/v1/user/signIn", payload);
  } catch (error) {
    return error;
  }
};

export const GetAllUsers = async (page, limit, search, filter, payload) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/user/getAllUsers?page=${page}&limit=${limit}&search=${search}&filter=${filter}`,
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
export const ForgotPassword = async (payload, token) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/user/forgotPasswordUpdate?token=${token}`,
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
    formData.append("files", data[i].file || data[i]);
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

export const GetCasePaymentById = async (page, id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/payment/getCasePayments/${id}?page=${page}&limit=10`,
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
  pages,
  limit,
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

export const EditSettings = async (payload) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/settings/editNotificationTemplate`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const DeleteSettings = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/settings/deleteNotificationTemplate`,
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

export const UpdateDebtor = async (id, payload, type) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/debtor/updateDebtor/${id}?contact=${type}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const UpdateBulkDebtor = async (id, payload) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/debtor/updateDebtorBulk/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const UpdateCreditor = async (id, payload, type) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/creditor/updateCreditor/${id}?contact=${type}`,
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
  limit,
  arrayName,
  search,
  filters,
  payload
) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/payment/getHomePayments?days=${count}&page=${page}&limit=${limit}&arrayName=${arrayName}&search=${search}&filters=${filters}`,
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
  pages,
  limit,
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

export const GetAllRoles = async (type) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/roles/getAllRoles?usersPage=${type}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const CreateRoles = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/roles/createRole",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const UpdateRole = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/roles/updateRole/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const DeleteRole = async (id) => {
  try {
    return await axios.delete(
      BASE_URL + `/v1/roles/deleteRole/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetRoleByName = async (name) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/roles/getRoleByName?role=${name}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetSettlementRangeWithScores = async (
  payload,
  id,
  status,
  all = "true"
) => {
  try {
    const allParam = all !== "true" ? all : isEmpty(payload);

    return await axios.post(
      BASE_URL +
        `/v1/case/getScoresSettlementRange/${id}?all=${allParam}&hardReload=${status}`,
      payload,
      setHeaders()
    );
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

export const GetSummary = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/case/getSummary/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetCreditorNames = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/case/getCreditorNames/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetScores = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/case/getScores/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const CreateDebtor = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/debtor/createDebtor",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const CreateCreditorCase = async (payload, debtorId) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/case/createCreditorsCases/${debtorId}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetAllTasks = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/task/getTasks?caseId=${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const CreateTasks = async (id, payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/task/addTask?caseId=${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const UpdateTasks = async (id, payload) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/task/updateTask/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const DeleteTasks = async (id) => {
  try {
    return await axios.delete(
      BASE_URL + `/v1/task/deleteTask/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const AddDocumentToDebtor = async (id, payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/debtor/addDocumentsToDebtor/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const AddNotesCase = async (id, payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/case/addNotes/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const getCaseSummaries = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/case/getCaseSummaries/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetLumpSumAmount = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/debtor/getLumpSumAmount/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetCustomVariable = async () => {
  try {
    return await axios.get(
      BASE_URL + `/v1/settings/getSystemTemplate`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetEvents = async (type) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/settings/getNotificationConfiguration?type=${type}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const UpdateNotificationConfiguration = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/settings/addNotificationConfiguration`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetFullProfit = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/debtor/getFullProfitSettlement/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const UpdateCaseCreditor = async (id, payload) => {
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

export const UpdateCommission = async (payload, id, status) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/case/getScoresSettlementByCommPercentage/${id}?all=${status}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetWeeklyAndTotalCommission = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/case/getWeeklyAndTotalCommission/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const SendSettlementEmail = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/case/sendSettlementEmail/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetLogs = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/case/caseHistory/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const ResendInvite = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/user/resendInvitationLink`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const SendEmailSmsCase = async (id, type, payload, threadId) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/email/sendSmsEmailDebtorCreditor/${id}?type=${type}&threadId=${threadId}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetCaseSummariesById = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/case/getCaseSummaries/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const SelectJustificationModal = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/case/saveJustification",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetPaymentIntervals = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/case/calculateIntervalsAmount/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetSettlementJustifications = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/case/getSettlementJustifications/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetFullProfitSettlement = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/debtor/getFullProfitJustifications/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetLumpSumJustifications = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/debtor/getLumpSumJustifications/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const ForgotPasswordRes = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/user/forgotPassword",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetAllCustomFields = async () => {
  try {
    return await axios.get(
      BASE_URL + `/v1/settings/getCustomFields`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetPipelineDataByCustomFields = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/pipeline/getCasesByCustomFieldAndValue/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const ExtractedCaseFields = async (id, payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/debtor/getExtractedFields/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const UpdateMultipleCreditors = async (id, payload, caseId) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/creditor/updateMultipleCreditors/${id}?bulk=${caseId}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const createMultipleDebtors = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/debtor/createMultipleDebtors`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetBulkRecords = async (arrayName, page, limit) => {
  try {
    return await axios.get(
      BASE_URL +
        `/v1/bulk/bulkUploadAnalytics?array=${arrayName}&page=${page}&limit=${limit}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const GetBulkCaseDetail = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/bulk/getBulkCasesDetails/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const AddCreditorAccount = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/payment/addACHDetailsCreditor/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const AddDebtorAccount = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/debtor/addDebtorAccount/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const SendPayment = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/payment/sendPaymentPaynote/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const AddSenderIdentity = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/user/addSenderIdentity/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const VerifySenderIdentity = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/user/verifySenderIdentity",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetAllLinks = async () => {
  try {
    return await axios.get(BASE_URL + "/v1/email/getAllLinks", setHeaders());
  } catch (error) {
    return error;
  }
};
export const DeleteLink = async (id) => {
  try {
    return await axios.delete(
      BASE_URL + `/v1/email/deleteLink/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetAllSenders = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/user/getVerifySenders/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const VerfiyEmailIdentity = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/user/addUserSender",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const PausePayments = async (id, pause, payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/creditor/pausePayments/${id}?pause=${pause}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const DebtorPaymentPlan = async (id, payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/debtor/addPaymentPlan/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const CancelPaymentPlan = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/payment/cancelCasePaymentPlan/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const CancelDebtorPaymentPlan = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/payment/cancelDebtorPaymentPlan/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetAllTransactions = async (page) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/payment/getCommissionPayments?page=${page}&limit=10`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetAllInbox = async (search, filter, medium, payload, All) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/inbox/getAllMessages?search=${search}&filter=${filter}&type=default&medium=${medium}&all=${All}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetAllNotifications = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/notification/getAllNotifications`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const MarkAsReadNotifications = async (id, payload) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/notification/markAsRead/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetNotificationsCount = async () => {
  try {
    return await axios.get(BASE_URL + `/v1/notification/count`, setHeaders());
  } catch (error) {
    return error;
  }
};
export const GetStatementSummary = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/debtor/getStatementsSummary/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetDailyCashFlow = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/debtor/getDailyCashFlows/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const UpdateContractDetails = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/case/updateContractDetails/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetCalls = async (id, page) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/call/getCalls/${id}?page=${page}&limit=10`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const DialCall = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/case/createCall/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetAllCasesTasks = async (id) => {
  try {
    return await axios.get(BASE_URL + `/v1/task/getAllTasks`, setHeaders());
  } catch (error) {
    return error;
  }
};
export const AddManualPayment = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/debtor/addManualPayment`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const deleteCreditor = async (id) => {
  try {
    return await axios.delete(
      BASE_URL + `/v1/case/deleteCreditor/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const handleDeleteFile = async (itemKey, caseDataId, type) => {
  try {
    return await axios.delete(
      `${BASE_URL}/v1/case/deleteFile/${caseDataId}?documentField=${type}`,
      {
        ...setHeaders(),
        data: { key: itemKey },
      }
    );
  } catch (error) {
    return error;
  }
};
export const GetAllUpcomingPayments = async (page, id) => {
  try {
    return await axios.get(
      BASE_URL +
        `/v1/payment/getAllUpcomingPayments/${id}?page=${page}&limit=10`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetCallToken = async () => {
  try {
    return await axios.get(BASE_URL + `/v1/call/twilio/token`, setHeaders());
  } catch (error) {
    return error;
  }
};
export const GetCreditorSyncEmail = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/creditor/getCreditorSyncEmail/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const SyncPaynoteCreditor = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/creditor/syncPaynoteCreditor/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetClientSyncEmail = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/debtor/getClientSyncEmail/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const SyncEasyPayEmail = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/debtor/clientSync/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const CreatePaymentPlan = async (payload, id) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/case/updateCasePlan/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};

export const UpdateWeeklyBudgetSettlement = async (payload, id) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/debtor/updateWeeklyBudget/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetMcaByMonth = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/creditor/mcaByMonth/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetManualPayments = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/debtor/getManualPayments/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const UpdateManualPayments = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/debtor/revertPayments/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetRelatedPayments = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/payment/getRelatedPayments/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const AddCheckPayment = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + "/v1/seemlesschex/createCheck",
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const CallSummary = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/call/callSummary`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetCheckDetails = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/seemlesschex/getClientChecks/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const DeleteCheckDetails = async (checkId, id) => {
  try {
    return await axios.delete(BASE_URL + `/v1/seemlesschex/voidCheck/${id}`, {
      ...setHeaders(),
      data: { checkId: checkId },
    });
  } catch (error) {
    return error;
  }
};
export const UpdateCheckIds = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/seemlesschex/updateCheck/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetAllUserCases = async () => {
  try {
    return await axios.get(BASE_URL + `/v1/case/getAllUserCases`, setHeaders());
  } catch (error) {
    return error;
  }
};
export const UpdateCallByCase = async (payload, callId) => {
  try {
    return await axios.patch(
      BASE_URL + `/v1/call/updateCall/${callId}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetCallSid = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/call/twilio/getIncomingCall/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const SaveAsDraft = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/inbox/createEmailDraft`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetCallerName = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/call/twilio/callerName`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetUsers = async () => {
  try {
    return await axios.get(BASE_URL + `/v1/user/getUsers`, setHeaders());
  } catch (error) {
    return error;
  }
};
export const DeleteDraft = async (id) => {
  try {
    return await axios.delete(
      BASE_URL + `/v1/inbox/deleteDraftEmail/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const UpdateDraft = async (id, payload) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/inbox/updateDraftEmail/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetNotificationTemplates = async () => {
  try {
    return await axios.get(
      BASE_URL + `/v1/settings/getTemplates`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const SaveWeeklyBudget = async (payload, id) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/debtor/saveWeeklyBudgetValues/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetAggregatedSummary = async (id) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/debtor/getStatementsSummaryWithPf/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetMissedCalls = async () => {
  try {
    return await axios.get(
      BASE_URL + `/v1/call/twilio/getNumberMissedCalls`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const UpdateSmsDraft = async (id, payload) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/inbox/updateDraft/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const CreateSmsDraft = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/inbox/createDraft`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const saveCaseDetailNotification = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/sms/saveCaseDetailNotification`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const DeleteSmsDraft = async (id) => {
  try {
    return await axios.delete(
      BASE_URL + `/v1/inbox/deleteDraft/${id}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetCreditorsFromDebtorId = async (debtorId) => {
  try {
    return await axios.get(
      BASE_URL + `/v1/case/getAllUserCases?debtorId=${debtorId}`,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const InboxStatus = async (id, payload) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/inbox/inboxStatus/${id}`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const TaskStatus = async (id, payload) => {
  try {
    return await axios.put(
      BASE_URL + `/v1/inbox/inboxStatus/${id}?task=true`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
export const GetAllCc = async () => {
  try {
    return await axios.get(BASE_URL + "/v1/user/usersByRole", setHeaders());
  } catch (error) {
    return error;
  }
};
export const GetServiceFee = async () => {
  try {
    return await axios.get(BASE_URL + "/v1/settings/serviceFee", setHeaders());
  } catch (error) {
    return error;
  }
};
export const SaveServiceFee = async (payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/settings/serviceFee`,
      payload,
      setHeaders()
    );
  } catch (error) {
    return error;
  }
};
