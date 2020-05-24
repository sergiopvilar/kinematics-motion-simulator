import React from 'react'
import RandomColor from 'randomcolor'
import { Input, Dropdown } from 'semantic-ui-react'
import Translatable from './Translatable.js'
import Units from '../config/units.js'

export default class ObjectForm extends Translatable {

  constructor(props) {
    super(props)
    this.state = {
      objects: []
    }
  }

  updateState(obj) {
    this.props.onChange(obj)
  }

  componentDidMount() {
    this.updateState({ objects: [this.newObject(0)] })
  }

  static getDerivedStateFromProps(props) {
    return { objects: props.objects }
  }

  startSpeedOptions(but = []) {
    return Units.speed(this.props.language, [], true)
  }

  startPositionOptions() {
    return Units.length(this.props.language, ['adaptive'], true)
  }

  getRandomColor() {
    const currentColors = this.state.objects.map((obj) => obj.color)
    let random = RandomColor({luminosity: 'dark'})

    while(currentColors.indexOf(random) > 0)
      random = RandomColor({luminosity: 'dark'})

    return random
  }

  newObject(length = this.state.objects.length, language = this.props.language) {
    const name = length === 0 ? 1 : this.state.objects[this.state.objects.length - 1].nome + 1

    return {
      nome: name,
      acceleration: '',
      startSpeed: '',
      startPosition: '',
      color: RandomColor({luminosity: 'dark'}),
      enabled: true,
      startSpeedUnity: 'm/s',
      startPositionUnity: 'm'
    }
  }

  addObject() {
    let objects = this.state.objects
    objects.push(this.newObject())

    this.updateState({
      objects: objects
    })
  }

  removeObject(index) {
    let objects = this.state.objects
    objects.splice(index, 1)

    this.updateState({
      objects: objects
    })
  }

  setValue(index, field, value) {
    let objects = this.state.objects.map((object, _index) => {
      if (index == _index) object[field] = value
      return object
    })

    this.updateState({
      objects: objects
    })
  }

  getUnitLabel(object, key, index) {
    const unity = object[`${key}Unity`]

    return (
      <Dropdown
        defaultValue={unity}
        options={this[`${key}Options`]()}
        onChange={(e, obj) => this.setValue(index, `${key}Unity`, obj.value)}
      />
    )
  }

  renderFields(object, index) {
    const fields = {
      acceleration: [this.labels.aceleracao, 'm/s²'],
      startSpeed: [this.labels.velocidade_inicial],
      startPosition: [this.labels.posicao_inicial],
    }

    return Object.entries(fields).map(([key, [label, defaultUnity]]) => {
      const inputLabel = defaultUnity ? {
        basic: true,
        content: defaultUnity
      }: this.getUnitLabel(this.state.objects[index], key, index)

      return <div className='inline field' key={`${index}${key}`} style={{ display: 'block' }}>
        <label style={{ width: '150px' }}>{label}:</label>
        <div className='ui right labeled input mruField'>
          <Input
            label={inputLabel}
            labelPosition='right'
            type='number'
            value={this.state.objects[index][key]}
            onChange={(e) => this.setValue(index, key, e.target.value)}
          />
        </div>
      </div>
    })
  }

  render() {
    return (
      <React.Fragment>
        <h2 className='ui dividing header'>{this.labels.objetos}</h2>
        <div className = 'objectConfiguration ui stackable equal width grid'>

            {this.state.objects.map((object, index) => {
              return (
                <div key={index} className='objectConfiguration column'>
                  <h4 className='ui header'>{this.labels.objeto} {object.nome}</h4>
                  <div className='ui form'>
                  {this.renderFields(object, index)}
                  <button onClick={() => this.removeObject(index)} className="ui small red button">{this.labels.remover_objeto}</button>
                  </div>
                </div>
              )
            })}
        </div>
        <div className='actions' style={{ margin: '30px 0' }}>
          <button className='ui primary button' onClick={this.addObject.bind(this)}>{this.labels.adicionar_objeto}</button>
        </div>
      </React.Fragment>
    )
  }

}
