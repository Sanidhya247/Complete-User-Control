import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";
import Breadcrumb from "./Breadcrumb";
import RequestsCard from "./RequestsCard";

const Requests = () => {
  const dispatch = useDispatch();
  const { fetchRequests, showAlert } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const { administrator } = useSelector((state) => state.main);
  const { requests } = useSelector((state) => state.request);
  const navigate = useNavigate();

  useEffect(() => {
    if (administrator === "admin" || administrator === "manager") {
      fetchRequests(administrator);
    }
    if (!administrator || administrator === null) {
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
    if(data.role === 'manager'){
      const deleteRequest = {
        query: `query{
          deleteManagerRequest(id:"${id}"){
            name
          }
        }`,
      };
      const response = await fetch(`http://localhost:5000/graphql`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(deleteRequest),
      });
      const json = await response.json();
      console.log(json);
      if (!json.errors) {
        return fetchRequests(administrator);
      } else {
        return showAlert(
          "danger",
          "There might be some error ! Please try again later"
        );
      }
    }else if(data.role  === 'user'){
      const deleteRequest = {
        query: `query{
          deleteUserRequest(id:"${id}"){
            name
          }
        }`,
      };
      const response = await fetch(`http://localhost:5000/graphql`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(deleteRequest),
      });
      const json = await response.json();
      console.log(json);
      if (!json.errors) {
        return fetchRequests(administrator);
      } else {
        return showAlert(
          "danger",
          "There might be some error ! Please try again later"
        );
      }
    } 
  };
  const addRequest = async (data) => {
    const token = localStorage.getItem("authToken");
    let newRequest = {
      query: `
      mutation{
        signupManager(signupManagerInput:{name:"${data.name}"  , email:"${data.email}", mobile:"${data.mobile}" , address:"${data.address}" , password:"${data.password}"}){
          name
          email
          mobile
          address
        }
      }
      `,
    };
    if (data.role === "manager") {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(newRequest),
      });
      const json = await response.json();
      console.log(json);
      if (!json.errors) {
        showAlert("success", "Request added successfully...");
        return deleteRequest(data);
      } else {
        return showAlert("danger", "Email already exists ");
      }
    } else if (data.role === "user") {
      console.log(data.manager._id);
      let newRequest = {
        query: `
        mutation{
          signupUser(signupUserInput:{name:"${data.name}" ,manager:"${data.manager._id}" , email:"${data.email}", mobile:"${data.mobile}" , address:"${data.address}" , password:"${data.password}"}){
            name
            email
            mobile
            address
            manager{
              name
              _id
            }
          }
        }
        `,
      };
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(newRequest),
      });
      const json = await response.json();
console.log(json)
      if (!json.errors) {
        showAlert("success", "Request added successfully...");
        deleteRequest(data);
      } else {
        showAlert("danger", "There might be some error");
      }
    }
  };
  return (
    <>
 <Breadcrumb/>
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
                  requests.map((element, index) => {
                    return (
                      <RequestsCard
                        index={index}
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
