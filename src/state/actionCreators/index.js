import {
  LOGIN,
  LOGIN_FAILED,
  MANAGER_SIGNUP,
  MANAGER_SIGNUP_FAILED,
  USER_SIGNUP_FAILED,
  MANAGER_EDIT_FAILED,
  USER_EDIT,
  USER_SIGNUP,
  MANAGER_EDIT,
  FETCH_USER_REQUESTS,
  FETCH_MANAGER_REQUESTS,
  DELETE_MANAGER_REQUEST,
  DELETE_USER_REQUEST,
  SHOW_ALERT,
  USER_EDIT_FAILED,
} from "../type";


export const Login = (data) => {
  return async (dispatch) => {
    let administrator;
    let detail ;
    try {
      let response = await fetch(
        "http://localhost:5000/user-control/api/auth/login",
        {
          headers: { "Content-type": "application/json" },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      let json = await response.json();
       detail = json.detail;
      if (json.administrator) {
        localStorage.setItem("admin", json.administrator);
        localStorage.setItem("authToken", json.authToken);
        administrator = json.administrator;
        dispatch({
          type: LOGIN,
          payload: { administrator, detail },
        });
      } else {
        administrator = null;
        localStorage.removeItem("admin");
        localStorage.removeItem("authToken");
        dispatch({
          type: LOGIN_FAILED,
          payload:{administrator , json },
        });
      }
    } catch (error) {
     
      console.error(error);
    }
  };
};

export const managerSignup = (data) => {
  return async (dispatch) => {
    try {
      let success;
      let response = await fetch(
        "http://localhost:5000/user-control/api/request/signup/manager",
        {
          headers: { "Content-type": "application/json" },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      let json = await response.json();
      console.log(json);
      if(!json.error){
        dispatch({
          type: MANAGER_SIGNUP,
          payload: true,
        });
      }
      else{
        dispatch({
          type: MANAGER_SIGNUP_FAILED,
          payload: json,
        });
      }  
    } catch (error) {
      console.error(error);
    }
  };
};

export const userSignup = (data) => {
  return async (dispatch) => {
    try {
      let administrator;
      let response = await fetch(
        "http://localhost:5000/user-control/api/request/signup/user",
        {
          headers: { "Content-type": "application/json" },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const json = await response.json();
      console.log(!json.error)
      if(!json.error){
        dispatch({
          type: USER_SIGNUP,
          payload: administrator,
        });
      }else {
        dispatch({
          type: USER_SIGNUP_FAILED,
          payload: {administrator, json },
        });
      }
      
    } catch (error) {
      console.error(error);
    }
  };
};

export const editDetailUser = (id, data) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("authToken");
      let response = await fetch(
        `http://localhost:5000/user-control/api/update/user/${id}`,
        {
          headers: {
            "Content-type": "application/json",
            authToken: `${token}`,
          },
          method: "PUT",
          body: JSON.stringify(data),
        }
      );
      const detail = await response.json();
      if(!detail.error){
        dispatch({
          type: USER_EDIT,
          payload: detail,
        });
      }else{
        dispatch({
          type: USER_EDIT_FAILED,
          payload: {detail},
        })
      }
      
    } catch (error) {
      console.error(error);
    }
  };
};

export const editDetailManager = (id, data) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("authToken");
      let response = await fetch(
        `http://localhost:5000/user-control/api/update/manager/${id}`,
        {
          headers: {
            "Content-type": "application/json",
            authToken: `${token}`,
          },
          method: "PUT",
          body: JSON.stringify(data),
        }
      );
      const detail = await response.json();
      console.log(detail);
      if(!detail.error){
        dispatch({
          type: MANAGER_EDIT,
          payload: detail,
        });
      }else{
        dispatch({
          type: MANAGER_EDIT_FAILED,
          payload: {detail},
        })
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchRequests = (administrator) => {
  if (administrator === "admin") {
    return async (dispatch) => {
      let token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/user-control/api/fetch/requestedmanagers",
        {
          method: "GET",
          headers: { authToken: `${token}` },
        }
      );
      const data = await response.json();
      const length = data.length;
      dispatch({
        type: FETCH_MANAGER_REQUESTS,
        payload: { data, length },
      });
    };
  } else if (administrator === "manager") {
    return async (dispatch) => {
      let token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/user-control/api/fetch/requestedusers",
        {
          method: "GET",
          headers: { authToken: `${token}` },
        }
      );
      const data = await response.json();
      const length = data.length;
      dispatch({
        type: FETCH_USER_REQUESTS,
        payload: { data, length },
      });
    };
  }
};

// export const deleteRequest = (data) => {
//   const token = localStorage.getItem("authToken");
//   const id = data._id;
//   if (data.role === "manager") {
//     return async (dispatch) => {
//       const response = await fetch(
//         `http://localhost:5000/user-control/api/delete/request/manager/${id}`,
//         {
//           method: "DELETE",
//           headers: { authToken: `${token}` },
//         }
//       );
//       const data = await response.json();
//       dispatch({
//         type: DELETE_MANAGER_REQUEST,
//         payload: { data },
//       });
//     };
//   } else if (data.role === "user") {
//     return async (dispatch) => {
//       const response = await fetch(
//         `http://localhost:5000/user-control/api/delete/request/user/${id}`,
//         {
//           method: "DELETE",
//           headers: { authToken: `${token}` },
//         }
//       );
//       const data = await response.json();
//       dispatch({
//         type: DELETE_USER_REQUEST,
//         payload: { data },
//       });
//     };
//   }
// };

export const showAlert = (type, message) => {
    return (dispatch) => {
      dispatch({
        type: SHOW_ALERT,
        payload : {type , message}
      });
    };
  };
