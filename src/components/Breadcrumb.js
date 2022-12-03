import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

const Breadcrumb = () => {
  const navigate = useNavigate();
  const { administrator } = useSelector((state) => state.main);
  const { totalRequest } = useSelector((state) => state.request);
  const dispatch = useDispatch();
  const { fetchRequests } = bindActionCreators(actionCreators, dispatch);

  useEffect(() => {
    if (administrator === "admin" || administrator==='manager') {
      fetchRequests(administrator);
    }
    //eslint-disable-next-line
  }, []);
  const logOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div>
      <ul className="breadcrumb nav  justify-content-between ">
        <div className="d-flex">
          <li className="nav-item">
            <Link className="nav-link  active" to="/home">
              Home
            </Link>
          </li>
          {administrator !== "user" ? (
            <li className="nav-item">
              <Link
                type="button"
                to="/requests"
                className="nav-link  position-relative"
              >
                Requests
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalRequest}+
                  <span className="visually-hidden">unread messages</span>
                </span>
              </Link>
            </li>
          ) : (
            ""
          )}
        </div>
        <div className="nav-right ">
          <div className="d-flex ">
            <div>
              <button className="log-btn">{administrator}</button>
            </div>
            <div>
              <button className="log-btn" onClick={logOut}>
                Log-Out
              </button>
            </div>
          </div>
        </div>
      </ul>
    </div>
  );
};

export default Breadcrumb;
