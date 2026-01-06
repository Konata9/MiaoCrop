<p align="center">
  <img src="./public/icons/icon-128.png" width="128" height="128" alt="MiaoCrop Logo" />
</p>

# MiaoCrop

[English](./README.md) | [简体中文](./README.zh-CN.md) | [Changelog](./CHANGELOG.md)

MiaoCrop is a static, browser-only image cropper and export toolkit. All processing runs locally in your browser (no server-side uploads).

## Features

- **Pure Static**: No server-side processing. Everything runs in your browser.
- **Immersive Editor**: Seamlessly integrated upload and editing experience.
- **Smart Upload**: Drag & drop to upload, or drop a new image onto the editor to replace instantly.
- **Responsive Layout**: Optimized split-screen view for large displays with no scrollbars.
- **Crop Tools**: Crop, rotate, flip, and pick common aspect ratios.
- **Export**:
  - Standard export (download the cropped image)
  - Icon pack export (download a ZIP containing multiple PNG icon sizes)
  - Cover export (download preset/custom sized PNG covers)
- **Remove White Background**: Convert near-white pixels to transparency (PNG).
- **Dark Mode**: Light/dark theme toggle.

## Tech Stack

- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- shadcn-vue
- vue-advanced-cropper
- @vueuse/core
- JSZip + file-saver
- lucide-vue-next

## How it works

- Images are loaded via `FileReader` as Data URLs (`src/components/ImageUploader.vue`).
- Cropping uses `vue-advanced-cropper` and a `<canvas>` result (`src/components/CropEditor.vue`).
- Export tools are implemented with Canvas APIs (`src/lib/image-processing.ts`).

## Usage

1. Upload an image.
2. Crop/rotate/flip, and optionally choose an aspect ratio.
3. In the Export panel:
   - **Standard**: Download the cropped image.
   - **Icons**: Pick sizes and download a ZIP.
   - **Covers**: Download preset sizes or enter a custom size.

## Icon sizes

### Website icons

The website favicon/logo assets live in `public/icons/`:

`16, 32, 48, 128, 256`.

### Icon pack export sizes

The default icon pack export sizes are defined in `src/lib/image-processing.ts` (`ICON_SIZES`) as:

`16, 19, 24, 32, 48, 128, 256, 512`.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start dev server:
   ```bash
   pnpm dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

4. Preview the production build locally:
   ```bash
   pnpm preview
   ```

## License

MIT
