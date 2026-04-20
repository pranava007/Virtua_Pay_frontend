import { useEffect } from "react";
import axios from "axios";

const PaymentPage = () => {

  useEffect(() => {
    startPayment();
  }, []);

  const startPayment = async () => {
    try {
      const params = new URLSearchParams(window.location.search);

      const orderId = params.get("orderId");
      const shop = params.get("shop");

      // 🔥 get payment details
      const { data } = await axios.get(
        `/api/payment/create-payment?orderId=${orderId}`
      );

      const payment = data.payment;

      // 🔥 RAZORPAY FLOW
      if (payment.gateway === "razorpay") {

        const options = {
          key: payment.key,
          amount: payment.amount,
          currency: payment.currency,
          order_id: payment.orderId,

          handler: async function (response) {

            const verifyRes = await axios.post(
              "/api/payment/verify-payment",
              {
                orderId,
                shop,
                paymentData: {
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id,
                  signature: response.razorpay_signature
                }
              }
            );

            if (verifyRes.data.success) {
              window.location.href = verifyRes.data.returnUrl;
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }

      // 🔥 CASHFREE FLOW
      else if (payment.gateway === "cashfree") {
        window.location.href = payment.paymentLink;
      }

    } catch (err) {
      console.error(err);
    }
  };

  return <h2>Processing Payment...</h2>;
};

export default PaymentPage;