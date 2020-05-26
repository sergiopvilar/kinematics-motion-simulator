export default class UnitConverter {

  // Converts given measurement unit to metres
  static lengthFrom(unit, value) {
    value = parseFloat(value, 10)

    if (unit === 'dm') return value / 10
    if (unit === 'cm') return value / 100
    if (unit === 'dam') return value * 10
    if (unit === 'hm') return value * 100
    if (unit === 'km') return value * 1000

    return value
  }

  // Converts metres to given measurement unit
  static lengthTo(unit, value) {
    value = parseFloat(value, 10)

    if(unit === 'adaptive')
      return this.lengthTo(this.adaptiveLenghtUnitFor(value), value)

    if (unit === 'dm') return value * 10
    if (unit === 'cm') return value * 100
    if (unit === 'dam') return value / 10
    if (unit === 'hm') return value / 100
    if (unit === 'km') return value / 1000

    return value
  }

  // Chooses dinamically a length unit based on the value provided
  static adaptiveLenghtUnitFor(value) {
    if(value >= 1000) return 'km'
    return 'm'
  }

  // Converts given measurement unit to metres per second
  static speedFrom(unit, value) {
    value = parseFloat(value, 10)

    if(unit === 'km/h') return value / 3.6

    return value
  }

  // Converts metres per second to given measurement unit
  static speedTo(unit, value) {
    value = parseFloat(value, 10)

    if (unit === 'km/h') return value * 3.6

    return value
  }

  // Converts given measurement unit to seconds
  static timeFrom(unit, value) {
    value = parseFloat(value, 10)

    if (unit === 'min') return value * 60
    if (unit === 'h') return value * 3600

    return value
  }

  // Converts seconds to given measurement unit
  static timeTo(unit, value) {
    value = parseFloat(value, 10)

    if (unit === 'adaptive')
      return this.timeTo(this.adaptiveTimeUnitFor(value), value)

    if(unit === 'min') return value/60
    if(unit === 'h') return value/3600

    return value
  }

  // Chooses dinamically a time unit based on the value provided
  static adaptiveTimeUnitFor(value) {
    if(value < 60) return 's'
    if(value < 3600) return 'min'

    return 'h'
  }

}
