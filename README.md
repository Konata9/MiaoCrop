<p align="center">
  <img src="./public/icons/icon-128.png" width="128" height="128" alt="MiaoCrop Logo" />
</p>

# MiaoCrop

[English](./README.md) | [简体中文](./README.zh-CN.md) | [Changelog](./CHANGELOG.md)

MiaoCrop is a static, browser-only image cropper and export toolkit. All processing runs locally in your browser (no server-side uploads).

When creating the Chrome extension **MiaoMint**, I found that the cover size are restricted, then I wrote this tool to help me resizing the image quickly.

<a href="https://miaomint.konata9.cc/" target="_blank">
  <img src="https://miaomint.konata9.cc/logo.png" width="48" height="48" alt="MiaoMint Logo" align="left" style="margin-right: 12px; border-radius: 4px;" />
</a>

**[MiaoMint](https://miaomint.konata9.cc/)**: Spotlight for your tabs. Manage tabs, bookmarks & history instantly.

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Available-blue?logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/miaomint-smart-tab-manage/fhbglejcilmhdnmipnjhanffmbijjego?hl=en)

If you find this tool helpful, please consider supporting my work:

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/M4M11S2U2E)
<img src="https://raw.githubusercontent.com/Konata9/pic-base/main/pics/20260127232615507.png" width=256 alt="wechat" />

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

## Presets sizes

### Cover export sizes

Default cover sizes which can be used for Chrome webstore cover and screen shot.
`1400x560, 1280x800, 640x400, 440x280`.

### Icon pack export sizes
Default icon sizes which can be used for website icon or Chrome extension icon.
`16, 19, 24, 32, 48, 128, 256, 512`.

## Usage

1. Upload an image.
2. Crop/rotate/flip, and optionally choose an aspect ratio.
3. In the Export panel:
   - **Standard**: Download the cropped image.
   - **Icons**: Pick sizes and download a ZIP.
   - **Covers**: Download preset sizes or enter a custom size.

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




<br clear="left"/>

## License

MIT
