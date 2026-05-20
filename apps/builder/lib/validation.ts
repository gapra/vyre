import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
});

export const createAppSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  isPublic: z.boolean().default(true),
});

export const createFieldSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum([
    "TEXT",
    "TEXTAREA",
    "RICH_TEXT",
    "NUMBER",
    "SELECT",
    "MULTI_SELECT",
    "DATE",
    "CHECKBOX",
    "FILE",
    "RELATION",
  ]),
  required: z.boolean().default(false),
  config: z.record(z.unknown()).default({}),
});

export const createRecordSchema = z.object({
  collectionId: z.string().cuid(),
  values: z.record(z.unknown()),
});

export const updateRecordSchema = z.object({
  values: z.record(z.unknown()),
});

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
