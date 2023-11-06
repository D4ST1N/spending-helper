import { defineStore } from "pinia";
import { ref } from "vue";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, doc, addDoc } from "firebase/firestore";
import { Category, SpendingData, SubCategory } from "@/types";
import firebaseConfig from "@/configs/firebaseConfig";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export const useFirebaseStore = defineStore(
  "firebase",
  () => {
    // const categoriesLastUpdate = ref<string>("");
    const categories = ref<Category[]>([]);
    const subCategories = ref<SubCategory[]>([]);

    async function getCategories() {
      const querySnapshot = await getDocs(collection(firestore, "categories"));
      categories.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }) as Category);

      return categories.value;
    }

    async function getSubCategories() {
      const querySnapshot = await getDocs(collection(firestore, "sub-categories"));
      subCategories.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }) as SubCategory);

      return subCategories.value;
    }

    async function addSpending(spendingData: SpendingData, subCategory: SubCategory) {
      const subCategoryDocumentRef = doc(firestore, "sub-categories", subCategory.id);
      
      await addDoc(collection(firestore, "spending"), {
        subCategory: subCategoryDocumentRef,
        ...spendingData,
      });
    }

    async function addCategory(categoryName: string) {
      await addDoc(collection(firestore, "categories"), {
        name: categoryName,
      });
      await getCategories();
    }

    async function addSubCategory(subCategoryName: string, category: Category) {
      const categoryDocumentRef = doc(firestore, "categories", category.id);

      await addDoc(collection(firestore, "sub-categories"), {
        categoryId: categoryDocumentRef,
        name: subCategoryName,
      });
      await getSubCategories();
    }

    return {
      categories,
      subCategories,
      getCategories,
      getSubCategories,
      addSpending,
      addCategory,
      addSubCategory,
    };
  },
);
