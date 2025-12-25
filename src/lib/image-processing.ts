/**
 * Remove white background from an image
 */
export async function removeWhiteBackground(imageUrl: string, threshold = 30): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        if (r === undefined || g === undefined || b === undefined) continue

        // Check if pixel is white (or close to white)
        // RGB values are close to 255
        if (r > 255 - threshold && g > 255 - threshold && b > 255 - threshold) {
          data[i + 3] = 0 // Set alpha to 0 (transparent)
        }
      }

      ctx.putImageData(imageData, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = imageUrl
  })
}

/**
 * Resize image to specific dimensions with aspect ratio preservation
 * mode: 'cover' | 'contain' | 'fill'
 * - contain: Resize to fit within dimensions, maintaining aspect ratio. Transparent/empty space if needed.
 * - cover: Resize to fill dimensions, cropping if needed. (Not implemented here as this is usually handled by cropper)
 * - fill: Stretch to dimensions (not recommended usually)
 */
export async function resizeImage(
  imageUrl: string, 
  width: number, 
  height: number, 
  mode: 'contain' | 'fill' = 'contain'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      if (mode === 'fill') {
        ctx.drawImage(img, 0, 0, width, height)
      } else {
        // contain
        const scale = Math.min(width / img.width, height / img.height)
        const x = (width / 2) - (img.width / 2) * scale
        const y = (height / 2) - (img.height / 2) * scale
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
      }

      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = imageUrl
  })
}

/**
 * Generate multiple icon sizes
 */
export const ICON_SIZES = [16, 19, 24, 32, 48, 128, 256, 512]

export async function generateIcons(imageUrl: string, sizes: number[] = ICON_SIZES): Promise<{ size: number, url: string }[]> {
  const promises = sizes.map(async (size) => {
    const url = await resizeImage(imageUrl, size, size, 'contain')
    return { size, url }
  })
  return Promise.all(promises)
}
