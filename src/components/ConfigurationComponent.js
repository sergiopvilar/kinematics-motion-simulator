import React from 'react'
import { Checkbox, Dropdown } from 'semantic-ui-react'
import TranslatableComponent from './TranslatableComponent.js'
import Units from '../physics/units.js'

export default class ConfigurationComponent extends TranslatableComponent {

  update(key, value) {
    const otherKey = key === 'motionTime' ? 'motionInterval' : 'motionTime'
    let object = []
    object[key] = value
    object[otherKey] = this.props[otherKey]

    this.props.onChange(object)
  }

  speedOptions() {
    return Units.speed(this.props.language)
  }

  timeOptions(but = []) {
    return Units.time(this.props.language, but)
  }

  lengthOptions() {
    return Units.length(this.props.language)
  }

  timeControlUnity() {
    return this.props.motionTimeUnity
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

          <div>
            <h3>{this.labels.unidades_de_medida_movimento}</h3>
            {this.labels.tempo}:
              <Dropdown
                inline
                className='inline-unity'
                options={this.timeOptions(['adaptive'])}
                defaultValue={this.props.motionTimeUnity}
                onChange={(e, obj) => this.props.setValue('motionTimeUnity', obj.value)}
              />
            </div>
        </div>
        <div className='column field'>
          <label>{this.labels.mostrar_no_grafico}:</label>
          <ul>
          {this.props.objects.map((object, index) => {
            return (
              <li key={index}>
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
