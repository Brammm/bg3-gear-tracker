import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { useBuildsStore } from "../store/use-builds";
import Button from "./button";

export default function SaveSelection() {
    const { addSave, deleteSave, openSave, saves, selectedSave } =
        useBuildsStore(
            useShallow((state) => ({
                saves: state.saves,
                selectedSave: state.selectedSave,
                openSave: state.openSave,
                addSave: state.addSave,
                deleteSave: state.deleteSave,
            })),
        );

    const handleAdd = () => {
        const name = prompt(
            "Enter name",
            `Save ${Object.keys(saves).length + 1}`,
        );
        if (!name) {
            return;
        }

        addSave(name);
    };

    const handleRemove = () => {
        if (!selectedSave) {
            return;
        }

        if (
            confirm(
                "Are you sure? All builds associated with this save will be removed.",
            )
        ) {
            deleteSave(selectedSave);
        }
    };

    return (
        <div className="lg:flex items-center">
            <Listbox value={selectedSave} onChange={openSave}>
                <div className="relative grow md:grow-0 md:w-48 mr-2">
                    <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-darker py-1.5 pl-3 pr-2 text-left text-text outline outline-1 -outline-offset-1 outline-neutral-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6">
                        <span className="col-start-1 row-start-1 truncate pr-6">
                            {selectedSave || <i>No save</i>}
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
                        {Object.keys(saves).map((save) => (
                            <ListboxOption
                                key={save}
                                value={save}
                                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-text data-[focus]:bg-primary data-[focus]:text-white data-[focus]:outline-none"
                            >
                                <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                    {save || <i>No save</i>}
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
            {selectedSave && (
                <Button onClick={handleRemove}>
                    <X className="size-4 mr-2" />
                    Remove
                </Button>
            )}
            <Button onClick={handleAdd}>
                <Plus className="size-4 mr-2" />
                Add save
            </Button>
        </div>
    );
}
