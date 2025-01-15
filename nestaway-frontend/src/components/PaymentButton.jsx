import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import PaymentAuth from "./PaymentAuth";
import plaid_icon from "../assets/plaid_icon.png";

function PaymentButton({ changePaidState, sendPaymentInfo }) {
  const [linkToken, setLinkToken] = useState();
  const [publicToken, setPublicToken] = useState();
  useEffect(() => {
    async function fetch() {
      const response = await axios.post(
        "http://localhost:8080/payment/create_link_token"
      );
      setLinkToken(response.data.link_token);
    }
    fetch();
  }, []);
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token);
      //   console.log("success", public_token, metadata);
    },
  });

  return publicToken ? (
    <PaymentAuth
      publicToken={publicToken}
      changePaidState={changePaidState}
      sendPaymentInfo={sendPaymentInfo}
    />
  ) : (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="flex items-center justify-center bg-teal-500 hover:text-opacity-100 text-white font-bold py-3 px-6 rounded-lg shadow-md"
    >
      Pay with
      <img src={plaid_icon} alt="Plaid Logo" className="h-6 object-cover " />
    </button>
  );
}

export default PaymentButton;
