import React from 'react';
import CanvasJSChart from '../vendor/canvasjs.react.js'
import Translatable from './Translatable.js'
import ChartConfiguration from './ChartConfiguration.js'

export default class Charts extends Translatable {

  isDataValid() {
    const invalids = this.props.objects.filter((object) => {
      return isNaN(parseInt(object.acceleration)) || isNaN(parseInt(object.startSpeed)) || isNaN(parseInt(object.startPosition))
    })
    
    return invalids.length === 0
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

  getAxis(unity) {
    return {
      axisX: {
        suffix: 's',
        minimum: 0,
        interval: parseInt(this.props.motionInterval, 10)
      },
      axisY: {
        suffix: unity
      },
    }
  }

  speedData() {
    return Object.assign({
      title: {
        text: this.labels.velocidade_tempo
      },
      data: this.props.objects.map((object, index) => {
        return {
          type: 'line',
          toolTipContent: `${object.nome} ${this.labels.em} {x}s: {y}m/s`,
          dataPoints: this.getTimes().map((time) => {
            return {x: time, y: this.getSpeed(object, time) }
          })
        }
      })
    }, this.getAxis('m/2'))
  }

  positionData() {
    return Object.assign({
      title: {
        text: this.labels.posicao_tempo
      },
      data: this.props.objects.map((object, index) => {
        return {
          type: 'line',
          toolTipContent: `${object.nome} ${this.labels.em} {x}s: {y}m`,
          dataPoints: this.getTimes().map((time) => {
            return {x: time, y: this.getPosition(object, time) }
          })
        }
      })
    }, this.getAxis('m'))
  }

  getTimes() {
    let times = [0]
      , counter = 0
      , iterations = Math.round(parseInt(this.props.motionTime, 10)/parseInt(this.props.motionInterval, 10))
    
    for(var i = 0; i < iterations; i++){
      counter = counter + parseInt(this.props.motionInterval, 10)
      times.push(counter)
    }

    return times
  }

  renderChart(data) {
    return (
      <CanvasJSChart options={data} />
    )
  }

  renderResult() {
    if (!this.getTimes()) return

    if(!this.isDataValid()) return (
      <div className='column'>
    <div className='ui message'>{this.labels.dados_vazios}</div></div>
    )

    return (
      <React.Fragment>
        <div className='column'>
          { this.renderChart(this.speedData())}
        </div>
        <div className='column'>
          { this.renderChart(this.positionData())}
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <h2 className='ui dividing header'>{this.labels.graficos}</h2>
        <ChartConfiguration
          motionInterval={this.props.motionInterval}
          motionTime={this.props.motionTime}
          onChange={this.props.onChange}
          language={this.props.language}
        />
        <div className='movimentoResult ui stackable equal width grid' style={{ margin: '5px 0 0 0' }}>
          <div className='row'>
            {this.renderResult()}
          </div>
        </div>
      </React.Fragment>
    )
  }
}
