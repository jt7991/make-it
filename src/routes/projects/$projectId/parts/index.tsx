import { convexQuery } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { CheckCircleIcon, CheckIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Route as projectRoute } from "../../$projectId/route";
import { NewPartDialog } from "./-components/NewPartDialog";
import { PartItem } from "./-components/PartItem";

export const Route = createFileRoute("/projects/$projectId/parts/")({
	component: RouteComponent,
	loader: async (opts) => {
		await opts.context.queryClient.ensureQueryData(
			convexQuery(api.parts.getByProjectId, {
				projectId: opts.params.projectId,
			}),
		);
	},
	validateSearch: (params) => {
		if (params.newPart) {
			return {
				newPart: true,
			};
		}
		return params;
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
	const { newPart } = Route.useSearch();

	const parts = useQuery(api.parts.getByProjectId, { projectId: project._id });

	return (
		<>
			<NewPartDialog isOpen={Boolean(newPart)} />
			<div className="flex flex-col gap-2">
				<div className="grid grid-cols-[1fr_60px_100px_60px_60px_10px] gap-2">
					<h1 className="font-bold"> Name </h1>
					<h1 className="font-bold"> Qty. </h1>
					<h1 className="font-bold"> Cost </h1>
					<h1 className="font-bold"> Owned </h1>
					<p />
				</div>
				<Accordion type="multiple">
					{parts?.map((part) => {
						return <PartItem key={part._id} part={part} />;
					})}
				</Accordion>
				<Link to="." search={{ newPart: true }}>
					<Button className="w-fit">
						<PlusIcon /> New Part
					</Button>
				</Link>
			</div>
		</>
	);
}
