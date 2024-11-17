import React, { useState } from 'react';
import axios from 'axios';

const Downloader = () => {
    const [url, setUrl] = useState('');
    const [format, setFormat] = useState('mp4');
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState('');

    const handleDownload = async () => {
        if (!url) {
            alert("Please enter the URL.");
            return;
        }

        setLoading(true);
        try {
            // Step 1: Fetch video info including the thumbnail
            const infoResponse = await axios.post('http://localhost:5000/download', { url, format });
            if (infoResponse.data.thumbnail) {
                setThumbnail(infoResponse.data.thumbnail);
            }

            // Step 2: Download the video
            const response = await axios.post(
                'http://localhost:5000/download',
                { url, format },
                { responseType: 'blob' } // Ensure the response is treated as a file
            );

            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `video.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading the video:', error);
            alert('Failed to download video. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h2>YouTube Downloader</h2>
            <input
                type="text"
                placeholder="Enter YouTube URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ width: '100%', padding: '10px', margin: '10px 0' }}
            />
            <select 
                value={format} 
                onChange={(e) => setFormat(e.target.value)} 
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            >
                <option value="mp4">MP4 (Video)</option>
                <option value="mp3">MP3 (Audio)</option>
            </select>
            <button 
                onClick={handleDownload} 
                style={{ width: '100%', padding: '10px', cursor: 'pointer' }} 
                disabled={loading}
            >
                {loading ? 'Downloading...' : 'Download'}
            </button>
            {loading && thumbnail && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Processing...</h4>
                    <img src={thumbnail} alt="Thumbnail" style={{ maxWidth: '100%' }} />
                </div>
            )}
        </div>
    );
};

export default Downloader;
