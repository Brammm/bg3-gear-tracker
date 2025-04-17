import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/all")({
    component: All,
});

function All() {
    return <div>WIP</div>;
}
