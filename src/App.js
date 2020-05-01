import React from 'react';
import { Chart } from 'react-charts';
import './App.css';

class MRUComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      t: 10,
      objects: [this.newObject(0)]
    }
  }

  getAxes(unidade) {
    return [{
        primary: true,
        position: 'bottom',
        format: d => `${d}s`,
        type: 'linear',
        show: true
      },
      {
        position: 'left',
        format: d => `${d}${unidade}`,
        type: 'linear'
      }
    ]
  }

  newObject(length = this.state.objects.length) {
    return {
      nome: `Objeto ${length + 1}`,
      acceleration: '',
      startSpeed: '',
      startPosition: ''
    }
  }

  addObject() {
    let objects = this.state.objects
    objects.push(this.newObject())

    this.setState({ objects: objects })
  }

  removeObject(index) {
    let objects = this.state.objects
    objects.splice(index, 1)

    this.setState({ objects: objects })
  }

  setValue(index, field, value) {
    let objects = this.state.objects.map((object, _index) => {
      if (index == _index) object[field] = value
      return object
    })

    this.setState({ objects: objects })
  }

  finalPositionNoAcceleration(startPosition, velocidade, time) {
    return parseInt(startPosition, 10) + (parseInt(velocidade, 10) * time)
  }

  finalPosition(startPosition, time, acceleration, startSpeed) {
    let base = parseInt(startPosition, 10) + parseInt(startSpeed, 10) * time

    if (acceleration > 0)
      return base + (Math.abs(parseInt(acceleration, 10)) * (time * time)) / 2
    return base - (Math.abs(parseInt(acceleration, 10)) * (time * time)) / 2
  }

  hasAcceleration(a) {
    return (parseInt(a, 10) != 0)
  }

  getSpeed(object, time) {
    if (!this.hasAcceleration(object.acceleration)) return parseInt(object.startSpeed, 10)
    return parseInt(object.startSpeed, 10) + (parseInt(object.acceleration, 10) * time)
  }

  getPosition(object, time) {
    if (!this.hasAcceleration(object.acceleration))
      return this.finalPositionNoAcceleration(object.startPosition, object.startSpeed, time)
    return this.finalPosition(object.startPosition, time, object.acceleration, object.startSpeed)
  }

  speedData() {
    return this.state.objects.map((object, index) => {
      return {
        label: object.nome,
        data: this.getTimes().map((time) => {
          return {x: time, y: this.getSpeed(object, time)}
        })
      }
    })
  }

  positionData() {
    return this.state.objects.map((object, index) => {
      return {
        label: object.nome,
        data: this.getTimes().map((time) => {
          return {x: time, y: this.getPosition(object, time)}
        })
      }
    })
  }

  getTimes() {
    const time = parseInt(this.state.t, 10)

    if (time === 0) return
    return Array.from({ length: time }, (v, k) => k + 1)
  }

  renderFields(object, index) {
    const fields = {
      acceleration: ['Aceleração', 'm/s²'],
      startSpeed: ['Velocidade Inicial', 'm/s'],
      startPosition: ['Posição Inicial', 'm'],
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

  renderChart(data, axes) {
    let size = this.props.width < 500 ? this.props.width : 500
    return (
      <div style={{ width: `${size}px`, height: `${size}px`, margin: '0 auto' }}>
        <Chart data={data} axes={axes} tooltip />
      </div>
    )
  }

  renderResult() {
    if (!this.getTimes()) return

    return (
      <React.Fragment>
        <div className='column'>
          <h3 className='ui heading' style={{textAlign: 'center'}}>Velocidade x time</h3>
          { this.renderChart(this.speedData(), this.getAxes('m/s'))}
        </div>
        <div className='column'>
          <h3 className='ui heading' style={{textAlign: 'center'}}>Posição x Tempo</h3>
          { this.renderChart(this.positionData(), this.getAxes('m'))}
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className='container'>
          <h1 className='ui dividing header'>Objetos</h1>
          <div className = 'objectConfiguration ui stackable equal width grid'>

              {this.state.objects.map((object, index) => {
                return (
                  <div key={index} className='objectConfiguration column'>
                    <h4 className='ui header'>{object.nome}</h4>
                    <div className='ui form'>
                    {this.renderFields(object, index)}
                    <button onClick={() => this.removeObject(index)} className="ui small red button">Remover Objeto</button>
                    </div>
                  </div>
                )
              })}
          </div>
          <div className='actions' style={{ margin: '30px 0' }}>
            <button className='ui primary button' onClick={this.addObject.bind(this)}>Adicionar Objeto</button>
          </div>
          <div className='movimento'>
            <h1 className='ui dividing header'>Movimento</h1>
            <div className='actions ui form'>
              <div className='inline field' style={{textAlign: 'center'}}>
                <label>Tempo:</label>
                <input type='number' value={this.state.t} onChange={(e) => this.setState({ t: e.target.value })} />
              </div>
            </div>
            <div className='movimentoResult ui stackable equal width grid' style={{ margin: '5px 0 0 0' }}>
              <div className='row'>
                {this.renderResult()}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

}

export default MRUComponent;
