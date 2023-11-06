<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  showModal: boolean;
}>();
const emit = defineEmits(["close-dialog", "submit-dialog"]);
const { t } = useI18n();

const subCategoryName = ref<string>("");

const rules = {
  required: (value: string) => !!value || t("add-sub-category-modal.name-required-error"),
};

function closeDialog() {
  emit("close-dialog");
}

function submitDialog() {
  emit("submit-dialog", subCategoryName.value);
}
</script>

<template>
  <v-dialog
    :model-value="props.showModal"
    persistent
    location="top"
    width="90%"
    :content-class="$style.modal"
  >
    <v-card :title="t('add-sub-category-modal.title')">
      <v-card-text>
        <v-text-field
          v-model="subCategoryName"
          :rules="[rules.required]"
          clearable
          :label="t('add-sub-category-modal.category-name-field-label')"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          {{ t("add-sub-category-modal.cancel-btn-text") }}
        </v-btn>
        <v-btn
          variant="elevated"
          color="success"
          @click="submitDialog"
        >
          {{ t("add-sub-category-modal.add-category-btn-text") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" module>
.modal {
  align-self: start;
  padding-top: 40px;
}
</style>
