import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JobFilters, SortField, FilterPreset } from "@/types";

export const DEFAULT_FILTERS: JobFilters = {
  search: "",
  minScore: 0,
  location: "",
  company: "",
  postedAfter: null,
  appliedAfter: null,
  applied: false,
};

interface JobStore {
  filters: JobFilters;
  sort: SortField;
  selectedIds: string[];
  filterPresets: FilterPreset[];
  hasNewNotification: boolean;

  setFilters: (filters: Partial<JobFilters>) => void;
  resetFilters: () => void;
  setSort: (sort: SortField) => void;
  toggleSelectedId: (id: string) => void;
  selectAllIds: (ids: string[]) => void;
  clearSelectedIds: () => void;
  saveFilterPreset: (name: string) => void;
  loadFilterPreset: (preset: FilterPreset) => void;
  deleteFilterPreset: (id: string) => void;
  setHasNewNotification: (value: boolean) => void;
}

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      filters: DEFAULT_FILTERS,
      sort: "score",
      selectedIds: [],
      filterPresets: [],
      hasNewNotification: false,

      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      setSort: (sort) => set({ sort }),

      toggleSelectedId: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((i) => i !== id)
            : [...state.selectedIds, id],
        })),

      selectAllIds: (ids) => set({ selectedIds: ids }),
      clearSelectedIds: () => set({ selectedIds: [] }),

      saveFilterPreset: (name) => {
        const { filters, sort } = get();
        const preset: FilterPreset = {
          id: crypto.randomUUID(),
          name,
          filters,
          sort,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          filterPresets: [...state.filterPresets, preset],
        }));
      },

      loadFilterPreset: (preset) =>
        set({
          filters: { ...DEFAULT_FILTERS, ...preset.filters },
          sort: preset.sort,
        }),

      deleteFilterPreset: (id) =>
        set((state) => ({
          filterPresets: state.filterPresets.filter((p) => p.id !== id),
        })),

      setHasNewNotification: (value) => set({ hasNewNotification: value }),
    }),
    {
      name: "jobsai-store",
      partialize: (state) => ({
        sort: state.sort,
        filterPresets: state.filterPresets,
      }),
    }
  )
);
