import React from 'react';
import {Line} from 'react-chartjs-2'
import ChartConfiguration from './ChartConfiguration.js'
import Motion from './Motion.js'

export default class Charts extends Motion {

  getAxis(object) {
    return {
      label: `${this.labels.objeto} ${object.nome}`,
      fill: false,
      borderColor: object.color,
      pointBackgroundColor: object.color,
      pointRadius: 4
    }
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
            return {x: time, y: this.round(this.getSpeed(object, time), this.props.decimals)}
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
            return {x: time, y: this.round(this.getPosition(object, time), this.props.decimals)}
          })
        })
      })
    }
  }

  getOptions(key) {

    const options = {
      speed: {
        title: this.labels.velocidade_tempo,
        unity: (value) => {
          if(this.props.speedUnity === 'km/h') return `${value/3.6}${this.props.speedUnity}`
          return `${value}${this.props.speedUnity}`
        }
      },
      position: {
        title: this.labels.posicao_tempo,
        unity: (value) => {
          return this.lengthUnity(value)
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
