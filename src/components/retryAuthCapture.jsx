import React, { useEffect, useState } from "react";
import { GetDebtorAccounts } from "../services/services";
import RetryPayments from "./caseDetail/retryPayments";

function RetryAuthCapture({ debtorId, itemRow, getHomeData, arrayName }) {
  const [accountsResponse, setAccountsResponse] = useState([]);

  const GetDebtorAccountsData = async () => {
    const accountsRes = await GetDebtorAccounts(debtorId);
    if (accountsRes?.status === 200) {
      setAccountsResponse(accountsRes?.data?.data);
    }
  };

  useEffect(() => {
    if (debtorId) GetDebtorAccountsData();
  }, [debtorId]);

  return (
    <div>
      <RetryPayments
        accountsResponse={accountsResponse}
        itemRow={itemRow}
        getHomeData={getHomeData}
        arrayName={arrayName}
        show={true}
      />
    </div>
  );
}

export default RetryAuthCapture;
