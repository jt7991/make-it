import { useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeletePartConfirm({ part }: { part?: Doc<"parts"> }) {
	const navigate = useNavigate();
	const deletePart = useMutation(api.parts.remove);
	return (
		<AlertDialog open={Boolean(part)}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete {part?.name}?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this
						part.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						variant="destructive"
						onClick={async () => {
							if (!part) {
								return;
							}
							await deletePart({ id: part?._id });
							navigate({ to: ".", search: {} });
						}}
					>
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
