import { baseUrl, NETWORK_ERROR } from "./constants/appConstants";
import { jsPDF } from "jspdf";

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

export const setAiHeaders = () => {
  const headerConfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("aiToken"),
      Accept: "application/json",
    },
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

export function formatDollarAmount(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

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

  if (apiData["get-scores"] && apiData["get-scores"]["Scores"]) {
    doc.setFontSize(16);
    doc.text("UCC Score:", 15, 30);
    doc.setFontSize(14);
    doc.text(`${apiData["get-scores"]["Scores"]["UCC Score"]}`, 35, 40);
  } else {
    doc.setFontSize(16);
    doc.text("UCC Score: N/A", 15, 30);
  }

  if (apiData["get-scores"] && apiData["get-scores"]["Scores"]) {
    doc.setFontSize(16);
    doc.text("Default Risk Score:", 15, 55);
    doc.setFontSize(14);
    doc.text(
      `${apiData["get-scores"]["Scores"]["Default Risk Score"]}`,
      55,
      55
    );
  } else {
    doc.setFontSize(16);
    doc.text("Default Risk Score: N/A", 15, 55);
  }

  if (
    apiData["get-scores"] &&
    apiData["get-scores"]["Scores"] &&
    apiData["get-scores"]["Scores"]["Weekly Budget"]
  ) {
    doc.setFontSize(16);
    doc.text("Weekly Budget (LCF Group):", 15, 70);
    doc.setFontSize(14);
    doc.text(
      `${apiData["get-scores"]["Scores"]["Weekly Budget"]["LCF Group"]}`,
      85,
      70
    );
  } else {
    doc.setFontSize(16);
    doc.text("Weekly Budget (LCF Group): N/A", 15, 70);
  }

  if (
    apiData["get-settlement-range"] &&
    apiData["get-settlement-range"]["settlement_range"] &&
    apiData["get-settlement-range"]["settlement_range"][
      "Everest Businss Funding"
    ]
  ) {
    doc.setFontSize(16);
    doc.text("Settlement Range (Everest Business Funding):", 15, 85);
    doc.setFontSize(14);
    const settlementRange =
      apiData["get-settlement-range"]["settlement_range"][
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
