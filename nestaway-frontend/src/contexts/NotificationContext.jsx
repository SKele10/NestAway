import { createContext, useRef } from "react";
import { Toast } from "primereact/toast";
import PropTypes from "prop-types";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const toastRef = useRef(null);

  /**
   * Display a toast notification.
   * @param {string} severity - The severity level of the notification (e.g., "info", "success", "warn", "error").
   * @param {string} label - The label or title of the notification.
   * @param {string} detail - Additional details or description for the notification.
   * @param {number} life - The duration in milliseconds that the notification should be visible before auto-dismissing. Default is 3000ms (3 seconds).
   */
  const showToast = (
    severity = "info",
    label = "",
    detail = "",
    life = 3000
  ) => {
    toastRef.current.show({
      severity: severity,
      summary: label,
      detail: detail,
      life: life,
    });
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      <Toast ref={toastRef} position="bottom-right" />
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export {
  NotificationContext as NotificationContext,
  NotificationProvider as NotificationProvider,
};
