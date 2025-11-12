import { v } from "convex/values"
import { mutation } from "./_generated/server"

export const create = mutation({
    args: {partId: v.id('parts'), description: v.string(), price: v.number(), link: v.string()},
    handler: (ctx, args) => {
      return ctx.db.insert('partOption', args)
    }
})
