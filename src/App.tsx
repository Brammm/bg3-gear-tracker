import GearSelector from "./components/gear-selector.tsx";
import { useBuildsStore } from "./store/use-builds.ts";

function App() {
    const { builds, addBuild, selectBuild, selectedBuild } = useBuildsStore();

    const handleAdd = () => {
        const name = prompt("Enter name");
        if (!name) {
            return;
        }

        addBuild(name);
    };

    return (
        <>
            <h1>Baldur's Gate 3 - Gear builder</h1>
            <button type="button" onClick={handleAdd}>
                Add Build
            </button>
            {builds.map((build, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <div key={i}>
                    <button onClick={() => selectBuild(i)} type="button">
                        {build.name}
                    </button>
                </div>
            ))}
            <GearSelector selectedItems={builds[selectedBuild].items} />
        </>
    );
}

export default App;
