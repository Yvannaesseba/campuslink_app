import { create } from 'zustand'

export type ModalType = "addImage" 
interface useImageModal {
  type: ModalType | null,
  isOpen: boolean;
  onOpen: (type: ModalType ) => void;
  onClose: () => void;
}

export const useImageModal = create<useImageModal>((set)=>({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true }),
  onClose: () => set({ isOpen: false})
}))