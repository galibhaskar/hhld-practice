import { create } from "zustand";

export const useChatMessagesStore = create((set) => ({
  chatMsgs: [],

  clearMsgs: () => set({ chatMsgs: [] }),

  updateChatMsgs: (msgs) =>
    set((state) => ({
      chatMsgs: [...state.chatMsgs, ...msgs],
    })),
}));
