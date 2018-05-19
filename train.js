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
    Object.entries(XKCD).forEach(entry => {
        const label = labelMap[findRealName(entry[1])]
        const rgb = tinycolor(entry[0]).toRgb()
        X.push([rgb.r, rgb.g, rgb.b, rgb.a])
        y.push(label)
    })

    // console.log(X.length) 98057

    const model = tf.sequential()
    model.add(tf.layers.dense(
        {units: 40, activation: 'sigmoid', inputShape: [4]}));
    model.add(tf.layers.dense({units: labels.length, activation: 'softmax'}));
    // model.add(tf.layers.dense({inputShape: [4], units: labels.length, kernelInitializer: 'varianceScaling', activation: 'softmax'}))

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
    for (let i = 0; i < iter; i++) {
        const batch_xs = tf.tensor2d(X.slice(i * batch_size, i * batch_size + batch_size))
        const batch_ys = tf.tensor2d(y.slice(i * batch_size, i * batch_size + batch_size))
        const history = await model.fit(batch_xs, batch_ys, {batchSize: batch_size, epochs: 1})
        const loss = history.history.loss[0]
        const accuracy = history.history.acc[0]

        console.log(`loss: ${loss}`)
        console.log(`accuracy: ${accuracy}`)
        batch_xs.dispose()
        batch_ys.dispose()
    
        await tf.nextFrame()
    }
    // // Train the model using the data.
    // model.fit(xs, ys).then(() => {
    //     // Use the model to do inference on a data point the model hasn't seen before:
    //     // model.predict(tf.tensor2d([5], [1, 1])).print()
    //     console.log('ready!')
    //     const predict = (hex, r, g, b) => {
    //         const rgb = tinycolor(hex).toRgb()
    //         const result = model.predict(tf.tensor2d([[rgb.r, rgb.g, rgb.b, rgb.a]]))
    //         console.log(result)
    //     }
    //     if (!exports.algos) {
    //         exports.algos = []
    //       }
    //       exports.algos.push({name: myname, f: predict})
    // })

    /* 
        this function will be passed in the color to be identified
        as hex (e.g. "#FF00FF", and also as r, g, b (eg 255, 0, 255)
        you can ignore the one(s) you won't use
    */
    console.log('ready!')

    function pickColor(hex, r, g, b){
        // const colors = Object.keys(parents)
        // const randindex = Math.floor(Math.random() * colors.length)
        // return colors[randindex]
        let ret
        tf.tidy(() => {
            const rgb = tinycolor(hex).toRgb()
            const predictOut = model.predict(tf.tensor2d([[rgb.r, rgb.g, rgb.b, rgb.a]]))
            // console.log(result)
            const logits = Array.from(predictOut.dataSync())
            console.log(logits)
            const winner = labels[predictOut.argMax(-1).dataSync()[0]]
            console.log(winner)
            ret = winner
        })
        return ret
    }

    // /* YOUR CODE ABOVE HERE  */
    if (!exports.algos) {
      exports.algos = []
    }
    exports.algos.push({name: myname, f: pickColor})
  })(COLORS)