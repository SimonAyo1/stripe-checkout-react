import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { Alert, CircularProgress } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch } from "react-redux";
import { db } from "./firebase-config";
import CheckoutForm from "./CheckoutForm";
import { secretActions } from "./store/clientSecret/ClientSecretSlice";

function Payment() {
  const dispatch = useDispatch();
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  let { userId, customerId, amount } = useParams();
  const parsedAmount = parseInt(amount, 10);
  const isAmountValid = !isNaN(parsedAmount);
  // console.log(userId)
  const [data, setData] = useState({
    company_name: null,
  });
  const fetchData = async (id) => {
    setIsLoading(true);
    const req = query(collection(db, "users"), where("userId", "==", `${id}`));
    const querySnapshot = await getDocs(req).catch((e) => {
      setIsLoading(false);
      // console.log(e);
    });
    querySnapshot.forEach((doc) => {
      setIsLoading(false);
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.data())
      setData({
        company_name: doc.data().company,
      });
      localStorage.setItem(
        "customerName",
        JSON.stringify({ customerName: doc.data().company })
      );
    });
  };

  useEffect(() => {
    fetchData(userId);
  }, []);

  useEffect(() => {
    fetch("https://api-tfconvert.vercel.app/api/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
      // console.log(publishableKey);
    });
  }, []);

  useEffect(() => {
    fetch("https://api-tfconvert.vercel.app/api/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({}),
    }).then(async (result) => {
      var { clientSecret } = await result.json();
      dispatch(secretActions.addSecret(clientSecret));
      localStorage.setItem("clientSt", JSON.stringify({ cs: clientSecret }));
      localStorage.setItem("userId", JSON.stringify({ userId: userId }));
      localStorage.setItem(
        "customerId",
        JSON.stringify({ customerId: customerId })
      );
      localStorage.setItem(
        "amountPayed",
        JSON.stringify({ amountPayed: amount })
      );
      setClientSecret(clientSecret);
    });
  }, []);

  return isAmountValid ? (
    <>
      <p style={{ marginTop: 20 }}>
        You are paying <b>${parsedAmount}</b> to
      </p>
      <p style={{ marginTop: 20 }}>
        Billing Company:{" "}
        {isLoading ? <CircularProgress size={18} /> : data.company_name}
      </p>
      {!isLoading && clientSecret && stripePromise ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      ) : (
        <div class="spinner">
          <div class="circle one"></div>
          <div class="circle two"></div>
          <div class="circle three"></div>
        </div>
      )}
    </>
  ) : (
    <Alert severity="error">
      Invallid URL Parameter, ERROR: INVALID AMOUNT "{amount}"
    </Alert>
  );
}

export default Payment;
