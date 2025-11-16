"use client";
import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/projects/$projectId")({
	params: {
		parse: (params) => ({
			...params,
			projectId: params.projectId as Id<"projects">,
		}),
	},
	component: Page,
	loader: async (opts) => {
		try {
			const data = await opts.context.queryClient.ensureQueryData(
				convexQuery(api.projects.getById, {
					id: opts.params.projectId as any,
				}),
			);
			if (data) {
				return { project: data, crumb: data.name };
			}
		} catch (e) {}
		throw redirect({ to: "/projects" });
	},
});

export default function Page() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumbs />
					</div>
				</header>
				<div className="p-4 pt-0">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
