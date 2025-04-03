import { useMemo } from "react";
import type { Item } from "../App.tsx";
import equipment from "../data/equipment.json";
import { useBuildsStore } from "../store/use-builds.ts";
import ItemCombobox from "./item-combobox.tsx";
import ItemName from "./item-name.tsx";

const allItems = equipment.flatMap((type) => type.items);

export default function GearSelector() {
    const rawItems = useBuildsStore(
        (state) => state.builds[state.selectedBuild].items,
    );
    const addItem = useBuildsStore((state) => state.addItem);
    const removeItem = useBuildsStore((state) => state.removeItem);

    const selectedItems = useMemo(() => {
        return Object.entries(rawItems).reduce<Record<string, Item[]>>(
            (acc, [type, urls]) => {
                if (!acc[type]) {
                    acc[type] = [];
                }

                for (const url of urls) {
                    const item = allItems.find((item) => item.url === url);
                    if (!item) {
                        continue;
                    }
                    acc[type].push(item);
                }

                acc[type].sort((a, b) => a.name.localeCompare(b.name));

                return acc;
            },
            {},
        );
    }, [rawItems]);

    return (
        <div>
            {equipment.map((type) => (
                <div key={type.name}>
                    <h2 className="flex items-center">
                        <img
                            src={type.thumbnail}
                            alt={type.name}
                            className="size-6 shrink-0"
                        />
                        <span className="ml-3">{type.name}</span>
                    </h2>
                    <ul>
                        {selectedItems[type.name]?.map((item) => (
                            <li key={item.url} className="flex">
                                <ItemName item={item} addLink />
                                <button
                                    type="button"
                                    onClick={() => {
                                        removeItem(type.name, item.url);
                                    }}
                                >
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                    <ItemCombobox
                        items={type.items}
                        onAdd={(item) => {
                            addItem(type.name, item.url);
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
