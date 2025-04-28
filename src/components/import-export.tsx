import { useRef, useState } from "react";
import * as z from "zod";
import { useShallow } from "zustand/shallow";
import { type Build, useBuildsStore } from "../store/use-builds";
import Button from "./button.tsx";
import Checkbox from "./checkbox.tsx";

const importSchema = z.object({
    builds: z
        .object({
            name: z.string(),
            items: z.record(z.string(), z.string().array()),
        })
        .array()
        .nonempty(),
    acquiredItems: z.string().array().optional(),
});

export default function ImportExport() {
    const [error, setError] = useState<string | undefined>();
    const formRef = useRef<HTMLFormElement>(null);
    const importRef = useRef<HTMLInputElement>(null);
    const [selectedSave, setSelectedSave] = useState<string | undefined>(
        undefined,
    );
    const [newSaveName, setNewSaveName] = useState<string | undefined>();
    const { acquiredItems, builds, saves, importBuilds } = useBuildsStore(
        useShallow((state) => ({
            builds: state.getSaveBuilds(),
            acquiredItems: state.getSaveAcquiredItems(),
            saves: state.saves,
            importBuilds: state.importBuilds,
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
        if (selectedBuilds.length === 0) {
            setError("Select at least one build");
            return;
        }

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

    const handleImport = () => {
        const file = importRef.current?.files?.[0];
        if (!file) {
            setError("No file selected.");
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            let parsed: unknown;
            try {
                const text = e.target?.result as string;
                parsed = JSON.parse(text);
            } catch (err) {
                setError("Invalid JSON file.");
                return;
            }

            const test = importSchema.safeParse(parsed);

            if (!test.success) {
                setError("Failed did not contain valid data to import");
                return;
            }

            if (!selectedSave) {
                if (newSaveName === undefined) {
                    setError("Select a save to import");
                    return;
                }
                if (newSaveName === "") {
                    setError("Must enter a name for a new save");
                    return;
                }
            }

            importBuilds(
                (selectedSave || newSaveName) as string,
                test.data.builds,
                test.data.acquiredItems || [],
            );

            formRef.current?.reset();
            setSelectedSave(undefined);
            setNewSaveName(undefined);
        };

        reader.onerror = () => {
            setError("Failed to read file.");
        };

        reader.readAsText(file);
    };

    const handleExistingSaveSelect = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setSelectedSave(e.currentTarget.value);
        setNewSaveName(undefined);
    };

    const handleNewSaveSelect = () => {
        setSelectedSave(undefined);
        setNewSaveName("");
    };

    return (
        <>
            <h2 className="text-xl font-title mb-4">Import/export</h2>
            {error}
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
                    <form ref={formRef}>
                        <h3 className="font-title text-lg mb-4">Import</h3>
                        <p>
                            <input type="file" accept=".json" ref={importRef} />
                        </p>
                        <p>
                            Select save to import to:
                            <ul>
                                {Object.keys(saves).map((save, i) => (
                                    <li key={save}>
                                        <label htmlFor={`save-${i}`}>
                                            <input
                                                type="radio"
                                                name="save"
                                                id={`save-${i}`}
                                                checked={save === selectedSave}
                                                value={save}
                                                onChange={
                                                    handleExistingSaveSelect
                                                }
                                            />
                                            {save}
                                        </label>
                                    </li>
                                ))}
                                <li>
                                    <label htmlFor="new">
                                        <input
                                            type="radio"
                                            name="save"
                                            id="new"
                                            checked={newSaveName !== undefined}
                                            onChange={handleNewSaveSelect}
                                        />
                                        New
                                    </label>
                                </li>
                                {newSaveName !== undefined && (
                                    <li>
                                        <input
                                            type="text"
                                            value={newSaveName}
                                            onChange={(e) =>
                                                setNewSaveName(
                                                    e.currentTarget.value,
                                                )
                                            }
                                            placeholder="Name of new save..."
                                            className="block w-full rounded-md bg-gray-darker py-1.5 pl-3 pr-3 text-base text-text outline -outline-offset-1 outline-neutral-700 placeholder:text-neutral-400 focus:outline focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                        />
                                    </li>
                                )}
                            </ul>
                        </p>
                        <Button onClick={handleImport}>Import</Button>
                    </form>
                </div>
            </div>
        </>
    );
}
