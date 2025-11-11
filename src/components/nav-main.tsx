import { Link } from "@tanstack/react-router";
import { ChevronRight, WrenchIcon } from "lucide-react";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain() {
	return (
		<SidebarGroup>
			<SidebarMenu>
				<SidebarMenuItem>
					<Link to="./parts" from="/projects/$projectId">
						<SidebarMenuButton
							tooltip={"Parts list"}
							className="cursor-pointer"
						>
							<WrenchIcon />
							<span>Parts</span>
						</SidebarMenuButton>
					</Link>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
