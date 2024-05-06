import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import PaymentDetails from "../components/paymentDetails";

export default function PaymentPage() {
  return (
    <PersistentDrawerLeft>
      <PaymentDetails />
    </PersistentDrawerLeft>
  );
}
