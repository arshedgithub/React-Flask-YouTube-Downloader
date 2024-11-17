from flask import Flask, request, jsonify, send_file
import yt_dlp
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/download', methods=['POST'])
def download_video():
    data = request.json
    url = data.get('url')
    format_type = data.get('format')  # e.g., "mp4", "mp3"

    ydl_opts = {
        'format': 'bestvideo+bestaudio' if format_type == 'mp4' else 'bestaudio',
        'outtmpl': 'downloaded_video.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegVideoConvertor',
            'preferredcodec': 'mp4',
        }] if format_type == 'mp4' else [],
        'ffmpeg_location': './bin',  # Ensure ffmpeg is accessible here
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            thumbnail_url = info.get('thumbnail')

        return jsonify({
            'filename': filename,
            'thumbnail': thumbnail_url
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

