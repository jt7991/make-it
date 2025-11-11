import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { PlusIcon } from "lucide-react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/projects/")({
	component: ProjectsPage,
});

function ProjectsPage() {
	const projects = useQuery(api.projects.list);
	return (
		<>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-4xl font-bold text-left mb-8  border-b-2 pb-2 border-primary">
					Projects
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects?.map((project) => (
						<Link to="/projects/$projectId" params={{ projectId: project._id }}>
							<Card key={project._id} className="overflow-hidden h-full">
								{project.imageSrc && (
									<img
										src={project.imageSrc}
										alt={project.name}
										className="w-full h-48 object-cover"
									/>
								)}
								<CardHeader>
									<CardTitle>{project.name}</CardTitle>
									<CardDescription>{project.description}</CardDescription>
								</CardHeader>
							</Card>
						</Link>
					))}
					<Link to="." search={{ newProject: true }}>
						<Card key="add-new" className="overflow-hidden h-full">
							<div className="w-full h-48 flex items-center justify-center bg-muted">
								<PlusIcon className="w-12 h-12 text-muted-foreground" />
							</div>
							<CardHeader>
								<CardTitle>Create New Project</CardTitle>
							</CardHeader>
						</Card>
					</Link>
				</div>
			</div>
		</>
	);
}
