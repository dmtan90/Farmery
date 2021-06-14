const ExcelJS = require('exceljs');
const Sensor = require('model/Sensor')
const Device = require('model/Device')
const User = require('model/User')
const Crop = require('model/Crop')
const Zone = require('model/Zone')
const Farm = require('model/Farm')
const Plant = require('model/Plant')
const DeviceTimeline = require('model/DeviceTimeline')
const CropTimeline = require('model/CropTimeline')
const SensorSeries = require('model/SensorSeries')
const SensorThreshold = require('model/SensorThreshold')
const { path2Image } = require('utils/db/farm')
const log = require('utils/log')

module.exports = {
	async exportSensorSeries(sensorIds, granularity, startTime, endTime) {
		const workbook = new ExcelJS.Workbook();
		workbook.creator = 'Farmery';
		workbook.lastModifiedBy = 'Owner';
		workbook.created = new Date();
		workbook.modified = new Date();
		workbook.lastPrinted = new Date();
		try{
			let device = null

			for(let i = 0; i < sensorIds.length; i++){
				let sensor = await Sensor.findById(sensorIds[i]);
				if(sensor){
					const worksheet = workbook.addWorksheet(sensor.name);
					// adjust pageSetup settings afterwards
					worksheet.pageSetup.margins = {
					  left: 0.7, right: 0.7,
					  top: 0.75, bottom: 0.75,
					  header: 0.3, footer: 0.3
					};

					const headerFontStyle = {
					  name: 'Arial',
					  family: 1,
					  size: 13,
					  bold: true
					};

					//add header of sheet
					if(device == null){
						device = await Device.findById(sensor.deviceId)
					}
					let rowIdx = 1
					let row = worksheet.getRow(rowIdx);
					row.getCell(1).value = "Device:"
					row.getCell(1).font = headerFontStyle
					row.getCell(2).value = device.name
					worksheet.mergeCells(rowIdx,2,rowIdx,3)
					rowIdx++

					row = worksheet.getRow(rowIdx);
					row.getCell(1).value = "Device UID:"
					row.getCell(1).font = headerFontStyle
					row.getCell(2).value = device.uid
					worksheet.mergeCells(rowIdx,2,rowIdx,3)
					rowIdx++

					row = worksheet.getRow(rowIdx);
					row.getCell(1).value = "Sensor:"
					row.getCell(1).font = headerFontStyle
					row.getCell(2).value = sensor.name
					worksheet.mergeCells(rowIdx,2,rowIdx,3)
					rowIdx++

					row = worksheet.getRow(rowIdx);
					row.getCell(1).value = "Granularity:"
					row.getCell(1).font = headerFontStyle
					row.getCell(2).value = granularity.toUpperCase()
					worksheet.mergeCells(rowIdx,2,rowIdx,3)
					rowIdx++

					row = worksheet.getRow(rowIdx);
					row.getCell(1).value = "From:"
					row.getCell(1).font = headerFontStyle
					row.getCell(2).value = new Date(startTime)
					worksheet.mergeCells(rowIdx,2,rowIdx,3)
					row.getCell(4).value = "To:"
					row.getCell(4).font = headerFontStyle
					row.getCell(5).value = new Date(endTime)
					worksheet.mergeCells(rowIdx,5,rowIdx,6)
					rowIdx++

					row = worksheet.getRow(rowIdx);
					row.getCell(1).value = "Created:"
					row.getCell(1).font = headerFontStyle
					row.getCell(2).value = new Date()
					worksheet.mergeCells(rowIdx,2,rowIdx,3)
					rowIdx++

					let columns = [
						{name: '#', totalsRowLabel: 'Totals:', filterButton: true},
					    {name: 'Date', filterButton: true}
					]
					if(granularity === "utm"){
						columns.push({name: 'Value(' + sensor.unit + ')', filterButton: true})
					}
					else{
						columns.push({name: 'Min(' + sensor.unit + ')', filterButton: true})
						columns.push({name: 'Max(' + sensor.unit + ')', filterButton: true})
						columns.push({name: 'Avg(' + sensor.unit + ')', filterButton: true})
					}

					let filter = {
						sensorId: sensor._id, 
						type: granularity,
						"meta.updatedAt": {"$gte": startTime, "$lte": endTime}
					}

					let rows = [];

					const sensorSeries = await SensorSeries.find(filter).sort({"meta.updatedAt":1})
					if(sensorSeries){
						sensorSeries.forEach((series, idx) => {
							if(granularity === "utm"){
								rows.push([idx + 1, new Date(series.meta.updatedAt), series.value])
							}
							else{
								rows.push([idx + 1, new Date(series.meta.updatedAt), series.aggregation.min, series.aggregation.max, series.aggregation.avg])	
							}
						})
					}

					worksheet.addTable({
					  name: sensor.name,
					  ref: 'A8',
					  headerRow: true,
					  totalsRow: false,
					  style: {
					    theme: 'TableStyleLight1',
					    showRowStripes: true,
					  },
					  columns: columns,
					  rows: rows
					});
				}
			}
		}catch(e){
			log.debug(e)
		}

		// write to a new buffer
		const buffer = await workbook.xlsx.writeBuffer();
		//let now = new Date()
		//let filename = now.valueOf() + "_" + granularity + "_" + startTime + "_" + endTime + ".xlsx";
		//await workbook.xlsx.writeFile(filename);
		//workbook.commit();
		return buffer
	},

	async exportCropTimelines(cropId, startTime, endTime, sensorIds){
		const workbook = new ExcelJS.Workbook();
		workbook.creator = 'Farmery';
		workbook.lastModifiedBy = 'Owner';
		workbook.created = new Date();
		workbook.modified = new Date();
		workbook.lastPrinted = new Date();
		try{
			const crop = await Crop.findById(cropId);

			if(crop){
				const worksheet = workbook.addWorksheet(crop.name);
				// adjust pageSetup settings afterwards
				worksheet.pageSetup.margins = {
				  left: 0.7, right: 0.7,
				  top: 0.75, bottom: 0.75,
				  header: 0.3, footer: 0.3
				};

				const headerFontStyle = {
				  name: 'Arial',
				  family: 1,
				  size: 13,
				  bold: true
				};

				const zone = await Zone.findById(crop.zoneId);
				const farm = await Farm.findById(zone.farmId);
				const plant = await Plant.findById(crop.plantId)

				let rowIdx = 1
				let row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "Crop:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = crop.name
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "Cultivation:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = zone.cultivationType.name
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "Size:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = crop.size.value + ' (' + crop.size.unit.name + ')'
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "Zone:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = zone.name
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "Farm:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = farm.name
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "Plant:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = plant.name
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "From:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = new Date(startTime)
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "To:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = new Date(endTime)
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "Created:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = new Date()
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				let columns = [
					{name: '#', totalsRowLabel: 'Totals:', filterButton: true},
				    {name: 'Date', filterButton: true},
				    {name: 'Subject', filterButton: true},
				    {name: 'Creator', filterButton: true},
				    {name: 'Content', filterButton: false},
				    {name: 'Tags', filterButton: false}
				]

				//let { cropId, name, startDate, endDate } = ctx.request.body

				let filter = {
					cropId: cropId,
					date: {"$gte": startTime, "$lte": endTime}
				}
				
				const timelines = await CropTimeline.find(filter).sort({ date: 1 })

				let rows = [];
				let maxMedias = 0;

				if(timelines){
					timelines.forEach((timeline, idx) => {
						if(timeline.medias.length > maxMedias){
							maxMedias = timeline.medias.length;
						}
						let owner = timeline.owner ? timeline.owner.name : 'Unknown';
						rows.push([idx + 1, new Date(timeline.meta.updatedAt), timeline.subject, owner, timeline.content, timeline.tags.join(' ')])
					})
				}
				for(let i = 0; i < maxMedias; i++){
					columns.push({name: 'Media ' + (i + 1), filterButton: false});
				}
				
				let table = worksheet.addTable({
				  name: crop.name,
				  ref: 'A12',
				  headerRow: true,
				  totalsRow: false,
				  style: {
				    theme: 'TableStyleLight1',
				    showRowStripes: true,
				  },
				  columns: columns,
				  rows: rows
				});

				//first row of table
				rowIdx = 12;
				if(timelines){
					timelines.forEach((timeline, idx) => {
						let colId = 6;
						// add image to workbook by base64
						timeline.medias.forEach((media, index) => {
							let ext = 'jpeg';
							const buffer = path2Image(media, ext);
							if(buffer){
								const imageId = workbook.addImage({
								  buffer: buffer,
								  extension: ext,
								});
								worksheet.addImage(imageId, {
								  tl: { col: colId, row: rowIdx },
								  br: { col: colId+1, row: rowIdx+1 },
								  editAs: 'undefined'
								});
								colId++;
							}
						})
						rowIdx++;
					})
				}
			}
		}catch(e){
			log.debug(e)
		}

		if(sensorIds && sensorIds.length > 0){
			try{
				const granularity = "daily";
				let device = null

				for(let i = 0; i < sensorIds.length; i++){
					let sensor = await Sensor.findById(sensorIds[i]);
					if(sensor){
						const worksheet = workbook.addWorksheet(sensor.name);
						// adjust pageSetup settings afterwards
						worksheet.pageSetup.margins = {
						  left: 0.7, right: 0.7,
						  top: 0.75, bottom: 0.75,
						  header: 0.3, footer: 0.3
						};

						const headerFontStyle = {
						  name: 'Arial',
						  family: 1,
						  size: 13,
						  bold: true
						};

						//add header of sheet
						if(device == null){
							device = await Device.findById(sensor.deviceId)
						}
						let rowIdx = 1
						let row = worksheet.getRow(rowIdx);
						row.getCell(1).value = "Device:"
						row.getCell(1).font = headerFontStyle
						row.getCell(2).value = device.name
						worksheet.mergeCells(rowIdx,2,rowIdx,3)
						rowIdx++

						row = worksheet.getRow(rowIdx);
						row.getCell(1).value = "Device UID:"
						row.getCell(1).font = headerFontStyle
						row.getCell(2).value = device.uid
						worksheet.mergeCells(rowIdx,2,rowIdx,3)
						rowIdx++

						row = worksheet.getRow(rowIdx);
						row.getCell(1).value = "Sensor:"
						row.getCell(1).font = headerFontStyle
						row.getCell(2).value = sensor.name
						worksheet.mergeCells(rowIdx,2,rowIdx,3)
						rowIdx++

						row = worksheet.getRow(rowIdx);
						row.getCell(1).value = "Granularity:"
						row.getCell(1).font = headerFontStyle
						row.getCell(2).value = granularity.toUpperCase()
						worksheet.mergeCells(rowIdx,2,rowIdx,3)
						rowIdx++

						row = worksheet.getRow(rowIdx);
						row.getCell(1).value = "From:"
						row.getCell(1).font = headerFontStyle
						row.getCell(2).value = new Date(startTime)
						worksheet.mergeCells(rowIdx,2,rowIdx,3)
						row.getCell(4).value = "To:"
						row.getCell(4).font = headerFontStyle
						row.getCell(5).value = new Date(endTime)
						worksheet.mergeCells(rowIdx,5,rowIdx,6)
						rowIdx++

						row = worksheet.getRow(rowIdx);
						row.getCell(1).value = "Created:"
						row.getCell(1).font = headerFontStyle
						row.getCell(2).value = new Date()
						worksheet.mergeCells(rowIdx,2,rowIdx,3)
						rowIdx++

						let columns = [
							{name: '#', totalsRowLabel: 'Totals:', filterButton: true},
						    {name: 'Date', filterButton: true}
						]
						if(granularity === "utm"){
							columns.push({name: 'Value(' + sensor.unit + ')', filterButton: true})
						}
						else{
							columns.push({name: 'Min(' + sensor.unit + ')', filterButton: true})
							columns.push({name: 'Max(' + sensor.unit + ')', filterButton: true})
							columns.push({name: 'Avg(' + sensor.unit + ')', filterButton: true})
						}

						let filter = {
							sensorId: sensor._id, 
							type: granularity,
							"meta.updatedAt": {"$gte": startTime, "$lte": endTime}
						}

						let rows = [];

						const sensorSeries = await SensorSeries.find(filter).sort({"meta.updatedAt":1})
						if(sensorSeries){
							sensorSeries.forEach((series, idx) => {
								if(granularity === "utm"){
									rows.push([idx + 1, new Date(series.meta.updatedAt), series.value])
								}
								else{
									rows.push([idx + 1, new Date(series.meta.updatedAt), series.aggregation.min, series.aggregation.max, series.aggregation.avg])	
								}
							})
						}

						worksheet.addTable({
						  name: sensor.name,
						  ref: 'A8',
						  headerRow: true,
						  totalsRow: false,
						  style: {
						    theme: 'TableStyleLight1',
						    showRowStripes: true,
						  },
						  columns: columns,
						  rows: rows
						});
					}
				}
			}catch(e){
				log.debug(e)
			}
		}

		// write to a new buffer
		const buffer = await workbook.xlsx.writeBuffer();
		return buffer
	},

	async exportDeviceTimelines(deviceId, startTime, endTime){
		const workbook = new ExcelJS.Workbook();
		workbook.creator = 'Farmery';
		workbook.lastModifiedBy = 'Owner';
		workbook.created = new Date();
		workbook.modified = new Date();
		workbook.lastPrinted = new Date();
		try{
			const device = await Device.findById(deviceId);

			if(device){
				const worksheet = workbook.addWorksheet(device.name);
				// adjust pageSetup settings afterwards
				worksheet.pageSetup.margins = {
				  left: 0.7, right: 0.7,
				  top: 0.75, bottom: 0.75,
				  header: 0.3, footer: 0.3
				};

				const headerFontStyle = {
				  name: 'Arial',
				  family: 1,
				  size: 13,
				  bold: true
				};

				let rowIdx = 1
				let row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "Device:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = device.name
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "From:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = new Date(startTime)
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "To:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = new Date(endTime)
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				row = worksheet.getRow(rowIdx);
				row.getCell(1).value = "Created:"
				row.getCell(1).font = headerFontStyle
				row.getCell(2).value = new Date()
				worksheet.mergeCells(rowIdx,2,rowIdx,3)
				rowIdx++

				let columns = [
					{name: '#', totalsRowLabel: 'Totals:', filterButton: true},
				    {name: 'Date', filterButton: true},
				    {name: 'Subject', filterButton: true},
				    {name: 'Creator', filterButton: true},
				    {name: 'Content', filterButton: false},
				    {name: 'Tags', filterButton: false}
				]

				let filter = {
					deviceId: deviceId,
					date: {"$gte": startTime, "$lte": endTime}
				}
				
				const timelines = await DeviceTimeline.find(filter).sort({ date: 1 })

				let rows = [];
				let maxMedias = 0;

				if(timelines){
					timelines.forEach((timeline, idx) => {
						if(timeline.medias.length > maxMedias){
							maxMedias = timeline.medias.length;
						}
						let owner = timeline.owner ? timeline.owner.name : 'Unknown';
						rows.push([idx + 1, new Date(timeline.meta.updatedAt), timeline.subject, owner, timeline.content, timeline.tags.join(' ')])
					})
				}
				for(let i = 0; i < maxMedias; i++){
					columns.push({name: 'Media ' + (i + 1), filterButton: false});
				}
				
				let table = worksheet.addTable({
				  name: device.name,
				  ref: 'A12',
				  headerRow: true,
				  totalsRow: false,
				  style: {
				    theme: 'TableStyleLight1',
				    showRowStripes: true,
				  },
				  columns: columns,
				  rows: rows
				});

				//first row of table
				rowIdx = 7;
				if(timelines){
					timelines.forEach((timeline, idx) => {
						let colId = 6;
						// add image to workbook by base64
						timeline.medias.forEach((media, index) => {
							let ext = 'jpeg';
							const buffer = path2Image(media, ext);
							if(buffer){
								const imageId = workbook.addImage({
								  buffer: buffer,
								  extension: ext,
								});
								worksheet.addImage(imageId, {
								  tl: { col: colId, row: rowIdx },
								  br: { col: colId+1, row: rowIdx+1 },
								  editAs: 'undefined'
								});
								colId++;
							}
						})
						rowIdx++;
					})
				}
			}
		}catch(e){
			log.debug(e)
		}

		// write to a new buffer
		const buffer = await workbook.xlsx.writeBuffer();
		return buffer
	}
}
