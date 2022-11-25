import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase-config";

function Completion(props) {
  const { secret } = useParams();
  const [loading, setLoading] = useState(true);
  const date = new Date();
  const addPayment = async (
    userId,
    clientSrt,
    customerId,
    customerName,
    amountPayed
  ) => {
    await addDoc(collection(db, "users_customer_payments"), {
      id: clientSrt,
      userId: userId,
      method: "stripe",
      amount: amountPayed,
      company_name: customerName,
      customer_id: customerId,
      status: "success",
      date: date.toISOString(),
    });
  };
  const clientst = JSON.parse(localStorage.getItem("clientSt"));
  const userId = JSON.parse(localStorage.getItem("userId"));
  const customerId = JSON.parse(localStorage.getItem("customerId"));
  const customerName = JSON.parse(localStorage.getItem("customerName"));
  const amountPayed = JSON.parse(localStorage.getItem("amountPayed"));

  const checkIfClientSecretExists = async (client_secret) => {
    const req = query(
      collection(db, "users_customer_payments"),
      where("id", "==", `${client_secret}`)
    );
    const querySnapshot = await getDocs(req).catch((e) => {});
    if (querySnapshot.empty) {
      addPayment(
        userId.userId,
        clientst.cs,
        customerId.customerId,
        customerName.customerName,
        amountPayed.amountPayed
      );
    }
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      if (doc.data().id === client_secret) {
        return null;
      }
    });
  };

  useEffect(() => {
    if (secret === clientst.cs) {
      checkIfClientSecretExists(clientst.cs);
    }
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div class="card" style={{ textAlign: "center" }}>
          <div
            style={{
              borderRadius: "200px",
              height: "200px",
              width: "200px",
              background: "#F8FAF5",
              margin: "0 auto",
            }}
          >
            <i class="checkmark">✓</i>
          </div>
          <h1>Success</h1>
          <p>We received your payment</p>
        </div>
      </div>
    </>
  );
}

export default Completion;
