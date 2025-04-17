import { createFileRoute } from "@tanstack/react-router";
import AddItems from "../components/add-items.tsx";
import BuildNav from "../components/build-nav.tsx";
import CharacterOverview from "../components/character-overview.tsx";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    return (
        <>
            <BuildNav />
            <CharacterOverview />
            <AddItems />
        </>
    );
}
