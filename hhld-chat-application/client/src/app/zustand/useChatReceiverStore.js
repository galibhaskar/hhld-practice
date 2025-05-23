import { create } from "zustand";

export const useChatReceiverStore = create((set) => ({
  receiver: "",
  updateChatReceiver: (user) => set({ receiver: user }),
}));
