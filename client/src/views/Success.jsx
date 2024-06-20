import React, { useEffect } from "react";

const Success = () => {
  useEffect(() => {
    const updateStatus = async () => {
      const orderId = localStorage.getItem("orderId");
      const transactionId = localStorage.getItem("transactionId");

      const body = {
        orderId: orderId,
      };

      const response = await fetch(
        "http://localhost:5000/api/update-payment-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      console.log(result);

      localStorage.removeItem("orderId");
      localStorage.removeItem("transactionId");
    };

    updateStatus();
  }, []);

  return <div>Payment Successful</div>;
};

export default Success;
