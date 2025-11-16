import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Doc, Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
	title: z.string().min(1, "Invalid"),
	description: z.string().min(0, "Invalid"),
	price: z.coerce.number().min(0, "Invalid").optional(),
	link: z.string().optional(),
	imageUrl: z.string().optional(),
});

export const NewSourceDialog = ({
	isOpen,
	source,
	partId,
}: {
	isOpen: boolean;
	source?: Doc<"source">;
	partId: Id<"parts">;
}) => {
	const navigate = useNavigate();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: source
			? {
					title: source.title,
					description: source.description,
					price: source.price ? `${source.price}` : "",
					link: source.link || "",
					imageUrl: source.imageUrl || "",
				}
			: {
					description: "",
					price: "",
					link: "",
					imageUrl: "",
				},
	});

	const createSource = useMutation(api.sources.create);
	const updateSource = useMutation(api.sources.update);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const cleanedValues = {
			...values,
			price: values.price ? Number(values.price) : undefined,
			link: values.link || undefined,
			imageUrl: values.imageUrl || undefined,
		};

		if (source?._id) {
			await updateSource({
				id: source._id,
				...cleanedValues,
			});
		} else {
			await createSource({
				partId,
				...cleanedValues,
			});
		}
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
					<DialogTitle>New Source</DialogTitle>
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
							name="link"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Link</FormLabel>
									<FormControl>
										<Input placeholder="https://example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea placeholder="Description" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price"
							render={({ field: { value, ...field } }) => (
								<FormItem>
									<FormLabel>Price (optional)</FormLabel>
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
							name="imageUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image URL (optional)</FormLabel>
									<FormControl>
										<Input
											placeholder="https://example.com/image.jpg"
											{...field}
										/>
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
