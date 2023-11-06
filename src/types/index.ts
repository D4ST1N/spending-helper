import { DocumentReference, Timestamp } from "firebase/firestore";

export interface Category {
  id: string;
  name: string;
}

export interface SubCategory extends Category {
  categoryId: DocumentReference;
}

export interface SpendingData {
  date: Timestamp;
  value: number;
  note: string;
}

export interface Spending extends SpendingData {
  subCategory: DocumentReference;
}

export interface AlertData {
  text: string;
  color?: string;
  timeout?: number;
}

export interface Alert extends AlertData {
  id: string;
}
