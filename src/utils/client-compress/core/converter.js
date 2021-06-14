const base64ToFile = (base64, mime = "image/jpeg") => {
  const byteString = window.atob(base64)
  const content = []
  for (let i = 0; i < byteString.length; i++) {
    content[i] = byteString.charCodeAt(i)
  }
  return new window.Blob([new Uint8Array(content)], { type: mime })
}

const blobToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new window.FileReader()
    fileReader.addEventListener(
      "load",
      (evt) => {
        resolve(evt.target.result)
      },
      false
    )

    fileReader.addEventListener(
      "error",
      (err) => {
        reject(err)
      },
      false
    )

    fileReader.readAsDataURL(file)
  })
}

const imageToCanvas = (image, width, height, orientation) => {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  canvas.width = width
  canvas.height = height

  if (!orientation || orientation > 8) {
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas
  }
  if (orientation > 4) {
    canvas.width = height
    canvas.height = width
  }
  switch (orientation) {
    case 2:
      // horizontal flip
      context.translate(width, 0)
      context.scale(-1, 1)
      break
    case 3:
      // 180° rotate left
      context.translate(width, height)
      context.rotate(Math.PI)
      break
    case 4:
      // vertical flip
      context.translate(0, height)
      context.scale(1, -1)
      break
    case 5:
      // vertical flip + 90 rotate right
      context.rotate(0.5 * Math.PI)
      context.scale(1, -1)
      break
    case 6:
      // 90° rotate right
      context.rotate(0.5 * Math.PI)
      context.translate(0, -height)
      break
    case 7:
      // horizontal flip + 90 rotate right
      context.rotate(0.5 * Math.PI)
      context.translate(width, -height)
      context.scale(-1, 1)
      break
    case 8:
      // 90° rotate left
      context.rotate(-0.5 * Math.PI)
      context.translate(-width, 0)
      break
  }
  if (orientation > 4) {
    context.drawImage(image, 0, 0, canvas.height, canvas.width)
  } else {
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
  }
  return canvas
}

const canvasToBlob = (canvas, quality) => {
  return new Promise((resolve, reject) => {
    // In order to compress, the final image format must be jpeg
    canvas.toBlob(
      (blob) => {
        resolve(blob)
      },
      "image/jpeg",
      quality
    )
  })
}

const size = (size) => {
  return {
    kB: size * 1e-3,
    MB: size * 1e-6
  }
}

export { base64ToFile, imageToCanvas, canvasToBlob, size, blobToBase64 }
