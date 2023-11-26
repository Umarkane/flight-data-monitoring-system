<template>
	<fdm-modal @close="$emit('close')">
		<div
			slot="content"
			class="tech-upload create"
		>
			<div class="tech-upload__head create__head">
				New FDM Analysis
			</div>
			<div class="tech-upload__body">
				<form
					class="form"
					@submit.prevent="onSubmit"
				>
					<div
						class="form__row"
						:class="{ error: errors.has('aircraft') }"
					>
						<label for="aircraft">Aircraft Registration No</label>
						<select
							id="aircraft"
							v-model="file.aircraft"
							v-validate="'required'"
							name="aircraft"
						>
							<option
								v-for="aircraft in aircrafts"
								:key="aircraft.id"
								:value="aircraft.id"
							>
								{{ aircraft.reg_number }}
							</option>
						</select>
					</div>
					<div
						class="form__row"
						:class="{ error: errors.has('file') }"
					>
						<label for="file">File</label>
						<input
							id="file"
							v-validate="'required'"
							type="file"
							name="file"
							class="form__file-input"
							@change="onFileChange"
						>
						<div
							class="form__row__file flex-center"
							:class="{ 'is-invalid' : errors.has('file') }"
						>
							{{ selectedFile ? selectedFile.name : 'Upload file' | crop }}
						</div>
						<template v-if="errors.length">
							<img
								src="../../assets/icons/error.svg"
								alt=""
							>
							<span>Required field</span>
						</template>
					</div>
					<div class="form__submit flex-justify-between">
						<button
							type="reset"
							class="black"
							@click="$emit('close')"
						>
							DECLINE
						</button>
						<button type="submit">
							UPLOAD
						</button>
					</div>
				</form>
			</div>
			<div
				v-if="isProgress"
				class="progress-bar-content"
			>
				<div class="flex items-center justify-center h-screen gap-4">
					<div class="progress-bar">
						<span class="bar">
							<span
								class="progress"
								:style="`width: ${uploadPercentage}%`"
							/>
						</span>
					</div>
					<span class="z-10 text-white">{{ uploadPercentage }}%</span>
				</div>
			</div>
		</div>
	</fdm-modal>
</template>

<script>
import FdmModal from '../FdmModal'
import { mapActions } from 'vuex'
import { aircraftService } from '../../_services/aircraft.service'
import axios from 'axios'
import { authHeader, handleResponse } from '@/_helpers/authHeader'

const baseUrl = process.env.VUE_APP_BASE_URL
export default {
	name: 'TechnicianUpload',
	components: { FdmModal  },
	data () {
		return {
			file: {},
			selectedFile: '',
			aircrafts: [],
			routes: [],
			uploadPercentage: 0,
			gradient: {
				radial: false,
				colors: [
					{
						color: '#6546f7',
						offset: 0,
						opacity: '1',
					},
					{
						color: 'lime',
						offset: 100,
						opacity: '0.6',
					},
				]
			},
			isProgress: false
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.user
		}
	},
	mounted () {
		this.fetchRouteCraft()
	},
	methods: {
		...mapActions('loader', [ 'setLoading', 'setType' ]),

		fetchRouteCraft () {
			this.setLoading(true)
			aircraftService.getAll(this.userProfile.user.airline[0]).then(res => {
				this.aircrafts = res
				this.setLoading(false)
			}).catch(err => {
				this.setLoading(false)
				this.$toastr.e(err)
				console.log(err)
			})
		},

		onSubmit (e) {
			this.$validator.validate().then(valid => {
				if (valid) {
					this.file.uploaded_file = this.selectedFile
					this.file.technician = this.userProfile.user.id

					const formData = new FormData()
					Object.keys(this.file).forEach(i => {
						formData.append(i, this.file[i])
					})
					this.isProgress = true

					axios.post( baseUrl + '/files/', formData,{
						headers: {
							'Content-Type': 'multipart/form-data',
							...authHeader()
						},
						onUploadProgress: function ( progressEvent ) {
							this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ))
						}.bind(this)
					}).then(() => {
						setTimeout(() => {
							this.$emit('close')
							this.$emit('fetch')
							this.isProgress = false
						}, 500)
					}).catch(err => {
						this.isProgress = false
						console.log(err)
						this.$toastr.e(err)
					})
					
					// fileService.create(this.file).then(res => {
					// 	this.$emit('close')
					// 	this.$emit('fetch', res.id)
					// 	this.setLoading(false)
					// }).catch(err => {
					// 	this.setLoading(false)
					// 	console.log(err)
					// 	this.$toastr.e(err)
					// })
				}
			})
		},
		onFileChange (e) {
			this.selectedFile = e.target.files[0]
		},
	}
}
</script>

<style lang="scss" scoped>
	.progress-bar-content {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(127, 125, 150, 0.8);
		z-index: 15;
	}
	// Color Variables ======================================
$green: #75b800;
$gray-light: #eef1f3;

// Bar Variables ========================================
$bar-size: 5px;
$bar-radius: 60px;
$bar-bg: rgba(0,0,0,0.075);

// Animation =============================================
// Edit these at random intervals to change the animation.
@keyframes loader {

	0% {
		width: 0;
	}

	20% {
		width: 10%;
	}

	25% {
		width: 24%;
	}

	43% {
		width: 41%;
	}

	56% {
		width: 50%;
	}

	66% {
		width: 52%;
	}

	71% {
		width: 60%;
	}

	75% {
		width: 76%;
    
	}

	94% {
		width: 86%;
	}

	100% {
		width: 100%;
	}

}

// Bar ============================================
.progress-bar {
	border-radius: $bar-radius;
	overflow: hidden;
  width: 100%;

	span {
		display: block;
	}

}

.bar {
  background: $bar-bg;
}

.progress {
//   animation: loader 8s ease infinite;
  // Change the animation fill mode 'infinite' to 'forwards' to stop the animation from repeating.
  background: $green;
  color: #fff;
  padding: $bar-size;
  width: 0;
  transition: width 350ms ease;
}

// Vertical Centering ==============================
// You don't need this to make it work on your site.
.progress-bar {
  left: 50%;
  max-width: 50%;
  position: absolute;
  top: 50%;
  transform: translate3d(-50%,-50%,0);
}
</style>