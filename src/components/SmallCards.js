import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const SmallCards = (props) => {
  const { data } = props;
  const { administrator } = useSelector((state) => state.main);
  let newData;
  // useEffect(()=>{
  //   if (administrator === "user") {
  //     newData = data.reduce((name) => name.manager);
  //     console.log(newData.manager);
  //   }
  // },[])
  console.log(data)
  

  return (
    <li className="list-group-item">
      {administrator === "user"? (
        <p>
          <strong> Name :</strong> {data.name}
          <br />
          <strong> Email :</strong>
          {data.email} <br /> <strong> Phone :</strong>{" "}
          {data.mobile}{" "}
        </p>
      ): data.name}
      
    </li>
  );
};

export default SmallCards;
