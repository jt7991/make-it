import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { CheckCircleIcon, CheckIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Route as projectRoute } from "../../$projectId/route";
import { DeletePartConfirm } from "./-components/DeletePartConfirm";
import { NewPartDialog } from "./-components/NewPartDialog";
import { NewSourceDialog } from "./-components/NewSourceDialog";
import { PartItem } from "./-components/PartItem";

export const Route = createFileRoute("/projects/$projectId/parts/")({
	component: RouteComponent,
	loader: async (opts) => {
		await opts.context.queryClient.ensureQueryData(
			convexQuery(api.parts.getByProjectId, {
				projectId: opts.params.projectId,
			}),
		);
		return { crumb: "Parts" };
	},
	validateSearch: (params) => {
		const schema = z.object({
			newPart: z
				.boolean()
				.transform((val) => (val ? val : undefined))
				.optional()
				.catch(undefined),
			editPart: z
				.string()
				.transform((val) => (val ? (val as Id<"parts">) : undefined))
				.optional()
				.catch(undefined),
			deletePart: z
				.string()
				.transform((val) => (val ? (val as Id<"parts">) : undefined))
				.optional()
				.catch(undefined),
			newSourcePartId: z
				.string()
				.transform((val) => (val ? (val as Id<"parts">) : undefined))
				.optional()
				.catch(undefined),
			editSource: z
				.string()
				.transform((val) => (val ? (val as Id<"source">) : undefined))
				.optional()
				.catch(undefined),
		});
		return schema.parse(params);
	},
});

export const partFormSchema = z.object({
	parts: z.array(
		z.object({
			name: z.string("Invalid"),
			cost: z.string("Invalid").refine((val) => val === "" || Number(val) >= 0),
			quantity: z.string("Invalid").refine((val) => Number(val) > 0),
		}),
	),
});

function RouteComponent() {
	const { project } = projectRoute.useLoaderData();
	const { newPart, editPart, deletePart, newSourcePartId, editSource } =
		Route.useSearch();

	const parts = useQuery(api.parts.getByProjectId, { projectId: project._id });
	const partToEdit = useQuery(
		api.parts.getById,
		editPart ? { id: editPart } : "skip",
	);

	const partToDelete = useQuery(
		api.parts.getById,
		deletePart ? { id: deletePart } : "skip",
	);

	const sourceToEdit = useQuery(
		api.sources.getById,
		editSource ? { id: editSource } : "skip",
	);

	return (
		<>
			<DeletePartConfirm part={partToDelete || undefined} />
			<NewPartDialog
				key={partToEdit?._id || "new_part"}
				isOpen={Boolean(newPart) || Boolean(partToEdit)}
				part={partToEdit || undefined}
			/>
			<NewSourceDialog
				key={sourceToEdit?._id || "new_source"}
				isOpen={Boolean(newSourcePartId) || Boolean(sourceToEdit)}
				source={sourceToEdit || undefined}
				partId={
					newSourcePartId ||
					(sourceToEdit ? sourceToEdit.partId : ("" as Id<"parts">))
				}
			/>
			<div className="flex flex-col gap-4">
				<Link to="." search={{ newPart: true }} className="self-end">
					<Button className="w-fit">
						<PlusIcon /> New Part
					</Button>
				</Link>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-8"></TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Qty.</TableHead>
							<TableHead>Cost</TableHead>
							<TableHead>Owned</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{parts?.map((part) => {
							return <PartItem key={part._id} part={part} />;
						})}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
