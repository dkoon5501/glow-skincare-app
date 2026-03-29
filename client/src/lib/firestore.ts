import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
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
    essential: boolean;
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
    essential: boolean;
  }>;
  tips: string[];
}

/** Strip undefined values — Firestore rejects them */
function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) clean[key] = val;
  }
  return clean;
}

function serializeProduct(product: RecommendedRoutine["amRoutine"][0]["product"]) {
  return stripUndefined({
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
    keyIngredients: product.keyIngredients,
    bestFor: product.bestFor,
    whyRecommended: product.whyRecommended,
    source: product.source,
    sourceUrl: product.sourceUrl,
    manufacturerUrl: product.manufacturerUrl,
    amazonUrl: product.amazonUrl,
    pmOnly: product.pmOnly,
  });
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
      product: serializeProduct(item.product) as SerializedRecommendation["amRoutine"][0]["product"],
      essential: item.essential,
    })),
    pmRoutine: recommendation.pmRoutine.map((item) => ({
      step: {
        step: item.step.step,
        label: item.step.label,
        time: item.step.time,
        category: item.step.category,
        description: item.step.description,
      },
      product: serializeProduct(item.product) as SerializedRecommendation["pmRoutine"][0]["product"],
      essential: item.essential,
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
  // Simple query without orderBy to avoid needing a composite index.
  // We sort client-side instead.
  const q = query(
    collection(db, "routines"),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const routines = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<SavedRoutine, "id">),
  }));
  // Sort by createdAt descending (client-side)
  routines.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
  return routines;
}

export async function deleteRoutine(routineId: string): Promise<void> {
  await deleteDoc(doc(db, "routines", routineId));
}
