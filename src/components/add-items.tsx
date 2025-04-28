import { ListTodo, ListX, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { equipment } from "../data/equipment";
import { items } from "../data/items";
import { useBuildsStore } from "../store/use-builds";
import { fuzzyIncludes } from "../util";
import Button from "./button";
import ItemName from "./item-name";

type Filter = {
    name: string;
    type?: string;
    selectedOnly: boolean;
};

const defaultFilter: Filter = {
    name: "",
    selectedOnly: false,
};

export default function AddItems() {
    const { rawItems, addItem, removeItem } = useBuildsStore(
        useShallow((state) => ({
            rawItems: state.getSaveSelectedBuild().items,
            addItem: state.addItem,
            removeItem: state.removeItem,
        })),
    );

    const [filter, setFilter] = useState<Filter>(defaultFilter);

    const filteredItems = useMemo(() => {
        if (!filter.name && !filter.type && !filter.selectedOnly) {
            return [];
        }

        // Flatten selected items for easier lookup if filtering by selected
        const selectedUrls = filter.selectedOnly
            ? new Set(Object.values(rawItems).flat())
            : null;

        return items.filter((item) => {
            const selectedMatch = selectedUrls
                ? selectedUrls.has(item.url)
                : true;
            const nameMatch = filter.name
                ? fuzzyIncludes(item.name, filter.name)
                : true;
            const typeMatch = filter.type ? item.type === filter.type : true;
            return selectedMatch && nameMatch && typeMatch;
        });
    }, [filter, rawItems]);

    return (
        <div className="mt-8">
            <h3 className="text-lg font-title mb-4">Filter items</h3>
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Name..."
                    value={filter.name}
                    onChange={(e) =>
                        setFilter((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="block w-full rounded-md bg-gray-darker py-1.5 pl-3 pr-3 text-base text-text outline -outline-offset-1 outline-neutral-700 placeholder:text-neutral-400 focus:outline focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                />
                <Button
                    onClick={() =>
                        setFilter((prev) => ({
                            ...prev,
                            selectedOnly: !filter.selectedOnly,
                        }))
                    }
                    active={filter.selectedOnly}
                    title="Filter selected items"
                >
                    <ListTodo className="size-4 mr-2" /> Selected
                </Button>
                {(filter.name || filter.type || filter.selectedOnly) && (
                    <Button onClick={() => setFilter(defaultFilter)}>
                        <ListX className="size-4 mr-2" /> Clear
                    </Button>
                )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {equipment.map((type) => (
                    <Button
                        key={type.name}
                        onClick={() =>
                            setFilter((prev) => ({
                                ...prev,
                                type:
                                    filter.type === type.name
                                        ? undefined
                                        : type.name,
                            }))
                        }
                        small
                        active={filter.type === type.name}
                    >
                        <img
                            src={type.thumbnail}
                            alt={type.name}
                            className="size-4 mr-2"
                        />
                        {type.name}
                    </Button>
                ))}
            </div>
            <div className="bg-gray-darker p-4 text-neutral-400">
                {filter.name || filter.type || filter.selectedOnly ? (
                    <ul>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <li
                                    key={item.url}
                                    className="flex items-center justify-between py-1 hover:bg-gray-dark"
                                >
                                    <ItemName item={item} />
                                    {rawItems[item.type]?.includes(item.url) ? (
                                        <Button
                                            onClick={() =>
                                                removeItem(item.type, item.url)
                                            }
                                            small
                                            title="Remove item"
                                        >
                                            <X className="size-3 mr-1" /> Remove
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                addItem(item.type, item.url)
                                            }
                                            small
                                            title="Add item"
                                        >
                                            <Plus className="size-3 mr-1" /> Add
                                        </Button>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="text-neutral-400">
                                No items found.
                            </li>
                        )}
                    </ul>
                ) : (
                    <p>Apply some filters first...</p>
                )}
            </div>
        </div>
    );
}
