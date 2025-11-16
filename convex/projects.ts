import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
	handler: async (ctx) => {
		const projects = await ctx.db.query("projects").collect();
		return Promise.all(
			projects.map(async (proj) => {
				return {
					...proj,
					imageSrc: proj.image ? await ctx.storage.getUrl(proj.image) : "",
				};
			}),
		);
	},
});

export const getById = query({
	args: { id: v.id("projects") },
	handler: async (ctx, args) => {
		const project = await ctx.db.get(args.id);
		return project
			? {
					...project,
					imageSrc: project.image
						? await ctx.storage.getUrl(project.image)
						: "",
				}
			: null;
	},
});

export const create = mutation({
	args: { name: v.string(), description: v.string(), image: v.id("_storage") },
	handler: (ctx, args) => {
		return ctx.db.insert("projects", args);
	},
});

export const generateUploadUrl = mutation({
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl();
	},
});
