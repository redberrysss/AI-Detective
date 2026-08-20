import { Case } from "@/types";
import { lockedRoomCase } from "./locked-room";

export const cases: Case[] = [lockedRoomCase];

export function getCaseById(id: string): Case | undefined {
  return cases.find((c) => c.metadata.id === id);
}

export function getCaseList() {
  return cases.map((c) => c.metadata);
}
