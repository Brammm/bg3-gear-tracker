import { useState } from "react";
import GearSelector from "./components/gear-selector.tsx";
import { useBuildsStore } from "./store/use-builds.ts";

function App() {
    const [selectedBuildIndex, setSelectedBuildIndex] = useState(0);
    const { builds, addBuild } = useBuildsStore();

    const handleAdd = () => {
        const name = prompt("Enter name");
        if (!name) {
            return;
        }

        addBuild(name);
    };

    const selectedBuild = builds[selectedBuildIndex];

    return (
        <>
            <h1>Baldur's Gate 3 - Gear builder</h1>
            <button type="button" onClick={handleAdd}>
                Add Build
            </button>
            {builds.map((build, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <div key={i}>
                    <button
                        onClick={() => setSelectedBuildIndex(i)}
                        type="button"
                    >
                        {build.name}
                    </button>
                </div>
            ))}
            <GearSelector selectedItems={selectedBuild.items} />
        </>
    );
}

export default App;
