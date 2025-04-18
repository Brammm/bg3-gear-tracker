import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import type { Item } from "../data/equipment.ts";
import { useBuildsStore } from "../store/use-builds.ts";
import Checkbox from "./checkbox.tsx";
import ItemName from "./item-name.tsx";

export type ItemWithBuilds = Item & { builds: string };

type Props = {
    item: ItemWithBuilds;
};

export default function ItemRow({ item }: Props) {
    const { acquiredItems, acquireItem, unacquireItem } = useBuildsStore(
        useShallow((state) => ({
            acquiredItems: state.acquiredItems,
            acquireItem: state.acquireItem,
            unacquireItem: state.unacquireItem,
        })),
    );
    const itemAcquired = acquiredItems.includes(item.url);

    return (
        <tr>
            <td className="whitespace-nowrap px-4 py-2 w-1">
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
            </td>
            <td className="whitespace-nowrap px-4 py-2">
                <ItemName
                    item={item}
                    showLocation={false}
                    acquired={itemAcquired}
                />
            </td>
            <td
                className={clsx(
                    "whitespace-nowrap px-4 py-2 text-neutral-400",
                    itemAcquired && "line-through",
                )}
            >
                {item.location}
            </td>
            <td
                className={clsx(
                    "whitespace-nowrap px-4 py-2 text-neutral-400",
                    itemAcquired && "line-through",
                )}
            >
                {item.type}
            </td>
            <td
                className={clsx(
                    "whitespace-nowrap px-4 py-2 text-neutral-400",
                    itemAcquired && "line-through",
                )}
            >
                {item.builds}
            </td>
        </tr>
    );
}
