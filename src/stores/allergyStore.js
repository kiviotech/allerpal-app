import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAllergyStore = create(
  persist(
    (set) => ({
      selectedAllergies: [],
      setSelectedAllergies: (allergies) =>
        set({
          selectedAllergies: allergies.map((allergy) => allergy.name),
        }),
      addAllergy: (allergyName) =>
        set((state) => ({
          selectedAllergies: [...state.selectedAllergies, allergyName],
        })),
      removeAllergy: (allergyName) =>
        set((state) => ({
          selectedAllergies: state.selectedAllergies.filter(
            (name) => name !== allergyName
          ),
        })),
      clearAllergies: () => set({ selectedAllergies: [] }),
    }),
    {
      name: "allergy-storage",
    }
  )
);

export default useAllergyStore;
