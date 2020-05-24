export default class MotionObject {

  constructor(data) {
    Object.keys(data).forEach((key) => {
      if (['acceleration', 'startSpeed', 'startPosition'].indexOf(key) > -1)
        this[`_${key}`] = data[key]
      else
        this[key] = data[key]
    })
  }

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
    if (this.startSpeedUnity === 'km/h')
      return parseFloat(this._startSpeed, 10) / 3.6

    return parseFloat(this._startSpeed)
  }

  get startPosition() {
    if (this.startPositionUnity === 'dm')
      return parseFloat(this._startPosition, 10)/10

    if (this.startPositionUnity === 'cm')
      return parseFloat(this._startPosition, 10)/100

    if (this.startPositionUnity === 'dam')
      return parseFloat(this._startPosition, 10)*10

    if (this.startPositionUnity === 'hm')
      return parseFloat(this._startPosition, 10)*100

    if (this.startPositionUnity === 'km')
      return parseFloat(this._startPosition, 10)*1000

    return parseFloat(this._startPosition)
  }

}
