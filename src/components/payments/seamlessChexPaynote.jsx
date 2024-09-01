/* eslint-disable no-undef */

import React, { useEffect } from "react";

const PaynoteButton = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://developers.seamlesschex.com/docs/checkoutjs/sdk-min.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        const objRequestIframe = {
          publicKey: "pk_test_01H8PVPA6Y7T7TBHPNJHYHKZ2C",
          sandbox: true,
          // authorizationOnly: true, // set this to true
          displayMethod: "iframe",
          paymentToken: "pay_tok_SPECIMEN-" + Math.random(),
          widgetContainerSelector: "wrapper-pay-buttons",
          saveBankDetails: true,
          storeName: "AlphaBetaGamma",
          checkout: {
            totalValue: 3,
            currency: "USD",
            description: "Sign up to System",
            items: [{ title: "Enrollment", price: 3 }],
            customerEmail: "laila@hotprospector.com",
            customerFirstName: "Laila",
            customerLastName: "Khan",
          },
          style: {
            buttonClass: "btn green-btn btn-block no-overflow",
            buttonColor: "#0091D5",
            buttonLabelColor: "#ffffff",
            buttonLabel: "Add Account Details",
          },
          onSuccess: function () {
            console.log("Payment successful!");
          },
          onError: function () {
            console.log("Errrrrrrrrrorrrroorororoorororo");
          },
        };
        const paynoteIframe = new PAYNOTE(objRequestIframe);
        paynoteIframe.render();
      } catch (error) {
        alert("Error initializing PAYNOTE:", error);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div className="wrapper-pay-buttons" />;
};

export default PaynoteButton;
