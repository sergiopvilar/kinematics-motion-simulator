import UnitConverter from './UnitConverter.js'

export default class MotionObject {

  constructor(data) {
    Object.keys(data).forEach((key) => {
      if (['acceleration', 'startSpeed', 'startPosition'].indexOf(key) > -1)
        this[`_${key}`] = data[key]
      else
        this[key] = data[key]
    })
  }

  // Getters and Setters
  set acceleration(value) {
    this._acceleration = value
  }

  set startSpeed(value) {
    this._startSpeed = value
  }

  set startPosition(value) {
    this._acceleration = value
  }

  get acceleration() {
    return parseFloat(this._acceleration, 10)
  }

  get startSpeed() {
    return UnitConverter.speedFrom(this.startSpeedUnity, this._startSpeed)
  }

  get startPosition() {
    return UnitConverter.lengthFrom(this.startPositionUnity, this._startPosition)
  }

  // Motion methods
  hasAcceleration() {
    return (this.acceleration !== 0)
  }

  getSpeed(time) {
    if (!this.hasAcceleration()) return this.startSpeed
    return this.startSpeed + (this.acceleration * time)
  }

  getSpeedByPosition(position){
    const deltaPosition = position - (this.startPosition)

    if (!this.hasAcceleration()) return this.startSpeed
    return Math.sqrt(Math.pow(this.startSpeed, 2) + (2 * this.acceleration * deltaPosition))
  }

  getPosition(time) {
    if (!this.hasAcceleration())
      return this.finalPositionNoAcceleration(time)
    return this.finalPosition(time)
  }

  finalPositionNoAcceleration(time) {
    return this.startPosition + (this.startSpeed * time)
  }

  finalPosition(time) {
    const base = this.startPosition + this.startSpeed * time
    const end = (Math.abs(this.acceleration) * (time * time)) / 2

    return this.acceleration > 0 ? base + end : base - end
  }

}
