import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type Build = {
    name: string;
    items: Record<string, string[]>;
};

interface BuildsState {
    builds: [Build, ...Build[]];
    selectedBuild: number;
    selectBuild: (index: number) => void;
    addBuild: (name: string) => void;
    selectItem: (type: string, item: string) => void;
}

export const useBuildsStore = create<BuildsState>()(
    persist(
        immer((set) => ({
            builds: [
                {
                    name: "Build 1",
                    items: {},
                },
            ],
            selectedBuild: 0,
            selectBuild: (index: number) =>
                set(() => ({ selectedBuild: index + 1 })),
            addBuild: (name) =>
                set((state) => {
                    state.builds.push({ name, items: {} });
                }),
            selectItem: (type, item) =>
                set((state) => {
                    state.builds.map((build, i) => {
                        if (i !== state.selectedBuild) {
                            return;
                        }
                        if (!build.items[type]) {
                            build.items[type] = [];
                        }
                        build.items[type].push(item);
                    });
                }),
        })),
        { name: "bg3-gear-tracker", version: 1 },
    ),
);
