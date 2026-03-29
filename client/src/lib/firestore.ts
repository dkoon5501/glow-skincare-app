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

/** Serialized product stored in Firestore — plain object, no class instances */
export interface SerializedProduct {
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
  sourceLinks?: { name: string; url: string }[];
  manufacturerUrl?: string;
  amazonUrl?: string;
  pmOnly?: boolean;
}

/** Serialized form stored in Firestore — plain objects, no class instances */
export interface SerializedRecommendation {
  amRoutine: Array<{
    step: { step: number; label: string; time: string; category: string; description: string };
    product: SerializedProduct;
    essential: boolean;
    alternatives?: SerializedProduct[];
  }>;
  pmRoutine: Array<{
    step: { step: number; label: string; time: string; category: string; description: string };
    product: SerializedProduct;
    essential: boolean;
    alternatives?: SerializedProduct[];
  }>;
  tips: string[];
}

/** A discarded product entry stored in Firestore */
export interface DiscardedProduct {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productBrand: string;
  category: string;
  reason: string;
  customReason?: string;
  discardedAt: Timestamp;
}

/** Strip undefined values — Firestore rejects them */
function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) clean[key] = val;
  }
  return clean;
}

function serializeProduct(product: import("./skincare-data").Product): SerializedProduct {
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
    sourceLinks: product.sourceLinks,
    manufacturerUrl: product.manufacturerUrl,
    amazonUrl: product.amazonUrl,
    pmOnly: product.pmOnly,
  }) as unknown as SerializedProduct;
}

function serializeRecommendation(recommendation: RecommendedRoutine): SerializedRecommendation {
  return {
    amRoutine: recommendation.amRoutine.map((item) => stripUndefined({
      step: {
        step: item.step.step,
        label: item.step.label,
        time: item.step.time,
        category: item.step.category,
        description: item.step.description,
      },
      product: serializeProduct(item.product),
      essential: item.essential,
      alternatives: item.alternatives?.map(serializeProduct),
    }) as SerializedRecommendation["amRoutine"][0]),
    pmRoutine: recommendation.pmRoutine.map((item) => stripUndefined({
      step: {
        step: item.step.step,
        label: item.step.label,
        time: item.step.time,
        category: item.step.category,
        description: item.step.description,
      },
      product: serializeProduct(item.product),
      essential: item.essential,
      alternatives: item.alternatives?.map(serializeProduct),
    }) as SerializedRecommendation["pmRoutine"][0]),
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

// ─────────────────────────────────────────────
// DISCARDED PRODUCTS
// ─────────────────────────────────────────────

export interface SaveDiscardedProductData {
  productId: string;
  productName: string;
  productBrand: string;
  category: string;
  reason: string;
  customReason?: string;
}

export async function saveDiscardedProduct(
  userId: string,
  data: SaveDiscardedProductData
): Promise<string> {
  const payload: Record<string, unknown> = {
    userId,
    productId: data.productId,
    productName: data.productName,
    productBrand: data.productBrand,
    category: data.category,
    reason: data.reason,
    discardedAt: Timestamp.now(),
  };
  // Only include customReason if it's non-empty
  if (data.customReason) {
    payload.customReason = data.customReason;
  }
  const docRef = await addDoc(collection(db, "discardedProducts"), payload);
  return docRef.id;
}

export async function getUserDiscardedProducts(userId: string): Promise<DiscardedProduct[]> {
  const q = query(
    collection(db, "discardedProducts"),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<DiscardedProduct, "id">),
  }));
  // Sort by discardedAt descending (client-side)
  items.sort((a, b) => {
    const aTime = a.discardedAt?.toMillis?.() || 0;
    const bTime = b.discardedAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
  return items;
}

export async function removeDiscardedProduct(docId: string): Promise<void> {
  await deleteDoc(doc(db, "discardedProducts", docId));
}

// ─── Upvotes ─────────────────────────────────────────────
export interface Upvote {
  id: string;
  userId: string;
  productId: string;
}

/**
 * Toggle upvote: add if not exists, remove if already upvoted.
 * Returns the new state (true = upvoted, false = removed).
 */
export async function toggleUpvote(userId: string, productId: string): Promise<boolean> {
  const q = query(
    collection(db, "upvotes"),
    where("userId", "==", userId),
    where("productId", "==", productId)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    // Add upvote
    await addDoc(collection(db, "upvotes"), { userId, productId });
    return true;
  } else {
    // Remove upvote (toggle off)
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, "upvotes", docSnap.id));
    }
    return false;
  }
}

/**
 * Get upvote counts for a list of product IDs.
 * Returns a map of productId -> count.
 */
export async function getUpvoteCounts(productIds: string[]): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  // Firestore 'in' queries max 30 items, batch if needed
  for (let i = 0; i < productIds.length; i += 30) {
    const batch = productIds.slice(i, i + 30);
    const q = query(
      collection(db, "upvotes"),
      where("productId", "in", batch)
    );
    const snapshot = await getDocs(q);
    for (const docSnap of snapshot.docs) {
      const pid = docSnap.data().productId as string;
      counts[pid] = (counts[pid] || 0) + 1;
    }
  }
  return counts;
}

/**
 * Get the product IDs a specific user has upvoted.
 */
export async function getUserUpvotes(userId: string): Promise<Set<string>> {
  const q = query(
    collection(db, "upvotes"),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  return new Set(snapshot.docs.map(d => d.data().productId as string));
}
