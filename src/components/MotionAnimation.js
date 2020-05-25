import React from 'react'
import Motion from './Motion.js'

export default class MotionAnimation extends Motion {

  constructor(props) {
    super(props)
    this.interval = undefined
    this.markers = []
    this.state = {
      motionTime: this.getTimes()[0],
      animating: false,
    }
  }

  componentWillReceiveProps(props) {
    this.markers = this.getMarkers(props).map((marker) => {
      return {
        left: this.getMarkerPosition(marker, props),
        text: this.lengthUnity(this.round(marker, props.decimals))
      }
    })
  }

  anyMarkerNear(position, markers, props = this.props) {
    const markerPositions = markers.map((marker) => this.getMarkerPosition(marker, props))
    const current = this.getMarkerPosition(position, props)
    const markerWidth = 53

    return markerPositions.filter((pos) => {
      return (
        (current >= pos && current <= pos + markerWidth) ||
        (current + markerWidth >= pos && current <= pos)
      )
    }).length > 0
  }

  getMarkers(props = this.props) {
    let markers = [this.startPosition(props), this.endPosition(props), 0]
    this.getPositionData(props).forEach((objectData) => {
      objectData.forEach((data) => {
        if(!this.anyMarkerNear(data.y, markers, props))
          markers.push(data.y)
      })
    })

    return markers.sort()
  }

  fixScale(value, props = this.props) {
    return value + (this.startPosition(props) < 0 ? this.startPosition(props) * -1 : 0)
  }

  getMarkerPosition(marker, props = this.props) {
    return ((props.width - 80) * this.fixScale(marker, props)) / this.fixScale(this.endPosition(props), props) + 20 - 25
  }

  getObjectPosition(object, time) {
    return ((this.props.width - 80) * (this.fixScale(this.getPosition(object, time)))) / this.fixScale(this.endPosition()) + 20 - 10
  }

  getAnimationHeigth() {
    return this.getAvailableObjects().length * 55 + 20
  }

  shouldRender() {
    return (this.getTimes() && this.isDataValid() && this.getAvailableObjects().length > 0)
  }

  stopAnimation() {
    clearInterval(this.interval)
    this.interval = undefined
    this.setState({
      animating: false
    })
  }

  resetAnimation() {
    this.stopAnimation()
    this.setState({motionTime: 0})
  }

  translateMotionTime() {
    const time = this.state.motionTime / 1000

    if (this.props.motionTimeUnity === 'min') return time * 60
    if (this.props.motionTimeUnity === 'h') return time * 3600

    return time
  }

  startAnimation() {
    const interval = 10
    let time

    this.interval = setInterval(() => {
      time = this.state.motionTime + interval
      if (time / 1000 >= this.props.motionTime) {
        this.setState({motionTime: this.props.motionTime*1000})
        return this.stopAnimation()
      }

      this.setState({ motionTime: time, animating: true })
    }, interval)
  }

  toggleAnimation() {
    this.state.animating ? this.stopAnimation() : this.startAnimation()
  }

  getMotionTime() {
    return this.round(this.state.motionTime/1000, this.props.decimals)
  }

  getObjectRealPosition(object) {
    return this.lengthUnity(this.round(this.getPosition(object, this.translateMotionTime()), this.props.decimals))
  }

  renderResult() {
    if (!this.shouldRender()) return (
      <div className='column'>
        <div className='ui message'>{this.labels.dados_vazios_animacao}</div>
      </div>
    )

    return this.renderAnimation()
  }

  renderActions() {
    if(!this.shouldRender()) return

    return (
      <div className='motionActions'>
        <button className='ui primary button playpause' onClick={this.toggleAnimation.bind(this)}>
          <i className={this.state.animating ? 'pause icon' : 'play icon'}></i>
          {this.state.animating ? this.labels.parar : this.labels.iniciar}
        </button>
        <button className='ui button' onClick={this.resetAnimation.bind(this)}>
          <i className='redo icon'></i>
          {this.labels.reiniciar}
        </button>
      </div>
    )
  }

  renderMotionTime() {
    if(!this.shouldRender()) return
    return (
      <span className='motionTime'>
        <strong>{this.labels.tempo_movimento}: </strong>
        {this.getMotionTime()}{this.props.motionTimeUnity}
      </span>
    )
  }

  renderAnimation() {

    return (
      <div className='animationBox' style={{height: this.getAnimationHeigth()}}>
        <div className='motionObjects'>
          {this.getAvailableObjects().map((object, index) => {
            return (
              <div
                className = 'motionObject'
                key={`objmarker${object.nome}`}
                style={{
                  backgroundColor: object.color,
                  top: 10 + index * 55,
                  left: this.getObjectPosition(object, this.translateMotionTime())
                }}>
                  <span className='name'>
                    {this.labels.objeto} {object.nome}
                  </span>
                  <span className='position'>
                    {this.getObjectRealPosition(object)}
                  </span>
              </div>
            )
          })}
        </div>
        <div className='motionMarkers'>
          {this.markers.map((marker, index) => {
            return (
              <div key={`marker_${index}`} className='marker' style={{top: 0, left: marker.left}}>
                {marker.text}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className='motionContainer'>
        <h2 className='ui dividing header'>{this.labels.animacao_movimento}</h2>
        { this.renderMotionTime() }
        { this.renderResult() }
        { this.renderActions() }
      </div>
    )
  }

}
