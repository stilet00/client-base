import { useCallback, useState } from "react";

export function useAlertConfirmation() {
  const [alertStatusConfirmation, setAlertStatusConfirmation] = useState(false);
  const openAlertConfirmation = useCallback(() => {
    setAlertStatusConfirmation(true);
  }, []);

  const closeAlertConfirmation = useCallback(() => {
    window.location.reload();
  }, []);
  const closeAlertConfirmationNoReload = useCallback(() => {
    setAlertStatusConfirmation(false);
  }, []);
  return {
    alertStatusConfirmation,
    openAlertConfirmation,
    closeAlertConfirmation,
    closeAlertConfirmationNoReload,
  };
}
