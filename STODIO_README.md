# Sanity Studio: Content Input Guide

This guide explains how to add and publish content in the Studio for this project.

## 1. Open Studio

- Start dev server: `npm run dev`
- Open: http://localhost:3000/studio

## 2. Data model (document types)

- Panel Panel
  - Used for the main gallery panels on the portfolio page.
  - Key fields: title, displayOrder, image, targetType, project, externalUrl
- Project Project
  - Used for detailed project content.
  - Key fields: title, slug, tag, summary, description, tags, heroImage, links

## 3. Create Project Project first

1. Click "Create new" -> "Project Project"
2. Fill in required fields:
   - Title
   - Slug (auto from Title, but make sure it is generated)
3. Optional but recommended:
   - Tagline (tag)
   - Summary
   - Description
   - Tags
   - Hero Image
   - Links (label + url + primary)
4. Click "Publish"

## 4. Create Panel Panel next

1. Click "Create new" -> "Panel Panel"
2. Fill in required fields:
   - Display Title (title)
   - Display Order (number, smaller shows first)
3. Choose target type:
   - Project: select a Project Project reference
   - External: set External URL
4. Add Display Image
5. Click "Publish"

## 5. Ordering

- Panels are sorted by displayOrder (ascending).
- Use 1, 2, 3, ... for the top-level order.

## 6. Check the site

- Open: http://localhost:3000
- If no content shows, check:
  - Panel Panel has at least one published item
  - Dataset is "production" in .env.local

## 7. Troubleshooting

- "No documents of this type": none created yet; create and publish.
- Changes not appearing: confirm you are in the correct dataset and the document is published.

## 8. Recommended first setup

- Create 3 Project Project documents
- Create 3 Panel Panel documents pointing to those projects
