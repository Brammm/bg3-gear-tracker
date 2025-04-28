import { createFileRoute } from "@tanstack/react-router";
import AddItems from "../components/add-items";
import BuildNav from "../components/build-nav";
import CharacterOverview from "../components/character-overview";

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
