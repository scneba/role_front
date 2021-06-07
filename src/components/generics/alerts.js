import { toast } from "react-toastify";
import i18next from "i18next";
//Show a popup for react toastify
export function showPopup(
  message,
  type,
  position = "top-right",
  closeTimeMillis = 5000,
) {
  let toaster;
  switch (type) {
    case "success":
      toaster = toast.success;
      break;
    case "info":
      toaster = toast.info;
      break;
    case "warning":
      toaster = toast.warn;
      break;
    case "dark":
      toaster = toast.dark;
      break;
    default:
      toaster = toast.error;
      break;
  }
  const notify = () =>
    toaster(message, {
      position: position,
      autoClose: closeTimeMillis,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      bodyClassName: "text-center",
    });
  notify();
}

/**
 * getHTTPErrorMessage
 * Given an error from an axios request, get the error messages
 */
export function getHTTPErrorMessage(err) {
  const httpResponse = err.response;
  //if no message, show internal server error
  if (!httpResponse) {
    return i18next.t("shared:internalError");
  }
  switch (httpResponse.status) {
    case 401:
      return i18next.t("shared:unauthorized");
    case 500:
      return i18next.t("shared:internalError");
    case 400:
      const errors = httpResponse.data.errors;
      return decodeErrors(errors);
    default:
      return i18next.t("shared:unknownError");
  }
}
//Get all errors from an array of errors into html list elts
function decodeErrors(errData) {
  let errorBuffer = []; //holds the errors in the jsx
  errorBuffer.push(i18next.t("shared:requestFailedwithErrors"));

  //check if the object is an array
  if (isIterable(errData)) {
    for (let err of errData) {
      if (err.err_code) {
        addErrors(
          errorBuffer,
          i18next.t("errors:" + err.err_code, { data: err.data }),
        );
      } else {
        //if error is unknown, return a string which can be displayed
        addErrors(
          errorBuffer,
          typeof err === "string" ? err : JSON.stringify(err),
        );
      }
    }
  } else {
    addErrors(
      errorBuffer,
      i18next.t("hared:requestFailedwithErrors") + JSON.stringify(errData),
    );
  }
  return errorBuffer;
}
//add a list error to an array of errors
function addErrors(errorBuffer, error) {
  errorBuffer.push(<li key={error}>{error}</li>);
}

//check if an object is iteratable
function isIterable(value) {
  return Symbol.iterator in Object(value);
}

//show errors or set the errors state
export function showErrors(err, setErrors) {
  let errorBuffer = getHTTPErrorMessage(err);
  if (Array.isArray(errorBuffer)) {
    setErrors(errorBuffer);
  } else {
    showPopup(errorBuffer, "error");
  }
}
//Show errors pop up, array or string alike
export function showErrorsPopUp(err, setErrors) {
  let errorBuffer = getHTTPErrorMessage(err);
  if (Array.isArray(errorBuffer)) {
    showPopup(errorBuffer.join(" "), "error");
  } else {
    showPopup(errorBuffer, "error");
  }
}
