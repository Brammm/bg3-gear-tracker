import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Build = {
    name: string;
    items: Record<string, string[]>;
};

export type Save = {
    builds: [Build, ...Build[]];
    acquiredItems: string[];
};

type Saves = Record<string, Save>;

interface BuildsState {
    saves: Saves;
    selectedSave: string;
    selectedBuildIndex: number;
    selectBuild: (index: number) => void;
    addSave: (name: string) => void;
    deleteSave: (name: string) => void;
    openSave: (name?: string) => void;
    addBuild: (name: string) => void;
    renameBuild: (index: number, name: string) => void;
    removeBuild: (index: number) => void;
    addItem: (type: string, item: string) => void;
    removeItem: (type: string, item: string) => void;
    acquireItem: (item: string) => void;
    unacquireItem: (item: string) => void;
    getSaveBuilds: () => [Build, ...Build[]];
    getSaveAcquiredItems: () => string[];
    getSaveSelectedBuild: () => Build;
}

const defaultBuild: Build = {
    name: "Tav",
    items: {},
};

const defaultSaves: Saves = {
    "Save 1": {
        builds: [defaultBuild],
        acquiredItems: [],
    },
};

export const useBuildsStore = create<BuildsState>()(
    persist(
        immer((set, get) => ({
            saves: defaultSaves,
            selectedSave: "Save 1",
            builds: [defaultBuild],
            acquiredItems: [],
            selectedBuildIndex: 0,
            selectBuild: (index: number) => {
                set(() => ({ selectedBuildIndex: index }));
            },
            addSave: (name: string) => {
                if (get().saves[name]) {
                    return;
                }

                set((state) => {
                    state.saves[name] = {
                        builds: [defaultBuild],
                        acquiredItems: [],
                    };
                    state.selectedSave = name;
                    state.selectedBuildIndex = 0;
                });
            },
            deleteSave: (name: string) =>
                set((state) => {
                    delete state.saves[name];
                    if (Object.keys(state.saves).length === 0) {
                        state.saves = defaultSaves;
                    }
                    // biome-ignore lint/style/noNonNullAssertion: We know this is non-empty
                    state.selectedSave = Object.keys(state.saves).at(-1)!;
                    state.selectedBuildIndex = 0;
                }),
            openSave: (name?: string) => {
                set(() => ({ selectedSave: name, selectedBuildIndex: 0 }));
            },
            addBuild: (name) => {
                set((state) => {
                    state.saves[state.selectedSave].builds.push({
                        name,
                        items: {},
                    });
                    state.selectedBuildIndex =
                        state.saves[state.selectedSave].builds.length - 1;
                });
            },
            renameBuild: (index: number, name: string) => {
                set((state) => {
                    state.saves[state.selectedSave].builds[index].name = name;
                });
            },
            removeBuild: (index: number) => {
                set((state) => {
                    state.saves[state.selectedSave].builds.splice(index, 1);
                    if (
                        index >= state.saves[state.selectedSave].builds.length
                    ) {
                        state.selectedBuildIndex =
                            state.saves[state.selectedSave].builds.length - 1;
                    }
                    if (state.saves[state.selectedSave].builds.length === 0) {
                        state.saves[state.selectedSave] = {
                            builds: [defaultBuild],
                            acquiredItems: [],
                        };
                        state.selectedBuildIndex = 0;
                    }
                });
            },
            addItem: (type, item) => {
                set((state) => {
                    state.saves[state.selectedSave].builds.map((build, i) => {
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
                });
            },
            removeItem: (type, item) => {
                set((state) => {
                    state.saves[state.selectedSave].builds.map((build, i) => {
                        if (i !== state.selectedBuildIndex) {
                            return;
                        }

                        build.items[type] = build.items[type].filter(
                            (addedItem) => addedItem !== item,
                        );
                    });
                });
            },
            acquireItem: (item) => {
                set((state) => {
                    if (
                        state.saves[state.selectedSave].acquiredItems.includes(
                            item,
                        )
                    ) {
                        return;
                    }

                    state.saves[state.selectedSave].acquiredItems.push(item);
                });
            },
            unacquireItem: (itemToRemove) => {
                set((state) => {
                    state.saves[state.selectedSave].acquiredItems = state.saves[
                        state.selectedSave
                    ].acquiredItems.filter((item) => itemToRemove !== item);
                });
            },
            getSaveBuilds: () => get().saves[get().selectedSave].builds,
            getSaveAcquiredItems: () =>
                get().saves[get().selectedSave].acquiredItems,
            getSaveSelectedBuild: () =>
                get().saves[get().selectedSave].builds[
                    get().selectedBuildIndex
                ],
        })),
        {
            name: "bg3-gear-tracker",
            version: 2,
            migrate: (persistedState, version) => {
                if (version === 1) {
                    return {
                        saves: {
                            "Save 1": {
                                // @ts-expect-error
                                builds: persistedState.builds,
                                // @ts-expect-error
                                acquiredItems: persistedState.acquiredItems,
                            },
                        },
                    };
                }
            },
        },
    ),
);
