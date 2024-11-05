import asyncio
import json
import librosa
import numpy as np
import websockets

def divide_audio_file(filename, window_size, hop_size):
    y, sr = librosa.load(filename)
    windows = librosa.util.frame(y, frame_length=window_size, hop_length=hop_size)
    duration = librosa.get_duration(y=y, sr=sr)
    time = duration/window_size
    return windows, time

window_size = 2048
hop_size = 128

window_size = 2048
hop_size = 128
windows = None
time = None
new_request = False


async def send_amplitudes(websocket):
    global windows, time
    i = 0
    while True:
        done, pending = await asyncio.wait([websocket.recv()])  # wait for a message to be received
        for task in done:
            new_request = True
            audio = task.result()
            audio = "." + audio
            windows, time = divide_audio_file(audio, window_size, hop_size)
            i = 0
        while True:
            if i >= len(windows):
                break

            # compute the amplitudes
            spectrogram = np.abs(np.fft.fft(windows[i]))
            n_bands = 10
            bands = np.array_split(spectrogram, n_bands, axis=0)
            bands_amplitudes = np.empty((10,))
            j = 0
            for band in bands:
                bands_amplitudes[j] = np.mean(band)
                j += 1
            bands_amplitudes = bands_amplitudes / np.max(bands_amplitudes)
            bands_amplitudes = bands_amplitudes.tolist()
            data = json.dumps({"amplitudes": bands_amplitudes})
            i += 1
            await websocket.send(data)
            await asyncio.sleep(time)




start_server = websockets.serve(send_amplitudes, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()


