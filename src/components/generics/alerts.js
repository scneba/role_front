import { toast } from "react-toastify";
//showPopup shows a react-toastify popup
export function showPopup(message, type, position = "top-right") {
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
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      bodyClassName: "text-center",
    });
  notify();
}
