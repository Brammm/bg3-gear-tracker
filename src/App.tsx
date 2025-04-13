import GearSelector from "./components/gear-selector.tsx";
import { useBuildsStore } from "./store/use-builds.ts";
import { Pencil, Plus } from 'lucide-react';
import NavButton from './components/nav-button.tsx';

function App() {
    const { builds, addBuild, selectBuild, selectedBuild, renameBuild } = useBuildsStore();

    const handleAdd = () => {
        const name = prompt("Enter name");
        if (!name) {
            return;
        }

        addBuild(name);
    };

    const handleRename  = (i: number) => () => {
        const name = prompt("Enter name");
        if (!name) {
            return;
        }

        renameBuild(i, name);
    }
    
    return (
        <div className="max-w-5xl mx-auto mt-10">
            <h1 className="font-title text-primary text-2xl mb-10">
                Baldur's Gate 3 - Gear Tracker
            </h1>
            <div className="border-b border-text">
                <nav className="-mb-px flex gap-x-4 justify-between">
                    <div className="flex">
                        {builds.map((build, i) => (
                            <NavButton
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                key={i}
                                onClick={() => selectBuild(i)}
                                active={selectedBuild === i}
                            >
                                {build.name}
                            </NavButton>
                        ))}
                    </div>
                    <div className="flex">
                        <NavButton
                            onClick={handleAdd}
                        >
                            <Plus className="size-6" />
                            Add Build
                        </NavButton>
                        <NavButton
                            onClick={handleRename(selectedBuild)}
                        >
                            <Pencil className="size-6" />
                            Rename current Build
                        </NavButton>
                    </div>
                </nav>
            </div>
            <GearSelector />
        </div>
    );
}

export default App;
