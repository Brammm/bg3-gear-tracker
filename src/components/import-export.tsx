import { useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { type Build, useBuildsStore } from "../store/use-builds";
import Button from "./button.tsx";
import Checkbox from "./checkbox.tsx";

export default function ImportExport() {
    const { acquiredItems, builds } = useBuildsStore(
        useShallow((state) => ({
            builds: state.getSaveBuilds(),
            acquiredItems: state.getSaveAcquiredItems(),
        })),
    );

    const [selectedBuilds, setSelectedBuilds] = useState<number[]>([]);
    const handleChange = (i: number) => (selected: boolean) => {
        if (selected) {
            setSelectedBuilds((prevBuilds) => [...prevBuilds, i]);
        } else {
            setSelectedBuilds((prevBuilds) =>
                prevBuilds.filter((other) => other !== i),
            );
        }
    };
    const [exportAcquired, setExportAcquired] = useState<boolean>(false);
    const handleExport = () => {
        const data: { builds?: Build[]; acquiredItems?: string[] } = {};

        data.builds = builds.filter((_, i) => selectedBuilds.includes(i));
        if (exportAcquired) {
            data.acquiredItems = acquiredItems;
        }

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "bg3-gear-tracker-export.json";
        link.click();

        URL.revokeObjectURL(url); // cleanup
    };

    const [error, setError] = useState<string | undefined>();
    const importRef = useRef<HTMLInputElement>(null);

    const handleImport = () => {
        const file = importRef.current?.files?.[0];
        setError("No file selected.");
        console.log("No file");
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const parsed = JSON.parse(text);

                console.log(parsed);
            } catch (err) {
                setError("Invalid JSON file.");
            }
        };

        reader.onerror = () => {
            setError("Failed to read file.");
        };

        reader.readAsText(file);
    };

    return (
        <>
            <h2 className="text-xl font-title mb-4">Import/export</h2>
            <div className="lg:grid grid-cols-2 gap-x-4">
                <div className="bg-gray-darker p-4">
                    <h3 className="font-title text-lg mb-4">Export</h3>
                    <em className="font-italic text-neutral-400">
                        Select which builds to export
                    </em>
                    <ul className="mt-4">
                        {builds.map((build, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            <li key={i} className="flex items-center gap-x-2">
                                <Checkbox
                                    checked={selectedBuilds.includes(i)}
                                    onChange={handleChange(i)}
                                />
                                {build.name}
                            </li>
                        ))}
                    </ul>
                    <hr className="my-4" />
                    <p className="flex items-center gap-x-2 mb-4">
                        <Checkbox
                            checked={exportAcquired}
                            onChange={(checked) => setExportAcquired(checked)}
                        />{" "}
                        Export acquired items
                    </p>
                    <Button onClick={handleExport}>Export</Button>
                </div>
                <div className="bg-gray-darker p-4">
                    <h3 className="font-title text-lg mb-4">Import</h3>
                    <p>
                        <input type="file" accept=".json" ref={importRef} />
                    </p>
                    {error}
                    <Button onClick={handleImport} disabled>
                        Import
                    </Button>
                </div>
            </div>
        </>
    );
}
