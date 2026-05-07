import { defineField, defineType } from "sanity";

export const panelpanel = defineType({
  name: "panelpanel",
  title: "Panel Panel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Display Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "short",
      title: "Short Text",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "image",
      title: "Display Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "targetType",
      title: "Target Type",
      type: "string",
      initialValue: "project",
      options: {
        list: [
          { title: "Project", value: "project" },
          { title: "External", value: "external" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "project",
      title: "Project",
      type: "reference",
      to: [{ type: "projectproject" }],
      hidden: ({ parent }) => parent?.targetType !== "project",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      hidden: ({ parent }) => parent?.targetType !== "external",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "project.title",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media,
      };
    },
  },
});
