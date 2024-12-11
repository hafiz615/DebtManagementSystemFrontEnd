import React, { useEffect, useMemo, useState } from "react";

const PaynoteButton = ({ caseData }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const objRequestIframe = useMemo(() => {
    let casedataName =
      caseData && caseData?.creditor?.basicInformation?.fullName;
    const parts = casedataName?.split(" ");
    const firstPart = parts && parts[0]?.trim();
    const secondPart = parts && parts[1] ? parts[1]?.trim() : "";

    return {
      publicKey: "pk_test_01H8PVPA6Y7T7TBHPNJHYHKZ2C",
      sandbox: true,
      displayMethod: "iframe",
      paymentToken: "pay_tok_SPECIMEN-" + Math.random(),
      widgetContainerSelector: "widgetSelector",
      storeName: "AlphaBetaGamma",
      checkout: {
        totalValue: 3,
        currency: "USD",
        description: "Sign up to System",
        items: [{ title: "Enrollment", price: 3 }],
        customerEmail: `${caseData?.creditor?.basicInformation?.email}`,
        customerFirstName: firstPart,
        customerLastName: secondPart,
      },
      style: {
        buttonClass: "btn green-btn btn-block no-overflow",
        buttonColor: "#00B660",
        buttonLabelColor: "#FFFFFF",
        buttonLabel: "Pay",
      },
      onSuccess: function () {},
      onError: function () {},
    };
  }, [caseData]);

  useEffect(() => {
    // Check if the script is already loaded
    const existingScript = document.querySelector(
      'script[src="https://developers.seamlesschex.com/docs/checkoutjs/sdk-min.js"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://developers.seamlesschex.com/docs/checkoutjs/sdk-min.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setScriptLoaded(true); // Set script loaded state to true
      };
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true); // Script already exists, mark as loaded
    }
    return () => {
      // Optionally, you could remove the script on unmount, but typically it is kept for reuse.
    };
  }, []);

  // Run this effect only on mount
  useEffect(() => {
    if (scriptLoaded) {
      // Once the script is loaded, initialize the iframe
      try {
        const paynoteIframe = new PAYNOTE(objRequestIframe);
        paynoteIframe.render();
      } catch (error) {
        console.error("Error initializing PAYNOTE:", error.message);
      }
    }
  }, [scriptLoaded, objRequestIframe]); // Depend on scriptLoaded and objRequestIframe

  return <div className={"widgetSelector"} />;
};
export default PaynoteButton;
