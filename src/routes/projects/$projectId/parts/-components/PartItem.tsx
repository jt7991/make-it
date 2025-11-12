import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
	ChevronDownIcon,
	EllipsisVerticalIcon,
	PencilIcon,
	PlusIcon,
	SparklesIcon,
	TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";

export function PartItem({ part }: { part: Doc<"parts"> }) {
	const [isOpen, setIsOpen] = useState(false);
	const updatePart = useMutation(api.parts.update);

	return (
		<>
			<TableRow className="hover:bg-muted/50">
				<TableCell
					className="text-center cursor-pointer w-15"
					onClick={() => setIsOpen(!isOpen)}
				>
					<ChevronDownIcon
						className={`h-4 w-4 transition-transform duration-200 ${
							isOpen ? "rotate-180" : ""
						}`}
					/>
				</TableCell>
				<TableCell>{part?.name}</TableCell>
				<TableCell>{part?.quantity}</TableCell>
				<TableCell>$ {part?.cost}</TableCell>
				<TableCell>
					<Checkbox
						checked={part?.status === "Owned"}
						onCheckedChange={(checked) =>
							updatePart({
								id: part._id,
								status: checked ? "Owned" : "Unowned",
							})
						}
					/>
				</TableCell>
				<TableCell className="text-center">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="link">
								<EllipsisVerticalIcon size={16} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem asChild>
								<Link
									to="."
									from="/projects/$projectId/parts"
									search={{ editPart: part._id }}
								>
									<PencilIcon size={16} /> Edit
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									className="text-destructive hover:text-destructive!"
									to="."
									from="/projects/$projectId/parts"
									search={{ deletePart: part._id }}
								>
									<TrashIcon size={14} className="text-destructive" /> Delete
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</TableCell>
			</TableRow>
			{isOpen && (
				<TableRow>
					<TableCell colSpan={6} className="bg-muted/20 p-4">
						<h1 className="text-xl"> Options </h1>
						<Button>
							<PlusIcon />
							Generate Suggestions
						</Button>
					</TableCell>
				</TableRow>
			)}
		</>
	);
}
