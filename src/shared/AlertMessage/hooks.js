import { useState } from "react";

export function useAlert() {
  const [alertOpen, setAlertOpen] = useState(false);
  const openAlert = () => {
    setAlertOpen(true);
  };

  const closeAlert = () => {
    window.location.reload();
  };
  function closeAlertNoReload() {
    setAlertOpen(false);
  }
  return {
    alertOpen,
    openAlert,
    closeAlert,
    closeAlertNoReload,
  };
}
