import { baseUrl, NETWORK_ERROR } from "./constants/appConstants";
import { jsPDF } from "jspdf";
import { parse, format, isValid } from "date-fns";

const BASE_URL = baseUrl();
function buildApiEndpoint(path) {
  const url = new URL(path, BASE_URL);
  return url.href;
}
export const request = async (
  path,
  method = "GET",
  body = {},
  contentType = "application/json"
) => {
  const fetchOption = {
    method,

    headers: new Headers({
      Accept: "application/json",
      "Content-Type": contentType,
    }),
    ...(method !== "GET" ? { body: JSON.stringify(body) } : {}),
  };
  try {
    const res = await fetch(buildApiEndpoint(path), fetchOption);

    if (res.status === 200) {
      const jsonResponse = await res.json();
      return jsonResponse;
    } else {
      return res;
    }
  } catch (err) {
    alert(NETWORK_ERROR);
    throw new Error(err);
  }
};
export const setHeaders = () => {
  const headerConfig = {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  };
  return headerConfig;
};

export const fillMissingPermissions = (permissionsArray) => {
  const updatedPermissionsArray = permissionsArray?.map((permissionObj) => {
    const permissions = { ...permissionObj.permissions };
    if (permissions?.admin === undefined) permissions.admin = false;
    if (permissions?.read === undefined) permissions.read = false;
    if (permissions?.write === undefined) permissions.write = false;
    if (permissions?.custom === undefined) permissions.custom = false;
    return { ...permissionObj, permissions };
  });

  return updatedPermissionsArray;
};
export const getExcelColumnName = (n) => {
  let columnName = "";
  while (n > 0) {
    let remainder = (n - 1) % 26;
    columnName = String?.fromCharCode(65 + remainder) + columnName;
    n = Math?.floor((n - 1) / 26);
  }
  return columnName;
};

export const generateColumnNames = (numColumns) => {
  const columnNames = [];
  for (let i = 1; i <= numColumns; i++) {
    const colName = getExcelColumnName(i);
    columnNames.push({
      label: `Col ${colName}`,
      value: `Col ${colName}`,
      index: i,
    });
  }
  return columnNames;
};

export const findColumnName = (index) => {
  let columnName = "";
  while (index >= 0) {
    columnName = String.fromCharCode((index % 26) + 65) + columnName;
    index = Math?.floor(index / 26) - 1;
  }
  return `Col ${columnName}`;
};

export const getColumnFieldIndex = (headerName, headers) => {
  return headers?.indexOf(headerName);
};

export const formatPhoneNumber = (value) => {
  if (value !== "" && value !== "+") {
    const spaceAndDashReplace = value?.replace(/[ -]/g, "");
    const phoneFormat = spaceAndDashReplace?.replace(/[^+a-zA-Z0-9]+/g, "");
    return phoneFormat;
  } else {
    return "";
  }
};

export const phoneNumberFormat = (phoneNumber) => {
  if (!phoneNumber) return "";

  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, ""); // Remove all non-numeric characters

  if (cleanedPhoneNumber.length === 10) {
    return "+1" + cleanedPhoneNumber;
  } else if (cleanedPhoneNumber.length === 11) {
    return "+" + cleanedPhoneNumber;
  }
  return phoneNumber.startsWith("+") ? phoneNumber : "+" + cleanedPhoneNumber;
};
export const sanitizeText = (input) => {
  const sanitizedInput = input.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  return sanitizedInput;
};

export function formatDollarAmount(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export const swapKeysAndValues = (obj) => {
  const swapped = {};
  for (const [key, value] of Object.entries(obj)) {
    swapped[value] = key;
  }
  return swapped;
};

export const formatDate = (value) => {
  if (!value) return "";

  const dateFormats = [
    "MMM-dd-yyyy",
    "MM/dd/yyyy",
    "MMMM dd, yyyy",
    "yyyy-MM-dd",
  ];
  let parsedDate;

  for (const dateFormat of dateFormats) {
    parsedDate = parse(value, dateFormat, new Date());
    if (isValid(parsedDate)) {
      return format(parsedDate, "yyyy-MM-dd"); // Output format
    }
  }

  return value; // Return original value if parsing failed
};

export function hasAnyValue(obj) {
  for (let key in obj) {
    if (obj[key] !== "") {
      return true;
    }
  }
  return false;
}

export function checkContacts(contacts) {
  return contacts?.some(
    (contact) =>
      hasAnyValue(contact) &&
      (contact.name === "" ||
        contact.title === "" ||
        contact.phone === "" ||
        contact.email === "")
  );
}

// export const inputTypesArray = [
//   { label: "button", value: "button" },
//   { label: "checkbox", value: "checkbox" },
//   { label: "color", value: "color" },
//   { label: "date", value: "date" },
//   { label: "datetime-local", value: "datetime-local" },
//   { label: "email", value: "email" },
//   { label: "file", value: "file" },
//   { label: "hidden", value: "hidden" },
//   { label: "image", value: "image" },
//   { label: "month", value: "month" },
//   { label: "number", value: "number" },
//   { label: "password", value: "password" },
//   { label: "radio", value: "radio" },
//   { label: "range", value: "range" },
//   { label: "reset", value: "reset" },
//   { label: "search", value: "search" },
//   { label: "submit", value: "submit" },
//   { label: "tel", value: "tel" },
//   { label: "text", value: "text" },
//   { label: "time", value: "time" },
//   { label: "url", value: "url" },
//   { label: "week", value: "week" },
// ];

export const inputTypesArray = [
  { label: "date", value: "date" },
  { label: "number", value: "number" },
  { label: "text", value: "text" },
];

export function removeDuplicates(array) {
  const seen = new Set();
  return array?.filter((item) => {
    const duplicate = seen?.has(item?.label);
    seen.add(item?.label);
    return !duplicate;
  });
}

export const generatePdfFromApiData = (apiData) => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("Financial Report", 15, 15);

  if (!apiData || Object.keys(apiData).length === 0) {
    doc.setFontSize(14);
    doc.text("No data available.", 15, 30);
    doc.save("financial_report.pdf");
    return;
  }

  if (apiData["getScores"] && apiData["getScores"]["Scores"]) {
    doc.setFontSize(16);
    doc.text("UCC Score:", 15, 30);
    doc.setFontSize(14);
    doc.text(`${apiData["getScores"]["Scores"]["UCC Score"]}`, 35, 40);
  } else {
    doc.setFontSize(16);
    doc.text("UCC Score: N/A", 15, 30);
  }

  if (apiData["getScores"] && apiData["getScores"]["Scores"]) {
    doc.setFontSize(16);
    doc.text("defaultRiskScore:", 15, 55);
    doc.setFontSize(14);
    doc.text(`${apiData["getScores"]["Scores"]["defaultRiskScore"]}`, 55, 55);
  } else {
    doc.setFontSize(16);
    doc.text("defaultRiskScore: N/A", 15, 55);
  }

  if (
    apiData["getScores"] &&
    apiData["getScores"]["Scores"] &&
    apiData["getScores"]["Scores"]["Weekly Budget"]
  ) {
    doc.setFontSize(16);
    doc.text("Weekly Budget (LCF Group):", 15, 70);
    doc.setFontSize(14);
    doc.text(
      `${apiData["getScores"]["Scores"]["Weekly Budget"]["LCF Group"]}`,
      85,
      70
    );
  } else {
    doc.setFontSize(16);
    doc.text("Weekly Budget (LCF Group): N/A", 15, 70);
  }

  if (
    apiData["getSettlementRange"] &&
    apiData["getSettlementRange"]["settlement_range"] &&
    apiData["getSettlementRange"]["settlement_range"]["Everest Businss Funding"]
  ) {
    doc.setFontSize(16);
    doc.text("Settlement Range (Everest Business Funding):", 15, 85);
    doc.setFontSize(14);
    const settlementRange =
      apiData["getSettlementRange"]["settlement_range"][
        "Everest Businss Funding"
      ];
    doc.text(
      `Recommendation 1: ${settlementRange["recommendation 1"][0]} - ${settlementRange["recommendation 1"][1]}`,
      35,
      95
    );
    doc.text(
      `Recommendation 2: ${settlementRange["recommendation 2"][0]} - ${settlementRange["recommendation 2"][1]}`,
      35,
      105
    );
    doc.text(
      `Recommendation 3: ${settlementRange["recommendation 3"][0]} - ${settlementRange["recommendation 3"][1]}`,
      35,
      115
    );
  } else {
    doc.setFontSize(16);
    doc.text("Settlement Range (Everest Business Funding): N/A", 15, 85);
  }

  doc.save("financial_report.pdf");
};

export const calculateNextWeek = () => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const year = nextWeek.getFullYear();
  const month = String(nextWeek.getMonth() + 1).padStart(2, "0");
  const day = String(nextWeek.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
export function getWeeksRemainingMessage(item) {
  switch (item) {
    case "recommendation 1":
      return "Weeks remaining based on recommendation 1";
    case "recommendation 2":
      return "Weeks remaining based on recommendation 2";
    case "recommendation 3":
      return "Weeks remaining based on recommendation 3";
    default:
      return "";
  }
}

export const isEmailValid = (email) => {
  // Use a more robust email validation regular expression
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};
export const HistoricRangeHandleNumberInput = (e) => {
  const invalidChars = ["e", "E", ".", "+", "-"];
  if (invalidChars.includes(e.key)) {
    e.preventDefault();
  }
};
export const handleNumberInput = (e) => {
  const allowedKeys = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
  ];
  if (!allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
  const invalidChars = ["e", "E", ".", "+", "-"];
  if (invalidChars.includes(e.key)) {
    e.preventDefault();
  }
};
export const handleNumberInputKeyDown = (e) => {
  const invalidChars = ["e", "E", ".", "-"];
  const allowedKeys = [
    "+",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
  ];
  if (!allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
  if (invalidChars.includes(e.key)) {
    e.preventDefault();
  }
};
export const convertCamelCaseToTitle = (str) => {
  return str
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
};
