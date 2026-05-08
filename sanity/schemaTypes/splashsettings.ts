import { defineField, defineType } from "sanity";

export const splashSettings = defineType({
  name: "splashSettings",
  title: "Splash Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Splash",
    }),
    defineField({
      name: "image",
      title: "Splash Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title: title ?? "Splash",
        media,
      };
    },
  },
});
