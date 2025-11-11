"use client";

import { Link, useParams } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { ChevronsUpDown, PenToolIcon, Plus } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

export function ProjectSwitcher() {
	const { isMobile } = useSidebar();
	const { projectId } = useParams({ from: "/projects/$projectId" });
	const projects = useQuery(api.projects.list);

	const activeProject = projects?.find((proj) => proj._id === projectId);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<PenToolIcon className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{activeProject?.name}
								</span>
								<span className="truncate text-xs">
									{activeProject?.description}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Teams
						</DropdownMenuLabel>
						{projects?.map((proj, index) => (
							<Link to="/projects/$projectId" params={{ projectId: proj._id }}>
								<DropdownMenuItem key={proj.name} className="gap-2 p-2">
									<div className="flex size-6 items-center justify-center rounded-md border">
										<PenToolIcon className="size-4" />
									</div>
									{proj.name}
									<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
								</DropdownMenuItem>
							</Link>
						))}
						<DropdownMenuSeparator />
						<Link to="." search={{ newProject: true }}>
							<DropdownMenuItem className="gap-2 p-2">
								<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
									<Plus className="size-4" />
								</div>
								<div className="text-muted-foreground font-medium">
									New Project
								</div>
							</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
