import labels from './labels.json'

const label = (language, key) => {
  return labels[language][key]
}

export default {
  speed: (language, but = [], abbr = false) => {
    const units = {
      'm/s': label(language, 'metros_por_segundo'),
      'km/h': label(language, 'quilometros_por_hora')
    }

    const available = Object.keys(units).map((key) => {
      return {
        key: key,
        value: key,
        text: abbr ? key : units[key]
      }
    })

    return available.filter((unit) => but.indexOf(unit.key) === -1)
  },
  time: (language, but = [], abbr = false) => {
    const units = {
      s: label(language, 'segundos'),
      min: label(language, 'minutos'),
      h: label(language, 'horas'),
    }

    let available = [{
      key: 'adaptive',
      value: 'adaptive',
      text: label(language, 'adaptavel')
    }]

    Object.keys(units).forEach((key) => {
      available.push({
        key: key,
        value: key,
        text: abbr ? key : units[key]
      })
    })

    return available.filter((unit) => but.indexOf(unit.key) === -1)
  },
  length: (language, but = [], abbr = false) => {
    const units = {
      cm: label(language, 'centimetros'),
      dm: label(language, 'decimetros'),
      m: label(language, 'metros'),
      dam: label(language, 'decametros'),
      hm: label(language, 'hectometros'),
      km: label(language, 'quilometros'),
    }

    let available = [{
      key: 'adaptive',
      value: 'adaptive',
      text: label(language, 'adaptavel')
    }]

    Object.keys(units).forEach((key) => {
      available.push({
        key: key,
        value: key,
        text: abbr ? key : units[key]
      })
    })

    return available.filter((unit) => but.indexOf(unit.key) === -1)
  }
}
