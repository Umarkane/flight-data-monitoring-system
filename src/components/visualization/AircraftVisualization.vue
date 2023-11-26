<template>
	<div id="container" />
</template>

<script>
// import * as THREE from '@/_helpers/threejs/three.min.js'
// import { GLTFLoader } from '@/_helpers/threejs/GLTFLoader'
// import { DRACOLoader } from '../../../public/threejs/DRACOLoader'

export default {
	name: 'AircraftVisualization',
	data () {
		return {
			container: '',
			camera: '',
			renderer: '',
			scene: '',
			house: '',
		}
	},
	mounted () {
		this.init()
		// window.addEventListener('resize', this.onWindowResize)
	},
	// beforeDestroy () {
	// 	window.removeEventListener('resize', this.onWindowResize)
	// },
	methods: {
		init () {
			// this.container = document.getElementById('container')
			// this.scene = new THREE.Scene()
			//
			// const fov = 35
			// const aspect = this.container.clientWidth / this.container.clientHeight
			// const near = 0.1
			// const far = 500
			//
			// //Camera setup
			// this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
			// this.camera.position.set(0, 2, 25)
			//
			// const ambient = new THREE.AmbientLight(0x404040, 2)
			// this.scene.add(ambient)
			//
			// const light = new THREE.DirectionalLight(0xffffff, 2)
			// light.position.set(10, 10, 100)
			// this.scene.add(light)
			//
			// //Renderer
			// this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
			// this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
			// this.renderer.setPixelRatio(window.devicePixelRatio)
			//
			// this.container.appendChild(this.renderer.domElement)
			//
			// //Load model
			// const loader = new GLTFLoader()
			//
			// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
			// const dracoLoader = new DRACOLoader()
			// dracoLoader.setDecoderPath( '/object/' )
			//
			// loader.setDRACOLoader( dracoLoader )
			//
			// loader.load('/object/scene.gltf', gltf => {
			// 	this.scene.add(gltf.scene)
			// 	this.house = gltf.scene.children[0]
			// 	this.animate()
			// })
		},
		// animate () {
		// 	requestAnimationFrame(this.animate)
		// 	this.house.rotation.z += 0.005
		// 	this.renderer.render(this.scene, this.camera)
		// },
		// onWindowResize () {
		// 	this.camera.aspect = this.container.clientWidth / this.container.clientHeight
		// 	this.camera.updateProjectionMatrix()
		//
		// 	this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
		// }
	}
}
</script>

<style lang="scss" scoped>
	#container {
		position: absolute;
		width: 100%;
		height: 100%;
		background: rebeccapurple;
	}
</style>