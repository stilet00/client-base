import { useState } from "react";

export function useAlert() {
  const [alertOpen, setAlertOpen] = useState(false);
  const openAlert = () => {
    setAlertOpen(true);
  };

  const closeAlert = () => {
    window.location.reload();

  };
  return {
    alertOpen,
    openAlert,
    closeAlert,
  };
}
