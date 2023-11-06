<script lang="ts" setup>
import moment from "moment";
import { DatePicker } from "v-calendar";
import { computed, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useFirebaseStore } from "@/store/firebase";
import { useAlertsStore } from "@/store/alerts";
import { Category, SubCategory } from "@/types";
import PageLayout from "@/components/UI/PageLayout.vue";
import { Timestamp } from "firebase/firestore";
import NewCategory from "@/components/NewCategory/NewCategory.vue";
import NewSubCategory from "@/components/NewSubCategory/NewSubCategory.vue";

const { t } = useI18n();

const day = 1000 * 60 * 60 * 24;

const firebaseStore = useFirebaseStore();
const alertsStore = useAlertsStore();

const categories = ref<Category[]>([]);
const subCategories = ref<SubCategory[]>([]);

const date = ref<Date>(new Date());
const selectedCategory = ref<Category | null>(null);
const selectedSubCategory = ref<SubCategory | null>(null);
const sum = ref<string>();
const note = ref<string>("");

const showOverlay = ref<boolean>(false);
const showNewCategoryModal = ref<boolean>(false);
const showNewSubCategoryModal = ref<boolean>(false);

onMounted(async () => {
  fetchCategories();
  fetchSubCategories();
});

const displayedDate = computed(() => moment(date.value).locale("uk").format("LL"));

const currentSubCategories = computed(() => {
  if (selectedCategory.value === null) return [];

  return subCategories.value.filter(
    subCategory => subCategory.categoryId.id === selectedCategory.value!.id
  );
});

const noDataText = computed(() => {
  if (selectedCategory.value === null) return t("new-spending-page.choose-category-error");

  return t("new-spending-page.no-sub-category-found-error");
});

async function fetchCategories() {
  categories.value = await firebaseStore.getCategories();
}

async function fetchSubCategories() {
  subCategories.value = await firebaseStore.getSubCategories();
}

function previousDay() {
  date.value = new Date(date.value.getTime() - day);
}

function nextDay() {
  date.value = new Date(date.value.getTime() + day);
}

function onAddCategoryClick() {
  showNewCategoryModal.value = true;
}

function onCloseNewCategoryModal() {
  showNewCategoryModal.value = false;
}

async function onSubmitNewCategoryModal(categoryName: string) {
  onCloseNewCategoryModal();

  try {
    await firebaseStore.addCategory(categoryName);
    alertsStore.addAlert({
      text: t("new-spending-page.category-adding-success-text"),
    });
    fetchCategories();
  } catch (e) {
    alertsStore.addAlert({
      text: t("new-spending-page.category-adding-error"),
      color: "error",
    });
  }
}

function onAddSubCategoryClick() {
  showNewSubCategoryModal.value = true;
}

function onCloseNewSubCategoryModal() {
  showNewSubCategoryModal.value = false;
}

async function onSubmitNewSubCategoryModal(subCategoryName: string) {
  onCloseNewSubCategoryModal();

  try {
    await firebaseStore.addSubCategory(subCategoryName, selectedCategory.value!);
    alertsStore.addAlert({
      text: t("new-spending-page.sub-category-adding-success-text"),
    });
    fetchSubCategories();
  } catch (e) {
    alertsStore.addAlert({
      text: t("new-spending-page.sub-category-adding-error"),
      color: "error",
    });
  }
}

async function onAddSpendingClick() {
  await firebaseStore.addSpending({
    date: Timestamp.fromDate(date.value),
    value: parseFloat(sum.value!),
    note: note.value,
  }, selectedSubCategory.value!);

  showOverlay.value = true;
}

function closeOverlay() {
  showOverlay.value = false;
  clearFields();
}

function clearFields() {
  selectedCategory.value = null;
  selectedSubCategory.value = null;
  sum.value = "";
  note.value = "";
}
</script>

<template>
  <PageLayout>
    <template #header>
      <h2>{{ t("new-spending-page.title") }}</h2>
    </template>
    <div :class="$style.page">
      <div>
        <DatePicker v-model="date" expanded>
          <template #default="{ togglePopover }">
            <div :class="$style.section">
              <v-btn
                variant="tonal"
                size="36"
                rounded
                icon="mdi-menu-left"
                @click="previousDay"
              ></v-btn>
              <v-btn variant="tonal" :class="$style.changeDate" @click="togglePopover">
                {{ displayedDate }}
              </v-btn>
              <v-btn
                variant="tonal"
                size="36"
                rounded
                icon="mdi-menu-right"
                @click="nextDay"
              ></v-btn>
            </div>
          </template>
        </DatePicker>
      </div>
      <div :class="$style.section">
        <v-select
          v-model="selectedCategory"
          :label="t('new-spending-page.category-field-label')"
          :items="categories"
          item-title="name"
          item-value="id"
          hide-details="auto"
          density="comfortable"
          :no-data-text="t('new-spending-page.no-category-found-error')"
          return-object
        ></v-select>
        <v-btn
          variant="tonal"
          rounded
          size="50"
          icon="mdi-plus-thick"
          @click="onAddCategoryClick"
        ></v-btn>
      </div>
      <div :class="$style.section">
        <v-select
          v-model="selectedSubCategory"
          :label="t('new-spending-page.sub-category-field-label')"
          :items="currentSubCategories"
          item-title="name"
          item-value="id"
          hide-details="auto"
          density="comfortable"
          :no-data-text="noDataText"
          return-object
        ></v-select>
        <v-btn
          :disabled="!selectedCategory"
          variant="tonal"
          rounded
          size="50"
          icon="mdi-plus-thick"
          @click="onAddSubCategoryClick"
        ></v-btn>
      </div>
      <div :class="$style.section">
        <v-text-field
          v-model="sum"
          :label="t('new-spending-page.sum-field-label')"
          hide-details="auto"
          type="number"
          prefix="₴"
          :class="$style.sumField"
        ></v-text-field>
      </div>
      <div :class="$style.section">
        <v-textarea
          v-model="note"
          variant="filled"
          :label="t('new-spending-page.notes-field-label')"
          auto-grow
        ></v-textarea>
      </div>
    </div>
    <template #footer>
      <v-btn
        variant="text"
        size="large"
        to="/"
      >
        {{ t("new-spending-page.cancel-spending-btn-text") }}
      </v-btn>
      <v-btn
        color="success"
        size="large"
        @click="onAddSpendingClick"
      >
        {{ t("new-spending-page.add-spending-btn-text") }}
      </v-btn>
    </template>
  </PageLayout>
  <v-overlay
    v-model="showOverlay"
    contained
    class="align-center justify-center"
    :class="$style.overlay"
  >
    <v-btn
      variant="text"
      size="large"
      to="/"
    >
      {{ t("new-spending-page.to-homepage-btn-text") }}
    </v-btn>
    <v-btn
      color="success"
      @click="closeOverlay"
    >
    {{ t("new-spending-page.add-more-btn-text") }}
    </v-btn>
  </v-overlay>
  <NewCategory
    :show-modal="showNewCategoryModal"
    @close-dialog="onCloseNewCategoryModal"
    @submit-dialog="onSubmitNewCategoryModal"
  />
  <NewSubCategory
    :show-modal="showNewSubCategoryModal"
    @close-dialog="onCloseNewSubCategoryModal"
    @submit-dialog="onSubmitNewSubCategoryModal"
  />
</template>

<style lang="scss" module>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section {
  display: flex;
  gap: 4px;
  width: 100%;
  align-items: center;
}

.changeDate {
  flex-grow: 1;
}

.sumField {
  :global(.v-text-field__prefix) {
    color: #fff;
  }
}

.overlay {
  :global(.v-overlay__scrim) {
    opacity: 0.67;
  }
}
</style>
