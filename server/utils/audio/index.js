require('module-alias/register')

const {
	B_AppID,
	B_APIKey,
	X_AppID,
	X_APIKey,
	SecretKey,
	format,
	rate,
	dev_pid
} = require('config/audio')

const AipSpeechClient = require('baidu-aip-sdk').speech

const ffmpeg = require('fluent-ffmpeg')

const Xunfei = require('xunfeisdk')
const { IATAueType, IATEngineType } = require('xunfeisdk')
const client = new Xunfei.Client(X_AppID)
client.IATAppKey = X_APIKey

// const Client = new AipSpeechClient(B_AppID, B_APIKey, SecretKey)

module.exports = {
	Recognize: (audio, cuid) => {
		// return Client.recognize(audio, format, rate, { dev_pid, cuid })
		return client.IAT(audio, IATEngineType.SMS8K_Mandarin, IATAueType.RAW)
	},
	ConvertByteRate: (path, callback, ctx) =>
		ffmpeg(path)
			.audioCodec('libmp3lame')
			.audioBitrate('128k')
			.audioChannels(2)
			.save(path)
			.on('end', callback)
			.on('error', () => ctx.sendError('Audio conversion failed!'))
}
