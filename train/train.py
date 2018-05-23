import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import time

x = np.genfromtxt('/data/data.csv', delimiter=',')
y = np.genfromtxt('/data/label.csv')

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(x, y)

import pickle
pickle.dump(knn, open('model.sav', 'wb'))

while 1: # keep docker alive to copy the model out
    time.sleep(1)
