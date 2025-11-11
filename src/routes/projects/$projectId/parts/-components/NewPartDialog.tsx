import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { DollarSignIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group.tsx";
import { Route as projectRoute } from "../../route.tsx";

const formSchema = z.object({
	name: z.string().min(1, "Invalid"),
	cost: z.coerce.number().min(0, "Invalid"),
	quantity: z.coerce.number().min(0),
});

export const NewPartDialog = ({ isOpen }: { isOpen: boolean }) => {
	const navigate = useNavigate();
	const { projectId } = projectRoute.useParams();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			cost: "0",
			quantity: "1",
		},
	});

	const createPart = useMutation(api.parts.create);
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		await createPart({
			projectId,
			...values,
			status: "Unowned",
		});
		return navigate({
			to: ".",
			search: {},
		});
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					navigate({
						to: ".",
						search: {},
					});
				}
			}}
		>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>New Part</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, (errors) => {
							console.log(errors);
						})}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="6ft 2x4" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="cost"
							render={({ field: { value, ...field } }) => (
								<FormItem>
									<FormLabel>Approx. Price</FormLabel>
									<FormControl>
										<InputGroup>
											<InputGroupAddon>
												<InputGroupText>$</InputGroupText>
											</InputGroupAddon>
											<InputGroupInput
												type="number"
												prefix="$"
												{...field}
												value={value as string}
											/>
										</InputGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="quantity"
							render={({ field: { value, ...field } }) => (
								<FormItem>
									<FormLabel>Quantity</FormLabel>
									<FormControl>
										<Input type="number" {...field} value={value as string} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<Link to="." search={{}}>
									<Button variant="outline">Cancel</Button>
								</Link>
							</DialogClose>
							<Button type="submit">Save changes</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
