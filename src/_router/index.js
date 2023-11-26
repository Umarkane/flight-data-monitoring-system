import Vue from 'vue'
import VueRouter from 'vue-router'
import protect from '../_helpers/protect-route'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import('@/components/admin/AdminLayout.vue'),
		children: [
			{
				path: '/',
				name: 'AdminHome',
				component: () => import('@/views/admin/Home.vue')
			},
			{
				path: '/dashboard',
				name: 'dashboard',
				component: () => import('@/views/admin/Home.vue')
			},
			{
				path: '/technician',
				name: 'AdminTechnician',
				component: () => import('@/views/admin/Technician.vue')
			},
			{
				path: '/data-insight',
				name: 'AdminDataList',
				component: () => import('@/views/admin/DataInsight.vue')
			},
			{
				path: '/animate',
				name: 'Animate',
				component: () => import('@/components/visualization/Cesium.vue')
			},
			{
				path: '/plot',
				name: 'Plot',
				component: () => import('@/views/admin/Plot.vue')
			},
			{
				path: '/analytics',
				name: 'Analytics',
				component: () => import('@/views/admin/Analytics.vue')
			},
			{
				path: '/report',
				name: 'Report',
				component: () => import('@/components/reports/FdmReport.vue')
			},

			// Technician Page
			{
				path: '/upload',
				name: 'Upload',
				component: () => import('@/views/technician/Upload.vue')
			},
		],
		// beforeEnter: (to, from, next) => {
		// 	protect.checkUser(next)
		// },
	},
	{
		path: '/super-admin',
		name: 'SuperAdmin',
		component: () => import('@/components/admin/AdminLayout.vue'),
		children: [
			{
				path: '/',
				redirect: '/airline'
				// name: 'SuperAdminHome',
				// component: () => import('@/views/super-admin/SuperAdmin.vue')
			},
			{
				path: '/airline',
				name: 'Airline',
				component: () => import('@/views/super-admin/Airline.vue')
			},
			{
				path: '/country',
				name: 'Country',
				component: () => import('@/views/super-admin/Country.vue')
			},
			{
				path: '/city',
				name: 'City',
				component: () => import('@/views/super-admin/City.vue')
			},
			{
				path: '/navbar',
				name: 'Navbar',
				component: () => import('@/views/super-admin/Navbar.vue')
			},
			{
				path: '/permission',
				name: 'Permission',
				component: () => import('@/views/super-admin/Permission.vue')
			},
			{
				path: '/role',
				name: 'Role',
				component: () => import('@/views/super-admin/Role.vue')
			},
			{
				path: '/aircraft-model',
				name: 'AircraftModel',
				component: () => import('@/views/super-admin/AircraftModel.vue')
			},
			{
				path: '/aircraft',
				name: 'Aircraft',
				component: () => import('@/views/super-admin/Aircraft.vue')
			},
			{
				path: '/airport',
				name: 'Airport',
				component: () => import('@/views/super-admin/Airport.vue')
			},
			{
				path: '/route',
				name: 'Route',
				component: () => import('@/views/super-admin/Route.vue')
			},
			{
				path: '/admin',
				name: 'Admin',
				component: () => import('@/views/super-admin/Admin.vue')
			},
			{
				path: '/trigger',
				name: 'Trigger',
				component: () => import('@/views/super-admin/Trigger.vue')
			},
			{
				path: '/aircraft-model-trigger',
				name: 'AircraftModelTrigger',
				component: () => import('@/views/super-admin/AircraftModelTrigger.vue')
			},
		],
		// beforeEnter: (to, from, next) => {
		// 	protect.checkSuperAdmin(next)
		// },
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/Login.vue')
	},
	{
		path: '/forgot-password',
		name: 'ForgotPassword',
		component: () => import('@/views/ForgotPassword.vue')
	},
	{
		path: '/password-recovery',
		name: 'PasswordRecovery',
		component: () => import('@/views/PasswordRecovery.vue')
	},
	{
		path: '/visual',
		name: 'Visual',
		component: () => import('@/components/visualization/AircraftVisualization.vue')
	},
	{
		path: '/cesium',
		name: 'Cesium',
		component: () => import('@/components/visualization/Cesium.vue')
	},
	{
		path: '*',
		redirect: '/login'
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
