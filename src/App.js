import "./App.css";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Requests from "./components/Requests";
import Alert from "./components/Alert";
import { useEffect } from "react";

function App() {
  // useEffect(() => {
  //   const alert = (type , message) => {
  //     let alertClass = document.querySelector(".alert-div");
        
  //       alertClass.innerHTML = `
  //       <div class="alert alert-${type} alert-dismissible fade show" role="alert">
  //       <strong>${message}</strong> 
  //       <button
  //         type="button"
  //         class="close"
  //         data-dismiss="alert"
  //         aria-label="Close"
  //       >
  //         <span aria-hidden="true">&times;</span>
  //       </button>
  //     </div>
  //     `;
  //     setTimeout(() => {
  //     alertClass.innerHTML='';
  //   }, 2000);
  //   };

  // }, []);

  return (
    <Router>
      <div>
        <Navbar />
        <Alert />
        <Routes>
          <Route path="/" element={<Login />}>
            {" "}
          </Route>
          <Route path="/signup-manager" element={<Signup name={"Manager"} />}>
            {" "}
          </Route>
          <Route path="/signup-user" element={<Signup name={"User"} />}>
            {" "}
          </Route>
          <Route path="/home" element={<Home />}>
            {" "}
          </Route>
          <Route path="/requests" element={<Requests />}>
            {" "}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
