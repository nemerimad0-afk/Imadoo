import { Sport, Match, Stream } from "../types";

const BASE_URL = "https://streamed.pk/api";

export async function getSports(): Promise<Sport[]> {
  const res = await fetch(`${BASE_URL}/sports`);
  if (!res.ok) throw new Error("Failed to fetch sports");
  return res.json();
}

export async function getMatches(sportId: string): Promise<Match[]> {
  const res = await fetch(`${BASE_URL}/matches/${sportId}`);
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}

export async function getStreams(source: string, id: string): Promise<Stream[]> {
  const res = await fetch(`${BASE_URL}/stream/${source}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch streams");
  return res.json();
}

export function getImageUrl(pathOrId: string, isBadge = false): string {
  if (!pathOrId) return "";
  if (pathOrId.startsWith("/")) {
    return `https://streamed.pk${pathOrId}`;
  }
  if (isBadge) {
    return `https://streamed.pk/api/images/proxy/${pathOrId}.webp`;
  }
  return `https://streamed.pk/api/images/proxy/${pathOrId}`;
}
