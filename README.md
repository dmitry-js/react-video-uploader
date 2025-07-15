# React Video Uploader (TypeScript)

A reusable React component for uploading large video files with chunked upload, progress bar, and drag & drop UI. Now fully written in TypeScript.

## Features
- Chunked upload (uploads large files in parts)
- Progress bar and file size display
- Drag & drop and file picker
- File type and size validation
- Status icons (loading, success, error)
- No dependencies on Redux or i18n
- Easy to integrate into any React/TypeScript project

## Usage Example
```tsx
import VideoUploader from './src/components/VideoUploader';

function App() {
  const handleUploadSuccess = (fileInfo: { file: File; uploadId: string }) => {
    console.log('Upload finished:', fileInfo);
  };

  return (
    <VideoUploader
      maxSizeGb={15}
      accept={[".mp4", ".mov", ".avi"]}
      onSuccess={handleUploadSuccess}
    />
  );
}
```

## Quick Start
1. Clone this repo or copy the `src/` folder into your project.
2. Install peer dependencies:
   - `@mui/material`
   - `@mui/icons-material`
   - `react-dropzone`
   - `typescript`, `@types/react`, `@types/react-dom`
3. Use `<VideoUploader />` in your React app.

## Customization
- You can replace the mock upload API in `useChunkedUpload.ts` with your backend logic.
- All UI is based on Material UI and can be easily restyled.