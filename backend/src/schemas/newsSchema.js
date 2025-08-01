const { z } = require('zod');

/**
 * Zod schemas for news API request validation
 */

// Common schemas
const limitSchema = z.coerce.number().int().min(1).max(100).default(50);
const pageSchema = z.coerce.number().int().min(1).default(1);
const categorySchema = z.enum(['general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health']).default('general');
const countrySchema = z.string().trim().min(2).max(50).regex(/^[a-zA-Z\s]+$/, 'Country name can only contain letters and spaces');
const sortOrderSchema = z.enum(['asc', 'desc']).default('desc');

// Global news query schema
const globalNewsQuerySchema = z.object({
  limit: limitSchema.optional(),
  category: categorySchema.optional()
});

// Country news params and query schema
const countryNewsParamsSchema = z.object({
  country: countrySchema
});

const countryNewsQuerySchema = z.object({
  limit: limitSchema.optional(), 
  category: categorySchema.optional()
});

// Events query schema
const eventsQuerySchema = z.object({
  country: z.string().trim().min(2).max(50).optional(),
  limit: limitSchema.optional(),
  page: pageSchema.optional(),
  sortBy: z.enum(['published_at', 'priority', 'title', 'country', 'createdAt']).default('published_at').optional(),
  order: sortOrderSchema.optional()
});

// Globe events query schema
const globeEventsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(100).optional(),
  minPriority: z.coerce.number().int().min(1).max(10).default(1).optional(),
  hours: z.coerce.number().int().min(1).max(168).default(24).optional()
});

// Event notes params and query schema
const eventNotesParamsSchema = z.object({
  eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Event ID must be a valid MongoDB ObjectId')
});

const eventNotesQuerySchema = z.object({
  page: pageSchema.optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20).optional()
});

module.exports = {
  globalNewsQuerySchema,
  countryNewsParamsSchema,
  countryNewsQuerySchema,
  eventsQuerySchema,
  globeEventsQuerySchema,
  eventNotesParamsSchema,
  eventNotesQuerySchema
};
