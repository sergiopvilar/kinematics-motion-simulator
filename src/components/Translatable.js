import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import labels from '../config/labels.json'

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

  setLanguage(language) {
    if (window) window.location.hash = language
    this.setState({language: language})
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
        onChange={(e, obj) => this.setLanguage(obj.value)}
      />
    )
  }
}
