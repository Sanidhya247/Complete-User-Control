import {
  LOGIN,
  LOGIN_FAILED,
  MANAGER_EDIT,
  MANAGER_SIGNUP,
  MANAGER_SIGNUP_FAILED,
  MANAGER_EDIT_FAILED,
  SHOW_ALERT,
  USER_EDIT,
  USER_EDIT_FAILED,
  USER_SIGNUP,
  USER_SIGNUP_FAILED,
} from "../type";

const showAlert = (type, message) => {
  let alertClass = document.querySelector(".alert-div");
  alertClass.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <strong>${message}</strong> 
        </button>
      </div>`;
  setTimeout(() => {
    alertClass.innerHTML = "";
  }, 2000);
};

let initial = {
  administrator: null,
  detail: null,
  process: 0,
  success: false,
};



const mainReducer = (state = initial, action) => {
  switch (action.type) {
    case LOGIN:
      showAlert("success", "Login successfully.");
      return {
        ...state,
        administrator: action.payload.administrator,
        detail: action.payload.detail,
      };
    case LOGIN_FAILED:
      showAlert("danger", action.payload.json.message);
      return {
        ...state,
        administrator: action.payload.administrator,
        detail: action.payload.json.message,
      };

    case MANAGER_SIGNUP:
      showAlert("success", "Your request has been sent to admin");
      return {
        ...state,
        success: action.payload,
      };
    case MANAGER_SIGNUP_FAILED:
      const { error } = action.payload;
      if (error.code === 11000) {
        showAlert("danger", "Email already exists !");
      } else {
        showAlert("danger", "Try to enter proper details");
      }
      return {
        ...state,
        detail: action.payload,
      };
    case USER_SIGNUP:
      showAlert("success", "Your request has been sent to selected manager");
      return {
        ...state,
        success: action.payload,
      };
    case USER_SIGNUP_FAILED:
      const { json } = action.payload;
      if (json.errors) {
        showAlert("danger", "Email already exists");
      } else {
        showAlert(
          "danger",
          "There might be some error ! Please try to enter proper details"
        );
      }
      return { ...state, success: action.payload };
    case USER_EDIT:
      showAlert("success", "Details edited successfully");
      return { ...state, detail: action.payload };
    case USER_EDIT_FAILED:
      showAlert("danger", "Try to enter proper details");
      return { ...state, detail: action.payload };
    case MANAGER_EDIT:
      showAlert("success", "Details edited successfully");
      return { ...state, detail: action.payload };
    case MANAGER_EDIT_FAILED:
      showAlert("danger", "Try to enter proper details");
      return { ...state, detail: action.payload };
    case SHOW_ALERT:
      const {type , message} = action.payload
      showAlert(type , message)
      return {...state  } 
     
    default:
      return state;
  }
};

export default mainReducer;
