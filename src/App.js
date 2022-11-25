import "./App.css";
import Payment from "./Payment";
import Completion from "./Completion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
function App() {
  return (
    <>
      <main>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/:userId/:customerId/:amount" element={<Payment />} />
            <Route path="/completion/:secret" element={<Completion />} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;
