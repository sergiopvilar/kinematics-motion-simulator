import labels from './labels.json'

const label = (language, key) => {
  return labels[language][key]
}

export default {
  speed: (language, but = [], abbr = false) => {
    const available = [{
        key: 'm/s',
        value: 'm/s',
        text: abbr ? 'm/s' : label(language, 'metros_por_segundo')
      },
      {
        key: 'km/h',
        value: 'km/h',
        text: abbr ? 'km/h' : label(language, 'quilometros_por_hora')
      },
    ]

    return available.filter((unit) => but.indexOf(unit.key) === -1)
  },
  time: (language, but = [], abbr = false) => {
    const available = [
      {
        key: 'adaptive',
        value: 'adaptive',
        text: label(language, 'adaptavel')
      },
      {
        key: 's',
        value: 's',
        text: abbr ? 's' : label(language, 'segundos')
      },
      {
        key: 'min',
        value: 'min',
        text: abbr ? 'min' : label(language, 'minutos')
      },
      {
        key: 'h',
        value: 'h',
        text: abbr ? 'h' : label(language, 'horas')
      },
    ]

    return available.filter((unit) => but.indexOf(unit.key) === -1)
  },
  length: (language, but = [], abbr = false) => {
    const available = [
      {
        key: 'adaptive',
        value: 'adaptive',
        text: label(language, 'adaptavel')
      }, {
        key: 'cm',
        value: 'cm',
        text: abbr ? 'cm' : label(language, 'centimetros')
      }, {
        key: 'dm',
        value: 'dm',
        text: abbr ? 'dm' : label(language, 'decimetros')
      }, {
        key: 'm',
        value: 'm',
        text: abbr ? 'm' : label(language, 'metros')
      }, {
        key: 'dam',
        value: 'dam',
        text: abbr ? 'dam' : label(language, 'decametros')
      }, {
        key: 'hm',
        value: 'hm',
        text: abbr ? 'hm' : label(language, 'hectometros')
      }, {
        key: 'km',
        value: 'km',
        text: abbr ? 'km' : label(language, 'quilometros')
      },
    ]

    return available.filter((unit) => but.indexOf(unit.key) === -1)
  }
}
