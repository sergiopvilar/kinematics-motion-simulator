import React from 'react';
import { Dropdown } from 'semantic-ui-react'
import Translatable from './Translatable.js'
import ObjectForm from './ObjectForm.js'
import Charts from './Charts.js'
import '../App.css';

class MRUComponent extends Translatable {

  constructor(props) {
    super(props)
    this.state = {
      movementTime: 10,
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
        <Dropdown
          button
          className='icon'
          floating
          labeled
          icon='world'
          id='language-switch'
          options={this.languageOptions()}
          text={this.state.language}
          onChange={(e, obj) => this.setState({language: obj.value})}
        />
        <div className='container'>
          <ObjectForm
            language={this.state.language}
            objects={this.state.objects}
            onChange={({objects}) => this.setState({objects: objects})}
          />
          <div className='movimento'>
            <Charts
              objects={this.state.objects}
              movementTime={this.state.movementTime}
              language={this.state.language}
              onChange={(movementTime) => this.setState({movementTime: movementTime})}
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
