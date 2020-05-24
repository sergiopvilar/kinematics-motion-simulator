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
    time = this.timeInUnity(time)
    return parseFloat(startPosition, 10) + (parseFloat(velocidade, 10) * time)
  }

  finalPosition(startPosition, time, acceleration, startSpeed) {
    time = this.timeInUnity(time)
    let base = parseFloat(startPosition, 10) + parseFloat(startSpeed, 10) * time

    if (acceleration > 0)
      return base + (Math.abs(parseFloat(acceleration, 10)) * (time * time)) / 2
    return base - (Math.abs(parseFloat(acceleration, 10)) * (time * time)) / 2
  }

  hasAcceleration(a) {
    return (parseFloat(a, 10) != 0)
  }

  getSpeed(object, time) {
    time = this.timeInUnity(time)
    if (!this.hasAcceleration(object.acceleration)) return parseFloat(object.startSpeed, 10)
    return parseFloat(object.startSpeed, 10) + (parseFloat(object.acceleration, 10) * time)
  }

  getPosition(object, time) {
    time = this.timeInUnity(time)

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
    return this.getTimes().map((t) => this.timeUnity(t))
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

  timeInUnity(time) {
    if (this.props.motionTimeUnity === 'min') return time * 60
    if (this.props.motionTimeUnity === 'h') return time * 3600

    return time
  }

  getTimes() {
    let times = [0]
      , counter = 0
      , iterations = Math.round(this.timeInUnity(parseInt(this.props.motionTime, 10))/this.timeInUnity(parseInt(this.props.motionInterval, 10)))

    for(var i = 0; i < iterations; i++){
      counter = counter + this.timeInUnity(parseInt(this.props.motionInterval, 10))
      times.push(counter)
    }

    return times
  }

  round(value, decimals = this.props.decimals) {
    return Number((value).toFixed(parseInt(decimals)))
  }

  timeUnity(value) {
    const unity = this.props.timeUnity

    if(unity === 'adaptive' && value < 60 || unity === 's') return `${value}s`
    if(unity === 'adaptive' && value < 3600 || unity === 'min') return `${this.round(value/60)}min`
    if(unity === 'adaptive' || unity === 'h') return `${this.round(value/3600)}h`

    return `${value}s`
  }

  lengthUnity(value) {
    const unity = this.props.lengthUnity

    if(unity === 'adaptive' && value < 1000) return `${value}m`
    if(unity === 'adaptive') return `${this.round(value/1000)}km`

    if(unity === 'dm') return `${this.round(value*10)}dm`
    if(unity === 'cm') return `${this.round(value*100)}cm`
    if(unity === 'dam') return `${this.round(value/10)}dam`
    if(unity === 'hm') return `${this.round(value/100)}hm`
    if(unity === 'km') return `${this.round(value/1000)}km`

    return `${value}m`
  }

  getOptions(key) {

    const options = {
      speed: {
        title: this.labels.velocidade_tempo,
        unity: (value) => {
          if(this.props.speedUnity === 'km/h') return `${this.round(value/3.6)}${this.props.speedUnity}`
          return `${value}${this.props.speedUnity}`
        }
      },
      position: {
        title: this.labels.posicao_tempo,
        unity: (value) => this.lengthUnity(value)
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
          speedUnity={this.props.speedUnity}
          timeUnity={this.props.timeUnity}
          lengthUnity={this.props.lengthUnity}
          motionTimeUnity={this.props.motionTimeUnity}
          setValue={this.props.setValue}
          decimals={this.props.decimals}
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
