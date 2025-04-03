import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type Build = {
    name: string;
    items: {
        type: string;
        item: string[];
    }[]
}

interface BuildsState {
    builds: [ Build, ...Build[] ];
    addBuild: (name: string) => void;
}

export const useBuildsStore = create<BuildsState>()(persist(immer((set) => ({
    builds: [
        {
            name: 'Build 1',
            items: [],
        },
    ],
    addBuild: (name) => set((state) => {
        state.builds.push({name, items: []});
    }),
})), { name: 'bg3-gear-tracker', version: 1 }));
