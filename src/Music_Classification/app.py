from flask import Flask, request, jsonify
from audio_features import get_tempo
from new_data import new_data
import pickle
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods = ['POST'])
def predict():
    # Load the audio features of the song
    data = request.get_json()
    file_path = data.get('song')
    file_path = "."+file_path
    print(file_path)
    predict = new_data(file_path)
    tempo = get_tempo(file_path)
    
    # Return the prediction result as a JSON object
    return jsonify({"mood":predict, "tempo":tempo})

if __name__ == "__main__":
    app.run(port=8081,debug=True)
