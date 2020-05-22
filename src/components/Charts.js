import React from 'react';
import { Chart } from 'react-charts';
import Translatable from './Translatable.js'

export default class Charts extends Translatable {

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
    return this.props.objects.map((object, index) => {
      return {
        label: object.nome,
        data: this.getTimes().map((time) => {
          return {x: time, y: this.getSpeed(object, time)}
        })
      }
    })
  }

  positionData() {
    return this.props.objects.map((object, index) => {
      return {
        label: object.nome,
        data: this.getTimes().map((time) => {
          return {x: time, y: this.getPosition(object, time)}
        })
      }
    })
  }

  getTimes() {
    const time = parseInt(this.props.movementTime, 10)

    if (time === 0) return
    return Array.from({ length: time }, (v, k) => k + 1)
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
          <h3 className='ui heading' style={{textAlign: 'center'}}>{this.labels.velocidade_tempo}</h3>
          { this.renderChart(this.speedData(), this.getAxes('m/s'))}
        </div>
        <div className='column'>
          <h3 className='ui heading' style={{textAlign: 'center'}}>{this.labels.posicao_tempo}</h3>
          { this.renderChart(this.positionData(), this.getAxes('m'))}
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <h2 className='ui dividing header'>{this.labels.graficos}</h2>
        <div className='actions ui form'>
          <div className='inline field' style={{textAlign: 'center'}}>
            <label>{this.labels.tempo_movimento}:</label>
            <input
              type='number'
              value={this.props.movementTime}
              onChange={(e) => this.props.onChange(e.target.value)}
            />
          </div>
        </div>
        <div className='movimentoResult ui stackable equal width grid' style={{ margin: '5px 0 0 0' }}>
          <div className='row'>
            {this.renderResult()}
          </div>
        </div>
      </React.Fragment>
    )
  }
}
