import React from 'react'
import Translatable from './Translatable.js'

export default class ObjectForm extends Translatable {

  constructor(props) {
    super(props)
    this.state = {
      objects: [this.newObject(0, props.language)]
    }
  }

  updateState(obj) {
    this.props.onChange(obj)
  }

  static getDerivedStateFromProps(props) {
    return { objects: props.objects }
  }

  newObject(length = this.state.objects.length, language = this.props.language) {
    return {
      nome: `${this.getLabel(language, 'objeto')} ${length + 1}`,
      acceleration: '',
      startSpeed: '',
      startPosition: ''
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

  renderFields(object, index) {
    const fields = {
      acceleration: [this.labels.aceleracao, 'm/s²'],
      startSpeed: [this.labels.velocidade_inicial, 'm/s'],
      startPosition: [this.labels.posicao_inicial, 'm'],
    }

    return Object.entries(fields).map(([key, [label, unidade]]) => {
      return <div className='inline field' key={`${index}${key}`} style={{ display: 'block' }}>
        <label style={{ width: '150px' }}>{label}:</label>
        <div className='ui right labeled input mruField'>
          <input type="number" value={this.state.objects[index][key]}
            onChange={(e) => this.setValue(index, key, e.target.value)} />
          <div className="ui basic label">{unidade}</div>
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
                  <h4 className='ui header'>{object.nome}</h4>
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
