import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { RecommendedRoutine, QuizAnswers } from "./skincare-data";

export interface SavedRoutine {
  id: string;
  userId: string;
  answers: QuizAnswers;
  recommendation: SerializedRecommendation;
  createdAt: Timestamp;
  skinProfile: {
    type: string;
    sensitivity: string;
    primaryConcern: string;
    baumannCode: string;
  };
}

/** Serialized form stored in Firestore — plain objects, no class instances */
export interface SerializedRecommendation {
  amRoutine: Array<{
    step: { step: number; label: string; time: string; category: string; description: string };
    product: {
      id: string;
      name: string;
      brand: string;
      category: string;
      price: string;
      keyIngredients: string[];
      bestFor: string[];
      whyRecommended: string;
      source: string;
      sourceUrl?: string;
      manufacturerUrl?: string;
      amazonUrl?: string;
      pmOnly?: boolean;
    };
  }>;
  pmRoutine: Array<{
    step: { step: number; label: string; time: string; category: string; description: string };
    product: {
      id: string;
      name: string;
      brand: string;
      category: string;
      price: string;
      keyIngredients: string[];
      bestFor: string[];
      whyRecommended: string;
      source: string;
      sourceUrl?: string;
      manufacturerUrl?: string;
      amazonUrl?: string;
      pmOnly?: boolean;
    };
  }>;
  tips: string[];
}

function serializeRecommendation(recommendation: RecommendedRoutine): SerializedRecommendation {
  return {
    amRoutine: recommendation.amRoutine.map((item) => ({
      step: {
        step: item.step.step,
        label: item.step.label,
        time: item.step.time,
        category: item.step.category,
        description: item.step.description,
      },
      product: {
        id: item.product.id,
        name: item.product.name,
        brand: item.product.brand,
        category: item.product.category,
        price: item.product.price,
        keyIngredients: item.product.keyIngredients,
        bestFor: item.product.bestFor,
        whyRecommended: item.product.whyRecommended,
        source: item.product.source,
        sourceUrl: item.product.sourceUrl,
        manufacturerUrl: item.product.manufacturerUrl,
        amazonUrl: item.product.amazonUrl,
        pmOnly: item.product.pmOnly,
      },
    })),
    pmRoutine: recommendation.pmRoutine.map((item) => ({
      step: {
        step: item.step.step,
        label: item.step.label,
        time: item.step.time,
        category: item.step.category,
        description: item.step.description,
      },
      product: {
        id: item.product.id,
        name: item.product.name,
        brand: item.product.brand,
        category: item.product.category,
        price: item.product.price,
        keyIngredients: item.product.keyIngredients,
        bestFor: item.product.bestFor,
        whyRecommended: item.product.whyRecommended,
        source: item.product.source,
        sourceUrl: item.product.sourceUrl,
        manufacturerUrl: item.product.manufacturerUrl,
        amazonUrl: item.product.amazonUrl,
        pmOnly: item.product.pmOnly,
      },
    })),
    tips: recommendation.tips,
  };
}

export async function saveRoutine(
  userId: string,
  data: { answers: QuizAnswers; recommendation: RecommendedRoutine }
): Promise<string> {
  const docRef = await addDoc(collection(db, "routines"), {
    userId,
    answers: data.answers,
    recommendation: serializeRecommendation(data.recommendation),
    createdAt: Timestamp.now(),
    skinProfile: data.recommendation.skinProfile,
  });
  return docRef.id;
}

export async function getUserRoutines(userId: string): Promise<SavedRoutine[]> {
  const q = query(
    collection(db, "routines"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<SavedRoutine, "id">),
  }));
}

export async function deleteRoutine(routineId: string): Promise<void> {
  await deleteDoc(doc(db, "routines", routineId));
}
