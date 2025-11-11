import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	image: z
		.instanceof(File)
		.refine(
			(file) => file.size <= 10 * 1024 * 1024, // 5MB max
			"File size must be less than 10MB",
		)
		.refine(
			(file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
			"Only JPEG, PNG, and WebP images are allowed",
		),
});

export const NewProjectDialog = ({ isOpen }: { isOpen: boolean }) => {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
	const createProject = useMutation(api.projects.create);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const uploadUrl = await generateUploadUrl();
		const result = await fetch(uploadUrl, {
			method: "POST",
			headers: { "Content-Type": values.image.type },
			body: values.image,
		});

		const { storageId } = await result.json();

		const projectId = await createProject({
			name: values.name,
			description: values.description || "",
			image: storageId,
		});

		return navigate({
			to: "/projects/$projectId",
			params: { projectId: projectId },
		});
	};

	return (
		<Dialog open={isOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>New Project</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Dresser" {...field} />
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
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="image"
							render={({ field: { value, onChange, ...field } }) => (
								<FormItem>
									<FormLabel>Image</FormLabel>
									<FormControl>
										<Input
											type="file"
											accept="image/*"
											onChange={(e) => onChange(e.target.files?.[0])}
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
