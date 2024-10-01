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
    const apiUrl = `${URL}/extract-fields-multiple-files?enable_cache=true`;
    const formData = new FormData();

    files.map(async (file) => {
      let processedFile = file.file;
      // Check if the file is a JPG and convert to PDF if true
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

// export const ExtractContractData = async (files) => {
//   // return extractContractDataResponse;
//   const processFile = async (file) => {
//     try {
//       // Example API endpoint
//       const apiUrl = "https://dms-negotiation.hpdemos.co/extract-fields";

//       // Create form data
//       const formData = new FormData();
//       const originalFileName = file.file.name;
//       const cleanedFileName = originalFileName.replace("MCA Contracts/", "");
//       const cleanedFile = new File([file.file], cleanedFileName, { type: file.file.type });
//       console.log("cleanedFile", cleanedFile);
//       formData.append("MCA_pdf", cleanedFile);
//       // formData.append("MCA_pdf", file.file); // Ensure file.file is a File object

//       // Call API
//       const response = await axios.post(apiUrl, formData, {
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'multipart/form-data', // This is often auto-set by axios
//         }
//       });

//       // Return the result of the API call
//       return response.data;
//     } catch (error) {
//       console.error(`Error uploading ${file.name}:`, error);
//       // Return an empty object in case of failure
//       return {};
//     }
//   };

//   const results = await Promise.all(files.map((file) => {
//     if (!isEmpty(file)){
//       return processFile(file)
//     }
//     return file
//   }));
//   return results; // Return the array of results
// };

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

export const GetSettlementRangeWithScores = async (payload, id, status) => {
  try {
    return await axios.post(
      BASE_URL +
        `/v1/case/getScoresSettlementRange/${id}?all=${isEmpty(
          payload
        )}&hardReload=${status}`,
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

export const SendEmailSmsCase = async (id, type, payload) => {
  try {
    return await axios.post(
      BASE_URL + `/v1/email/sendSmsEmailDebtorCreditor/${id}?type=${type}`,
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
