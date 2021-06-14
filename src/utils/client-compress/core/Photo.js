import { extractOrientation } from "./rotate"
import { loadImageElement } from "./image"
import { imageToCanvas } from "./converter"

// The photo model
export default class Photo {
  constructor(file) {
    this.data = file // Store the File or Blob
    this.name = file.name
    this.type = file.type
    this.size = file.size
  }

  setData(data) {
    this.data = data
    this.size = data.size
    this.type = data.type
  }

  async _calculateOrientation() {
    const orientation = await extractOrientation(this.data)
    this.orientation = orientation
  }

  async load() {
    await this._calculateOrientation()

    // Create an object URL which points to the File/Blob image data
    const objectUrl = URL.createObjectURL(this.data)
    const img = new window.Image()
    await loadImageElement(img, objectUrl)

    // Image element has now loaded the object so we can safely revoke the
    // object URL
    URL.revokeObjectURL(objectUrl)

    this._img = img
    this.width = img.naturalWidth
    this.height = img.naturalHeight
  }

  getCanvas(width, height, orientationOverride) {
    if (orientationOverride !== undefined) {
      return imageToCanvas(this._img, width, height, orientationOverride)
    } else {
      return imageToCanvas(this._img, width, height, this.orientation)
    }
  }
}
