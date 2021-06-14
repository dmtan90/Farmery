import i18n from '@/lang/i18n'
export default {
	isPhone() {
		return (/Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i).test( navigator.userAgent ) && window.innerWidth < 760
	}
}


export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return [i18n.t('common.sun'), i18n.t('common.mon'), i18n.t('common.tue'), i18n.t('common.wed'), i18n.t('common.thu'), i18n.t('common.fri'), i18n.t('common.sat')][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}


export function compressImage(file, quality, callback) {
  quality = quality || 0.3
  const reader = new FileReader()
  reader.onload = function(event) {
    var result = event.target.result
    if (file.size > 204800 && file.type !== 'image/gif' && quality < 1) { // 大于200Kb
      const img = new Image()
      img.src = result
      img.onload = function() {
        // var initSize = img.src.length
        var width = img.width
        var height = img.height

        var ratio
        if ((ratio = width * height / 4000000) > 1) {
          ratio = Math.sqrt(ratio)
          width /= ratio
          height /= ratio
        } else {
          ratio = 1
        }
        var canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        var ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        var count
        if ((count = width * height / 1000000) > 1) {
          count = ~~(Math.sqrt(count) + 1)
          var nw = ~~(width / count)
          var nh = ~~(height / count)
          var tCanvas = document.createElement('canvas')
          tCanvas.width = nw
          tCanvas.height = nh
          for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
              var tctx = tCanvas.getContext('2d')
              tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)

              ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
            }
          }
          tCanvas.width = tCanvas.height = 0
        } else {
          ctx.drawImage(img, 0, 0, width, height)
        }
        var ndata = canvas.toDataURL('image/jpeg', quality)
        canvas.width = canvas.height = 0
        callback(ndata)
      }
    } else {
      callback(result)
    }
  }
  reader.readAsDataURL(file)
}


export function getWkDateTime(time) {
  if (time) {
    const temps = time.split(' ')
    return temps.length > 0 ? temps[0] : ''
  }
  return time
}


export function createBlob(result) {
  var arr = result.split(',')
  var mime = arr[0].match(/:(.*?)/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {
    type: mime
  })
}

export function fileSize(value) {
  if (typeof value == 'string') {
    return value
  }
  if (value == null || value == '') {
    return '0 Bytes'
  }
  var unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var index = 0
  var srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  var size = srcsize / Math.pow(1024, index)
  //  保留的小数位数
  size = size.toFixed(2)
  return size + unitArr[index]
}


import {
  PopupManager
} from 'element-ui/lib/utils/popup'
export function getMaxIndex() {
  return PopupManager.nextZIndex()
}


export function objDeepCopy(source) {
  if (typeof source === 'object') {
    var sourceCopy = source instanceof Array ? [] : {}
    for (var item in source) {
      if (!source[item]) {
        sourceCopy[item] = source[item]
      } else {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
      }
    }
    return sourceCopy
  }
  return source
}


export function getFileTypeIcon(file) {
  if (file.type.indexOf('image') !== -1) {
    return getFileIconWithSuffix('png')
  } else if (file.type.indexOf('audio') !== -1) {
    return getFileIconWithSuffix('mp3')
  } else if (file.type.indexOf('video') !== -1) {
    return getFileIconWithSuffix('mp4')
  } else {
    const index = file.name.lastIndexOf('.')
    const ext = file.name.substr(index + 1) || ''

    return getFileIconWithSuffix(ext)
  }
}


export function canPreviewFile(name) {
  const temps = name ? name.split('.') : []
  var ext = ''
  if (temps.length > 0) {
    ext = temps[temps.length - 1]
  } else {
    ext = ''
  }

  if (['xlsx', 'xls'].includes(ext)) {
    return true
  } else if (['doc', 'docx'].includes(ext)) {
    return true
  } else if (ext === 'pdf') {
    return true
  } else if (['ppt', 'pptx'].includes(ext)) {
    return true
  } else if (['txt', 'text'].includes(ext)) {
    return true
  }

  return false
}

export function getFileIconWithSuffix(ext) {
  const fileType = getFileTypeWithExt(ext)
  if (fileType) {
    return {
      image: require('@/assets/img/file/file_img.png'),
      tif: require('@/assets/img/file/file_tif.png'),
      video: require('@/assets/img/file/file_video.png'),
      audio: require('@/assets/img/file/file_music.png'),
      excel: require('@/assets/img/file/file_excle.png'),
      word: require('@/assets/img/file/file_word.png'),
      archive: require('@/assets/img/file/file_zip.png'),
      pdf: require('@/assets/img/file/file_pdf.png'),
      ppt: require('@/assets/img/file/file_ppt.png'),
      text: require('@/assets/img/file/file_txt.png')
    }[fileType]
  }

  return require('@/assets/img/file/file_unknown.png')
}


export function getFileTypeWithFileName(fileName) {
  if (fileName) {
    const index = fileName.lastIndexOf('.')
    const ext = fileName.substr(index + 1) || ''
    getFileTypeWithExt(ext)
  }
  return ''
}

import {
  Message
} from 'element-ui'

export function verifyFileTypeWithFileName(fileName, type = 'excel', messageShow = true) {
  let pass = true
  if (fileName) {
    const index = fileName.lastIndexOf('.')
    const ext = fileName.substr(index + 1) || ''
    const fileType = getFileTypeWithExt(ext)
    if (fileType != type) {
      pass = false
    }
  } else {
    pass = false
  }

  if (!pass && messageShow) {
    Message({
      message: i18n.t('utils.global.fileFormatHintError'),
      type: i18n.t('common.error')
    })
  }
  return pass
}


export function getFileTypeWithExt(ext) {
  if (ext) {
    ext = ext.toLowerCase()
    if (['jpg', 'png', 'jpeg', 'bmp', 'ico', 'gif'].includes(ext)) {
      return 'image'
    } else if (ext === 'psd') {
      return 'psd'
    } else if (ext === 'tif') {
      return 'tif'
    } else if (['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', '3gp'].includes(ext)) {
      return 'video'
    } else if (['mp3', 'wma', 'wav'].includes(ext)) {
      return 'audio'
    } else if (['xlsx', 'xls'].includes(ext)) {
      return 'excel'
    } else if (['doc', 'docx'].includes(ext)) {
      return 'word'
    } else if (['rar', 'zip', '7z', 'tar', 'iso', 'dmg'].includes(ext)) {
      return 'archive'
    } else if (ext === 'pdf') {
      return 'pdf'
    } else if (['ppt', 'pptx'].includes(ext)) {
      return 'ppt'
    } else if (['txt', 'text'].includes(ext)) {
      return 'text'
    }
  }
  return ''
}


export function regexIsNumber(nubmer) {
  var regex = /^[0-9]+.?[0-9]*/
  if (!regex.test(nubmer)) {
    return false
  }
  return true
}


export function regexIsCRMNumber(nubmer) {
  var regex = /^([-+]?\d{1,15})(\.\d{0,4})?$/
  if (!regex.test(nubmer)) {
    return false
  }
  return true
}


export function regexIsCRMMoneyNumber(nubmer) {
  var regex = /^([-+]?\d{1,15})(\.\d{0,2})?$/
  if (!regex.test(nubmer)) {
    return false
  }
  return true
}


export function regexIsCRMMobile(mobile) {
  var regex = /^(\+?0?\d{2,4}\-?)?\d{6,11}$/
  if (!regex.test(mobile)) {
    return false
  }
  return true
}


export const chinaMobileRegex = /^1\d{10}$/


export function regexIsCRMEmail(email) {
  var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  if (!regex.test(email)) {
    return false
  }
  return true
}


import moment from 'moment'

export function formatTime(time) {
  const timeMoment = moment(time)
  const nowMoment = moment()
  const diff = nowMoment.diff(timeMoment, 'seconds')

  if (diff < 30) {
    return i18n.t('common.secondAgo')
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + ' ' + i18n.t('common.minuteAgo')
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + ' ' + i18n.t('common.hourAgo')
  } else if (diff < 3600 * 24 * 2) {
    return i18n.t('common.someDayAgo')
  }

  const timeYear = timeMoment.format('YYYY')
  const nowYear = nowMoment.format('YYYY')

  if (timeYear == nowYear) {
    return timeMoment.format('DD/MM')
  } else {
    return timeMoment.format('DD/MM/YY')
  }
}

export function getDateFromTimestamp(time) {
  var times = 0
  if (time.length === 13) {
    times = parseInt(time)
  } else {
    times = parseInt(time) * 1000
  }
  return new Date(times)
}


export function timestampToFormatTime(timestamp, format) {
  if (timestamp && timestamp.toString().length >= 10) {
    return moment(getDateFromTimestamp(timestamp.toString())).format(format)
  }
  return ''
}


export function timeToFormatTime(time, format) {
  if (time) {
    return moment(time).format(format || 'YYYY-MM-DD')
  }
  return ''
}


export function formatTimeToTimestamp(format) {
  if (format && format.length > 0) {
    var timeValue = moment(format)
      .valueOf()
      .toString()
    return timeValue.length > 10 ? timeValue.substr(0, 10) : timeValue
  }
  return ''
}

export function dataURLtoBlob(dataurl) {
  // eslint-disable-next-line one-var
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {
    type: mime
  })
}

export function getBase64Image(img) {
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  var ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  var dataURL = canvas.toDataURL('image/' + ext)
  return dataURL
}


export function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4())
}


export function floatAdd(num1, num2) {
  let r1, r2
  try {
    r1 = num1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = num2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = Math.pow(10, Math.max(r1, r2))
  return Math.round(num1 * m + num2 * m) / m
}


export function downloadExcelWithResData(res) {
  let fileName = res.headers['content-disposition'].split('filename=')[1]
  if (!fileName) {
    fileName = res.headers['content-disposition'].split('UTF-8\'\'')[1]
  }
  // fileName = fileName ? fileName.replace(/\"/g, '') : 'file.xlsx'
  // fileName = fileName ? fileName : 'file.xlsx'
  fileName = decodeURI(fileName) || ''
  downloadFileWithBuffer(res.data, fileName, 'application/vnd.ms-excel;charset=utf-8')
}

export function downloadFileWithBuffer(data, name, type) {
  var blob = new Blob([data], {
    type: type || ''
  })
  var downloadElement = document.createElement('a')
  var href = window.URL.createObjectURL(blob)
  downloadElement.href = href
  downloadElement.download = name
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)
  window.URL.revokeObjectURL(href)
}

export function downloadFileWithBlob(blob, name) {
  var downloadElement = document.createElement('a')
  var href = window.URL.createObjectURL(blob)
  downloadElement.href = href
  downloadElement.download = name
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)
  window.URL.revokeObjectURL(href)
}

export function getGoogleMap() {
  if (!global.GMap) {
    global.GMap = {}
    global.GMap._preloader = new Promise((resolve, reject) => {
      global._initGoogleMap = function() {
        resolve(global.GMap)
        global.document.body.removeChild($script)
        global.GMap._preloader = null
        global._initGoogleMap = null
        global.GMap.maps = google.maps
      }
      const $script = document.createElement('script')
      global.document.body.appendChild($script)
      // console.log(WKConfig)
      $script.src = `https://maps.googleapis.com/maps/api/js?key=${WKConfig.googleMapKey}&libraries=places,geometry&callback=_initGoogleMap`
    })
    return global.GMap._preloader
  } else if (!global.GMap._preloader) {
    return Promise.resolve(global.GMap)
  } else {
    return global.GMap._preloader
  }
}

export function urltoImage(url, fn) {
  var img = new Image()
  img.src = url
  return img
}

export function imagetoCanvas(image) {
  var cvs = document.createElement('canvas')
  var ctx = cvs.getContext('2d')
  cvs.width = image.width
  cvs.height = image.height
  ctx.drawImage(image, 0, 0, cvs.width, cvs.height)
  return cvs
}

export function canvasToDataURL(canvas, format, quality) {
  return canvas.toDataURL(format || 'image/jpeg', quality || 1.0)
}

/**
 * file Path to blob
 */
export function filePathToBlob(filePath) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', filePath, true)
    xhr.responseType = 'blob'
    xhr.onload = function() {
      if (this.status == 200) {
        resolve(this.response)
      } else {
        reject()
      }
    }
    xhr.send()
  })
}

export function isMobileDevice() {
  if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
    return true
  }
  return false
}

import Compress from '@/utils/client-compress'
const options = {
  targetSize: 2.0,
  quality: 0.75,
  maxWidth: 1920,
  maxHeight: 1080,
  autoRotate: false
}
 
const compress = new Compress(options)

export function compressImageBase64(file){
  return new Promise((resolve, reject) => {
    try{
      compress.compress([file.raw]).then(async (conversions) => {
        // Conversions is an array of objects like { photo, info }.
        // 'photo' has the photo data while 'info' contains metadata
        // about that particular image compression (e.g. time taken).

        const { photo, info } = conversions[0]

        console.log({ photo, info })
        let base64 = await Compress.blobToBase64(photo.data)
        // console.log("After compress: " + base64.length)
        resolve(base64)
      })
    }catch(e){
      reject()
    }
  })
}


