<template>
  <div
    id="cesiumContainer"
    :class="{ minimize: minimize }"
    class="relative"
  >
    <div class="content">
      <div class="row">
        <svg
          id="gs"
          height="300"
          width="80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="gsGroupMask">
              <path
                d="M 0 0 H 70 V 260 H 0 V 0"
                stroke="transparent"
              />
            </clipPath>
          </defs>
          <defs>
            <clipPath id="gsFrontMask">
              <path
                d="M 1 120 L 35 120 V 110 H 50 V 122 L 70 130 L 50 137 V 150 H 35 V 140 H 1"
                stroke="transparent"
              />
            </clipPath>
          </defs>
        </svg>
        <svg
          id="center"
          width="360"
          height="500"
        >
          <defs>
            <clipPath id="myClip">
              <path
                d="M 40 155 Q 160 25 280 155 V 295 Q 160 410 40 295 V 155"
                stroke="transparent"
              />
            </clipPath>
          </defs>
        </svg>
        <svg
          id="altitude"
          height="260"
          width="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="altitudeMask">
              <path
                d="M 20 130 L 35 123 V 115 H 70 V 105 H 99 V 155 H 70 V 145 H 35 V 137 L 20 130"
                stroke="#ffffff"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div class="row">
        <svg
          id="compass"
          height="300"
          width="300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="compassMask">
              <path d="M 0 0 H 300 V 88 H 0 V 0" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
    <div class="absolute z-10 engine top-2 left-2">
      <svg
        id="engine"
        height="300"
        width="300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- <defs>
						<clipPath id="engineMask"> -->
        <!-- <path d="M 120 55 L 260 55 V 100 H 120 V 55"  /> -->
        <!-- </clipPath>
					</defs> -->
      </svg>
    </div>
  </div>
</template>

<script>
import { otherService } from '../../_services/other.service'

window.CESIUM_BASE_URL = '/'
import * as Cesium from 'cesium'
import { mapActions } from 'vuex'
import drawSpeedometer from '@/mixins/DrawSpeedometer'
import moment from 'moment'
import _ from 'lodash'
import * as $ from 'jquery'
import { eventService } from '../../_services/event.service'
import { cesiumExample } from '@/_helpers/cesium-example'

export default {
  name: 'Cesium',
  mixins: [ drawSpeedometer ],
  data () {
    return {
      flightData: [],
      counter: 0,
      roll: 0,
      pitch: 0,
      viewer: '',
      selectedData: {},
      oldAltitude: 0,
      oldCoordinates: {},
      audio: '',
      events: [],
    }
  },
  computed: {
    flightId () {
      return this.$store.getters['file/selectedFlight']
    },
    minimize () {
      return this.$store.getters['sidebars/minimize']
    },
  },
  watch: {
    flightId: {
      immediate: true,
      handler (value) {
        if (value) {
          this.fetchData(value)
        }
      },
    },
  },
  mounted () {
    // cesiumExample()
    Cesium.Ion.defaultAccessToken = process.env.VUE_APP_CESIUM_TOKEN
    // this.audio = new Audio('adi.mp3')
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      baseLayerPicker: false,
      terrainProvider: Cesium.createWorldTerrain(),
    })
    const osmBuildings = this.viewer.scene.primitives.add(
      Cesium.createOsmBuildings()
    )

    this.makeCanvas(0)
  },
  beforeDestroy () {
    // this.audio.pause()
    // this.audio.currentTime = 0
    this.setFileId(0)
  },
  methods: {
    ...mapActions('loader', [ 'setLoading' ]),
    ...mapActions('file', [ 'setFileId' ]),
    fetchData (flightId) {
      this.setLoading(true)
      // if (this.audio)
      // {this.audio.pause()}
      eventService
        .getAll(flightId)
        .then(res => {
          this.events = res
          return otherService.getFileCoordinates(flightId)
        })
        .then(res => {
          this.flightData = res.map(i => {
            const e = this.events.find(j => j.timestamp === i.timestamp)
            if (e) return { ...i, isEvent: true, event_name: e.event_name }
            return i
          })
          // this.audio.currentTime = 0
          if (this.flightData.length) {
            this.init()
          }
          this.setLoading(false)
        })
        .catch(err => {
          this.setLoading(false)
          console.log(err)
        })
    },
    init () {
      // this.audio.play()
      const dataLength = this.flightData.length
      const start = Cesium.JulianDate.fromDate(
        new Date(this.flightData[0].timestamp)
      )
      const stop = Cesium.JulianDate.fromDate(
        new Date(this.flightData[dataLength - 1].timestamp)
      )
      this.viewer.clock.startTime = start.clone()
      this.viewer.clock.stopTime = stop.clone()
      const quarterTime = Math.round(this.flightData.length / 4)
      this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(
        new Date(this.flightData[quarterTime].timestamp)
      )
      this.viewer.timeline.zoomTo(start, stop)
      // Speed up the playback speed 10x.
      this.viewer.clock.multiplier = 10
      // Start playing the scene.
      this.viewer.clock.shouldAnimate = true

      // Cesium.knockout.getObservable(this.viewer.clockViewModel,
      // 	'shouldAnimate').subscribe(isAnimating => {
      // 	if (isAnimating) {
      // 		// this.audio.play()
      // 	} else {
      // 		this.audio.pause()
      // 		console.log('Cesium clock is paused.')
      // 	}
      // })

      // The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
      const positionProperty = new Cesium.SampledPositionProperty()
      for (let i = 0; i < this.flightData.length; i++) {
        const dataPoint = this.flightData[i]
        // if (dataPoint.longitude && dataPoint.latitude && dataPoint.altitude && dataPoint.timestamp) {

        // }
        dataPoint.latitude = parseFloat(dataPoint.latitude)
        dataPoint.longitude = parseFloat(dataPoint.longitude)
        dataPoint.altitude = parseFloat(dataPoint.altitude)
        // Declare the time for this individual sample and store it in a new JulianDate instance.
        // const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate())
        const time = Cesium.JulianDate.fromDate(new Date(dataPoint.timestamp))
        const position = Cesium.Cartesian3.fromDegrees(
          dataPoint.longitude,
          dataPoint.latitude,
          dataPoint.altitude
        )
        // Store the position along with its timestamp.
        // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
        positionProperty.addSample(time, position)

        if (dataPoint.isEvent) {
          this.viewer.entities.add({
            description: `${dataPoint.event_name}`,
            position: position,
            point: { pixelSize: 10, color: Cesium.Color.RED },
            label: {
              text: dataPoint.event_name,
              horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
              pixelOffset: new Cesium.Cartesian2(10, 0),
            },
          })
        }
      }
      function toDegrees (angle) {
        return angle * (180 / Math.PI)
      }
      function getDirection (lat1, lng1, lat2, lng2) {
        const PI = Math.PI
        const dTeta = Math.log(
          Math.tan(lat2 / 2 + PI / 4) / Math.tan(lat1 / 2 + PI / 4)
        )
        const dLon = Math.abs(lng1 - lng2)
        const teta = Math.atan2(dLon, dTeta)
        const direction = Math.round(toDegrees(teta))
        return direction
      }
      const loadModel = async () => {
        // const airplaneUri = await Cesium.IonResource.fromAssetId(355099)
        const airplaneEntity = this.viewer.entities.add({
          availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({ start: start, stop: stop }),
          ]),
          position: positionProperty,
          // Attach the 3D model instead of the green point.
          model: { uri: '/airbus200/scene.gltf', scale: 1.4 },
          // Automatically compute the orientation from the position.
          orientation: new Cesium.VelocityOrientationProperty(positionProperty),
          path: new Cesium.PathGraphics({ width: 1 }),
        })

        // const box = new Cesium.BoxGeometry({
        // 	vertexFormat : Cesium.VertexFormat.POSITION_ONLY,
        // 	maximum : new Cesium.Cartesian3(250000.0, 250000.0, 250000.0),
        // 	minimum : new Cesium.Cartesian3(-250000.0, -250000.0, -250000.0)
        // })
        // const geometry = Cesium.BoxGeometry.createGeometry(box)

        this.viewer.clock.onTick.addEventListener(clock => {
          onTimeChange(clock)
        })

        const onTimeChange = clock => {
          const date = Cesium.JulianDate.toDate(
            new Cesium.JulianDate(
              clock.currentTime.dayNumber,
              clock.currentTime.secondsOfDay
            )
          )
          const formatDate = moment(date).format('MM/DD/YYYY HH:mm:ss')
          this.selectedData = this.flightData.find(
            i => i.timestamp === formatDate
          )

          if (this.selectedData) {
            const speed = Math.round(this.selectedData.ground_speed)
            const airSpeed = Math.round(this.selectedData.air_speed)
            const pitchAngle = parseFloat(this.selectedData.pitch_angle)
            const rollAngle = parseFloat(this.selectedData.roll_angle)
            const altitude = parseInt(this.selectedData.altitude)
            const n1Left = parseFloat(this.selectedData.n1_left)
            const n1Right = parseFloat(this.selectedData.n1_right)
            const ittLeft = parseFloat(this.selectedData.itt_left)
            const ittRight = parseFloat(this.selectedData.itt_right)
            const oilPressLeft = parseFloat(this.selectedData.oil_press_left)
            const oilPressRight = parseFloat(this.selectedData.oil_press_right)
            const oilTempLeft = parseFloat(this.selectedData.oil_temp_left)
            const oilTempRight = parseFloat(this.selectedData.oil_temp_right)

            const el = document.getElementById('gsGroupContent')
            const text = document.getElementById('gsText')
            const gsText = document.getElementById('gsFrontContent')
            const frontNum0 = document.getElementById('gsFront0')
            const frontNum1 = document.getElementById('gsFront1')
            const frontNum2 = document.getElementById('gsFront2')
            const aircraftAngle = document.getElementById('aircraftAngle')
            const topArrow = document.getElementById('topArrow')
            const altitudeNum0 = document.getElementById('altitudeNum0')
            const altitudeNum1 = document.getElementById('altitudeNum1')
            const altitudeNum2 = document.getElementById('altitudeNum2')
            const altitudeMarker = document.getElementById('altitudeMarker')
            const altitudeRuler = document.getElementById('km')
            const compass = document.getElementById('innerComppass')
            const engineText1 = document.getElementById('engineText1')
            const engineText2 = document.getElementById('engineText2')
            const engineText3 = document.getElementById('engineText3')
            const engineText4 = document.getElementById('engineText4')
            const oilPressLeftElement = document.getElementById('oilPressLeft')
            const oilPressRightElement = document.getElementById(
              'oilPressRight'
            )
            const oilTempLeftElement = document.getElementById('oilTempLeft')
            const oilTempRightElement = document.getElementById('oilTempRight')
            const oilPressLeftCircle = document.getElementById('engineCircle1')
            const oilPressRightCircle = document.getElementById(
              'engineCircle2'
            )
            const oilTempLeftCircle = document.getElementById('engineCircle3')
            const oilTempRightCircle = document.getElementById('engineCircle4')

            //Engine
            engineText1.innerHTML = n1Left.toFixed(1)
            engineText2.innerHTML = n1Right.toFixed(1)
            engineText3.innerHTML = ittLeft.toFixed(1)
            engineText4.innerHTML = ittRight.toFixed(1)
            oilPressLeftElement.innerHTML = oilPressLeft.toFixed(1)
            oilPressRightElement.innerHTML = oilPressRight.toFixed(1)
            oilTempLeftElement.innerHTML = oilTempLeft.toFixed(1)
            oilTempRightElement.innerHTML = oilTempRight.toFixed(1)
            const n1L = this.describeArc(90, 50, 45, 90, n1Left * 2 + 90)
            const n1R = this.describeArc(210, 50, 45, 90, n1Right * 2 + 90)
            const ittL = this.describeArc(90, 150, 45, 90, ittLeft * 0.2 + 90)
            const ittR = this.describeArc(
              210,
              150,
              45,
              90,
              ittRight * 0.2 + 90
            )
            oilPressLeftCircle.setAttribute('d', n1L > 100 ? 100 : n1L)
            oilPressRightCircle.setAttribute('d', n1R > 100 ? 100 : n1R)
            oilTempLeftCircle.setAttribute('d', ittL > 1000 ? 1000 : ittL)
            oilTempRightCircle.setAttribute('d', ittR > 1000 ? 1000 : ittR)

            //compass
            const a = getDirection(
              this.oldCoordinates.latitude,
              this.oldCoordinates.longitude,
              this.selectedData.latitude,
              this.selectedData.longitude
            )

            compass.setAttribute(
              'style',
              `transform-origin: center; transform: rotate(${a * -1}deg)`
            )

            if (altitude >= 1800) {
              altitudeRuler.setAttribute(
                'style',
                `transform: translateY(${altitude * 0.5 - 130}px)`
              )
              const num0 = parseInt((altitude / 100) % 10)
              const num1 = isNaN(parseInt((altitude / 1000) % 10))
                ? ''
                : parseInt((altitude / 1000) % 10)
              const num2 = parseInt((altitude / 10000) % 10) || ''
              const last2Digit = parseInt(altitude) % 100

              altitudeNum0.innerHTML = num0
              altitudeNum1.innerHTML = num1
              altitudeNum2.innerHTML = num2

              // Altitude marker
              const markerText = altitudeMarker.querySelector('text')
              markerText.innerHTML = parseInt(altitude - this.oldAltitude)
              altitudeMarker.setAttribute(
                'style',
                `transform: translateY(${(altitude - this.oldAltitude > 2000
                  ? 2000
                  : altitude - this.oldAltitude) *
                  -1 *
                  0.0595}px)`
              )

              const texts = document.querySelectorAll('.alt')
              const centerNum = Array.from(texts).sort(
                (a, b) =>
                  parseInt(a.attributes.y.value) -
                  parseInt(b.attributes.y.value)
              )[2]
              let count = 0
              const subtract = 136 - parseInt(centerNum.attributes.y.value)

              if (last2Digit >= parseInt(centerNum.innerHTML)) {
                count = last2Digit - parseInt(centerNum.innerHTML)
              } else {
                count = last2Digit + 100 - parseInt(centerNum.innerHTML)
              }

              $('.alt').each(function (i) {
                $(this).attr(
                  'y',
                  parseInt($(this).attr('y')) + (count + subtract)
                )
                if (parseInt($(this).attr('y')) >= 172) {
                  $(this).attr('y', $(this).attr('y') - 100)
                }
              })
            }

            topArrow.setAttribute(
              'style',
              `transform: translate(0px, 56px) rotate(${rollAngle}deg); transform-origin: 45% 35%;`
            )
            aircraftAngle.setAttribute(
              'style',
              `transform-box: fill-box; transform-origin: center; transform: rotate(${rollAngle}deg) translateY(${pitchAngle *
                6.4}px);`
            )
            text.innerHTML = 'GS ' + speed
            if (airSpeed > 45) {
              frontNum0.innerHTML = parseInt(airSpeed / 10) % 10
              frontNum1.innerHTML = isNaN(parseInt(airSpeed / 100) % 10)
                ? ''
                : parseInt(airSpeed / 100) % 10
              frontNum2.innerHTML = parseInt(airSpeed / 1000) || ''

              el.setAttribute(
                'style',
                `transform: translateY(${(airSpeed - 45) * 3.3}px)`
              )

              const centerNum = Array.from(gsText.children).find(
                i => i.attributes.y.value === '136'
              )

              const num = airSpeed % 10
              let count
              if (num < parseInt(centerNum.innerHTML)) {
                count = num + 10 - parseInt(centerNum.innerHTML)
              } else count = num - parseInt(centerNum.innerHTML)

              $('.gsT').each(function (i) {
                $(this).attr('y', parseInt($(this).attr('y')) + count * 18)
                if (parseInt($(this).attr('y')) >= 172) {
                  $(this).attr('y', $(this).attr('y') - 180)
                }
              })
            }

            this.oldAltitude = altitude
            this.oldCoordinates = this.selectedData
          }
        }

        this.viewer.trackedEntity = airplaneEntity
      }

      loadModel()
    },
  },
}
</script>

<style lang="scss">
#cesium {
  position: relative;
  width: calc(100vw - 240px);
  height: calc(100vh - 100px);
  overflow: hidden;

  &.minimize {
    width: calc(100vw - 81px);
  }
}
.content {
  position: absolute;
  right: 0px;
  bottom: 0px;
  z-index: 1;
  pointer-events: none;
  margin-bottom: -187px;
  transform: scale(0.7, 0.7) translate(140px, 25px);
}
#gs {
  /* border: solid 1px #FFFFFF; */
}

#center {
  position: absolute;
  top: -91px;
  left: 85px;
}

.mask {
  clip-path: url(#gsFrontMask);
}
.indicator-mask {
  clip-path: url(#myClip);
}
#altitudeBack {
  clip-path: url(#altitudeMask);
}

#altitude {
  margin-left: 340px;
}

#compass {
  margin-left: 95px;
  margin-top: -22px;
}

#main {
  clip-path: url(#compassMask);
}

#gsGroup {
  clip-path: url(#gsGroupMask);
}

.engineCircle1 {
  clip-path: url(#engineMask1);
}

.engineCircle2 {
  clip-path: url(#engineMask2);
}

.engineCircle3 {
  clip-path: url(#engineMask3);
}

.engineCircle4 {
  clip-path: url(#engineMask4);
}

.row {
  display: flex;
}
.engineN1 {
  stroke: #00ffff;
  letter-spacing: 2px;
}
// #engine {
// 	margin-left: 180px;
// 	margin-top: -175px;
// }
.letter-space {
  letter-spacing: 2px;
}
.engine {
  transform: scale(0.7, 0.7) translate(-83px, -60px);
}
.cesium-widget-credits {
  display: none !important;
}
</style>
