import GearSelector from "./components/gear-selector.tsx";
import Nav from "./components/nav.tsx";

function App() {
    return (
        <div className="max-w-5xl mx-auto mt-10">
            <h1 className="font-title text-primary text-2xl mb-10">
                Baldur's Gate 3 - Gear Tracker
            </h1>
            <Nav />
            <GearSelector />
        </div>
    );
}

export default App;
