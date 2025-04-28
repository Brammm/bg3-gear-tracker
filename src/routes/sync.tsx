import { createFileRoute } from "@tanstack/react-router";
import ImportExport from "../components/import-export";

export const Route = createFileRoute("/sync")({
    component: ImportExport,
});
