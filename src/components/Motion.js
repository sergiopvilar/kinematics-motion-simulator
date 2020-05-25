import Translatable from './Translatable.js'
import MotionObject from './MotionObject.js'

export default class Motion extends Translatable {

  isDataValid() {
    const invalids = this.props.objects.filter((obj) => {
      const object = new MotionObject(obj)
      return isNaN(object.acceleration) || isNaN(object.startSpeed) || isNaN(object.startPosition)
    })

    return invalids.length === 0
  }

  getAvailableObjects() {
    return this.props.objects.filter((obj) => obj.enabled)
  }

  timeInUnity(time) {
    if (this.props.motionTimeUnity === 'min') return time * 60
    if (this.props.motionTimeUnity === 'h') return time * 3600

    return time
  }

  getTimes() {
    let times = [0],
      counter = 0,
      iterations = Math.round(this.timeInUnity(parseInt(this.props.motionTime, 10)) / this.timeInUnity(parseInt(this.props.motionInterval, 10)))

    for (var i = 0; i < iterations; i++) {
      counter = counter + this.timeInUnity(parseInt(this.props.motionInterval, 10))
      times.push(counter)
    }

    return times
  }

  hasAcceleration(acceleration) {
    return (acceleration !== 0)
  }

  getSpeedData() {
    return this.getAvailableObjects().map((object) => {
      return this.getTimes().map((time) => {
        return {x: time, y: this.getSpeed(object, time)}
      })
    })
  }

  getPositionData() {
    return this.getAvailableObjects().map((object) => {
      return this.getTimes().map((time) => {
        return {x: time, y: this.getPosition(object, time)}
      })
    })
  }

  getSpeed(obj, time) {
    const object = new MotionObject(obj)

    if (!this.hasAcceleration(object.acceleration)) return object.startSpeed
    return object.startSpeed + (object.acceleration * time)
  }

  finalPositionNoAcceleration(startPosition, velocidade, time) {
    // console.log(startPosition, velocidade, time, startPosition + (velocidade * time))
    return startPosition + (velocidade * time)
  }

  finalPosition(startPosition, time, acceleration, startSpeed) {
    let base = startPosition + startSpeed * time

    if (acceleration > 0)
      return base + (Math.abs(acceleration) * (time * time)) / 2
    return base - (Math.abs(acceleration) * (time * time)) / 2
  }

  getPosition(obj, time) {
    const object = new MotionObject(obj)

    if (!this.hasAcceleration(object.acceleration))
      return this.finalPositionNoAcceleration(object.startPosition, object.startSpeed, time)
    return this.finalPosition(object.startPosition, time, object.acceleration, object.startSpeed)
  }

  getSpeedPerPosition(obj, position) {
    const object = new MotionObject(obj)

    if (!this.hasAcceleration(object.acceleration))
      return object.startSpeed
    return Math.sqrt(Math.pow(object.startPosition, 2) + (2 * object.acceleration * position))
  }

  round(value, decimals = this.props.decimals) {
    return Number((value).toFixed(parseInt(decimals)))
  }

  timeUnity(value) {
    const unity = this.props.timeUnity

    if ((unity === 'adaptive' && value < 60) || unity === 's') return `${value}s`
    if ((unity === 'adaptive' && value < 3600) || unity === 'min') return `${this.round(value/60)}min`
    if (unity === 'adaptive' || unity === 'h') return `${this.round(value/3600)}h`

    return `${value}s`
  }


  lengthUnity(value) {
    const unity = this.props.lengthUnity

    if(unity === 'adaptive' && value < 1000) return `${value}m`
    if(unity === 'adaptive') return `${this.round(value/1000)}km`

    if(unity === 'dm') return `${this.round(value*10)}dm`
    if(unity === 'cm') return `${this.round(value*100)}cm`
    if(unity === 'dam') return `${this.round(value/10)}dam`
    if(unity === 'hm') return `${this.round(value/100)}hm`
    if(unity === 'km') return `${this.round(value/1000)}km`

    return `${value}m`
  }

  startPosition() {
    let positions

    positions = this.props.objects.map((object) => {
      return this.getPosition(object, 0)
    })

    return Math.min(...positions)
  }

  endPosition() {
    let endTime = this.getTimes().pop()
      , positions

    positions = this.props.objects.map((object) => {
      return this.getPosition(object, endTime)
    })

    return Math.max(...positions)
  }

}
