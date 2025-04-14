import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Build = {
    name: string;
    items: Record<string, string[]>;
};

interface BuildsState {
    builds: [Build, ...Build[]];
    acquiredItems: string[];
    selectedBuildIndex: number;
    selectBuild: (index: number) => void;
    addBuild: (name: string) => void;
    renameBuild: (index: number, name: string) => void;
    removeBuild: (index: number) => void;
    addItem: (type: string, item: string) => void;
    removeItem: (type: string, item: string) => void;
    acquireItem: (item: string) => void;
    unacquireItem: (item: string) => void;
    isAcquired: (item: string) => boolean;
}

const defaultBuild = {
    name: "Build 1",
    items: {},
};

export const useBuildsStore = create<BuildsState>()(
    persist(
        immer((set, get) => ({
            builds: [defaultBuild],
            acquiredItems: [],
            selectedBuildIndex: 0,
            selectBuild: (index: number) =>
                set(() => ({ selectedBuildIndex: index })),
            addBuild: (name) =>
                set((state) => {
                    state.builds.push({ name, items: {} });
                }),
            renameBuild: (index: number, name: string) =>
                set((state) => {
                    state.builds[index].name = name;
                }),
            removeBuild: (index: number) =>
                set((state) => {
                    state.builds.splice(index, 1);
                    if (index >= state.builds.length) {
                        state.selectedBuildIndex = state.builds.length - 1;
                    }
                    if (state.builds.length === 0) {
                        state.builds = [defaultBuild];
                        state.selectedBuildIndex = 0;
                    }
                }),
            addItem: (type, item) =>
                set((state) => {
                    state.builds.map((build, i) => {
                        if (i !== state.selectedBuildIndex) {
                            return;
                        }

                        if (!build.items[type]) {
                            build.items[type] = [];
                        }

                        if (build.items[type].includes(item)) {
                            return;
                        }

                        build.items[type].push(item);
                    });
                }),
            removeItem: (type, item) =>
                set((state) => {
                    state.builds.map((build, i) => {
                        if (i !== state.selectedBuildIndex) {
                            return;
                        }

                        build.items[type] = build.items[type].filter(
                            (addedItem) => addedItem !== item,
                        );
                    });
                }),
            acquireItem: (item) =>
                set((state) => {
                    state.acquiredItems.push(item);
                }),
            unacquireItem: (itemToRemove) =>
                set((state) => {
                    state.acquiredItems = state.acquiredItems.filter(
                        (item) => itemToRemove !== item,
                    );
                }),
            isAcquired: (item) => get().acquiredItems.includes(item),
        })),
        { name: "bg3-gear-tracker", version: 1 },
    ),
);
