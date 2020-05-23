import React from 'react'
import { Checkbox } from 'semantic-ui-react'
import Translatable from './Translatable.js'

export default class ChartConfiguration extends Translatable {

  update(key, value) {
    const otherKey = key === 'motionTime' ? 'motionInterval' : 'motionTime'
    let object = []
    object[key] = value
    object[otherKey] = this.props[otherKey]

    this.props.onChange(object)
  }

  render() {
    return (
      <div className='actions ui form stackable equal width grid grid'>
        <div className='inline field column' style={{textAlign: 'center'}}>
          <label>{this.labels.tempo_movimento}:</label>
          <input
            type='number'
            value={this.props.motionTime}
            min='1'
            onChange={(e) => this.update('motionTime', e.target.value)}
          />
        </div>
        <div className='inline field column' style={{textAlign: 'center'}}>
          <label>{this.labels.intervalo_movimento}:</label>
          <input
            type='number'
            value={this.props.motionInterval}
            min='1'
            onChange={(e) => this.update('motionInterval', e.target.value)}
          />
        </div>
        <div className='column field'>
          <label>{this.labels.mostrar_no_grafico}:</label>
          <ul>
          {this.props.objects.map((object, index) => {
            return (
              <li>
                <Checkbox
                  label={`${this.labels.objeto} ${object.nome}`}
                  defaultChecked={object.enabled}
                  onChange={() => this.props.toggleObject(index, !object.enabled)}
                />
              </li>
            )
          })}
          </ul>
        </div>
      </div>
    )
  }

}
