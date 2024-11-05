from sklearn.svm import SVC
from audio_features import extract_features
from audio_features import return_features
import pickle
import numpy as np

with open('trained_model.pkl', 'rb') as f:
    model = pickle.load(f)

def new_data(new_song):
    features = extract_features(new_song)
    features = features.reshape(1,-1)
    prediction = model.predict(features)
    if prediction == 1:
        print("chill babe")
        return 1
    else:
        print("Bounce dat ASS!!")
        return 0
    
