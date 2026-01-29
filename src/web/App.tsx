import { useState } from 'react';
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

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');

  async function onSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setStatus('');

    if (!file) {
      setStatus('Pick a file first.');
      return;
    }

    const form = new FormData();
    form.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: form
    });

    const data = (await res.json()) as UploadResponse;

    if (!res.ok || !data.ok) {
      setStatus(
        `Upload failed: ${'error' in data ? data.error : res.statusText}`
      );
      return;
    }

    setStatus(
      `Uploaded: ${data.originalName} -> ${data.storedName} (${String(data.size)} bytes, ${data.mimeType})`
    );
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
          Upload
        </button>
      </form>

      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </div>
  );
}

export default App;
