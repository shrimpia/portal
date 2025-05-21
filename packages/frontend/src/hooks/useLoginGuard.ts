import { navigateToMiAuth } from "@/services/navigate-to-miauth";
import { tokenAtom } from "@/states/sessions";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

/**
 * このページを読み込んだときにセッションがなければ、ログイン画面にリダイレクトする
 */
export const useLoginGuard = () => {
  const token = useAtomValue(tokenAtom);

  useEffect(() => {
    if (token) return;
    const callbackTo = window.location.href.replace(window.location.origin, "");
    navigateToMiAuth(callbackTo);
  }, [token]);
};
