import librosa
import numpy as np
import os
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score


def extract_features(file_path):
    audio, sample_rate = librosa.load(file_path, sr=44100)
    mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
    mfccs_mean = np.mean(mfccs.T, axis=0)
    return mfccs_mean


def return_features(dir_path):


    files = []


    for file in os.listdir(dir_path):
        if file.endswith(".mp3"):
            file_path = os.path.join(dir_path, file)
            files.append(extract_features(file_path))

    features = np.array(files)
    
    return features
    
def get_tempo(file_path):
    y, sr = librosa.load(file_path)
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    return tempo


