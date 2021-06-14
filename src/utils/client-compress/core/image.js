const loadImageElement = (img, src) => {
  return new Promise((resolve, reject) => {
    img.addEventListener(
      "load",
      () => {
        resolve(img)
      },
      false
    )

    img.addEventListener(
      "error",
      (err) => {
        reject(err)
      },
      false
    )

    img.src = src
  })
}
/*
   * Resize the image based on the given height or width boundary.
   * Auto resize based on aspect ratio.
  **/
const resize = (currentWidth, currentHeight, maxWidth, maxHeight) => {
  if (!maxWidth && !maxHeight) return { currentWidth, currentHeight }

  const originalAspectRatio = currentWidth / currentHeight
  const targetAspectRatio = maxWidth / maxHeight

  let outputWidth, outputHeight

  if (originalAspectRatio > targetAspectRatio) {
    outputWidth = Math.min(currentWidth, maxWidth)
    outputHeight = outputWidth / originalAspectRatio
  } else {
    outputHeight = Math.min(currentHeight, maxHeight)
    outputWidth = outputHeight * originalAspectRatio
  }

  return { width: outputWidth, height: outputHeight }
}

export { loadImageElement, resize }
