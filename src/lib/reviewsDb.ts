import fs from "fs";
import path from "path";
import { Review } from "@/types";

const DATA_DIR     = path.join(process.cwd(), "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

function ensureFilesExist() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(REVIEWS_FILE))
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify([], null, 2), "utf8");
  } catch (err) {
    console.error("reviewsDb: Error creating storage files:", err);
  }
}

let inMemoryReviews: Review[] = [];

export function getReviews(): Review[] {
  try {
    ensureFilesExist();
    const data = fs.readFileSync(REVIEWS_FILE, "utf8");
    const cleanData = data.replace(/^\uFEFF/, "").trim();
    const parsed = JSON.parse(cleanData || "[]");
    if (Array.isArray(parsed)) {
      inMemoryReviews = parsed;
      return parsed;
    }
  } catch (err) {
    console.error("reviewsDb: Error reading reviews:", err);
  }
  return inMemoryReviews;
}

export function saveReviews(reviews: Review[]): boolean {
  inMemoryReviews = reviews;
  try {
    ensureFilesExist();
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("reviewsDb: Error saving reviews:", err);
    return false;
  }
}

export function getApprovedReviewsByProductId(productId: string): Review[] {
  const all = getReviews();
  return all
    .filter((r) => r.productId === productId && r.status === "approved")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createReview(review: Review): Review {
  const all = getReviews();
  const updated = [review, ...all];
  saveReviews(updated);
  return review;
}

export function hasCustomerReviewedProduct(customerId: string, productId: string): boolean {
  const all = getReviews();
  return all.some((r) => r.customerId === customerId && r.productId === productId);
}

export function updateReviewStatus(id: string, status: "approved" | "rejected"): Review | null {
  const all = getReviews();
  let updated: Review | null = null;
  const newAll = all.map((r) => {
    if (r.id === id) {
      updated = { ...r, status };
      return updated;
    }
    return r;
  });
  if (updated) saveReviews(newAll);
  return updated;
}

export function deleteReview(id: string): boolean {
  const all = getReviews();
  const filtered = all.filter((r) => r.id !== id);
  if (filtered.length === all.length) return false;
  saveReviews(filtered);
  return true;
}

export function getPendingReviewCount(): number {
  return getReviews().filter((r) => r.status === "pending").length;
}
