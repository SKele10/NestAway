import { func } from "prop-types";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PaymentAuth({
  publicToken,
  changePaidState,
  sendPaymentInfo,
}) {
  const [account, setAccount] = useState();

  useEffect(() => {
    async function fetchData() {
      let accessToken = await axios.post(
        "http://localhost:8080/payment/exchange_public_token",
        { public_token: publicToken }
      );
      //console.log("accessToken", accessToken.data);
      const auth = await axios.post("http://localhost:8080/payment/auth", {
        access_token: accessToken.data.accessToken,
      });
      setAccount(auth.data.numbers.ach[0]);
      const paymentInfo = {
        paymentMethod: auth.data.accounts[0].official_name,
      };
      sendPaymentInfo(paymentInfo);
      changePaidState();
    }
    fetchData();
  }, []);
  return (
    account && (
      <>
        <div className="bg-gray-100 rounded-lg p-4 shadow-md">
          <div className="mb-2">
            <span className="font-semibold">Account Number:</span>{" "}
            {account.account}
          </div>
          <div>
            <span className="font-semibold">Routing Number:</span>{" "}
            {account.routing}
          </div>
        </div>
      </>
    )
  );
}
