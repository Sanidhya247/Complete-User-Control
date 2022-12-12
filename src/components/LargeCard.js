import React from "react";
import { useSelector } from "react-redux";

const LargeCard = (props) => {
  const { administrator } = useSelector((state) => state.main);
  const { data, openEditView, Del } = props;
  let name, email, mobile, address;
  let role = data.role;
  name = data.name;
  email = data.email
  mobile = data.mobile;
  address = data.address;

  // if (administrator === "admin") {
  //   name = data.manager_Name;
  //   email = data.manager_Email;
  // } else if (administrator === "manager") {
  //   name = data.user_Name;
  //   email = data.user_Email;
  //   mobile = data.mobile_No;
  //   address = data.address;
  // }
  // else if (administrator === "user") {
  //   name = data.user_Name;
  //   email = data.user_Email;
  //   mobile = data.mobile_No;
  //   address = data.address;
  // }

  const fillEditView = async () => {
    openEditView(data);

    document.getElementById("edit-name").value = name;
    document.getElementById("edit-email").value = email;
    document.getElementById("edit-mobile").value = mobile;
    document.getElementById("edit-address").value = address;
  };

  return (
    <div className="col-sm-6 ">
      <div className="card my-2">
        <div className="card-body">
          <h5 className="card-title">
            <strong>Name : </strong>
            {name}
          </h5>
          <p className="card-text">From : {address}</p>
          <p className="card-text">Mail : {email}</p>
          <p className="card-text">Call At : {mobile}</p>
          {administrator !== "user" ? (
            <div className="d-flex">
              <p className="btn btn-primary mx-1" onClick={fillEditView}>
                EDIT
              </p>
              <p className="btn btn-primary mx-1" onClick={() => Del(data._id)}>
                DELETE
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default LargeCard;
