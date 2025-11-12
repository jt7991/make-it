import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    image: v.optional(v.id('_storage')),
    budget: v.optional(v.number()),
  }),
  parts: defineTable({
    projectId: v.id('projects'),
    name: v.string(),
    cost: v.number(),
    status: v.union(v.literal('Unowned'), v.literal('Owned')),
    quantity: v.optional(v.number())
  }),
  partOption: defineTable({
    partId: v.id('parts'),
    description: v.string(), 
    link: v.optional(v.string()),
    price: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
  })
})
