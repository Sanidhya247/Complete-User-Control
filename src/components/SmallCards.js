import React from "react";
import { useSelector } from "react-redux";

const SmallCards = (props) => {
  const { data } = props;
  const { administrator } = useSelector((state) => state.main);
  return (
    <li className="list-group-item">
      {administrator === "user" ? (
        <p>
          <strong> Name :</strong> {data.manager_Name}
          <br />
          <strong> Email :</strong>
          {data.manager_Email} <br /> <strong> Phone :</strong> {data.mobile_No}{" "}
        </p>
      ) : (
        `${data.user_Name}`
      )}
    </li>
  );
};

export default SmallCards;
