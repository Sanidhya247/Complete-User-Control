import { type } from "@testing-library/user-event/dist/type";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

import Breadcrumb from "./Breadcrumb";
import LargeCard from "./LargeCard";
import SmallCards from "./SmallCards";

const Home = () => {
  const dispatch = useDispatch();
  const { editDetailUser, editDetailManager, showAlert } = bindActionCreators(
    actionCreators,
    dispatch
  );
  let { administrator, detail } = useSelector((state) => state.main);
  const ref = useRef();
  let navigate = useNavigate();
  let token = localStorage.getItem("authToken");
  if (!administrator) {
    navigate("/");
  }

  useEffect(() => {
    if (administrator === "manager") {
      document.body.style.background = "#cad2c5";
      document.querySelector(".nav").style.background = "#2f3e46";
      document.querySelector(".list-1").style.background = "#84a98c";
      document.querySelector(".list-2").style.background = "#52796f";
    } else if (administrator === "admin") {
      document.body.style.background = "#4f5d75";
      document.querySelector(".nav").style.background = "#2d3142";
      document.querySelector(".list-1").style.background = "#bfc0c0";
      document.querySelector(".list-2").style.background = "#bfc0c0";
    }
    //eslint-disable-next-line
  }, []);

  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalManagers, setTotalManagers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState();
  ////////////////////////////////////////////////////////////////

  const CountManagers = async () => {
    if (administrator === "admin") {
      const requestBody = {
        query: `query{
          managers{
            _id
            name
            email
            address
            mobile
            _id
            role
  
          }
        }
        `,
      };

      let token = localStorage.getItem("authToken");
      if (administrator !== "manager") {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: { "Content-type": "application/json" },
        });
        const json = await response.json();
        setTotalManagers(json.data.managers.length);
        setManagers(json.data.managers);
      }
    } else if (administrator === "user") {
      const requestBody = {
        query: `query{
          users{
            _id
           manager{
            name
            mobile
            email
           }
  
          }
        }
        `,
      };
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-type": "application/json" },
      });
      const json = await response.json();
      let id = localStorage.getItem("administrator");
      const { data } = json;
      const { users } = data;
      let manager = Array.from(users)
      .filter((element) => (element._id===id)).map((element)=>element.manager)
      setManagers(manager[0]);
    } else {
      return;
    }
  };

  ////////////////////////////////////////////////////////////////

  const CountUsers = async () => {
    let id = localStorage.getItem("administrator");
    let requestBody;
    if (administrator === "manager") {
      requestBody = {
        query: `query{
          myusers(id:"${id}"){
            name
            email
            address
            mobile
            _id
            role
          }
        }
        `,
      };
    } else {
      requestBody = {
        query: `query{
          users{
            name
            email 
            mobile
            address
          }
        }
        `,
      };
    }

    let token = localStorage.getItem("authToken");
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: { "Content-type": `application/json` },
      body: JSON.stringify(requestBody),
    });
    const json = await response.json();

    {
      administrator === "manager"
        ? setTotalUsers(json.data.myusers.length)
        : setTotalUsers(json.data.users.length);
    }
    {
      administrator === "manager"
        ? setUsers(json.data.myusers)
        : setUsers(json.data.users);
    }
  };

  ////////////////////////////////////////////////////////////////
  const CountAdmins = async () => {
    const requestBody = {
      query: `query{
        admins{
          name
        }
      }
      `,
    };
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: { "Content-type": `application/json` },
      body: JSON.stringify(requestBody),
    });
    const json = await response.json();
    setTotalAdmins(json.data.admins.length);
  };
  useEffect(() => {
    CountAdmins();
    if (administrator === "admin" || administrator === "user") {
      CountManagers();
    }
    CountUsers();
    //eslint-disable-next-line
  }, []);

  ////////////////////////////////////////////////////////////////

  const openEditView = (data1) => {
    ref.current.click();
    setData(data1);
  };

  ////////////////////////////////////////////////////////////////

  const updateFinal = async () => {
    const id = data._id;
    const token = localStorage.getItem("authToken");
    let name = document.getElementById("edit-name").value;
    let email = document.getElementById("edit-email").value;
    let address = document.getElementById("edit-address").value;
    let mobile = document.getElementById("edit-mobile").value;

    ref.current.click();
    if (data.role === "manager") {
      let updatedManager = {
        query: `
        mutation{
          editManager(editManagerInput:{_id:"${id}" , name:"${name}" , address:"${address}" , email :"${email}" , mobile:"${mobile}"}){
            name
            email
            mobile
            address
            _id
          }
        }
        `,
      };
      console.log(data);
      const response = await fetch(`http://localhost:5000/graphql`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(updatedManager),
      });
      const json = await response.json();
      CountManagers();
      ref.current.click();
      showAlert("success", "edited successfully");
    } else if (data.role === "user") {
      let updatedUser = {
        query: `
        mutation{
          editUser(editUserInput:{_id:"${id}" , name:"${name}" , address:"${address}" , email :"${email}" , mobile:"${mobile}"}){
            name
            email
            mobile
            address
            _id
          }
        }
        `,
      };
      const response = await fetch(`http://localhost:5000/graphql`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
      const json = await response.json();
      ref.current.click();
      if (!json.errors) {
        showAlert("success", "edited successfully");
        CountUsers();
      } else {
        showAlert("danger", "There might be some error ! Try again later");
      }
    }
  };

  ////////////////////////////////////////////////////////////
  const Del = async (id) => {
    const token = localStorage.getItem("authToken");
    const deleteManager = {
      query: `
      query{
      deleteManager(id:"${id}"){
      name
      address
    }
  }
  `,
    };
    if (administrator === "admin") {
      const response = await fetch(`http://localhost:5000/graphql`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(deleteManager),
      });
      const json = await response.json();
      console.log(json);
      if (!json.errors) {
        showAlert("success", "Deleted successfully");
        CountManagers();
        CountUsers();
      } else {
        showAlert(
          "danger",
          "There might be some error ! Please try again later"
        );
      }
    } else if (administrator === "manager") {
      const deleteUser = {
        query: `query{
                deleteUser(id:"${id}"){
                name
              }
            }`,
      };
      const response = await fetch(`http://localhost:5000/graphql`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(deleteUser),
      });
      const json = await response.json();
      if (!json.errors) {
        showAlert("success", "Deleted successfully");
        CountUsers();
      } else {
        showAlert(
          "danger",
          "There might be some error ! Please try again later"
        );
      }
    }
  };
  return (
    <>
      <Breadcrumb />
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
                Edit
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label htmlFor="recipient-name" className="col-form-label">
                  Name
                </label>
                <input type="text" className="form-control" id="edit-name" />
              </div>
              <div className="mb-2">
                <label htmlFor="recipient-name" className="col-form-label">
                  Admin E-Mail
                </label>
                <input type="email" className="form-control" id="edit-email" />
              </div>
              <div className="mb-2">
                <label htmlFor="recipient-name" className="col-form-label">
                  address
                </label>
                <input type="text" className="form-control" id="edit-address" />
              </div>
              <div className="mb-2">
                <label htmlFor="recipient-name" className="col-form-label">
                  Mobile No
                </label>
                <input type="text" className="form-control" id="edit-mobile" />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={updateFinal}
                className="btn btn-info"
              >
                UPDATE
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className="container section">
        <div className="home">
          <div className="home-header">
            <h1>Welcome!</h1>
          </div>
          <div className="home-content">
            {administrator === "admin" && (
              <div className="totals d-flex">
                <div className="total-admins ">
                  <div className="circle-total">
                    {totalAdmins < 9 ? "0" + totalAdmins : totalAdmins}
                  </div>
                  <div>Admins</div>
                </div>
                <div className="total-managers">
                  <div className="circle-total">
                    {totalManagers < 9 ? "0" + totalManagers : totalManagers}
                  </div>
                  <div>Managers</div>
                </div>
                <div className="total-users">
                  <div className="circle-total">
                    {totalUsers < 9 ? "0" + totalUsers : totalUsers}
                  </div>
                  <div>Users</div>
                </div>
              </div>
            )}

            <div className="line"></div>
            {/* {administrator !== "admin" && administrator && (
              <div class="card">
                <div class="card-header">My Profile</div>

                <div class="card-body">
                  <h5 class="card-title">
                    Name : {detail[`${administrator}_Name`]}
                  </h5>
                  <p class="card-text">
                    Mail : {detail[`${administrator}_Email`]}
                  </p>
                  {detail.mobile_No && detail.address ? (
                    <p class="card-text">Mobile :{detail.mobile_No}</p>
                  ) : null}
                  {detail.address ? (
                    <p class="card-text">Address :{detail.address}</p>
                  ) : null}
                  {/* eslint-disable-next-line */}
            {/* <a
                    class="btn btn-primary"
                    onClick={() => {
                      document.getElementById("edit-name").value =
                        detail.manager_Name ||
                        detail.user_Name ||
                        detail.admin_Name;
                      document.getElementById("edit-email").value =
                        detail.manager_Email ||
                        detail.user_Email ||
                        detail.admin_Email;
                      document.getElementById("edit-mobile").value =
                        detail.mobile_No;
                      document.getElementById("edit-address").value =
                        detail.address;
                      openEditView(detail);
                    }}
                  >
                    Edit Profile
                  </a>
                </div>
              </div>
            {/* )} */}
            <div className="line"></div>
            <h1>
              Lists of the {administrator === "admin" ? "managers" : "users"}
            </h1>
            <div className="line"></div>

            <div className="lists d-flex">
              <div className="list-1 ">
                <div className="list-1-title">
                  <h2>
                    <strong>
                      {administrator === "admin" ? "Managers" : "Users"}
                    </strong>
                  </h2>
                </div>
                <div className="list-1-content">
                  <div className="row">
                    {administrator === "admin" &&
                      managers.map((element) => {
                        return (
                          <LargeCard
                            Del={Del}
                            openEditView={openEditView}
                            data={element}
                          />
                        );
                      })}
                    {administrator === "manager" &&
                      users.map((element) => {
                        return (
                          <LargeCard
                            Del={Del}
                            openEditView={openEditView}
                            data={element}
                          />
                        );
                      })}
                    {administrator === "user" &&
                      users.map((element) => {
                        return (
                          <LargeCard
                            Del={Del}
                            openEditView={openEditView}
                            data={element}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className="list-2 mx-2 ">
                <div className="list-2-title">
                  <h2>
                    <strong>
                      {administrator !== "user" ? "Users" : "Your Manager"}
                    </strong>
                  </h2>
                </div>
                <div className="list-2-content">
                  {administrator !== "user" ? (
                    <ul className="list-group list-group-flush table table-striped">
                      {users.map((element) => {
                        return <SmallCards data={element} />;
                      })}
                    </ul>
                  ) : (
                    ""
                  )}
                  {administrator === "user" ? (
                    <ul className="list-group list-group-flush table table-striped">
                      {<SmallCards data={managers} />}
                    </ul>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
