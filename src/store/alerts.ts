import { ref } from "vue";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { AlertData, Alert } from "@/types";
import { timeout as wait } from "@/utils/generalUtils";

export const useAlertsStore = defineStore("alerts", () => {
  const alerts = ref<Alert[]>([]);

  function addAlert({ text = "", timeout = 4000, color = "success" }: AlertData) {
    const id = uuidv4();
    alerts.value.push({
      text,
      timeout,
      color,
      id,
    });

    if (timeout > - 1) {
      removeAlertAfterTimeout(timeout, id);
    }
  }

  async function removeAlertAfterTimeout(timeout: number, alertId: string) {
    await wait(timeout);
    alerts.value = alerts.value.filter(alert => alert.id !== alertId);
  }

  return {
    alerts,
    addAlert,
  };
});
