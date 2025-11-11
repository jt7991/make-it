import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export function PartItem({ part }: { part?: Doc<"parts"> }) {
	const deletePart = useMutation(api.parts.remove);
	return (
		<AccordionItem value={part?._id || ""} className="border-0">
			<AccordionTrigger className="grid grid-cols-[1fr_60px_100px_60px_60px_10px] gap-2 hover:no-underline">
				<h2 className="text-left">{part?.name}</h2>
				<h2>{part?.quantity}</h2>
				<h2>$ {part?.cost}</h2>
				<h2>{part?.status === "Owned" ? "Yes" : "No"}</h2>
				<div />
			</AccordionTrigger>
			<AccordionContent>{/* Content will be added later */}</AccordionContent>
		</AccordionItem>
	);
}
