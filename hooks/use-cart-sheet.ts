// src/hooks/use-cart-sheet.ts
import { create } from "zustand";

type CartSheetState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useCartSheet = create<CartSheetState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
