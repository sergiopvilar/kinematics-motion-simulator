import React from 'react'
import { Checkbox, Dropdown } from 'semantic-ui-react'
import Translatable from './Translatable.js'

export default class ChartConfiguration extends Translatable {

  update(key, value) {
    const otherKey = key === 'motionTime' ? 'motionInterval' : 'motionTime'
    let object = []
    object[key] = value
    object[otherKey] = this.props[otherKey]

    this.props.onChange(object)
  }

  speedOptions() {
    return [
      {key: 'm/s', value: 'm/s', text: this.labels.metros_por_segundo},
      {key: 'km/h', value: 'km/h', text: this.labels.quilometros_por_hora},
    ]
  }

  timeOptions() {
    return [
      {key: 'adaptive', value: 'adaptive', text: this.labels.adaptavel},
      {key: 's', value: 's', text: this.labels.segundos},
      {key: 'min', value: 'min', text: this.labels.minutos},
      {key: 'h', value: 'h', text: this.labels.horas},
    ]
  }

  lengthOptions() {
    return [
      {key: 'adaptive', value: 'adaptive', text: this.labels.adaptavel},
      {key: 'cm', value: 'cm', text: this.labels.centimetros},
      {key: 'dm', value: 'dm', text: this.labels.decimetros},
      {key: 'm', value: 'm', text: this.labels.metros},
      {key: 'dam', value: 'dam', text: this.labels.decametros},
      {key: 'hm', value: 'hm', text: this.labels.hectometros},
      {key: 'km', value: 'km', text: this.labels.quilometros},
    ]
  }

  timeControlUnity() {
    if(this.props.timeUnity === 'adaptive') return 's'
    return this.props.timeUnity
  }

  render() {
    return (
      <div className='actions ui form stackable equal width grid grid'>
        <div className='column'>
          <div className='inline field'>
          <label style={{ width: '150px' }}>{this.labels.tempo_movimento}:</label>
            <div className='ui right labeled input mruField'>
              <input
                type='number'
                value={this.props.motionTime}
                min='1'
                onChange={(e) => this.update('motionTime', e.target.value)}
              />
              <div className="ui basic label">{this.timeControlUnity()}</div>
            </div>
            
          </div>

          <div className='inline field'>
          <label style={{ width: '150px' }}>{this.labels.intervalo_movimento}:</label>
            <div className='ui right labeled input mruField'>
              <input
                type='number'
                value={this.props.motionInterval}
                min='1'
                onChange={(e) => this.update('motionInterval', e.target.value)}
              />
              <div className="ui basic label">{this.timeControlUnity()}</div>
            </div>
          </div>
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
        <div className='column field'>
          <h3>{this.labels.unidades_de_medida}</h3>
          <ul>
            <li>
              {this.labels.velocidade}: 
              <Dropdown
                inline
                className='inline-unity'
                options={this.speedOptions()}
                defaultValue={this.props.speedUnity}
                onChange={(e, obj) => this.props.setValue('speedUnity', obj.value)}
              />
            </li>
            <li>
              {this.labels.tempo}: 
              <Dropdown
                inline
                className='inline-unity'
                options={this.timeOptions()}
                defaultValue={this.props.timeUnity}
                onChange={(e, obj) => this.props.setValue('timeUnity', obj.value)}
              />
            </li>
            <li>
              {this.labels.comprimento}: 
              <Dropdown
                inline
                className='inline-unity'
                options={this.lengthOptions()}
                defaultValue={this.props.lengthUnity}
                onChange={(e, obj) => this.props.setValue('lengthUnity', obj.value)}
              />
            </li>
          </ul>
          <label>{this.labels.casas_decimais}:</label>
          <input
            type='number'
            value={this.props.decimals}
            min='0'
            onChange={(e) => this.update('decimals', e.target.value)}
          />
        </div>
      </div>
    )
  }

}
