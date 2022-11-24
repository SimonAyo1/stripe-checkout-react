import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { CircularProgress } from "@mui/material";
  import { collection, query, where, getDocs } from "firebase/firestore";
  import { loadStripe } from "@stripe/stripe-js";
  import { db } from "./firebase-config";
import CheckoutForm from "./CheckoutForm";



function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true)


  let { userId, customerId, amount } = useParams();
  // console.log(userId)
  const [data, setData] = useState({
    company_name: null,
  });
  const fetchData = async (id) => {
    setIsLoading(true)
    const req = query(collection(db, "users"), where("userId", "==", `${id}`));
    const querySnapshot = await getDocs(req).catch((e) => {
      setIsLoading(false)
      // console.log(e);
    });
    querySnapshot.forEach((doc) => {
      setIsLoading(false);
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.data())
      setData({
        company_name: doc.data().company,
      });
    });
  };

  useEffect(() => {
  fetchData(userId)
  }, [])

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
      setClientSecret(clientSecret);
    });
  }, []);

  return (
    <>
      <p style={{marginTop: 20}}>
        Billing Company: { isLoading ? (<CircularProgress size={18} />)  : data.company_name}
      </p>
      {clientSecret && stripePromise ? (
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
  );
}

export default Payment;
