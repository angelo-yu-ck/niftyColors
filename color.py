#!/usr/bin/python
import sys
import pickle
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

def hex_to_data(hex):
    if hex[0] == '#':
        hex = hex[1:]
    return [ [ int(hex[:2], 16), int(hex[2:4], 16), int(hex[4:], 16) ] ]

    # var parents = { red: '#FF0000',
    # orange: '#FF7F00',
    # yellow: '#FFFF00',
    # green: '#00FF00',
    # blue: '#0000FF',
    # violet: '#7F00FF',
    # white: '#FFFFFF',
    # black: '#000000',
    # gray: '#808080',
    # brown: '#A52A2A' }
COLORS = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'violet',
    'white',
    'black',
    'gray',
    'brown'
]

clf = pickle.load(open('/src/model.sav', 'rb'))
result = clf.predict(hex_to_data(sys.argv[1]))

print(COLORS[int(result[0])])
