const fs = require('fs')

const data = JSON.parse(fs.readFileSync('data.json').toString())

// console.log(data)

function findRealName (color) {
    // create a tree of mappings
    var names = {'black': 'black',
      'dark green': 'green',
      'green': 'green',
      'navy blue': 'blue',
      'dark blue': 'blue',
      'dark teal': 'blue',
      'blue': 'blue',
      'teal': 'blue',
      'light green': 'green',
      'light blue': 'blue',
      'cyan': 'blue',
      'sky blue': 'blue',
      'brown': 'brown',
      'dark purple': 'violet',
      'maroon': 'red',
      'red': 'red',
      'dark red': 'red',
      'purple': 'violet',
      'magenta': 'violet',
      'pink': 'red',
      'dark brown': 'brown',
      'orange': 'orange',
      'olive': 'green',
      'gold': 'yellow',
      'mustard': 'yellow',
      'yellow': 'yellow',
    'lime green': 'green'}
  
    if (names[color]) {
      return names[color]
    }
    return color
  }

const hexToRgb = (str) => {
    const r = parseInt(str.slice(1, 3), 16)
    const g = parseInt(str.slice(3, 5), 16)
    const b = parseInt(str.slice(5), 16)
    return `${r},${g},${b}`
}

var parents = { red: '#FF0000',
orange: '#FF7F00',
yellow: '#FFFF00',
green: '#00FF00',
blue: '#0000FF',
violet: '#7F00FF',
white: '#FFFFFF',
black: '#000000',
gray: '#808080',
brown: '#A52A2A' }

const labels = Object.keys(parents)

const labelMap = labels.reduce((lmap, val, index) => {
    lmap[val] = index
    return lmap
}, {})

const x = []
const y = []

Object.entries(data).forEach(entry => {
    x.push(hexToRgb(entry[0]))
    y.push(labelMap[findRealName(entry[1])])
})

fs.writeFileSync('train/data.csv', x.join('\n'))
fs.writeFileSync('train/label.csv', y.join('\n'))
