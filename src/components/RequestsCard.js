import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

const RequestsCard = (props) => {
  const { data, deleteRequest, addRequest , index } = props;
  const dispatch = useDispatch();
  const {showAlert} = bindActionCreators(actionCreators , dispatch)
  
  let {name , email , mobile} = data
  return (
    <tr>
      <th scope="row">{index+1}</th>
      <td>{name}</td>
      <td>{email}</td>
      <td>{mobile}</td>
      <td>
        <button className="table-btn" onClick={() => addRequest(data)}>
          <i className="fa fa-duotone fa-check-double"></i>
        </button>
      </td>
      <td>
        <button
          className="table-btn"
          onClick={() => {
            showAlert('success' , 'Deleted successfully')
            deleteRequest(data);
          }}
        >
          <i className="fa fa-solid fa-xmark"></i>
        </button>
      </td>
    </tr>
  );
};

export default RequestsCard;
