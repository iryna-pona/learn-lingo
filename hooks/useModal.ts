"use client";

import { useState } from "react";

type ModalType = "login" | "register" | "booking" | null;

export const useModal = () => {
  const [type, setType] = useState<ModalType>(null);

  const open = (modal: ModalType) => setType(modal);

  const close = () => setType(null);

  const switchAuth = () => {
    setType((prev) => (prev === "login" ? "register" : "login"));
  };

  return {
    type,
    isOpen: type !== null,
    open,
    close,
    switchAuth,
  };
};