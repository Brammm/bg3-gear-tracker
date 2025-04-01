import equipment from './data/equipment.json';
import ItemCombobox from './components/item-combobox.tsx';

function App() {
    return (
        <>
            <h1>Hello World!</h1>
            {equipment.map((type) => (
                <div key={type.name}>
                    <h2 className="flex items-center">
                        <img src={type.thumbnail} alt={type.name}  className="size-6 shrink-0" />
                        <span className="ml-3">{type.name}</span>
                    </h2>
                    <ItemCombobox items={type.items} />
                </div>
            ))}
        </>
    );
}

export default App;
