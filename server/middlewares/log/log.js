const log4js = require('log4js')
const access = require('./access') // Encapsulation file for importing log output information
const path = require('path')
const config = require('config/log')
const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark']

// Extract the default public parameter object
const baseInfo = config
module.exports = (options = {}) => {
  let contextLogger = {}, //Error log level object, finally assigned to ctx, used to print various logs
    appenders = {}, //Log configuration
    opts = Object.assign({}, baseInfo, options), //System Configuration
    { logLevel, dir, ip, projectName } = opts,
    commonInfo = { projectName, ip } //Store common log information

  //Specify the log category to be recorded
  appenders.all = {
    type: 'dateFile', //Log file type, you can use the date as a placeholder for the file name
    filename: `${dir}/all/`, //Log file name, you can set relative path or absolute path
    pattern: 'task-yyyy-MM-dd.log', //Placeholder, immediately after filename
    alwaysIncludePattern: true //Is there always a suffix
  }

  // The environment variable is dev local development, which is considered a development environment
  if (
    config.env === 'dev' || config.env === 'local' || config.env === 'development' ) {
    appenders.out = {
      type: 'console'
    }
  }

  let logConfig = {
    appenders,

    /**
     * Specify the default configuration items for the log
     * If not specified in log4js.getLogger, the default is the configuration item of cheese log
     */
    categories: {
      default: {
        appenders: Object.keys(appenders),
        level: logLevel
      }
    }
  }

  let logger = log4js.getLogger('cheese')
  return async (ctx, next) => {
    const start = Date.now() // Record the time the request started

    // Loop methods to mount all methods to ctx
    methods.forEach((method, i) => {
      contextLogger[method] = message => {
        logConfig.appenders.cheese = {
          type: 'dateFile', //Log file type, you can use the date as a placeholder for the file name
          filename: `${dir}/${method}/`,
          pattern: `${method}-yyyy-MM-dd.log`,
          alwaysIncludePattern: true //Is there always a suffix
        }
        log4js.configure(logConfig)
        logger[method](access(ctx, message, commonInfo))
      }
    })
    ctx.log = contextLogger
    await next()
    // Time of completion of recording, difference calculation of response time
    const responseTime = Date.now() - start

    ctx.log.info( access( ctx, { responseTime: `The response time is ${responseTime / 1000}s` }, commonInfo ) )
  }
}
