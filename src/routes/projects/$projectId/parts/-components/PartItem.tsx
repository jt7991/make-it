import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
	ChevronDownIcon,
	EllipsisVerticalIcon,
	ExternalLinkIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function PartItem({ part }: { part: Doc<"parts"> }) {
	const [isOpen, setIsOpen] = useState(false);
	const updatePart = useMutation(api.parts.update);
	const sources = useQuery(api.sources.getByPartId, { partId: part._id });

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
				<TableRow className="hover:bg-background">
					<TableCell colSpan={6} className="bg-muted/20 p-4">
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-2">
								{sources?.map((source) => (
									<div
										className={cn(
											"flex-row items-start text-left justify-start flex gap-6 w-full border-accent border-2 p-4 rounded-sm min-h-36",
											{
												"boder-primary": part.selectedSourceId === source._id,
											},
										)}
									>
										<img
											src={source.imageUrl || ""}
											width="100px"
											height="100px"
										/>
										<div className="flex flex-col justify-between h-full w-full gap-4">
											<h1 className="font-bold break-words text-wrap">
												{source.title} - <span>${source.price}</span>
											</h1>
											<p className="text-sm break-words text-wrap">
												{source.description}
											</p>
											<div className="flex flex-row gap-2">
												{part.selectedSourceId !== source._id ? (
													<Button
														size={"sm"}
														variant="secondary"
														className="cursor-pointer"
														onClick={() =>
															updatePart({
																id: part._id,
																selectedSourceId: source._id,
															})
														}
													>
														Select
													</Button>
												) : (
													<Button
														size={"sm"}
														variant="secondary"
														className="cursor-pointer"
														disabled
													>
														Selected
													</Button>
												)}
												<Link to={source.link}>
													<Button className="cursor-pointer" size={"sm"}>
														<ExternalLinkIcon />
														View Product
													</Button>
												</Link>
											</div>
										</div>
									</div>
								))}
							</div>
							<Link
								to="."
								search={{ newSourcePartId: part._id }}
								className="w-fit"
							>
								<Button className="cursor-pointer">
									<PlusIcon />
									New Product
								</Button>
							</Link>
						</div>
					</TableCell>
				</TableRow>
			)}
		</>
	);
}
