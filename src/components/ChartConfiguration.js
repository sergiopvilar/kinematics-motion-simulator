import React from 'react';
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
            onChange={(e) => this.update('motionTime', e.target.value)}
          />
        </div>
        <div className='inline field column' style={{textAlign: 'center'}}>
          <label>{this.labels.intervalo_movimento}:</label>
          <input
            type='number'
            value={this.props.motionInterval}
            onChange={(e) => this.update('motionInterval', e.target.value)}
          />
        </div>
      </div>
    )
  }

}
