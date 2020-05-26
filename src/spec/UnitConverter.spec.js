import UnitConverter from '../physics/UnitConverter.js'

describe('Time conversion', () => {
  it('converts from seconds to other units', () => {
    const time = 3600

    expect(UnitConverter.timeTo('min', time)).toBe(60)
    expect(UnitConverter.timeTo('h', time)).toBe(1)
    expect(UnitConverter.timeTo('s', time)).toBe(time)
  })

  it('converts to other units to seconds', () => {
    const time = 3600

    expect(UnitConverter.timeFrom('h', 1)).toBe(time)
    expect(UnitConverter.timeFrom('min', 60)).toBe(time)
    expect(UnitConverter.timeFrom('s', time)).toBe(time)
  })

  it('converts with adaptive unit', () => {
    const time = 1

    expect(UnitConverter.timeTo('adaptive', 1)).toBe(time)
    expect(UnitConverter.timeTo('adaptive', 60)).toBe(time)
    expect(UnitConverter.timeTo('adaptive', 3600)).toBe(time)
  })
})

describe('Speed conversion', () => {
  it('converts from m/s to other units', () => {
    const speed = 1

    expect(UnitConverter.speedTo('km/h', speed)).toBe(3.6)
    expect(UnitConverter.speedTo('m/s', speed)).toBe(1)
  })

  it('converts from other units to m/s', () => {
    const speed = 1

    expect(UnitConverter.speedFrom('km/h', 3.6)).toBe(speed)
    expect(UnitConverter.speedFrom('m/s', speed)).toBe(speed)
  })
})

describe('Length conversion', () => {
  it('converts from m to other units', () => {
    const position = 100

    expect(UnitConverter.lengthTo('cm', position)).toBe(10000)
    expect(UnitConverter.lengthTo('dm', position)).toBe(1000)
    expect(UnitConverter.lengthTo('m', position)).toBe(100)
    expect(UnitConverter.lengthTo('dam', position)).toBe(10)
    expect(UnitConverter.lengthTo('hm', position)).toBe(1)
    expect(UnitConverter.lengthTo('km', position)).toBe(0.1)
  })

  it('converts from other units to m', () => {
    const position = 100

    expect(UnitConverter.lengthFrom('cm', 10000)).toBe(position)
    expect(UnitConverter.lengthFrom('dm', 1000)).toBe(position)
    expect(UnitConverter.lengthFrom('m', position)).toBe(position)
    expect(UnitConverter.lengthFrom('dam', 10)).toBe(position)
    expect(UnitConverter.lengthFrom('hm', 1)).toBe(position)
    expect(UnitConverter.lengthFrom('km', 0.1)).toBe(position)
  })

  it('converts with adaptive unit', () => {
    const position = 1

    expect(UnitConverter.lengthTo('adaptive', 1)).toBe(position)
    expect(UnitConverter.lengthTo('adaptive', 1000)).toBe(1)
  })
})
