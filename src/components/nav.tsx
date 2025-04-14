import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    Pencil,
    Plus,
    X,
} from "lucide-react";
import { type Build, useBuildsStore } from "../store/use-builds.ts";
import Button from "./button.tsx";

export default function Nav() {
    const {
        builds,
        addBuild,
        selectBuild,
        selectedBuildIndex,
        renameBuild,
        removeBuild,
    } = useBuildsStore();

    const selected = builds[selectedBuildIndex];
    const setSelected = (build: Build) => {
        selectBuild(builds.indexOf(build));
    };

    const selectPrevious = () => {
        selectBuild(selectedBuildIndex - 1);
    };
    const selectNext = () => {
        selectBuild(selectedBuildIndex + 1);
    };
    const handleAdd = () => {
        const name = prompt("Enter name");
        if (!name) {
            return;
        }

        addBuild(name);
    };

    const handleRename = (i: number) => () => {
        const name = prompt("Enter name");
        if (!name) {
            return;
        }

        renameBuild(i, name);
    };

    const handleRemove = (i: number) => () => {
        removeBuild(i);
    };

    return (
        <div>
            <div className="flex items-center justify-center gap-x-4 mb-4">
                <Button
                    disabled={selectedBuildIndex === 0}
                    onClick={selectPrevious}
                    small
                >
                    <ChevronLeft />
                </Button>
                <Listbox value={selected} onChange={setSelected}>
                    <div className="relative grow md:grow-0 md:w-64">
                        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-darker py-1.5 pl-3 pr-2 text-left text-text outline outline-1 -outline-offset-1 outline-neutral-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6">
                            <span className="col-start-1 row-start-1 truncate pr-6">
                                {selected.name}
                            </span>
                            <ChevronsUpDown
                                aria-hidden="true"
                                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />
                        </ListboxButton>

                        <ListboxOptions
                            transition
                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-dark py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                        >
                            {builds.map((build, i) => (
                                <ListboxOption
                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                    key={i}
                                    value={build}
                                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-text data-[focus]:bg-primary data-[focus]:text-white data-[focus]:outline-none"
                                >
                                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                        {build.name}
                                    </span>

                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                                        <Check
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </span>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                </Listbox>
                <Button
                    disabled={selectedBuildIndex === builds.length - 1}
                    onClick={selectNext}
                    small
                >
                    <ChevronRight />
                </Button>
            </div>
            <div className="flex items-center justify-center gap-x-4 [&>*]:grow md:[&>*]:grow-0">
                <Button onClick={handleAdd}>
                    <Plus className="size-4 mr-3" />
                    Add Build
                </Button>
                <Button onClick={handleRename(selectedBuildIndex)}>
                    <Pencil className="size-4 mr-3" />
                    Rename
                </Button>
                <Button onClick={handleRemove(selectedBuildIndex)}>
                    <X className="size-4 mr-3" />
                    Remove
                </Button>
            </div>
        </div>
    );
}
