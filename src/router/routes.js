import Login from '@/views/Login/Index'
import SignUp from '@/views/SignUp/Index'
import Error from '@/views/Error/404'
import Home from '@/views/Admin/Index'

import OrgManage from '@/views/Admin/pages/organization/Admin'
import OrgAdd from '@/views/Admin/pages/organization/Add'
import OrgAddMember from '@/views/Admin/pages/organization/AddMember'
import OrgEdit from '@/views/Admin/pages/organization/Edit'

import UserProfile from '@/views/Admin/pages/user/Index'

import FarmManage from '@/views/Admin/pages/farm/Admin'
import FarmView from '@/views/Admin/pages/farm/View'
import FarmAdd from '@/views/Admin/pages/farm/Add'

import ZoneManage from '@/views/Admin/pages/zone/Admin'
import ZoneAdd from '@/views/Admin/pages/zone/Add'
import ZoneEdit from '@/views/Admin/pages/zone/Edit'

import CropManage from '@/views/Admin/pages/crop/Admin'
import CropAdd from '@/views/Admin/pages/crop/Add'
import CropEdit from '@/views/Admin/pages/crop/Edit'

import PlantManage from '@/views/Admin/pages/plant/Admin'
import PlantAdd from '@/views/Admin/pages/plant/Add'
import PlantEdit from '@/views/Admin/pages/plant/Edit'

import DeviceManage from '@/views/Admin/pages/device/Admin'
import DeviceAdd from '@/views/Admin/pages/device/Add'
import DeviceEdit from '@/views/Admin/pages/device/Edit'
import DeviceModelAdd from '@/views/Admin/pages/device/ModelAdd'
import DeviceModelEdit from '@/views/Admin/pages/device/ModelEdit'

import ScriptManage from '@/views/Admin/pages/scripts/Admin'
import ScriptAdd from '@/views/Admin/pages/scripts/Add'
import ScriptEdit from '@/views/Admin/pages/scripts/Add'

import WeatherIndex from '@/views/Admin/pages/weather/Index'
import WeatherForecast from '@/views/Admin/pages/weather/Forecast'

import Card from '@/views/Admin/wrap/Card'
import i18n from '@/lang/i18n'

export default [
	{
		path: '/',
		name: 'Login',
		component: Login,
		meta: {
			title: 'SMART AGRICULTURE – VKIST – NACENTECH'
		}
	},
	{
		path: '/signup',
		name: 'SignUp',
		component: SignUp,
		meta: {
			title: 'SMART AGRICULTURE – VKIST – NACENTECH'
		}
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
		meta: {
			title: i18n.t('components.layout.aside.dashboard')
		},
		children: [
			{
				path: 'user',
				name: 'User',
				redirect: '/home',
				component: Card,
				children: [
					{
						path: 'profile',
						name: 'UserProfile',
						component: UserProfile,
						meta: {
							title: 'components.layout.aside.profile'
						}
					}
				]
			},
			{
				path: 'org',
				name: 'Organization',
				redirect: '/home',
				component: Card,
				children: [
					{
						path: 'admin',
						name: 'OrgManage',
						component: OrgManage,
						meta: {
							title: 'components.layout.aside.orgManagement'
						}
					},
					{
						path: 'edit/:id',
						name: 'OrgEdit',
						component: OrgEdit,
						props: true,
						meta: {
							title: 'components.layout.aside.orgEdit'
						}
					},
					{
						path: 'add',
						name: 'OrgAdd',
						component: OrgAdd,
						meta: {
							title: 'components.layout.aside.orgCreate'
						}
					},
					{
						path: 'addmember/:id',
						name: 'OrgAddMember',
						component: OrgAddMember,
						props: true,
						meta: {
							title: 'components.layout.aside.orgAddMember'
						}
					}
				]
			},
			{
				path: 'farm',
				name: 'Farm',
				redirect: '/home',
				component: Card,
				children: [
					{
						path: 'admin',
						name: 'FarmManage',
						component: FarmManage,
						meta: {
							title: 'components.layout.aside.farmManagement'
						}
					},
					{
						path: 'view/:id',
						name: 'FarmView',
						component: FarmView,
						props: true,
						meta: {
							title: 'components.layout.aside.farmDetail'
						}
					},
					{
						path: 'create',
						name: 'FarmAdd',
						component: FarmAdd,
						meta: {
							title: 'components.layout.aside.farmCreate'
						}
					}
				]
			},
			{
				path: 'zone',
				name: 'Zone',
				redirect: '/home',
				component: Card,
				children: [
					{
						path: 'admin/:farmId',
						name: 'ZoneManage',
						component: ZoneManage,
						props: true,
						meta: {
							title: 'components.layout.aside.zoneManagement'
						}
					},
					{
						path: 'edit/:id',
						name: 'ZoneEdit',
						component: ZoneEdit,
						props: true,
						meta: {
							title: 'components.layout.aside.zoneEdit'
						}
					},
					{
						path: 'add',
						name: 'ZoneAdd',
						component: ZoneAdd,
						meta: {
							title: 'components.layout.aside.zoneCreate'
						}
					}
				]
			},
			{
				path: 'crop',
				name: 'Crop',
				redirect: '/home',
				component: Card,
				children: [
					{
						path: 'admin',
						name: 'CropManage',
						component: CropManage,
						props: true,
						meta: {
							title: 'components.layout.aside.cropManagement'
						}
					},
					{
						path: 'edit/:id',
						name: 'CropEdit',
						component: CropEdit,
						props: true,
						meta: {
							title: 'components.layout.aside.cropEdit'
						}
					},
					{
						path: 'add',
						name: 'CropAdd',
						component: CropAdd,
						meta: {
							title: 'components.layout.aside.cropCreate'
						}
					}
				]
			},
			{
				path: 'plant',
				name: 'Plant',
				redirect: '/home',
				component: Card,
				children: [
					{
						path: 'admin',
						name: 'PlantManage',
						component: PlantManage,
						meta: {
							title: 'components.layout.aside.plantManagement'
						}
					},
					{
						path: 'edit/:id',
						name: 'PlantEdit',
						component: PlantEdit,
						props: true,
						meta: {
							title: 'components.layout.aside.plantEdit'
						}
					},
					{
						path: 'add',
						name: 'PlantAdd',
						component: PlantAdd,
						meta: {
							title: 'components.layout.aside.plantCreate'
						}
					}
				]
			},
			{
				path: 'device',
				name: 'Device',
				redirect: '/home',
				component: Card,
				children: [
					{
						path: 'admin',
						name: 'DeviceManage',
						component: DeviceManage,
						meta: {
							title: 'components.layout.aside.deviceManagement'
						}
					},
					{
						path: 'add',
						name: 'DeviceAdd',
						component: DeviceAdd,
						meta: {
							title: 'components.layout.aside.deviceCreate'
						}
					},
					{
						path: 'edit/:id',
						name: 'DeviceEdit',
						component: DeviceEdit,
						props: true,
						meta: {
							title: 'components.layout.aside.deviceEdit'
						}
					},
					{
						path: 'modeladd',
						name: 'DeviceModelAdd',
						component: DeviceModelAdd,
						meta: {
							title: 'components.layout.aside.deviceModelCreate'
						}
					},
					{
						path: 'modeledit/:id',
						name: 'DeviceModelEdit',
						component: DeviceModelEdit,
						props: true,
						meta: {
							title: 'components.layout.aside.deviceModelEdit'
						}
					}
				]
			},
			{
				path: 'weather',
				name: 'Weather',
				redirect: '/home',
				component: Card,
				children: [
					{
						path: 'info',
						name: 'WeatherIndex',
						component: WeatherIndex,
						meta: {
							title: 'components.layout.aside.weather'
						}
					},
					{
						path: 'forecast',
						name: 'WeatherForecast',
						component: WeatherForecast,
						meta: {
							title: 'components.layout.aside.weatherForecast'
						}
					}
				]
			},
			{
				path: 'script',
				name: 'Script',
				redirect: '/home',
				component: Card,
				children: [
					{
						path: 'admin',
						name: 'ScriptManage',
						component: ScriptManage,
						meta: {
							title: 'components.layout.aside.scriptManagement'
						}
					},
					{
						path: 'add',
						name: 'ScriptAdd',
						component: ScriptAdd,
						meta: {
							title: 'components.layout.aside.scriptCreate'
						}
					},
					{
						path: 'edit/:id',
						name: 'ScriptEdit',
						component: ScriptEdit,
						props: true,
						meta: {
							title: 'components.layout.aside.scriptEdit'
						}
					}
				]
			}
		]
	},
	{
		path: '*',
		name: 'Login',
		component: Login,
		meta: {
			title: 'SMART AGRICULTURE – VKIST – NACENTECH'
		}
	}
]
