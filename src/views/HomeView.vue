<script lang="ts" setup>
import PageLayout from "@/components/UI/PageLayout.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <PageLayout>
    <template #header>
      <h2>{{ t("homepage.title") }}</h2>
    </template>
    <template #footer>
      <v-btn
        block
        color="light-blue-darken-2"
        size="large"
        to="/new"
      >
        {{ t("homepage.add-spending-btn-text") }}
      </v-btn>
    </template>
  </PageLayout>
</template>
