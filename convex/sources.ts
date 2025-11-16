import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
	args: {
		partId: v.id("parts"),
		title: v.string(),
		description: v.optional(v.string()),
		price: v.optional(v.number()),
		link: v.optional(v.string()),
		imageUrl: v.optional(v.string()),
	},
	handler: (ctx, args) => {
		return ctx.db.insert("source", args);
	},
});

export const update = mutation({
	args: {
		id: v.id("source"),
		description: v.optional(v.string()),
		price: v.optional(v.number()),
		link: v.optional(v.string()),
		imageUrl: v.optional(v.string()),
	},
	handler: (ctx, args) => {
		const { id, ...rest } = args;
		return ctx.db.patch(args.id, rest);
	},
});

export const getByPartId = query({
	args: { partId: v.id("parts") },
	handler: async (ctx, args) => {
		const sources = await ctx.db
			.query("source")
			.filter((q) => q.eq(q.field("partId"), args.partId))
			.order("asc")
			.collect();
		return sources;
	},
});

export const getById = query({
	args: { id: v.id("source") },
	handler: async (ctx, args) => {
		return ctx.db.get(args.id);
	},
});

export const remove = mutation({
	args: { id: v.id("source") },
	handler: (ctx, args) => {
		return ctx.db.delete(args.id);
	},
});
