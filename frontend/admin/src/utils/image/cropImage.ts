import { Area } from 'react-easy-crop'

export const getCroppedImg = async (imageSrc: string, cropAreaPixels: Area) => {
  const image = new Image()
  image.src = imageSrc
  await new Promise(resolve => (image.onload = resolve))

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = cropAreaPixels.width
  canvas.height = cropAreaPixels.height

  ctx.drawImage(
    image,
    cropAreaPixels.x,
    cropAreaPixels.y,
    cropAreaPixels.width,
    cropAreaPixels.height,
    0,
    0,
    cropAreaPixels.width,
    cropAreaPixels.height
  )

  return new Promise<{ file: File; previewUrl: string }>((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob!], 'cropped.jpg', { type: 'image/jpeg' })
      const previewUrl = URL.createObjectURL(file)
      resolve({ file, previewUrl })
    }, 'image/jpeg')
  })
}
