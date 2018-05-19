;(async function (exports) {
    
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

    /* YOUR CODE BELOW HERE  */
    
    TRAINING_DONE = 0
    // change this to your name
    const myname = "angelo"

    const labels = Object.keys(parents)
    const num_classes = labels.length

    const toVector = (index, total) => {
        const ret = new Array(total).fill(0)
        ret[index] = 1
        return ret
    }

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

    const labelMap = labels.reduce((lmap, val, index) => {
        lmap[val] = toVector(index, num_classes)
        return lmap
    }, {})

    const X = []
    const y = []

    const toX = (colorStr) => {
        const color = tinycolor(colorStr)
        const rgb = color.toRgb()
        const hsv = color.toHsv()
        return [rgb.r, rgb.g, rgb.b,  hsv.h, hsv.s, hsv.v, rgb.a, color.getBrightness(), color.getLuminance()]
    }
    Object.entries(XKCD).forEach(entry => {
        const label = labelMap[findRealName(entry[1])]
        X.push(toX(entry[0]))
        y.push(label)
    })

    // console.log(X.length) 98057
    const model = tf.sequential()
    model.add(tf.layers.dense(
        {units: 50, activation: 'sigmoid', inputShape: [ X[0].length ]}));
    model.add(tf.layers.dense({units: labels.length, activation: 'softmax'}))

    const LEARNING_RATE = 0.05
    const optimizer = tf.train.sgd(LEARNING_RATE)
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    })

    // data too big for single load
    // const xs = tf.tensor2d(X)
    // const ys = tf.tensor2d(y)

    const batch_size = 1000
    const iter = 98
    const randomIndex = tf.util.createShuffledIndices(X.length)

    for (let i = 0; i < iter; i++) {
        const indexes = randomIndex.slice(i * batch_size, i * batch_size + batch_size)
        const xs = []
        const ys = []
        indexes.forEach( index => {
            xs.push(X[index])
            ys.push(y[index])
        })
        const batch_xs = tf.tensor2d(xs)
        const batch_ys = tf.tensor2d(ys)
        const history = await model.fit(batch_xs, batch_ys, {batchSize: batch_size, epochs: 1})
        const loss = history.history.loss[0]
        const accuracy = history.history.acc[0]

        console.log(`loss: ${loss}`)
        console.log(`accuracy: ${accuracy}`)
        batch_xs.dispose()
        batch_ys.dispose()
    
        await tf.nextFrame()
    }

    /* 
        this function will be passed in the color to be identified
        as hex (e.g. "#FF00FF", and also as r, g, b (eg 255, 0, 255)
        you can ignore the one(s) you won't use
    */
    console.log('ready!')

    function pickColor(hex, r, g, b){
        let ret
        tf.tidy(() => {
            const predictOut = model.predict(tf.tensor2d([toX(hex)]))
            // console.log(result)
            const logits = Array.from(predictOut.dataSync())
            // console.log(logits)
            const winner = labels[predictOut.argMax(-1).dataSync()[0]]
            // console.log(winner)
            ret = winner
        })
        return ret
    }

    // /* YOUR CODE ABOVE HERE  */
    if (!exports.algos) {
      exports.algos = []
    }
    exports.algos.push({name: myname, f: pickColor})

    TRAINING_DONE = 1
  })(COLORS)