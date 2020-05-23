import React from 'react';
import {Line} from 'react-chartjs-2'
import Translatable from './Translatable.js'
import ChartConfiguration from './ChartConfiguration.js'

export default class Charts extends Translatable {

  isDataValid() {
    const invalids = this.props.objects.filter((object) => {
      return isNaN(parseFloat(object.acceleration)) || isNaN(parseFloat(object.startSpeed)) || isNaN(parseFloat(object.startPosition))
    })
    
    return invalids.length === 0
  }

  finalPositionNoAcceleration(startPosition, velocidade, time) {
    return parseFloat(startPosition, 10) + (parseFloat(velocidade, 10) * time)
  }

  finalPosition(startPosition, time, acceleration, startSpeed) {
    let base = parseFloat(startPosition, 10) + parseFloat(startSpeed, 10) * time

    if (acceleration > 0)
      return base + (Math.abs(parseFloat(acceleration, 10)) * (time * time)) / 2
    return base - (Math.abs(parseFloat(acceleration, 10)) * (time * time)) / 2
  }

  hasAcceleration(a) {
    return (parseFloat(a, 10) != 0)
  }

  getSpeed(object, time) {
    if (!this.hasAcceleration(object.acceleration)) return parseFloat(object.startSpeed, 10)
    return parseFloat(object.startSpeed, 10) + (parseFloat(object.acceleration, 10) * time)
  }

  getPosition(object, time) {
    if (!this.hasAcceleration(object.acceleration))
      return this.finalPositionNoAcceleration(object.startPosition, object.startSpeed, time)
    return this.finalPosition(object.startPosition, time, object.acceleration, object.startSpeed)
  }

  getAxis(object) {
    return {
      label: `${this.labels.objeto} ${object.nome}`,
      fill: false,
      borderColor: object.color,
      pointBackgroundColor: object.color,
      pointRadius: 4
    }
  }

  getAvailableObjects() {
    return this.props.objects.filter((obj) => obj.enabled)
  }

  getLabels() {
    return this.getTimes().map((t) => {
      if(t < 60) return `${t}s`
      if(t < 3600) return `${Number((t/60).toFixed(2))}min`
      return `${Number((t/3600).toFixed(2))}h`
    })
  }

  speedData() {
    return {
      labels: this.getLabels(),
      datasets: this.getAvailableObjects().map((object) => {
        return Object.assign(this.getAxis(object), {
          data: this.getTimes().map((time) => {
            return {x: time, y: this.getSpeed(object, time) }
          })
        })
      })
    }
  }

  positionData() {
    return {
      title: { text: this.labels.posicao_tempo, display: true },
      labels: this.getLabels(),
      datasets: this.getAvailableObjects().map((object) => {
        return Object.assign(this.getAxis(object), {
          data: this.getTimes().map((time) => {
            return {x: time, y: this.getPosition(object, time) }
          })
        })
      })
    }
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

  getOptions(key) {

    const options = {
      speed: {
        title: this.labels.velocidade_tempo,
        unity: (value) => `${value}${this.props.speedUnity}`
      },
      position: {
        title: this.labels.posicao_tempo,
        unity: (value) => {
          if(value < 1000) return `${value}${this.props.spaceUnity}`
          return `${value/1000}km`
        }
      }
    }

    return {
      title: {
        text: options[key].title,
        display: true,
        fontSize: 24
      },
      tooltips: {
        callbacks: {
          title: (tooltip) => {
            return `${this.labels.tempo}: ${tooltip[0].label}`
          },
          label: (tooltipItems, data) => {
            return `${data.datasets[tooltipItems.datasetIndex].label}: ${options[key].unity(tooltipItems.value)}`
          }
        }
      },
      scales: {
        xAxes: [{
            ticks: {
                suggestedMin: 0
            }
        }],
        yAxes: [{
          ticks: {
            callback: (value) => `${options[key].unity(value)}`
          }
        }]
      },
      responsive: true
    }
  }

  renderChart(data, options) {
    return (
      <Line data={data} options={options} />
    )
  }

  renderResult() {
    if (!this.getTimes()) return

    if(!this.isDataValid() || this.getAvailableObjects().length === 0) return (
      <div className='column'>
    <div className='ui message'>{this.labels.dados_vazios}</div></div>
    )

    return (
      <React.Fragment>
        <div className='column'>
          { this.renderChart(this.speedData(), this.getOptions('speed'))}
        </div>
        <div className='column'>
          { this.renderChart(this.positionData(), this.getOptions('position'))}
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
          objects={this.props.objects}
          toggleObject={this.props.toggleObject}
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
