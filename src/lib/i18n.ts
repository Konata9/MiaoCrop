import { ref, watch } from 'vue'

export type Locale = 'en' | 'zh-CN'

const storageKey = 'miaocrop_locale'

const isZhLanguageTag = (tag: string) => {
  return tag.toLowerCase().startsWith('zh')
}

const detectBrowserLocale = (): Locale => {
  if (typeof navigator === 'undefined') return 'en'

  const tags = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language]

  const hasZh = tags.some((tag) => typeof tag === 'string' && isZhLanguageTag(tag))
  return hasZh ? 'zh-CN' : 'en'
}

const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'en'

  const saved = window.localStorage.getItem(storageKey)
  if (saved === 'en' || saved === 'zh-CN') return saved
  return detectBrowserLocale()
}

const locale = ref<Locale>(getInitialLocale())

const messages = {
  en: {
    'app.title': 'MiaoCrop — Simple Image Cropper',
    'hero.title': 'Simple Image Cropper',
    'hero.subtitle': 'Upload, crop, and resize your images entirely in your browser. No data leaves your device.',
    'editor.title': 'Editor',
    'editor.reset': 'Reset Image',
    'uploader.title': 'Upload an image',
    'uploader.subtitle': 'Drag and drop or click to upload',
    'uploader.selectFile': 'Select File',
    'uploader.invalidFile': 'Please upload an image file',
    'crop.rotateLeft': 'Rotate Left',
    'crop.rotateRight': 'Rotate Right',
    'crop.flipHorizontal': 'Flip Horizontal',
    'crop.flipVertical': 'Flip Vertical',
    'crop.free': 'Free',
    'export.title': 'Export',
    'export.noPreview': 'No preview',
    'export.removeWhiteBg': 'Remove White Background',
    'export.tab.standard': 'Standard',
    'export.tab.icons': 'Icons',
    'export.tab.covers': 'Covers',
    'export.format': 'Format',
    'export.selectFormat': 'Select format',
    'export.standardHint': 'Standard export mode. Best for general use.',
    'export.downloadImage': 'Download Image',
    'export.selectIconSizes': 'Select icon sizes to generate:',
    'export.downloadZip': 'Download ZIP',
    'export.cover.laptop': 'MacBook Air / Laptop',
    'export.cover.thumbnail': 'Thumbnail / Preview',
    'export.cover.customSize': 'Custom Size',
    'export.cover.width': 'Width (px)',
    'export.cover.height': 'Height (px)',
    'export.cover.widthPlaceholder': 'Width',
    'export.cover.heightPlaceholder': 'Height',
    'export.cover.downloadCustom': 'Download Custom',
    'ad.miaomint.title': 'MiaoMint - Chrome Extension',
    'ad.miaomint.desc': 'Spotlight for your tabs. Manage tabs, bookmarks & history instantly.',
    'ad.miaomint.action': 'Install',
  },
  'zh-CN': {
    'app.title': 'MiaoCrop — 图片裁剪工具',
    'hero.title': '图片裁剪工具',
    'hero.subtitle': '在浏览器中完成上传、裁剪与尺寸调整。所有数据均在本地处理，不会上传到服务器。',
    'editor.title': '编辑',
    'editor.reset': '重置图片',
    'uploader.title': '上传图片',
    'uploader.subtitle': '拖拽到此处或点击选择文件',
    'uploader.selectFile': '选择文件',
    'uploader.invalidFile': '请上传图片文件',
    'crop.rotateLeft': '向左旋转',
    'crop.rotateRight': '向右旋转',
    'crop.flipHorizontal': '水平翻转',
    'crop.flipVertical': '垂直翻转',
    'crop.free': '自由',
    'export.title': '导出',
    'export.noPreview': '暂无预览',
    'export.removeWhiteBg': '去白底',
    'export.tab.standard': '标准',
    'export.tab.icons': '图标',
    'export.tab.covers': '封面',
    'export.format': '格式',
    'export.selectFormat': '选择格式',
    'export.standardHint': '标准导出模式，适合一般用途。',
    'export.downloadImage': '下载图片',
    'export.selectIconSizes': '选择要生成的图标尺寸：',
    'export.downloadZip': '下载 ZIP',
    'export.cover.laptop': '笔记本封面',
    'export.cover.thumbnail': '缩略图 / 预览图',
    'export.cover.customSize': '自定义尺寸',
    'export.cover.width': '宽度 (px)',
    'export.cover.height': '高度 (px)',
    'export.cover.widthPlaceholder': '宽度',
    'export.cover.heightPlaceholder': '高度',
    'export.cover.downloadCustom': '下载自定义',
    'ad.miaomint.title': 'MiaoMint - Chrome 效率神器',
    'ad.miaomint.desc': '像 Spotlight 一样管理标签页。极速搜索书签与历史记录。',
    'ad.miaomint.action': '安装',
  },
} as const

type MessageKey = keyof (typeof messages)['en']

const t = (key: MessageKey): string => {
  return messages[locale.value][key] ?? messages.en[key]
}

const setLocale = (nextLocale: Locale) => {
  locale.value = nextLocale
}

watch(
  locale,
  (value) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, value)

    const lang = value === 'zh-CN' ? 'zh-CN' : 'en'
    document.documentElement.lang = lang
    document.title = t('app.title')
  },
  { immediate: true },
)

export function useI18n() {
  return {
    locale,
    setLocale,
    t,
  }
}
