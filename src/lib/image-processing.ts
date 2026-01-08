import Pica from 'pica'

/**
 * Lossless crop from original image
 */
export async function cropImage(imageUrl: string, coordinates: { left: number, top: number, width: number, height: number }): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = coordinates.width
      canvas.height = coordinates.height
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      // Draw only the cropped region from the original high-res image
      ctx.drawImage(
        img,
        coordinates.left,
        coordinates.top,
        coordinates.width,
        coordinates.height,
        0,
        0,
        coordinates.width,
        coordinates.height
      )

      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = imageUrl
  })
}

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
 * Resize image to specific dimensions with aspect ratio preservation using Pica (Lanczos3)
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
    img.onload = async () => {
      // Calculate dimensions
      let drawWidth = width
      let drawHeight = height
      let offsetX = 0
      let offsetY = 0

      if (mode === 'contain') {
        const scale = Math.min(width / img.width, height / img.height)
        drawWidth = Math.round(img.width * scale)
        drawHeight = Math.round(img.height * scale)
        offsetX = Math.round((width - drawWidth) / 2)
        offsetY = Math.round((height - drawHeight) / 2)
      }

      // Create resize target canvas
      const resizeCanvas = document.createElement('canvas')
      resizeCanvas.width = drawWidth
      resizeCanvas.height = drawHeight

      // Initialize pica
      const pica = Pica()

      try {
        // Dynamic unsharp mask settings based on target size
        let unsharpAmount = 0
        let unsharpRadius = 0.6
        let unsharpThreshold = 2

        // Determine optimal sharpening
        if (width <= 64) {
          // Strong sharpening for small icons
          unsharpAmount = 120
          unsharpRadius = 0.55
          unsharpThreshold = 0
        } else if (width <= 256) {
          // Moderate sharpening for medium sizes
          unsharpAmount = 60
          unsharpRadius = 0.6
          unsharpThreshold = 2
        } else {
          // Subtle sharpening for large images
          unsharpAmount = 20
          unsharpRadius = 0.8
          unsharpThreshold = 5
        }

        // Resize using pica (Lanczos3 + Unsharp Mask)
        await pica.resize(img, resizeCanvas, {
          unsharpAmount,
          unsharpRadius,
          unsharpThreshold
        })

        // Create final canvas
        const finalCanvas = document.createElement('canvas')
        finalCanvas.width = width
        finalCanvas.height = height
        const ctx = finalCanvas.getContext('2d')
        
        if (!ctx) {
            reject(new Error('Could not get context'))
            return
        }

        // Clear canvas (transparent)
        ctx.clearRect(0, 0, width, height)
        
        // Draw resized image centered
        ctx.drawImage(resizeCanvas, offsetX, offsetY)

        resolve(finalCanvas.toDataURL('image/png'))
      } catch (err) {
        reject(err)
      }
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
