"use server";

import {
  getRecentStudy,
  getStudy,
  getStudyList,
  recordStudy,
} from "@/lib/db/queries";
import type { StudySummary } from "@/lib/types";

export async function getStudyAction(
  userId: string,
  bookId: string,
): Promise<StudySummary | null> {
  return getStudy(userId, bookId);
}

export async function getStudyListAction(
  userId: string,
): Promise<StudySummary[]> {
  return getStudyList(userId);
}

export async function getRecentStudyAction(
  userId: string,
): Promise<StudySummary | null> {
  return getRecentStudy(userId);
}

export async function recordStudyAction(
  userId: string,
  bookId: string,
  wordRank: number,
  wordId: string,
): Promise<StudySummary | null> {
  return recordStudy(userId, bookId, wordRank, wordId);
}
