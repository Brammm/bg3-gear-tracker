import { createFileRoute } from "@tanstack/react-router";
import AllItems from "../components/all-items";

export const Route = createFileRoute("/all")({
    component: AllItems,
});
