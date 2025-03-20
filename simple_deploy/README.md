# README - Stock Analysis Website Deployment

This is a simplified deployment package for the Stock Analysis Website. Follow these instructions to deploy it to Cloudflare Pages.

## Files in this Package

This package contains all the necessary files for deploying the Stock Analysis Website:

- `package.json` - Contains project dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `src/` - Source code directory containing components, pages, and application logic
- `public/` - Public assets directory

## Deployment Instructions

### 1. Upload to GitHub

1. Create a new GitHub repository
2. Upload ALL files from this package DIRECTLY to the root of your repository
   - Make sure package.json is in the root directory, not in any subfolder
   - Do not create additional folders when uploading

### 2. Deploy on Cloudflare Pages

1. Log in to your Cloudflare account
2. Go to "Pages" from the sidebar
3. Click "Create a project" → "Connect to Git"
4. Connect to your GitHub account and select your repository
5. Configure build settings:
   - Project name: "stock-analysis" (or your preferred name)
   - Build command: `npm install && npm run build`
   - Build output directory: `.next`
   - Add Environment Variables:
     - `NODE_VERSION`: `18.x`
     - `NPM_VERSION`: `9.x`
6. Click "Save and Deploy"

### 3. Wait for Deployment

- Deployment typically takes 1-3 minutes
- Once complete, Cloudflare will provide you with a URL (typically https://your-project-name.pages.dev)

## Troubleshooting

If you encounter build errors:

1. Verify that package.json is in the root directory of your repository
2. Check that you've added the environment variables correctly
3. Make sure you're using the correct build command and output directory

## Features

The Stock Analysis Website includes:

- Interactive stock screening with customizable filters
- Data visualization with multiple chart types
- Comprehensive report generation
- Modern, responsive design

All functionality from the original stock analysis system is available through this user-friendly web interface.
