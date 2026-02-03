import { useState } from 'react';
import axios from 'axios';
import './App.css';

type UploadResponse =
  | {
      ok: true;
      originalName: string;
      storedName: string;
      size: number;
      mimeType: string;
    }
  | { ok: false; error: string };

function Form() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  async function onSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setStatus('');

    if (!file) {
      setStatus('Pick a file first.');
      return;
    }

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await axios.post<UploadResponse>('/api/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setUploadPercentage(percentCompleted);
          }
        }
      });
      const data = res.data;

      if (!data.ok) {
        setStatus(
          `Upload failed: ${'error' in data ? data.error : res.statusText}`
        );
        return;
      }

      setStatus(
        `Uploaded: ${data.originalName} -> ${data.storedName} (${String(data.size)} bytes, ${data.mimeType})`
      );
    } catch (error) {
      console.error('Upload error:', error);
      setUploadPercentage(0); // Reset or set to error state
    }
  }

  return (
    <div className="card">
      <h1>Upload demo</h1>

      <form onSubmit={onSubmit}>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
          }}
        />
        <button type="submit" style={{ marginLeft: 12 }}>
          Upload {uploadPercentage} %
        </button>
      </form>

      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </div>
  );
}

export default Form;
