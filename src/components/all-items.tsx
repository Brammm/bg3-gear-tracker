import { ChevronDown, ChevronUp, ListX } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { items } from "../data/items";
import { locations } from "../data/locations";
import { useBuildsStore } from "../store/use-builds";
import { fuzzyIncludes } from "../util";
import Button from "./button.tsx";
import ItemRow, { type ItemWithBuilds } from "./item-row.tsx";

type SortKey = "name" | "location" | "type" | "builds";
type SortDirection = "asc" | "desc";

export default function AllItems() {
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [filter, setFilter] = useState<string>("");

    const { builds } = useBuildsStore(
        useShallow((state) => ({
            builds: state.getSaveBuilds(),
        })),
    );

    const uniqueItems = useMemo(() => {
        const allItemUrls = [
            ...new Set(
                builds.flatMap((build) => Object.values(build.items)).flat(),
            ),
        ];
        const itemBuildMap = new Map<string, string[]>();

        for (const build of builds) {
            for (const urls of Object.values(build.items)) {
                for (const url of urls) {
                    if (!itemBuildMap.has(url)) {
                        itemBuildMap.set(url, []);
                    }
                    itemBuildMap.get(url)?.push(build.name);
                }
            }
        }

        const uniqueItemList: ItemWithBuilds[] = allItemUrls
            .map((url) => {
                const item = items.find((item) => item.url === url);
                if (!item) {
                    return null; // Filter out non-existing items
                }

                const act = item.location
                    ? locations.get(item.location)
                    : undefined;

                return {
                    ...item,
                    builds: (itemBuildMap.get(item.url) ?? []).join(", "),
                    location: act ? `${act}: ${item.location}` : item.location,
                };
            })
            .filter((item) => item !== null)
            .filter((item) => {
                if (!filter) {
                    return true;
                }

                return (
                    fuzzyIncludes(item.name, filter) ||
                    !item.location ||
                    fuzzyIncludes(item.location, filter)
                );
            });

        uniqueItemList.sort((a, b) => {
            // Use item property for other sort keys
            const valA = a[sortKey] ?? "";
            const valB = b[sortKey] ?? "";
            const comparison = valA.localeCompare(valB);

            // Apply direction
            return sortDirection === "asc" ? comparison : -comparison;
        });

        return uniqueItemList;
    }, [builds, sortKey, sortDirection, filter]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };

    const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
        if (sortKey !== columnKey) {
            return null;
        }
        return sortDirection === "asc" ? (
            <ChevronUp className="inline ml-1 size-4" />
        ) : (
            <ChevronDown className="inline ml-1 size-4" />
        );
    };

    const TableHeader = ({
        children,
        sortKey,
    }: { children: ReactNode; sortKey: SortKey }) => (
        <th scope="col">
            <button
                className="w-full hover:bg-black px-3 py-3.5 inline-flex justify-between"
                type="button"
                onClick={() => handleSort(sortKey)}
            >
                {children}
                <SortIcon columnKey={sortKey} />
            </button>
        </th>
    );

    return (
        <>
            <h2 className="text-xl font-title mb-4">All Unique Items Used</h2>
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Filter by name or location..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="block w-full rounded-md bg-gray-darker py-1.5 pl-3 pr-3 text-base text-text outline -outline-offset-1 outline-neutral-700 placeholder:text-neutral-400 focus:outline focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                />
                {filter && (
                    <Button onClick={() => setFilter("")}>
                        <ListX className="size-4 mr-2" /> Clear
                    </Button>
                )}
            </div>
            {uniqueItems.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-darker text-sm font-medium divide-y divide-neutral-700">
                        <thead>
                            <tr>
                                <th />
                                <TableHeader sortKey="name">Name</TableHeader>
                                <TableHeader sortKey="location">
                                    Location
                                </TableHeader>
                                <TableHeader sortKey="type">Type</TableHeader>
                                <TableHeader sortKey="builds">
                                    Builds
                                </TableHeader>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {uniqueItems.map((item) => (
                                <ItemRow item={item} key={item.url} />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-neutral-400">
                    No items added to any build yet.
                </p>
            )}
        </>
    );
}
