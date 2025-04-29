import { baseUrl, NETWORK_ERROR } from "./constants/appConstants";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
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
    return cleanedPhoneNumber;
  } else if (cleanedPhoneNumber.length === 11) {
    return cleanedPhoneNumber;
  }
  return phoneNumber.startsWith("+") ? phoneNumber : cleanedPhoneNumber;
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

export const generatePdfFromApiData = (
  selectedCreditorDetails,
  credDetail,
  debtorInfo,
  summaryPayable
) => {
  const value = selectedCreditorDetails?.contractDetails?.payable_amount;
  const formatedValue =
    credDetail === "Summary"
      ? `$${summaryPayable}`
      : value?.includes("$")
      ? value
      : `$${value}`;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Settlement Agreement", 15, 15);
  doc.setFontSize(10);
  const currentDate = new Date();
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  const agreementText = `
This Debt Settlement Agreement (the "Agreement") is entered into as of ${formattedDate}.
The parties to this Agreement are as follows:

Client Company: ${debtorInfo?.companyName}
Company Address: ${debtorInfo?.address}

Creditor Company: ${credDetail}
Company Address:

The Creditor and Client(s) agree to negotiate and settle the debt under the following terms and conditions.
The Creditor and Client(s) agree that the current outstanding debt is ${formatedValue}.
All parties agree that the Creditor will accept a payment of ___________________ towards 
settlement of the debt in full. 
The Creditor agrees to compromise the debt under the condition 
that they will receive the payment by _____________________.
This Agreement for debt settlement shall be binding upon the Creditor, Client(s), and their 
successors and assignees.
The parties have agreed to settle finally and forever any and all claims between them of any 
nature whatsoever from any and all liability or damages of any kind, known or unknown, in 
contract or in tort.
The parties agree that the terms of this Agreement are the result of negotiations between the 
parties, and constitute a final accord and satisfaction concerning all disputes between them.
All settlement terms herein are dependent upon receipt of final payment 
via ACH in the amount of _____________________ to the Creditor's account.
Except only to enforce the terms of this Agreement, each party agrees not to bring any claim of 
any kind against the other party to this Agreement concerning any matter released by this 
Agreement. Each party further agrees that this Agreement constitutes a bar to any such future 
claim.
All parties agree that the other parties are free of any liability or 
wrongdoing. Any liability or wrongdoing is expressly denied. Furthermore, the parties each agree that neither 
shall disparage the other to any third party at any time.
No modification to any provisions contained in this Agreement shall be binding upon any party 
unless made in writing and signed by all parties.
If any provision of this Agreement is held to be unenforceable for any reason, the remaining 
parts of the Agreement shall remain in full force and effect.
Each party represents that he/she/it has not assigned any portion of the claims released under this 
Agreement to any third party.
This Agreement constitutes a single, integrated written contract expressing the entire agreement 
of the parties to this Agreement. Any other agreements, discussions, promises, and 
representations have been and are integrated into and superseded by this Agreement.
Each party represents that he/she/it has the authority to enter into this Agreement on behalf 
of him/her/itself or his/her/its respective organization.
Upon receipt and subsequent clearance of the agreed upon payment, all parties release each 
other from any further claim or liability.

Printed Name: _____________________________
Signature: _____________________________ Date: ___________________________

Printed Name: _____________________________
Signature: _____________________________ Date: ___________________________`;

  const agreementLines = agreementText.split("\n");
  let yCoordinate = 35;
  const lineHeight = 10;
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 20;

  agreementLines.forEach((line) => {
    if (yCoordinate + lineHeight > pageHeight - marginBottom) {
      doc.addPage();
      yCoordinate = 20;
    }
    doc.text(line, 15, yCoordinate);
    yCoordinate += lineHeight;
  });
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
    "Control",
    "v",
    "c",
    "x",
    "a",
    "z",
    "y",
  ];
  if (
    e.ctrlKey &&
    ["v", "c", "x", "a", "z", "y"].includes(e.key.toLowerCase())
  ) {
    return; // Allow the copy-paste or cut operation
  }
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
export const getTruncatedText = (text, maxLength) => {
  if (text?.length > maxLength) {
    return text?.slice(0, maxLength) + "...";
  }
  return text;
};

export const truncateText = (text, length) => {
  if (text?.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
};
export const formatPurchasedPercentage = (value) => {
  if (!value) return "0%";
  const numericValue = parseFloat(value); // Extracts the number
  return isNaN(numericValue) ? "0%" : `${numericValue}%`;
};
const generatePDF = (data, lumpSumpData, checkboxState) => {
  const {
    creditors,
    debtor,
    creditorsContractDetailsSum,
    settlementRange,
    getScores,
  } = data;

  const doc = new jsPDF();
  doc.setFontSize(18);

  const formatPercentage = (value) => {
    return typeof value === "number" ? `${value}%` : "N/A";
  };
  const formatCurrencyConditional = (value) => {
    if (typeof value === "number") {
      return `$${value.toLocaleString()}`;
    }
    return value.toString().includes("$") ? value : `$${value}`;
  };
  const formatCurrency = (value) => {
    return typeof value === "number" ? `$${value.toLocaleString()}` : "N/A";
  };

  const startY = 20;
  let currentY = startY;

  // Title
  doc.text("Settlement Range Data", 14, currentY);
  currentY += 10;

  // Debtor Information
  if (checkboxState["Client Information"]) {
    doc.setFontSize(14);
    doc.text("Client Information", 14, currentY);
    currentY += 10;

    const debtorInfo = [
      ["Full Name", debtor?.basicInformation?.fullName || "N/A"],
      ["Email", debtor?.basicInformation?.email || "N/A"],
      ["Phone", debtor?.basicInformation?.phone || "N/A"],
      [
        "Address",
        `${debtor?.basicInformation?.address || "N/A"}, ${
          debtor?.basicInformation?.city || "N/A"
        }, ${debtor?.basicInformation?.state || "N/A"}, ${
          debtor?.basicInformation?.zipCode || "N/A"
        }`,
      ],
      ["Weekly Budget", `$${debtor?.basicInformation?.weeklyBudget || 0}`],
      ["Commission Percentage", `${debtor?.commissionPercentage || 0}%`],
    ];

    doc.autoTable({
      head: [["Field", "Value"]],
      body: debtorInfo,
      startY: currentY,
    });

    currentY = doc.autoTable.previous.finalY + 10;
  }

  // Settlement Range
  if (checkboxState["Settlement Range"]) {
    doc.setFontSize(14);
    doc.text("Settlement Range", 14, currentY);
    currentY += 10;

    const settlementRangeSummary = [
      ["Weekly Profit", formatCurrency(settlementRange?.weekly_profit) || 0],
      [
        "Weekly True Revenue",
        formatCurrency(settlementRange?.weekly_true_revenue) || 0,
      ],
      ["Profitability", formatPercentage(settlementRange?.profitability) || 0],
    ];

    doc.autoTable({
      head: [["Field", "Value"]],
      body: settlementRangeSummary,
      startY: currentY,
    });

    currentY = doc.autoTable.previous.finalY + 10;
  }

  // Add Scores
  if (checkboxState.Scores) {
    doc.setFontSize(14);
    doc.text("Scores", 14, currentY);
    currentY += 10;

    const scoresSummary = [
      [
        "Default Risk Score",
        formatPercentage(getScores?.Scores?.["Default Risk Score"]) || 0,
      ],
      ["UCC Score", formatPercentage(getScores?.Scores?.["UCC Score"]) || 0],
    ];

    doc.autoTable({
      head: [["Field", "Value"]],
      body: scoresSummary,
      startY: currentY,
    });

    currentY = doc.autoTable.previous.finalY + 10;
  }

  // Creditors Information
  if (checkboxState["Creditors Contract Information"]) {
    doc.setFontSize(14);
    doc.text("Creditors Contract Information", 14, currentY);
    currentY += 10;

    const creditorDetails = creditors?.map((creditor) => {
      const payableAmount =
        creditor?.totalDebt !== undefined &&
        creditor?.remainingAmountPaid !== undefined
          ? `$${(creditor?.totalDebt - creditor?.remainingAmountPaid).toFixed(
              2
            )}`
          : "--";
      return [
        creditor?.creditorAccountTitle || "N/A",
        formatCurrencyConditional(creditor?.contractDetails?.loan_amount || 0),
        formatCurrencyConditional(
          creditor?.contractDetails?.funded_amount || 0
        ),
        formatCurrencyConditional(
          creditor?.contractDetails?.payable_amount || 0
        ),

        formatCurrencyConditional(payableAmount || 0),
        formatCurrencyConditional(creditor?.breakEven || 0),
        formatPurchasedPercentage(
          creditor?.contractDetails?.purchased_percentage || 0
        ),
        formatCurrencyConditional(
          creditor?.contractDetails?.repayment_amount || 0
        ),
      ];
    });

    doc.autoTable({
      head: [
        [
          "Name",
          "Purchase Price",
          "Net Funded Amount",
          "Purchased Amount",
          "Current Balance",
          "Break Even Point",
          "Purchased Percentage",
          "Current Payment Amount",
        ],
      ],
      body: creditorDetails,
      startY: currentY,
    });

    currentY = doc.autoTable.previous.finalY + 10;
  }

  // Creditors Summary
  if (checkboxState["Creditors Contract Details Summary"]) {
    doc.setFontSize(14);
    doc.text("Creditors Contract Details Summary", 14, currentY);
    currentY += 10;

    const creditorsSummary = [
      [
        "Total Loan Amount",
        `$${creditorsContractDetailsSum?.loanAmount?.toLocaleString() || 0}`,
      ],
      [
        "Total Payable Amount",
        `$${creditorsContractDetailsSum?.payableAmount?.toLocaleString() || 0}`,
      ],
    ];

    doc.autoTable({
      head: [["Field", "Value"]],
      body: creditorsSummary,
      startY: currentY,
    });

    currentY = doc.autoTable.previous.finalY + 10;
  }

  // Recommendations
  if (checkboxState["Strategy 1 Recommendations"]) {
    doc.setFontSize(14);
    doc.text("Max Profit Recommendation 1 Minimum", 14, currentY);
    currentY += 10;

    const recommendationOneMin = creditors?.map((creditor) => {
      const title = creditor?.creditorAccountTitle || "N/A";
      return [
        title,
        formatCurrencyConditional(
          settlementRange?.commission_range?.[title]?.["recommendation 1"]
            ?.min || 0
        ),
        formatCurrencyConditional(
          settlementRange?.settlement_range?.[title]?.["recommendation 1"]
            ?.min || 0
        ),
      ];
    });

    doc.autoTable({
      head: [["Creditors", "Commission Range", "Settlement Range"]],
      body: recommendationOneMin,
      startY: currentY,
    });

    currentY = doc.autoTable.previous.finalY + 10;

    doc.setFontSize(14);
    doc.text("Max Profit Recommendation 1 Maximum", 14, currentY);
    currentY += 10;

    const recommendationOneMax = creditors?.map((creditor) => {
      const title = creditor?.creditorAccountTitle || "N/A";
      return [
        title,
        formatCurrencyConditional(
          settlementRange?.commission_range?.[title]?.["recommendation 1"]
            ?.max || 0
        ),
        formatCurrencyConditional(
          settlementRange?.settlement_range?.[title]?.["recommendation 1"]
            ?.max || 0
        ),
      ];
    });

    doc.autoTable({
      head: [["Creditors", "Commission Range", "Settlement Range"]],
      body: recommendationOneMax,
      startY: currentY,
    });

    currentY = doc.autoTable.previous.finalY + 10;
  }

  //   //strategy 2
  if (checkboxState["Strategy 2 Recommendations"]) {
    doc.setFontSize(14);
    doc.text("Lump Sum", 14, currentY);
    currentY += 10;
    const recommendationTwo = creditors.map((creditor) => {
      const title = creditor?.creditorAccountTitle || "N/A";
      return [
        title,
        formatCurrency(
          lumpSumpData?.lumpsum_settlement?.[title]
            ?.remaining_principle_amount || 0
        ) || 0,

        formatCurrency(
          lumpSumpData?.lumpsum_settlement?.[title]?.repaid_debt || 0
        ) || 0,
      ];
    });

    doc.autoTable({
      head: [["Creditors", "Remaining Amount ", "Repaid Debt"]],
      body: recommendationTwo,
      startY: currentY,
    });
    currentY = doc.autoTable.previous.finalY + 10;
  }
  // strategy 3
  if (checkboxState["Strategy 3 Recommendations"]) {
    doc.setFontSize(14);
    doc.text("Percentage Receivable Minimum", 14, currentY);
    currentY += 10;

    const recommendationThreeMinVal = creditors?.map((creditor) => {
      const title = creditor?.creditorAccountTitle || "N/A";
      return [
        title,

        formatPercentage(
          settlementRange?.percentage_settlement_over_weekly_budget?.[title]?.[
            "recommendation 1"
          ]?.min || 0
        ),
        formatPercentage(
          settlementRange?.percentage_settlement_over_weekly_true_revenue?.[
            title
          ]?.["recommendation 1"]?.min || 0
        ),
        formatPercentage(
          settlementRange?.new_default_risk_score?.["recommendation 1"]?.min ||
            0
        ),
      ];
    });
    doc.autoTable({
      head: [
        [
          "Creditors",
          "Weekly Budget %",
          "Weekly True Revenue",
          "New Default Risk",
        ],
      ],
      body: recommendationThreeMinVal,
      startY: currentY,
    });
    currentY = doc.autoTable.previous.finalY + 10;

    doc.setFontSize(14);
    doc.text("Percentage Receivable Maximum", 14, currentY);
    currentY += 10;

    const recommendationThree = creditors?.map((creditor) => {
      const title = creditor?.creditorAccountTitle || "N/A";
      return [
        title,

        formatPercentage(
          settlementRange?.percentage_settlement_over_weekly_budget?.[title]?.[
            "recommendation 1"
          ]?.max || 0
        ),
        formatPercentage(
          settlementRange?.percentage_settlement_over_weekly_true_revenue?.[
            title
          ]?.["recommendation 1"]?.max || 0
        ),
        formatPercentage(
          settlementRange?.new_default_risk_score?.["recommendation 1"]?.max ||
            0
        ),
      ];
    });
    doc.autoTable({
      head: [
        [
          "Creditors",
          "Weekly Budget %",
          "Weekly True Revenue",
          "New Default Risk",
        ],
      ],
      body: recommendationThree,
      startY: currentY,
    });
    currentY = doc.autoTable.previous.finalY + 10;
  }

  doc.save("document.pdf");
};

export default generatePDF;

export function formatDateString(isoDateStr) {
  const date = isoDateStr === "now" ? new Date() : new Date(isoDateStr);

  const options = {
    year: "2-digit",
    month: "short",
    day: "numeric",
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString("en-US", options);
  return `${formattedDate}`;
}
export function formatDateCall(isoDateStr) {
  const date = isoDateStr === "now" ? new Date() : new Date(isoDateStr);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: true,
  };

  return date.toLocaleDateString(undefined, options);
}

export const isPhoneNumber = (value) => {
  const phoneRegex = /^[0-9]{10,}$/;
  return phoneRegex.test(value);
};
export const formatValue = (value) => {
  if (isPhoneNumber(value)) {
    return `+1${value}`;
  }
  return value;
};

export const formatCsvValues = (value) => {
  return value?.replace(/[-\s]/g, "");
};

export function sanitizePhoneNumber(phoneNumber) {
  let sanitizedNumber = phoneNumber?.startsWith("+1")
    ? phoneNumber?.slice(2)
    : phoneNumber;
  sanitizedNumber = sanitizedNumber?.replace(/[-\s]/g, "");
  return sanitizedNumber;
}

export function sanitizeBudget(budget) {
  let sanitizedBudget = budget.replace(/[$,\s]/g, "");
  return parseInt(sanitizedBudget, 10);
}
export const formatAmountValue = (value) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  return numericValue
    ? new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericValue)
    : "0.00";
};
export const formatWeeklyBudget = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "--";
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
