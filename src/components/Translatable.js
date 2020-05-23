import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import labels from '../labels.json'

export default class Translatable extends React.Component {
  get labels() {
    return labels[this.language]
  }

  get language() {
    return this.state && this.state.language ? this.state.language : this.props.language
  }

  languageOptions() {
    return Object.keys(labels).map((key) => {
      return { key: key, value: key, text: key }
    })
  }

  getLabel(language, key) {
    return labels[language][key]
  }

  renderLanguageSwitch() {
    return (
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
    )
  }
}
