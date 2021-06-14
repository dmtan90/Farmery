# Farmery — Opensource Cultivation Management Platform

## Overview of Farmery

Farmery is an open-source cultivation management system based on NodeJS, Vue.JS, and MongoDB. We started to develop it in November 2020, because we want to build an open-source cultivation management system for every farmer around the world can apply technology to improve their business, where we have to connect various sensors, smart devices, task management, and automation processes for farming and manage it while we are on the go.
If you are a farm owner, scientist, grower, or researcher, you can manage your farm easily with Farmery. We know that it’s still a small project. Therefore, we are very open if you want to collaborate with us and make this project bigger. Contact us dmtan@agrhub.com
You can try the online version, by access to this page http://farmery.agrhub.com
Demo account: dmtan90@gmail.com pass: admin@123
If you have any request or cooperation, please email us dmtan@agrhub.com




## 📃System Architecture

#### Front end

1. Vue family bucket (Vue + VueRouter + Vuex + some Vue components)
2. Element UI
3. Preprocessor: Stylus, Pug, Babel
4. Echarts
5. Full calendar
6. Gantt elastic



#### Backend end

1. Koa2
2. Monitoring: fundebug
3. Log: Log4js
4. Timer: node-schedule



#### Persistence

1. MongoDB
2. DAO: Mongoose



#### Hardware

1. ESP32
2. nRF528xx
3. Sense Hub Gateway
4. Sense Hydro Pro
5. Sense Air Basic
6. Sense CO2
7. Xiaomi Flower Care
8. Xiaomi Hydrometer



#### Server

1. Nginx (site server)
2. PM2 (site server)
3. Aedes (MQTT client)
4. Eclipse Mosquitto (MQTT Server)
4. Docker + Docker compose (install Eclipse Mosquitto + Eclipse Streamsheets)




#### Communication

HTTP: Axios

MQTT: Promise + MQTT communication framework



#### Safety

Encryption algorithm: Bcrypt + secondary salting

Communication: JWT



#### Other

Code specification: ESLint

Time processing: moment



## 🌟Installation starts

1. Before starting the project, you need to install all prerequisites first
	1. NodeJS 12+ (https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04)
	2. MongoDB 4+ (https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04-source)
	3. Docker(https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04) + Docker Compose (https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-18-04)
	4. Eclipse Mosquitto + Eclipse Streamsheets (https://wiki.instar.com/en/Frequently_Asked_Question/Mosquitto_2.0_with_Management_Dashboard/)
	5. AdminMongo for management on web (https://github.com/mrvautin/adminMongo)

2. npm install (install all required npm modules)
3. Modify the following configuration files in the config folder to
   1. file.json
   2. key.json
   3. db.json
   3. mqtt.json


4. Turn on the front-end server

  > npm run serve (development)
  > npm run build (productivity)

5. Start backend and files management

  > nohup ./pm2.sh &

  

## 🌞 License

[!License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
