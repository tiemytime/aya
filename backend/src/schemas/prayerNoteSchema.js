const { z } = require('zod');

const createPrayerNoteSchema = z.object({
  content: z.string()
    .min(5, 'Prayer note content must be at least 5 characters long')
    .max(500, 'Prayer note content must be at most 500 characters long')
    .trim(),
  lightId: z.string()
    .length(24, 'Light ID must be a valid 24-character string')
    .optional(),
  isPublic: z.boolean()
    .default(true)
    .optional(),
});

module.exports = {
  createPrayerNoteSchema,
};
