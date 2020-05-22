import { Component } from 'react';
import labels from '../labels.json'

export default class Translatable extends Component {
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
}
