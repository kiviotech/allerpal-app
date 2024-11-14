// import { create } from "zustand";

// const useSetupStore = create((set) => ({
//   selectedOptions: {
//     Myself: { id: 1, checked: false },
//     "My Child": { id: 2, checked: false },
//     "My Partner": { id: 3, checked: false },
//   },
//   allergens: {}, // Store for allergens with their selection status

//   setSelectedOption: (option) =>
//     set((state) => ({
//       selectedOptions: {
//         ...state.selectedOptions,
//         [option]: {
//           ...state.selectedOptions[option],
//           checked: !state.selectedOptions[option].checked,
//         },
//       },
//     })),

//   toggleAllergenSelection: (id) =>
//     set((state) => ({
//       allergens: {
//         ...state.allergens,
//         [id]: !state.allergens[id], // Toggle the allergen's selected state
//       },
//     })),
// }));

// export default useSetupStore;

// import { create } from "zustand";

// const useSetupStore = create((set) => ({
//   userId: "", // Replace with dynamic ID if needed
//   selectedAllergies: [],
//   excludeMayContain: false,
//   termsAccepted: false,

//   setExcludeMayContain: (value) => set({ excludeMayContain: value }),
//   setTermsAccepted: (value) => set({ termsAccepted: value }),

//   toggleAllergySelection: (id) =>
//     set((state) => {
//       const selected = state.selectedAllergies.includes(id);
//       return {
//         selectedAllergies: selected
//           ? state.selectedAllergies.filter((allergyId) => allergyId !== id)
//           : [...state.selectedAllergies, id],
//       };
//     }),
// }));

// export default useSetupStore;
// useSetupStore.js
import { create } from "zustand";

const useSetupStore = create((set) => ({
  selectedOptions: {
    Myself: { id: 1, checked: false },
    "My Child": { id: 2, checked: false },
    "My Partner": { id: 3, checked: false },
  },
  selectedAllergies: [], // Store for allergy IDs selected by the user
  excludeMayContain: false,
  termsAccepted: false,

  // Toggle selected option for who the profile is created
  setSelectedOption: (option) =>
    set((state) => ({
      selectedOptions: {
        ...state.selectedOptions,
        [option]: {
          ...state.selectedOptions[option],
          checked: !state.selectedOptions[option].checked,
        },
      },
    })),

  // Toggle selection of an allergy ID
  toggleAllergySelection: (allergyId) =>
    set((state) => ({
      selectedAllergies: state.selectedAllergies.includes(allergyId)
        ? state.selectedAllergies.filter((id) => id !== allergyId)
        : [...state.selectedAllergies, allergyId],
    })),

  setExcludeMayContain: (value) => set({ excludeMayContain: value }),
  setTermsAccepted: (value) => set({ termsAccepted: value }),
}));

export default useSetupStore;
