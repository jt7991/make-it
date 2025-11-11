import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NewProjectDialog } from "./-components/NewProjectDialog";

export const Route = createFileRoute("/projects")({
	component: RouteComponent,
	validateSearch: (searchParams) => {
		return searchParams.newProject
			? {
					newProject: Boolean(searchParams.newProject),
				}
			: {};
	},
});

function RouteComponent() {
	const { newProject } = Route.useSearch();
	return (
		<>
			<NewProjectDialog isOpen={Boolean(newProject)} />
			<Outlet />
		</>
	);
}
