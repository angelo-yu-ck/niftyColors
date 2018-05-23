import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from flask import Flask
from flask import request

x = np.genfromtxt('data.csv', delimiter=',')
y = np.genfromtxt('label.csv')

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(x, y)

def hex_to_data(hex):
    if hex[0] == '#':
        hex = hex[1:]
    return [ [ int(hex[:2], 16), int(hex[2:4], 16), int(hex[4:], 16) ] ]

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

app = Flask(__name__)

@app.route('/control')
def index():
    return 'PASS'

@app.route('/prediction/color', methods=['GET'])
def get_prediction():
    result = knn.predict(hex_to_data(request.args.get('hex')))

    return COLORS[int(result[0])]
   
if __name__ == '__main__':
    app.run(port=3000,host='0.0.0.0')