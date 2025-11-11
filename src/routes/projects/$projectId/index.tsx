import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/")({
	loader: () => {
		throw redirect({
			from: "/projects/$projectId",
			to: "./parts",
		});
	},
});
