export function isNoImprovement(
  prevDiff: string | null,
  nextDiff: string | null,
  turn: number
): boolean {
  if (turn <= 1) return false;
  return (prevDiff ?? null) === (nextDiff ?? null);
}
