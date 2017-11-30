# Neural net takes a array(8,1) input of any number in binary form
# so the number is represented as a base 2 number in reverse order in
# the array.
# Hence the first bit of the array represent if the number is even or not.

from keras.models import Sequential
from keras.layers import Dense
from keras import losses
import numpy as np

# convert input
def convertBase2(n, length):
	mot = [0 for i in range(length)]
	index = 0
	while(n != 0) and index < length:
		n, r = divmod(n, 2)
		mot[index] = r
		index += 1
	return mot

# create dataset
def createDataSet(start, end):
	X = [convertBase2(i, 8) for i in range(start, end)]
	Y = [mot[0] + (-1)**mot[0] for mot in X]
	return X, Y

# create model
model = Sequential()
model.add(Dense(8, input_dim = 8, activation = 'relu'))
model.add(Dense(1, activation = 'sigmoid'))

# compile model
model.compile(loss = losses.mean_squared_error,
	optimizer = 'adam',
	metrics = ['accuracy'])

# fit model
X, Y = createDataSet(0, 100)
print('####################')
print(X)
print('####################')
print(Y)
model.fit(X, Y, epochs = 100, batch_size = 10)

# evaluate the model
X, Y = createDataSet(1000, 10000)
scores = model.evaluate(X, Y)
print('####################')
print(model.metrics_names[1], scores[1]*100)

def isEven(n):
	mot = np.array([convertBase2(n, 8)])
	prediction = model.predict(mot)[0][0]
	return bool(round(prediction))

print('####################')
print(isEven(51))
print(isEven(76))
