import GearSelector from "./components/gear-selector.tsx";
import { useBuildsStore } from "./store/use-builds.ts";

function App() {
    const { builds, addBuild, selectBuild } = useBuildsStore();

    const handleAdd = () => {
        const name = prompt("Enter name");
        if (!name) {
            return;
        }

        addBuild(name);
    };

    return (
        <div className="max-w-5xl mx-auto mt-10">
            <h1 className="font-title text-primary text-2xl mb-10">
                Baldur's Gate 3 - Gear Tracker
            </h1>
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
            <GearSelector />
        </div>
    );
}

export default App;
