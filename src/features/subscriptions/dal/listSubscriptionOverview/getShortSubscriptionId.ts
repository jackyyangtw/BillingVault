export function getShortSubscriptionId(id: string) {
  return `SUB-${id.slice(0, 8).toUpperCase()}`;
}
