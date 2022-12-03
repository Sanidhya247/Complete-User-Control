import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

const Login = () => {
  let ref = useRef();
  const [validEmail, setValidEmail] = useState(false);
  const [validPW, setValidPW] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Login } = bindActionCreators(actionCreators, dispatch);

  const onChangeEmail = (e) => {
    const emailRegex = /^[A-z]([A-z0-9.])+@([A-z0-9]+)\.([A-z]+)$/;
    let validateEmail = emailRegex.test(e.target.value);
    if (e.target.value === "") {
      e.target.classList.remove("invalid");
    }
    e.target.addEventListener("blur", () => {
      if (!validateEmail) {
        e.target.classList.add("invalid");
      } else {
        e.target.classList.remove("invalid");
      }
      if (e.target.value === "") {
        e.target.classList.remove("invalid");
      }
    });
    setValidEmail(validateEmail);
  };
  const onChangePW = (e) => {
    const passwordRe = /[A-z0-9@$.*]{4}$/;
    let validatePW = passwordRe.test(e.target.value);
    e.target.addEventListener("blur", () => {
      if (!validatePW) {
        e.target.classList.add("invalid");
      } else {
        e.target.classList.remove("invalid");
      }
      if (e.target.value === "") {
        e.target.classList.remove("invalid");
      }
    });
    setValidPW(validatePW);
  };

  const signupToggle = () => {
    ref.current.click();
  };
  const handleSignupManager = () => {
    ref.current.click();
    navigate("/signup-manager");
  };
  const handleSignupUser = () => {
    ref.current.click();
    navigate("/signup-user");
  };
  const handleLogin = (e) => {
    e.preventDefault();
    let loginEmail = document.getElementById("login-email").value;
    let loginPassword = document.getElementById("login-password").value;
    if (validPW && validEmail) {
      let data = {
        email: loginEmail,
        password: loginPassword,
      };
      Login(data);

      setTimeout(() => {
        if (localStorage.getItem("authToken")) {
          navigate("/home");
        }
      }, 1000);
    }
  };
  useEffect(() => {

    document.body.style.background ="linear-gradient(to right, #325861, #88bdbc)";
    document.querySelector(".nav").style.background ="linear-gradient(to right, #325861, #88bdbc)" ;

  }, []);

  return (
    <>
      <section>
        {/* //////////////////// */}

        <button
          ref={ref}
          type="button"
          className="btn btn-primary d-none "
          data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter"
        >
          Launch demo modal
        </button>

        <div
          className="modal fade"
          id="exampleModalCenter"
          tabIndex="-1"
          aria-labelledby="exampleModalCenterLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Choose an option for sign Up
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-2" onClick={handleSignupManager}>
                  <div className="model-body-heading">Manager</div>
                  <div className="model-body-small">Sign up as Manager</div>
                </div>
                <div className="mb-2" onClick={handleSignupUser}>
                  <div className="model-body-heading">User</div>
                  <div className="model-body-small">Sign up as User</div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-info"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* //////////////////// */}

        <div className="login-section container ">
          <div className="login-form">
            <div className="login-form-header">
              <h3>Login</h3>
            </div>
            <div className="line"></div>
            <form onSubmit={handleLogin} className="login-form-main">
              <div>
                <label htmlFor="login-email-address">Email ID</label>
                <input
                  className="inputfield"
                  name="email"
                  type="text"
                  placeholder="Enter valid email address here"
                  id="login-email"
                  onChange={onChangeEmail}
                />
              </div>
              <div>
                <label htmlFor="login-password">Password</label>
                <input
                  className=" inputfield"
                  name="password"
                  type="password"
                  placeholder="Enter password here"
                  id="login-password"
                  onChange={onChangePW}
                />
              </div>
              <div className="btns">
                <button className="login-btn m-3" type="submit">
                  Log-In
                </button>
                <button className="login-btn m-3" onClick={signupToggle}>
                  Sign-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
