from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from audio_features import return_features
from sklearn.metrics import accuracy_score
import numpy as np
import pickle


chill_features = return_features("chill")
dance_features = return_features("dance")
X = np.concatenate((chill_features, dance_features))
y = np.concatenate((np.ones(len(chill_features)),
                    np.zeros(len(dance_features))))

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = SVC()
model.fit(X_train, y_train)
with open('trained_model.pkl', 'wb') as f:
    pickle.dump(model, f)

y_pred = model.predict(X_test)
print(accuracy_score(y_test, y_pred))
