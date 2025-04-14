import clsx from "clsx";
import { X } from "lucide-react";
import { useMemo } from "react";
import { equipment } from "../data/equipment";
import type { Item } from "../data/rarity.ts";
import { useBuildsStore } from "../store/use-builds.ts";
import Button from "./button.tsx";
import Checkbox from "./checkbox.tsx";
import ItemCombobox from "./item-combobox.tsx";
import ItemName from "./item-name.tsx";

const allItems = equipment.flatMap((type) => type.items);

export default function GearSelector() {
    const rawItems = useBuildsStore(
        (state) => state.builds[state.selectedBuildIndex].items,
    );
    const addItem = useBuildsStore((state) => state.addItem);
    const removeItem = useBuildsStore((state) => state.removeItem);
    const acquiredItems = useBuildsStore((state) => state.acquiredItems);
    const acquireItem = useBuildsStore((state) => state.acquireItem);
    const unacquireItem = useBuildsStore((state) => state.unacquireItem);

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
        <div className="grid lg:grid-cols-2 gap-4 mt-8">
            {equipment.map((type) => (
                <div key={type.name} className="bg-gray-darker p-4">
                    <div className="lg:flex items-center justify-between mb-4">
                        <h2 className="flex items-center mb-2 lg:mb-0">
                            <img
                                src={type.thumbnail}
                                alt={type.name}
                                className="size-6 shrink-0"
                            />
                            <span className="ml-3 font-title">{type.name}</span>
                        </h2>
                        <ItemCombobox
                            items={type.items}
                            onAdd={(item) => {
                                addItem(type.name, item.url);
                            }}
                        />
                    </div>
                    <ul>
                        {selectedItems[type.name]?.map((item) => {
                            const itemAcquired = acquiredItems.includes(
                                item.url,
                            );
                            return (
                                <li
                                    key={item.url}
                                    className="flex items-center justify-between"
                                >
                                    <div
                                        className={clsx(
                                            "flex gap-4",
                                            itemAcquired && "line-through",
                                        )}
                                    >
                                        <Checkbox
                                            checked={itemAcquired}
                                            onChange={(checked) => {
                                                if (checked) {
                                                    acquireItem(item.url);
                                                } else {
                                                    unacquireItem(item.url);
                                                }
                                            }}
                                        />
                                        <ItemName item={item} addLink />
                                    </div>
                                    <Button
                                        onClick={() => {
                                            removeItem(type.name, item.url);
                                        }}
                                        small
                                        title="Remove item"
                                    >
                                        <X className="size-3" />
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}
