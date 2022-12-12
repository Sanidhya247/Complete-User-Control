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
    const requestBody ={
      query:`
      query{
        Login(email:"${data.email}" , password:"${data.password}"){
          token
          _id
          administrator
        }
      }
      `
    }
    try {
      let response = await fetch(
        "http://localhost:5000/graphql",
        {
          headers: { "Content-type": "application/json" },
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );
      let json = await response.json();
       detail = json.detail;
      if (!json.errors) {
        localStorage.setItem("admin", json.data.Login.administrator);
        localStorage.setItem("authToken", json.data.Login.token);
        localStorage.setItem("administrator", json.data.Login._id);
        administrator = json.data.Login.administrator;
        dispatch({
          type: LOGIN,
          payload: { administrator, detail },
        });
      } else {
        administrator = null;
        localStorage.removeItem("administrator");
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
      let response = await fetch(
        "http://localhost:5000/graphql",
        {
          headers: { "Content-type": "application/json" },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      let json = await response.json();
      console.log(json);
      if(!json.errors){
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
        "http://localhost:5000/graphql",
        {
          headers: { "Content-type": "application/json" },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const json = await response.json();
      
      if(!json.errors){
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
    let updatedManager = {
      query : `
      mutation{
        editManager(editManagerInput:{_id:"${id}" , name:"${data.name}" , address:"${data.address}" , email :"${data.email}" , mobile:"${data.mobile}"}){
          name
          email
          mobile
          address
          _id
        }
      }
      `
    };
   
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch( 
        `http://localhost:5000/graphql`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            'Authorization': `${token}`,
          },
          body: JSON.stringify(updatedManager),
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
    const requestBody = {
      query:`
      query{
        allRequestedManagers{
          name
          mobile
          _id
          address
          email
          role
          password
        }
      }
      `
    }
    return async (dispatch) => {
      let token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/graphql",
        {
          method: "POST",
          headers: { 'Content-type': `application/json` },
          body:JSON.stringify(requestBody)
        }
      );
      const json = await response.json();
      const data =json.data.allRequestedManagers;
      const length = json.data.allRequestedManagers.length;
      dispatch({
        type: FETCH_MANAGER_REQUESTS,
        payload: { data, length },
      });
    };
  } else if (administrator === "manager") {
    const requestBody = {
      query:`
      query{
        allRequestedUsers{
          name
          mobile
          _id
          address
          email
          role
          password
          manager{
            _id
          }
        }
      }
      `
    }
    const managerId = localStorage.getItem('administrator');

    return async (dispatch) => {
      let token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/graphql",
        {
          method: "POST",
          headers: { 'Content-type' : 'application/json'},
          body : JSON.stringify(requestBody)
        }
      );
      const json = await response.json();
      const data = json.data.allRequestedUsers;
      const filteredData =  Array.from(data).filter((element)=>element.manager._id === managerId)
      const length = filteredData.length;
      dispatch({
        type: FETCH_USER_REQUESTS,
        payload: { filteredData, length },
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
