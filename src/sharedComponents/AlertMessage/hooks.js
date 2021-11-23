import { useCallback, useState } from "react";

export function useAlert() {
  const [alertOpen, setAlertOpen] = useState(false);
  const openAlert = useCallback(() => {
    setAlertOpen(true);
  }, []);

  const closeAlert = useCallback(() => {
    setAlertOpen(false);
  }, []);
  return {
    alertOpen,
    openAlert,
    closeAlert,
  };
}
