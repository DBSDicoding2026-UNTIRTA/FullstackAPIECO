"use client";

import { useCallback } from "react";
import { toast } from "sonner";

export function useAppNotifications() {
  return {
    notify: useCallback((message: string) => {
      toast(message);
    }, []),
  };
}
