<p align="center">
  <img src="./public/icons/icon-128.png" width="128" height="128" alt="MiaoCrop Logo" />
</p>

# MiaoCrop

[English](./README.md) | [简体中文](./README.zh-CN.md) | [更新日志](./CHANGELOG.md)

MiaoCrop 是一个纯前端（静态）的图片裁剪与导出工具。所有处理都在浏览器本地完成（不依赖服务器上传/处理）。

在开发 Chrome 扩展 **MiaoMint** 时，我发现商店封面图的尺寸要求比较严格，因此开发了这个工具来帮助我快速调整图片尺寸。

<a href="https://miaomint.konata9.cc/" target="_blank">
  <img src="https://miaomint.konata9.cc/logo.png" width="48" height="48" alt="MiaoMint Logo" align="left" style="margin-right: 12px; border-radius: 4px;" />
</a>

**[MiaoMint](https://miaomint.konata9.cc/)**: 像 Spotlight 一样管理标签页。极速搜索书签与历史记录。

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Available-blue?logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/miaomint-smart-tab-manage/fhbglejcilmhdnmipnjhanffmbijjego?hl=en)

## 功能特性

- **纯静态**：无服务端处理，所有操作都在浏览器内完成。
- **沉浸式编辑器**：上传与编辑区域无缝整合，提供流畅的工作台体验。
- **智能上传**：支持拖拽上传，编辑时可直接拖入新图片即时替换。
- **响应式布局**：大屏模式下采用无滚动条分栏设计，操作更高效。
- **裁剪工具**：裁剪、旋转、翻转，并提供常用宽高比选项。
- **导出**：
  - 标准导出（下载裁剪后的图片）
  - 图标包导出（下载包含多尺寸 PNG 的 ZIP）
  - 封面图导出（下载预设/自定义尺寸的 PNG）
- **去白底**：将接近白色的像素转为透明（PNG）。
- **暗色模式**：支持浅色/深色主题切换。

## 技术栈

- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- shadcn-vue
- vue-advanced-cropper
- @vueuse/core
- JSZip + file-saver
- lucide-vue-next

## 实现方式概览

- 图片通过 `FileReader` 读取为 Data URL（`src/components/ImageUploader.vue`）。
- 裁剪基于 `vue-advanced-cropper`，并通过 `<canvas>` 获取结果（`src/components/CropEditor.vue`）。
- 导出相关能力通过 Canvas API 实现（`src/lib/image-processing.ts`）。

## 使用方式

1. 上传一张图片。
2. 在编辑区完成裁剪/旋转/翻转，并按需选择宽高比。
3. 在右侧导出面板中：
   - **Standard**：下载裁剪后的图片。
   - **Icons**：勾选尺寸并下载 ZIP。
   - **Covers**：下载预设尺寸或输入自定义尺寸。

## 图标尺寸

### 站点图标

网站 favicon/logo 的资源位于 `public/icons/`：

`16, 32, 48, 128, 256`。

### 图标包导出尺寸

图标包导出的默认尺寸定义在 `src/lib/image-processing.ts`（`ICON_SIZES`）：

`16, 19, 24, 32, 48, 128, 256, 512`。

## 本地开发

1. 安装依赖：
   ```bash
   pnpm install
   ```

2. 启动开发服务器：
   ```bash
   pnpm dev
   ```

3. 生产构建：
   ```bash
   pnpm build
   ```

4. 本地预览构建产物：
   ```bash
   pnpm preview
   ```

## License

MIT
