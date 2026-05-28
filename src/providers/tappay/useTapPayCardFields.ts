"use client";

import {
  useEffect,
  useEffectEvent,
  useState,
  useSyncExternalStore,
} from "react";
import { useTheme } from "next-themes";
import { getTappayCardSetupConfig } from "./cardSetup";
import {
  getTapPayCardStatusSnapshot,
  resetTapPayCardStatus,
  subscribeTapPayCardStatus,
  updateTapPayCardStatus,
} from "./cardStatusStore";
import type { TapPayCardUpdate } from "./tappay";
import { useTapPay } from ".";

type UseTapPayCardFieldsOptions = {
  revealDelay?: number;
  onReadyToPrime?: () => void;
};

export function useTapPayCardFields({
  revealDelay = 0,
  onReadyToPrime,
}: UseTapPayCardFieldsOptions = {}) {
  const tapPay = useTapPay();
  const { resolvedTheme } = useTheme();
  const colorMode = resolvedTheme === "light" ? "light" : "dark";
  const [isHostedFieldVisible, setIsHostedFieldVisible] = useState(
    revealDelay === 0,
  );
  const [setupError, setSetupError] = useState("");
  const handleReadyToPrime = useEffectEvent(() => {
    onReadyToPrime?.();
  });
  const cardStatus = useSyncExternalStore(
    subscribeTapPayCardStatus,
    getTapPayCardStatusSnapshot,
    getTapPayCardStatusSnapshot,
  );

  useEffect(() => {
    if (!tapPay.isReady || !window.TPDirect) {
      return;
    }

    let isMounted = true;
    let hasRevealedHostedField = false;
    let revealTimer: number | undefined;
    let fallbackRevealTimer: number | undefined;
    function revealHostedField() {
      if (hasRevealedHostedField) {
        return;
      }

      hasRevealedHostedField = true;

      if (revealDelay > 0) {
        revealTimer = window.setTimeout(() => {
          if (isMounted) {
            setIsHostedFieldVisible(true);
          }
        }, revealDelay);
        return;
      }

      setIsHostedFieldVisible(true);
    }

    const setupTimer = window.setTimeout(() => {
      if (!isMounted || !window.TPDirect) {
        return;
      }

      try {
        window.TPDirect.card.setup(getTappayCardSetupConfig(colorMode));
        updateTapPayCardStatus(window.TPDirect.card.getTappayFieldsStatus());
        setSetupError("");

        if (colorMode === "light") {
          revealHostedField();
          return;
        }

        fallbackRevealTimer = window.setTimeout(() => {
          if (isMounted) {
            revealHostedField();
          }
        }, 600);
      } catch {
        setSetupError("TapPay 欄位初始化失敗，請關閉表單後再試一次。");
      }
    }, 0);

    window.TPDirect.card.onUpdate((update: TapPayCardUpdate) => {
      if (!isMounted) {
        return;
      }

      updateTapPayCardStatus(update);
      if (colorMode === "dark") {
        revealHostedField();
      }
      if (update.canGetPrime) {
        handleReadyToPrime();
      }
    });

    return () => {
      isMounted = false;
      window.clearTimeout(setupTimer);
      if (revealTimer) {
        window.clearTimeout(revealTimer);
      }
      if (fallbackRevealTimer) {
        window.clearTimeout(fallbackRevealTimer);
      }
      setIsHostedFieldVisible(revealDelay === 0);
      resetTapPayCardStatus();
    };
  }, [colorMode, revealDelay, tapPay.isReady]);

  return {
    cardStatus,
    error: tapPay.error || setupError,
    isHostedFieldVisible,
  };
}
