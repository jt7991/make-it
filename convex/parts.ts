import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const getByProjectId = query({
    args: {projectId: v.id('projects')},
    handler: async (ctx, args) => {
      const parts = await ctx.db.query('parts').filter(q => q.eq(q.field('projectId'), args.projectId)).order('asc').collect()
      return parts
  }
})

export const create = mutation({
    args: {projectId: v.id('projects'), name: v.string(), cost: v.number(), status: v.union(v.literal('Owned'), v.literal('Unowned')), quantity: v.number()},
    handler: (ctx, args) => {
      return ctx.db.insert('parts', args)
    }
})

export const remove = mutation({
    args: { id: v.id('parts') },
    handler: (ctx, args) => {
        return ctx.db.delete(args.id);
    }
})
