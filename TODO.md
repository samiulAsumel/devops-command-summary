# Task: Consolidate Table of Contents into One File

## Information Gathered

- Currently, each of the three main HTML files has its own Table of Contents section:
  - system-admin.html: Sections 1-10
  - devops-tools.html: Sections 11-23
  - monitoring-security.html: Sections 24-29
- index.html is the home page and does not have a Table of Contents
- User wants to consolidate all Table of Contents into one file

## Plan

- Add a comprehensive "Complete Table of Contents" section to index.html
- Include all 29 sections with links to their respective pages and anchors
- Remove the individual Table of Contents sections from system-admin.html, devops-tools.html, and monitoring-security.html

## Dependent Files to be Edited

- index.html: Add new TOC section
- system-admin.html: Remove TOC section
- devops-tools.html: Remove TOC section
- monitoring-security.html: Remove TOC section

## Followup Steps

- Test navigation links in the consolidated TOC
- Ensure all section anchors still work after removal from individual files
