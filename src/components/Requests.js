import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";
import Breadcrumb from "./Breadcrumb";
import RequestsCard from "./RequestsCard";

const Requests = () => {
  const dispatch = useDispatch();
  const { fetchRequests , showAlert } = bindActionCreators(actionCreators, dispatch);
  const { administrator } = useSelector((state) => state.main);
  const { requests } = useSelector((state) => state.request);
  const navigate = useNavigate();
  

  useEffect(() => {
    if (administrator === "admin" || administrator === "manager") {
      fetchRequests(administrator);
    }
    if (!administrator || administrator===null) {
      localStorage.removeItem("admin");
      localStorage.removeItem("authToken");
      navigate("/");
    }
    //eslint-disable-next-line
  }, []);

  const deleteRequest = async (data) => {
    const id = data._id;
    const role = data.role;
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `http://localhost:5000/user-control/api/delete/request/${role}/${id}`,
      {
        method: "DELETE",
        headers: { authToken: `${token}` },
      }
    );
    const json = await response.json();
    if (!json.error) {
     
      fetchRequests(administrator);
    }else{
      showAlert('danger' , 'There might be some error ! Please try again later')
    }
  };

  const addRequest = async (data) => {
    const token = localStorage.getItem("authToken");
    let newUser = {
      user_Name: data.requested_user_Name,
      user_Email: data.requested_user_Email,
      password: data.password,
      mobile_No: data.mobile_No,
      address: data.address,
      manager: data.manager,
    };
    let newManager = {
      manager_Name: data.requested_manager_Name,
      manager_Email: data.requested_manager_Email,
      password: data.password,
      mobile_No: data.mobile_No,
      address: data.address,
      manager: data.manager,
    };
    if (data.role === "manager") {
      const response = await fetch(
        "http://localhost:5000/user-control/api/signup/manager",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            authToken: `${token}`,
          },
          body: JSON.stringify(newManager),
        }
      );
      const json = await response.json();
      if (!json.error) {
        showAlert('success' , 'Request added successfully...')
        deleteRequest(data);
      }else {
        showAlert('danger' , 'There might be some error ')
      }
    } 
    else if (data.role === "user") {
      const response = await fetch(
        "http://localhost:5000/user-control/api/signup/user",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            authToken: `${token}`,
          },
          body: JSON.stringify(newUser),
        }
      );
      const json = await response.json();
      if (!json.error) {
        showAlert('success' , 'Request added successfully...')
        deleteRequest(data);
      }else{
        showAlert('danger' , 'There might be some error');
      }
    }
  };
  return (
    <>
      <Breadcrumb />
      <div className="section container ">
        <section className="requests-section">
          <div className="requests-section-header">
            <h2> Requests of Managers and user </h2>
          </div>
          <div className="line"></div>
          <div className="requests-section-content">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Mobile No</th>
                  <th scope="col">Approve</th>
                  <th scope="col">Refuse</th>
                </tr>
              </thead>
              <tbody>
                {requests &&
                  requests.map((element) => {
                    return (
                      <RequestsCard
                        addRequest={addRequest}
                        deleteRequest={deleteRequest}
                        data={element}
                      />
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
};

export default Requests;
