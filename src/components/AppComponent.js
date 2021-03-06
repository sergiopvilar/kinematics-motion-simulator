import React from 'react';
import TranslatableComponent from './TranslatableComponent.js'
import ObjectComponent from './ObjectComponent.js'
import ChartComponent from './ChartComponent.js'
import AnimationComponent from './AnimationComponent.js'
import '../assets/App.css';

export default class AppComponent extends TranslatableComponent {

  constructor(props) {
    super(props)
    this.state = {
      motionTime: 10,
      motionInterval: 1,
      language: props.language,
      objects: [],
      speedUnity: 'm/s',
      timeUnity: 'adaptive',
      lengthUnity: 'adaptive',
      motionTimeUnity: 's',
      decimals: 2
    }
  }

  componentDidMount() {
    this.setLanguage(this.state.language)
  }

  toggleObject(index, state) {
    let objects = this.state.objects
    objects[index].enabled = state

    this.setState({objects: objects})
  }

  validateAndSetState(state) {

    if(state.motionInterval && state.motionInterval < 1) return
    if(state.motionTime && state.motionTime < 1) return

    this.setState(state)
  }

  setStateValue(unity, value) {
    let obj = {}
    obj[unity] = value

    this.setState(obj)
  }

  motionProps() {
    const keys = ['objects', 'motionTimeUnity', 'motionTime', 'motionInterval', 'language', 'lengthUnity', 'timeUnity',
                  'decimals']
    let props = {}

    keys.map((key) => props[key] = this.state[key])
    return props
  }

  renderHeader() {
    return (
      <React.Fragment>
        <div className='container main-header'>
          <h1 className='ui dividing header'>{this.labels.titulo}</h1>
          { this.labels.resumo.map((resumo, index) => {
            return <p key={index} dangerouslySetInnerHTML={{__html: resumo}}></p>
          }) }
        </div>
        { this.renderLanguageSwitch() }
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        { this.renderHeader() }
        <div className='container'>
          <ObjectComponent
            language={this.state.language}
            objects={this.state.objects}
            onChange={({objects}) => this.setState({objects: objects})}
          />
          <div className='animacao'>
            <AnimationComponent
              {...this.motionProps()}
              width={this.props.width}
            />
          </div>
          <div className='movimento'>
            <ChartComponent
              speedUnity={this.state.speedUnity}
              onChange={(state) => this.validateAndSetState(state)}
              toggleObject={this.toggleObject.bind(this)}
              setValue={this.setStateValue.bind(this)}
              {...this.motionProps()}
            />
          </div>
        </div>
        <div id="footer">{this.labels.titulo} {this.labels.por} <a href="http://vilar.cc">Sérgio Vilar</a><br />
        {this.labels.codigo_aberto} <a href="https://github.com/sergiopvilar/urm-simulator">Github</a></div>
      </React.Fragment>
    )
  }

}
