import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

const Signup = (props) => {
  const { name } = props;
  const [managersList, setManagersList] = useState([]);
  const [validForm, setValidForm] = useState(false);
  const dispatch = useDispatch();
  const { managerSignup, userSignup } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const {success} = useSelector(state=>state.main)

  useEffect(() => {
    const fetchManagers = async () => {
      const response = await fetch(
        "http://localhost:5000/user-control/api/fetch/allmanagers",
        {
          method: "GET",
          headers: {
            authToken:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODA0MDNiNmZkMmU2NGU5NmZiNDkxYiIsImlhdCI6MTY2OTM0OTQzNX0.KO8gOlBfTAp2HjudARwPYikfIqtQa6MoN5WjOZmvwE0",
          },
        }
      );
      const json = await response.json();
      setManagersList(json);
    };
    fetchManagers();
  }, []);

  const navigate = useNavigate();
  console.log(success)
  
  const onChange = (e) => {
    let newname = e.target.name;
    let value = e.target.value;
    const regex = {
      email: /^[A-z]([A-z0-9.])+@([A-z0-9]+)\.([A-z]+)$/,
      password: /[A-z0-9@$.*]{4}$/,
      name: /([A-z0-9@$.*]{2})/,
      // eslint-disable-next-line
      address: /[A-z0-9\,-\.]{5}/,
      mobile: /^[0-9]{10}$/,
    };
    if (newname === "name") {
      const validation = regex.name.test(value);
      e.target.addEventListener("blur", () => {
        if (validation) {
          e.target.classList.remove("invalid");
          setValidForm(true);
        }
        // eslint-disable-next-line
        else if (e.target.value === "") {
          e.target.classList.remove("invalid");
        } else {
          e.target.classList.add("invalid");
        }
      });
    } else if (newname === "email") {
      const validation = regex.email.test(value);
      e.target.addEventListener("blur", () => {
        if (validation) {
          e.target.classList.remove("invalid");
          setValidForm(true);
        } else if (e.target.value === "") {
          e.target.classList.remove("invalid");
        } else {
          e.target.classList.add("invalid");
        }
      });
    } else if (newname === "password") {
      const validation = regex.password.test(value);
      e.target.addEventListener("blur", () => {
        if (validation) {
          e.target.classList.remove("invalid");
          setValidForm(true);
        } else if (e.target.value === "") {
          e.target.classList.remove("invalid");
        } else {
          e.target.classList.add("invalid");
        }
      });
    } else if (newname === "mobile") {
      const validation = regex.mobile.test(value);
      e.target.addEventListener("blur", () => {
        if (validation) {
          e.target.classList.remove("invalid");
          setValidForm(true);
        } else if (e.target.value === "") {
          e.target.classList.remove("invalid");
        } else {
          e.target.classList.add("invalid");
        }
      });
    } else if (newname === "address") {
      const validation = regex.address.test(value);
      e.target.addEventListener("blur", () => {
        if (validation) {
          e.target.classList.remove("invalid");
          setValidForm(true);
        } else if (e.target.value === "") {
          e.target.classList.remove("invalid");
        } else {
          e.target.classList.add("invalid");
        }
      });
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    let nname = document.getElementById("newName").value;
    let password = document.getElementById("newPW").value;
    let address = document.getElementById("newAddress").value;
    let email = document.getElementById("newEmail").value;
    let mobile = document.getElementById("newMobile").value;
    if (validForm) {
      if (name === "Manager") {
        const newManager = {
          requested_manager_Name: nname,
          requested_manager_Email: email,
          password: password,
          mobile_No: mobile,
          address: address,
        };
        managerSignup(newManager);
      } else if (name === "User") {
        let manager = document.getElementById("choose-manager").value;
        const newUser = {
          requested_user_Name: nname,
          manager: manager,
          requested_user_Email: email,
          password: password,
          mobile_No: mobile,
          address: address,
        };
        userSignup(newUser);
      }
    } else {
      console.log("not a valid form");
    }
  };

  return (
    <>
      <section>
        <div className="signup-section container">
          <div className="signup-form">
            <div className="login-form-header">
              <h3>Sign-Up as {name}</h3>
            </div>
            <div className="line"></div>
            <form
              onSubmit={handleSignup}
              onChange={onChange}
              className="signup-form-main"
            >
              <div className="d-flex flex-row ">
                <div>
                  <div>
                    <label htmlFor="signup-email-address">Name</label>
                    <input
                      id="newName"
                      name="name"
                      type="text"
                      placeholder="Enter Name here"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-email-address">Email ID</label>
                    <input
                      id="newEmail"
                      name="email"
                      type="text"
                      placeholder="Enter valid email address here"
                      required
                    />
                  </div>
                  {name === "User" && (
                    <div>
                      <label htmlFor="signup-email-address">
                        Choose a manager
                      </label>
                      <select name="manager" id="choose-manager">
                        {managersList.map((element) => {
                          return (
                            <option value={element._id}>
                              {element.manager_Name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                  <div>
                    <label htmlFor="signup-password">Password</label>
                    <input
                      id="newPW"
                      name="password"
                      type="text"
                      placeholder="Enter password here "
                      required
                    />
                  </div>
                </div>
                <div>
                  <div className="mx-5">
                    <label htmlFor="signup-email-address">Mobile No</label>
                    <input
                      id="newMobile"
                      name="mobile"
                      type="text"
                      placeholder="Enter your mobile here"
                      required
                    />
                  </div>
                  <div className="mx-5">
                    <label htmlFor="signup-email-address">Address</label>
                    <textarea
                      id="newAddress"
                      name="address"
                      rows="2"
                      type="text"
                      placeholder="Enter your address here"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="btns">
                <button className="login-btn m-3" type="submit">
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

export default Signup;
