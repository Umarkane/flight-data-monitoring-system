<template>
	<div
		class="sidebar"
		:class="{ small: minimize }"
	>
		<div class="sidebar__top">
			<div 
				:class="{ minimize : minimize }"
				class="sidebar__up" 
			>
				<div
					v-if="!minimize"
					class="sidebar__logo"
				>
					<span>FlightData</span>
					<span class="sidebar__circle" />
				</div>
				<div
					v-else
					class="sidebar__space"
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					width="24px"
					height="24px"
					viewBox="0 0 24 24"
					version="1.1"
					@click="onMinimize"
				>
					<g
						stroke="none"
						stroke-width="1"
						fill="none"
						fill-rule="evenodd"
					>
						<polygon points="0 0 24 0 24 24 0 24" />
						<path
							d="M5.29288961,6.70710318 C4.90236532,6.31657888 4.90236532,5.68341391 5.29288961,5.29288961 C5.68341391,4.90236532 6.31657888,4.90236532 6.70710318,5.29288961 L12.7071032,11.2928896 C13.0856821,11.6714686 13.0989277,12.281055 12.7371505,12.675721 L7.23715054,18.675721 C6.86395813,19.08284 6.23139076,19.1103429 5.82427177,18.7371505 C5.41715278,18.3639581 5.38964985,17.7313908 5.76284226,17.3242718 L10.6158586,12.0300721 L5.29288961,6.70710318 Z"
							fill="#000000"
							fill-rule="nonzero"
							transform="translate(8.999997, 11.999999) scale(-1, 1) translate(-8.999997, -11.999999)"
						/>
						<path
							d="M10.7071009,15.7071068 C10.3165766,16.0976311 9.68341162,16.0976311 9.29288733,15.7071068 C8.90236304,15.3165825 8.90236304,14.6834175 9.29288733,14.2928932 L15.2928873,8.29289322 C15.6714663,7.91431428 16.2810527,7.90106866 16.6757187,8.26284586 L22.6757187,13.7628459 C23.0828377,14.1360383 23.1103407,14.7686056 22.7371482,15.1757246 C22.3639558,15.5828436 21.7313885,15.6103465 21.3242695,15.2371541 L16.0300699,10.3841378 L10.7071009,15.7071068 Z"
							fill="#000000"
							fill-rule="nonzero"
							opacity="0.3"
							transform="translate(15.999997, 11.999999) scale(-1, 1) rotate(-270.000000) translate(-15.999997, -11.999999)"
						/>
					</g>
				</svg>
			</div>
			
			<div class="sidebar__menu">
				<div
					v-for="item in menus"
					:key="item.href"
					class="sidebar__menu__item"
					:class="{
						small: minimize,
						active: item.href === $route.path,
					}"
					@click="onRoute(item.href)"
				>
					<i
						v-if="item.icon"
						:class="item.icon"
					/>
					<img
						v-else
						:src="folderIcon"
						alt=""
					>
					{{ !minimize ? item.title : '' }}
				</div>
			</div>
		</div>
		<div class="sidebar__bottom">
			<div
				v-for="item in bottomMenus"
				:key="item.icon"
				class="sidebar__menu__item"
				:class="{ small: minimize }"
				@click="onRoute(item.href)"
			>
				<img
					:src="item.icon"
					alt=""
				> {{ !minimize ? item.title : '' }}
			</div>
		</div>
	</div>
</template>

<script>
import sidebars from '@/_helpers/sidebars'
import { mapActions } from 'vuex'
export default {
	name: 'Sidebar',
	data () {
		return {
			menus: [],
			bottomMenus: sidebars.bottomMenus,
			folderIcon: require('../assets/icons/folder.svg'),
		}
	},
	computed: {
		sidebars () {
			return this.$store.getters['sidebars/sidebars']
		},
		userProfile () {
			return this.$store.state.account.user
		},
		minimize () {
			return this.$store.getters['sidebars/minimize']
		}
	},
	watch: {
		sidebars () {
			if (this.userProfile.user.is_staff) {
				this.menus = sidebars.superAdminSidebars
			} else this.menus = this.sidebars
		}
	},
	mounted () {
		if (this.userProfile.user.is_staff) {
			this.menus = sidebars.superAdminSidebars
		} else this.menus = this.sidebars
	},
	methods: {
		...mapActions('sidebars', [ 'setMinimize' ]),
		onRoute (href) {
			if (href !== this.$route.path) this.$router.push(href)
		},
		onMinimize () {
			this.$emit('change', !this.minimize)
			this.setMinimize(!this.minimize)
		}
	}
}
</script>

<style lang="scss">
	.sidebar {
		width: 240px;
		background: #22262a;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		animation: width 2s ease;
		overflow-y: auto;
		transition: all .15s ease;
		overflow-x: hidden;

		&::-webkit-scrollbar {
			width: 5px;
		}
		&::-webkit-scrollbar-track {
			-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		}
		&::-webkit-scrollbar-thumb {
			background: #7882A2;
			opacity: 0.7;
			border-radius: 9.54286px;
		}

		&.small {
			width: 81px;
			transition: all .15s ease;
		}

		&__space {
			margin-top: 92px;
		}

		&__bottom {
			margin-bottom: 30px;
		}

		&__logo {
			font-weight: 400;
			font-size: 24px;
			line-height: 28px;
			color: #ffffff;
			text-align: center;
			margin-left: 43px;
		}

		&__circle {
			background: linear-gradient(225deg, #fa2b56 0%, #f91c3d 100%);
			width: 10px;
			height: 10px;
			display: inline-block;
			border-radius: 50%;
			margin-left: 4px;
		}

		&__up {
			display: flex;
			padding-top: 23px;
			padding-bottom: 56px;
			justify-content: space-between;
			align-items: center;

			svg {
				margin-right: 20px;
				cursor: pointer;
				transition: all .15s ease;

				path {
					transition: fill .3s ease;
    				fill: #a3bfe3;
				}

				&:hover {
					path {
						fill: #3699ff;
					}
				}
			}

			&.minimize {
				justify-content: center;
				svg {
					transform: rotate(180deg);
					transition: all .15s ease;
					margin-right: 0;
				}
			}
		}

		&__top {
			display: flex;
			flex-direction: column;
		}

		&__menu {
			flex: 1;
			overflow-y: auto;
			&__item {
				display: flex;
				align-items: center;
				font-weight: 400;
				font-size: 15px;
				line-height: 20px;
				letter-spacing: 0.02em;
				color: #ffffff;
				padding: 15px 0 15px 43px;
				cursor: pointer;

				&.small {
					padding-left: 27px;
				}

				&:hover {
					background: rgba($color: #ffffff, $alpha: 0.05);
				}

				img, i {
					padding-right: 20px;
				}

				&.active {
					background: rgba($color: #ffffff, $alpha: 0.1);
				}
			}
		}
	}
</style>