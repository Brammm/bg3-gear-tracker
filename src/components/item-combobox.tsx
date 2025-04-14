import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import type { Item } from "../data/rarity.ts";
import ItemName from "./item-name.tsx";
import Button from './button.tsx';

type Props = { items: Item[]; onAdd: (item: Item) => void };

export default function ItemCombobox({ items, onAdd }: Props) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [query, setQuery] = useState("");

    const filteredItems =
        query === ""
            ? items
            : items.filter((item) =>
                  item.name.toLowerCase().includes(query.toLowerCase()),
              );

    const handleAdd = () => {
        if (!selectedItem) {
            return;
        }
        onAdd(selectedItem);
    };

    return (
        <div className="flex items-center gap-x-2">
            <Combobox
                as="div"
                value={selectedItem}
                onChange={setSelectedItem}
                onClose={() => setQuery("")}
            >
                <div className="relative max-w-64">
                    <ComboboxInput
                        aria-label="Item"
                        className="block w-full rounded-md bg-gray-darker py-1.5 pl-3 pr-12 text-base text-text outline -outline-offset-1 outline-neutral-700 placeholder:text-neutral-400 focus:outline focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                        displayValue={(item: Item | null) => item?.name ?? ""}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Select item..."
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <ChevronsUpDown
                            className="size-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </ComboboxButton>
                    <ComboboxOptions
                        anchor="bottom"
                        className="absolute z-10 mt-1 max-h-56 max-w-64 overflow-auto rounded-md bg-gray-dark py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    >
                        {filteredItems.map((item) => (
                            <ComboboxOption
                                key={item.name}
                                value={item}
                                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-primary data-[focus]:text-white data-[focus]:outline-none"
                            >
                                <div className="flex items-center group-data-[selected]:font-semibold">
                                    <ItemName item={item} />
                                </div>

                                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-primary group-data-[selected]:flex group-data-[focus]:text-white">
                                    <Check
                                        className="size-5"
                                        aria-hidden="true"
                                    />
                                </span>
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                </div>
            </Combobox>
            <Button onClick={handleAdd} title="Add item" disabled={!selectedItem}>
                <Plus className="size-4" />
            </Button>
        </div>
    );
}
