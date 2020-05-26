import faker from 'faker'
import MotionObject from '../physics/MotionObject.js'

const create = (acceleration, startSpeed, startPosition, sUnit = 'm/s', lUnit = 'm') => {
  return new MotionObject({
    nome: faker.name.firstName,
    acceleration: acceleration,
    startSpeed: startSpeed,
    startPosition: startPosition,
    color: faker.internet.color,
    enabled: true,
    startSpeedUnity: sUnit,
    startPositionUnity: lUnit
  })
}

describe('Getters and setters', () => {
  it('always returns acceleration as a number', () => {
    const object = create('0', 1, 0)

    expect(object.acceleration).toEqual(0)
    expect(object.acceleration).not.toEqual('0')
  })

  it('always returns startSpeed as a number and in m/s', () => {
    const object = create(1, '3.6', 0, 'km/h')

    expect(object.startSpeed).toEqual(1)
  })

  it('always returns startPosition as a number and in metres', () => {
    const object = create(0, 0, '1', 'm/s', 'km')

    expect(object.startPosition).toEqual(1000)
  })
})
