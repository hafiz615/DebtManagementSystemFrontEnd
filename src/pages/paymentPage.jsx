import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import PaymentCardDetails from "../components/paymentCard";
function PaymentsCardPage() {
  return (
    <PersistentDrawerLeft>
      <PaymentCardDetails />
    </PersistentDrawerLeft>
  );
}
export default PaymentsCardPage;
