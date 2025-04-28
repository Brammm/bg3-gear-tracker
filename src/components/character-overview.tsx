import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { type Item, equipment } from "../data/equipment.ts";
import { items } from "../data/items";
import { useBuildsStore } from "../store/use-builds.ts";
import Checkbox from "./checkbox.tsx";
import ItemName from "./item-name.tsx";

export default function CharacterOverview() {
    const { acquiredItems, acquireItem, unacquireItem, rawItems } =
        useBuildsStore(
            useShallow((state) => ({
                acquiredItems: state.getSaveAcquiredItems(),
                acquireItem: state.acquireItem,
                unacquireItem: state.unacquireItem,
                rawItems: state.getSaveSelectedBuild().items,
            })),
        );

    const selectedItems = useMemo(() => {
        return Object.entries(rawItems).reduce<Record<string, Item[]>>(
            (acc, [type, urls]) => {
                if (!acc[type]) {
                    acc[type] = [];
                }

                for (const url of urls) {
                    const item = items.find((item) => item.url === url);
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
        <div className="grid md:grid-cols-2 gap-4 mt-8">
            {equipment.map((type) => (
                <div key={type.name} className="bg-gray-darker p-4">
                    <div className="md:flex items-center justify-between mb-4">
                        <h2 className="flex items-center mb-2 md:mb-0">
                            <img
                                src={type.thumbnail}
                                alt={type.name}
                                className="size-6 shrink-0"
                            />
                            <span className="ml-3 font-title">{type.name}</span>
                        </h2>
                    </div>
                    <ul>
                        {selectedItems[type.name]?.map((item) => {
                            const itemAcquired = acquiredItems.includes(
                                item.url,
                            );
                            return (
                                <li
                                    key={item.url}
                                    className="flex items-center justify-between py-1"
                                >
                                    <div className="flex gap-4">
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
                                        <ItemName
                                            acquired={itemAcquired}
                                            item={item}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}
