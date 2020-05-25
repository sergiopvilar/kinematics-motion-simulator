import TranslatableComponent from './TranslatableComponent.js'
import MotionObject from '../physics/MotionObject.js'
import UnitConverter from '../physics/UnitConverter.js'

export default class MotionComponent extends TranslatableComponent {

  isDataValid() {
    const invalids = this.props.objects.filter((obj) => {
      const object = new MotionObject(obj)
      return isNaN(object.acceleration) || isNaN(object.startSpeed) || isNaN(object.startPosition)
    })

    return invalids.length === 0
  }

  getAvailableObjects(props = this.props) {
    return props.objects.filter((obj) => obj.enabled)
  }

  timeInUnity(time, props = this.props) {
    return UnitConverter.timeFrom(props.motionTimeUnity, time)
  }

  getTimes(props = this.props) {
    let times = [0],
      counter = 0,
      iterations = Math.round(this.timeInUnity(props.motionTime, props) / this.timeInUnity(props.motionInterval, props))

    for (var i = 0; i < iterations; i++) {
      counter = counter + this.timeInUnity(props.motionInterval, props)
      times.push(counter)
    }

    return times
  }

  getSpeedData() {
    return this.getAvailableObjects().map((object) => {
      return this.getTimes().map((time) => {
        return {x: time, y: this.getSpeed(object, time)}
      })
    })
  }

  getPositionData(props = this.props) {
    return this.getAvailableObjects(props).map((object) => {
      return this.getTimes(props).map((time) => {
        return {x: time, y: this.getPosition(object, time)}
      })
    })
  }

  getSpeed(obj, time) {
    return new MotionObject(obj).getSpeed(time)
  }

  getPosition(obj, time) {
    return new MotionObject(obj).getPosition(time)
  }

  getSpeedPerPosition(obj, position) {
    return new MotionObject(obj).getSpeedByPosition(position)
  }

  round(value, decimals = this.props.decimals) {
    return Number((value).toFixed(parseInt(decimals)))
  }

  timeUnity(value) {
    const unit = this.props.timeUnity
    const sufixUnit = unit === 'adaptive' ? UnitConverter.adaptiveLenghtUnitFor(value) : unit

    return `${this.round(UnitConverter.timeTo(unit, value))}${sufixUnit}`
  }

  lengthUnity(value, props = this.props) {
    const unit = props.lengthUnity
    const sufixUnit = unit === 'adaptive' ? UnitConverter.adaptiveLenghtUnitFor(value) : unit

    return `${this.round(UnitConverter.lengthTo(unit, value))}${sufixUnit}`
  }

  getAllPositions(props) {
    let positions = []

    props.objects.forEach((object) => {
      this.getTimes(props).forEach((time) => {
        positions.push(this.getPosition(object, time))
      })
    })

    return positions
  }

  startPosition(props = this.props) {
    return Math.min(...this.getAllPositions(props))
  }

  endPosition(props = this.props) {
    return Math.max(...this.getAllPositions(props))
  }

}
