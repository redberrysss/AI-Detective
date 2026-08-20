import { Case } from "@/types";
import { lockedRoomCase } from "./locked-room";
import { vanishingHeiressCase } from "./vanishing-heiress";
import { midtownArsonCase } from "./midtown-arson";
import { corporatePoisonCase } from "./corporate-poison";
import { museumHeistCase } from "./museum-heist";
import { dinnerPartyDeathCase } from "./dinner-party-death";
import { lighthouseKeeperCase } from "./lighthouse-keeper";
import { digitalGhostCase } from "./digital-ghost";

export const cases: Case[] = [
  lockedRoomCase,
  vanishingHeiressCase,
  midtownArsonCase,
  corporatePoisonCase,
  museumHeistCase,
  dinnerPartyDeathCase,
  lighthouseKeeperCase,
  digitalGhostCase,
];

export function getCaseById(id: string): Case | undefined {
  return cases.find((c) => c.metadata.id === id);
}

export function getCaseList() {
  return cases.map((c) => c.metadata);
}
