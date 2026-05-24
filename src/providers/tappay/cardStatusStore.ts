import type { TapPayCardUpdate, TapPayFieldStatus } from "./tappay";

type CardStatusSnapshot = {
  canGetPrime: boolean;
  hasInteracted: boolean;
  status: TapPayFieldStatus;
};

const initialStatus: TapPayFieldStatus = {
  number: -1,
  expiry: -1,
  ccv: -1,
};

const initialSnapshot: CardStatusSnapshot = {
  canGetPrime: false,
  hasInteracted: false,
  status: initialStatus,
};

let snapshot = initialSnapshot;
const listeners = new Set<() => void>();

export function subscribeTapPayCardStatus(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getTapPayCardStatusSnapshot() {
  return snapshot;
}

export function updateTapPayCardStatus(update: TapPayCardUpdate) {
  snapshot = {
    canGetPrime: update.canGetPrime,
    hasInteracted: true,
    status: update.canGetPrime
      ? {
          number: 0,
          expiry: 0,
          ccv: 0,
        }
      : update.status,
  };

  for (const listener of listeners) {
    listener();
  }
}

export function resetTapPayCardStatus() {
  snapshot = initialSnapshot;

  for (const listener of listeners) {
    listener();
  }
}
