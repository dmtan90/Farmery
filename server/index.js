require('module-alias/register')

const Koa = require('koa')
const ip = require('ip')
const router = require('routes')
const http = require('config/http')
const log = require('utils/log')
const middleware = require('middlewares')

const app = new Koa()
middleware(app)
router(app)
require('db')()

//require('schedule')()
//require('consumption')()

require('schedule/ScheduleTimer')
ScheduleTimer.start()

require('schedule/SystemTasks')
SystemTasks.start()

app.listen(http.port, () => {
  log.success(`Backend Server is running at http://${ip.address()}:${http.port}`)
})
