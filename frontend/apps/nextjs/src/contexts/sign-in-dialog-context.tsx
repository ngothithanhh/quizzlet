"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

type ActiveTab = "login" | "register";

interface SignInDialogState {
  open: boolean;
  activeTab: ActiveTab;
  onOpenChange: (open: boolean) => void;
  openWithTab: (tab: ActiveTab) => void;
}

const initialState: SignInDialogState = {
  open: false,
  activeTab: "login",
  onOpenChange: () => undefined,
  openWithTab: () => undefined,
};

const SignInDialogContext = createContext<SignInDialogState>(initialState);

const SignInDialogProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("login");

  const openWithTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setOpen(true);
  };

  return (
    <SignInDialogContext.Provider
      value={{ open, activeTab, onOpenChange: setOpen, openWithTab }}
    >
      {children}
    </SignInDialogContext.Provider>
  );
};

export default SignInDialogProvider;

export const useSignInDialogContext = (): SignInDialogState =>
  useContext(SignInDialogContext);
