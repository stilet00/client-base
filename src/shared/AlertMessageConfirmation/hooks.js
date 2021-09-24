import { useState } from "react";

export function useAlertConfirmation() {
  const [alertStatusConfirmation, setAlertStatusConfirmation] = useState(false);
  const openAlertConfirmation = () => {
    setAlertStatusConfirmation(true);
  };

  const closeAlertConfirmation = () => {
    window.location.reload();
  };
  function closeAlertConfirmationNoReload() {
    setAlertStatusConfirmation(false);
  }
  return {
    alertStatusConfirmation,
    openAlertConfirmation,
    closeAlertConfirmation,
    closeAlertConfirmationNoReload,
  };
}
