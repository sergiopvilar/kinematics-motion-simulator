import React from 'react';
import Translatable from './Translatable.js'
import ObjectForm from './ObjectForm.js'
import Charts from './Charts.js'
import '../App.css';

class MRUComponent extends Translatable {

  constructor(props) {
    super(props)
    this.state = {
      motionTime: 10,
      motionInterval: 1,
      language: props.language,
      objects: []
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className='container main-header'>
          <h1 className='ui dividing header'>{this.labels.titulo}</h1>
          { this.labels.resumo.map((resumo, index) => {
            return <p key={index} dangerouslySetInnerHTML={{__html: resumo}}></p>
          }) }
        </div>
        { this.renderLanguageSwitch() }
        <div className='container'>
          <ObjectForm
            language={this.state.language}
            objects={this.state.objects}
            onChange={({objects}) => this.setState({objects: objects})}
          />
          <div className='movimento'>
            <Charts
              objects={this.state.objects}
              motionTime={this.state.motionTime}
              motionInterval={this.state.motionInterval}
              language={this.state.language}
              timeUnity={'s'}
              spaceUnity={'m'}
              speedUnity={'m/s'}
              onChange={(state) => this.setState(state)}
            />
          </div>
        </div>
        <div id="footer">{this.labels.titulo} {this.labels.por} <a href="mailto:vilar@me.com">Sérgio Vilar</a><br />
        {this.labels.codigo_aberto} <a href="https://github.com/sergiopvilar/urm-simulator">Github</a></div>
      </React.Fragment>
    )
  }

}

export default MRUComponent;
