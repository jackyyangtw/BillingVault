"use client";

import Script from "next/script";
import { createContext, use, useEffect, useState } from "react";
import { TAPPAY_SDK_URL, getTapPayConfig } from "./tappay";

type TapPayContextValue = {
  isReady: boolean;
  error: string;
};

type TapPayProviderProps = {
  children: React.ReactNode;
  scriptNonce?: string;
};

const TapPayContext = createContext<TapPayContextValue>({
  isReady: false,
  error: "",
});

const tappayConfig = getTapPayConfig();

export default function TapPayProvider({
  children,
  scriptNonce,
}: TapPayProviderProps) {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [scriptError, setScriptError] = useState("");

  useEffect(() => {
    if (!isScriptReady || !tappayConfig.isReady || !window.TPDirect) {
      return;
    }

    window.TPDirect.setupSDK(
      tappayConfig.appId,
      tappayConfig.appKey,
      tappayConfig.serverType,
    );
  }, [isScriptReady]);

  const setupError = tappayConfig.isReady ? "" : tappayConfig.message;
  const error = scriptError || setupError;
  const value = {
    isReady: isScriptReady && tappayConfig.isReady && !error,
    error,
  };

  return (
    <TapPayContext value={value}>
      <Script
        src={TAPPAY_SDK_URL}
        strategy="afterInteractive"
        nonce={scriptNonce}
        onReady={() => setIsScriptReady(true)}
        onError={() => setScriptError("TapPay SDK 載入失敗，請稍後再試。")}
      />
      {children}
    </TapPayContext>
  );
}

export function useTapPay() {
  return use(TapPayContext);
}
