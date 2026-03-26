"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { connectAlertWebSocket } from "../api/smallcaps-api";
import { addAlertAtom, alertsAtom } from "../atoms/smallcaps";

export function useAlerts() {
  const [alerts] = useAtom(alertsAtom);
  const [, addAlert] = useAtom(addAlertAtom);

  useEffect(() => {
    const disconnect = connectAlertWebSocket((alert) => {
      addAlert(alert);
    });
    return disconnect;
  }, [addAlert]);

  return { alerts };
}
