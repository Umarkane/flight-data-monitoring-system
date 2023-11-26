<template>
	<div class="header">
		<div class="header__left" />
		<div
			v-if="isTechnician"
			class="header__center"
		>
			<img
				src="../assets/icons/search.svg"
				alt=""
			>
			<input
				type="text"
				placeholder="Search here"
			>
		</div>
		<div
			v-if="isDashboard"
			class="header__dashboard"
		>
			<FunctionalCalendar
				v-model="calendarData"
				:is-dark="true"
				:is-modal="true"
				:is-date-range="true"
				@selectedDaysCount="onClose"
			/>
			<top-triggers />
		</div>
		<div
			v-if="isAnimate"
			class="flight-select"
		>
			<select
				v-model="aircraftId"
				placeholder="Choose an aircraft"
				@change="onAircraftSelect"
			>
				<option value="0">
					Select an aircraft
				</option>
				<option
					v-for="aircraft in aircrafts"
					:key="aircraft.id"
					:value="aircraft.id"
					:title="aircraft.title"
				>
					{{ aircraft.title }}
				</option>
			</select>
			<select
				v-model="routeId"
				placeholder="Choose a route"
				@change="onRouteSelect"
			>
				<option value="0">
					Select a route
				</option>
				<option
					v-for="route in routes"
					:key="route.id"
					:value="route.id"
					:title="route.from_airport_title + ' - ' + route.to_airport_title"
				>
					{{ route.from_airport_title }} - {{ route.to_airport_title }}
				</option>
			</select>
			<select
				v-model="flight"
				placeholder="Choose a file"
				@change="onFlightSelect"
			>
				<option value="0">
					Select a flight
				</option>
				<option
					v-for="f in flights"
					:key="f.id"
					:value="f.id"
					:title="f.flight_no"
				>
					{{ f.flight_no }}
				</option>
			</select>
		</div>
		<div class="header__right">
			<div
				v-if="isNotif"
				id="overflow"
				class="overflow"
			/>
			<div
				class="header__right__alert"
				@click="onShowAlert"
			>
				<img
					class="relative pointer"
					src="../assets/icons/alert.svg"
					alt=""
				>
				<svg
					class="alert"
					width="6"
					height="6"
					viewBox="0 0 6 6"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						cx="3"
						cy="3"
						r="3"
						fill="#FA5F1C"
					/>
				</svg>
				<div
					v-if="isNotif"
					class="alert__content"
				>
					<notifications />
				</div>
			</div>
			<div
				class="header__right__profile"
			>
				<div
					v-if="isShowProfile"
					id="overflow"
					class="overflow"
				/>
				<div
					class="pointer flex-align-center header__right__profile__content"
					:class="{ 'up' : isShowProfile }"
					@click="isShowProfile = !isShowProfile"
				>
					<div
						v-if="userProfile.user.avatar"
						:style="`background-image: url(${userProfile.user.avatar})`"
						alt=""
						class="avatar"
					/>
					<div
						v-else-if="userRole && userRole.code === 'ROLE_TECHNICIAN'"
						:style="`background-image: url(${require('../assets/img/boss.png')})`"
						alt=""
						class="avatar"
					/>
					<div
						v-else
						:style="`background-image: url(${require('../assets/img/profile.png')})`"
						alt=""
						class="avatar"
					/>
					<!-- <i
						v-else-if="userRole && userRole.code === 'ROLE_TECHNICIAN'"
						class="fas fa-user"
					/>
					<i
						v-else
						class="fas fa-user-tie"
					/> -->
					<span class="header__right__name">{{ userProfile.user.first_name }} {{ userProfile.user.last_name }}</span>
					<img
						src="../assets/icons/chevron-down.svg"
						alt=""
					>
				</div>

				<div
					v-if="isShowProfile"
					class="profile"
				>
					<div
						class="profile__item"
						:style="`background-image: url(${require('../assets/icons/profile.svg')})`"
						@click="isProfile = true"
					>
						My Profile
					</div>
					<div
						class="profile__item"
						:style="`background-image: url(${require('../assets/icons/password.svg')})`"
					>
						Password
					</div>
					<div
						class="profile__item"
						:style="`background-image: url(${require('../assets/icons/alert-2.svg')})`"
					>
						Alerts
					</div>
				</div>
			</div>
		</div>
		<profile
			v-if="isProfile"
			@close="isProfile = false"
		/>
	</div>
</template>

<script>
import Notifications from './Notifications'
import Profile from './Profile'
import { mapActions } from 'vuex'
import moment from 'moment'
import TopTriggers from './reports/TopTriggers'
import { fileService } from '../_services/file.service'
import { roleService } from '../_services/role.service'
import { flightService } from '../_services/flight.service'
import { aircraftService } from '../_services/aircraft.service'
import { routeService } from '../_services/route.service'

export default {
	name: 'Header',
	components: { TopTriggers, Profile, Notifications },
	data () {
		return {
			isNotif: false,
			isShowProfile: false,
			isProfile: false,
			calendarData: {},
			aircrafts: [],
			aircraftId: 0,
			routes: [],
			routeId: 0,
			roles: [],
			userRole: '',
			flights: [],
			flight: 0
		}
	},
	computed: {
		isTechnician () {
			return this.$route.path === '/technician'
		},
		isDashboard () {
			return this.$route.path === '/dashboard'
		},
		isAnimate () {
			return this.$route.path === '/animate'
		},
		userProfile () {
			return this.$store.state.account.user
		},
		fileId () {
			return this.$store.getters['file/selectedFile']
		},
	},
	watch: {
		isAnimate: {
			immediate: true,
			handler: function (value) {
				if (value) {
					this.fetchAircrafts()
				}
			}
		},
		fileId (val) {
			this.selectedFile = val
		}
	},
	mounted () {
		document.addEventListener('click', this.onOutsideClick)
		this.fetchRoles()
	},
	beforeDestroy () {
		document.removeEventListener('click', this.onOutsideClick)
	},
	methods: {
		...mapActions('other', [ 'setCalendar' ]),
		...mapActions('file', [ 'setFileId','setFlightId' ]),
		onShowAlert () {
			this.isNotif = !this.isNotif
		},
		onOutsideClick (e) {
			const overflow = document.getElementById('overflow')
			if (e.target === overflow) {
				this.isNotif = false
				this.isShowProfile = false
			}
		},
		fetchRoles () {
			roleService.getAll().then(res => {
				this.roles = res
				this.userRole = this.roles.find(i => i.id === this.userProfile.user.role[0])
			}).catch(err => console.log(err))	
		},
		cropText (text) {
			if (text.length > 40) {
				return text.substr(0, 40) + '...'
			}	else return text
		},
		fetchFlight (routeId) {
			flightService.getAll(routeId, '','', this.aircraftId).then(res => {
				this.flights = res
			}).catch(err => {
				console.log(err)
			})
		},
		fetchAircrafts () {
			aircraftService.getAll(this.userProfile.user.airline[0]).then(res => {
				this.aircrafts = res
			}).catch(err => {
				console.log(err)
			})
		},
		fetchRoutes () {
			routeService.getAll(this.aircraftId, this.userProfile.user.airline[0]).then(res => {
				this.routes = res
			}).catch(err => {
				console.log(err)
			})
		},
		onClose () {
			this.setCalendar({
				start: moment(this.calendarData.dateRange.start, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
				end: moment(this.calendarData.dateRange.end, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
			})
		},
		onAircraftSelect (event) {
			if (event.target.value !== '0') {
				this.fetchRoutes()
			}
		},
		onRouteSelect (event) {
			if (event.target.value !== '0') {
				this.fetchFlight(event.target.value)
			}
		},
		onFlightSelect (e) {
			if (e.target.value !== '0') {
				this.setFlightId(e.target.value)
			}
		}
	}
}
</script>

<style lang="scss">
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100px;

		&__center {
			position: relative;
			input {
				border: 0.5px solid #888e9a;
				width: 400px;
				height: 39px;
				background: $black-back;
				padding-left: 42px;
				font-weight: 400;
				font-size: 14px;
				line-height: 19px;
				color: #7882a2;
				outline-color: #888e9a;
			}

			img {
				position: absolute;
				left: 16px;
				top: 9px;
			}
		}

		&__right {
			display: flex;
			align-items: center;

			&__alert {
				margin-right: 42px;
				cursor: pointer;
				position: relative;
				z-index: 2;

				.alert {
					position: absolute;
					top: -2px;
    				right: 1px;
				}
			}

			.p-alert {
				position: relative;
				top: -6px;
				right: 3px;
			}

			&__profile {
				font-weight: 400;
				font-size: 16px;
				line-height: 22px;
				letter-spacing: 0.02em;
				color: #ffffff;
				margin-right: 40px;
				position: relative;

				&__content {
					position: relative;
					z-index: 1;

					&.up {
						z-index: 2;
					}
				}
			}

			&__name {
				padding: 0 13px 0 16px;
			}
		}

		&__dashboard {
			display: flex;
			align-items: center;
			gap: 20px;
		}
	}
	.alert {
		position: relative;

		&__content {
			position: absolute;
			top: 31px;
			right: 0;
			z-index: 12;
		}
	}

	.profile {
		position: absolute;
		right: 0;
		top: 62px;
		width: 320px;
		padding: 25px 0;
		background: #1F2327;
		box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
		border-radius: 2px;
		z-index: 12;

		&__item {
			height: 66px;
			font-size: 20px;
			font-weight: 400;
			line-height: 24px;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			background-repeat: no-repeat;
			background-position: left 32px center;
			cursor: pointer;

			&:hover {
				background-color: rgba(#FFFFFF, 0.2);
			}
		}
	}
	.flight-select {
		select {
			width: 200px;
			height: 40px;
			outline: none;
			background: #b4b4b4;
			border-radius: 2px;
			color: #000000;
			margin-right: 10px;
		}
	}

</style>
