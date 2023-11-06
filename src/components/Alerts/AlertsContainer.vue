<script lang="ts" setup>
import { useAlertsStore } from "@/store/alerts";
import { storeToRefs } from "pinia";

const alertsStore = useAlertsStore();
const { alerts } = storeToRefs(alertsStore);
</script>

<template>
  <div :class="$style.container">
    <v-alert
      v-for="alert in alerts"
      :key="alert.id"
      :timeout="alert.timeout"
      :color="alert.color"
      :model-value="true"
      position="static"
      transition="scale-transition"
    >
      {{ alert.text }}
    </v-alert>
  </div>
</template>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 20px;
  width: 100%;
}
</style>
