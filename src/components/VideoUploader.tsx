import React, { useState } from 'react';
import { Typography } from '@mui/material';
import Uploader from './Uploader';
import UploaderProgress from './UploaderProgress';
import { useChunkedUpload } from '../hooks/useChunkedUpload';
import { convertGbToBytes, UPLOADER_STATUS } from '../utils/uploader';

export interface VideoUploaderProps {
  maxSizeGb?: number;
  accept?: string[];
  onSuccess?: (info: { file: File; uploadId: string }) => void;
  onError?: (error: unknown) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  maxSizeGb = 15,
  accept = ['.mp4', '.mov', '.avi'],
  onSuccess,
  onError,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const { status, progress, loaded, upload } = useChunkedUpload({
    onSuccess: (info) => {
      setFiles([{ ...info.file, path: info.file.name } as File]);
      setUploadFile(null);
      if (onSuccess) onSuccess(info);
    },
    onError,
  });

  const handleLoad = (file: File) => {
    setFiles([{ ...file, path: file.name } as File]);
    setUploadFile(file);
    upload(file);
  };

  return (
    <>
      <Uploader
        accept={accept}
        maxSize={convertGbToBytes(maxSizeGb)}
        onLoad={handleLoad}
        status={status}
        files={files}
      />
      <UploaderProgress progress={progress} loaded={loaded} fileSize={uploadFile?.size} />
      {status === UPLOADER_STATUS.error && (
        <Typography color="error" sx={{ mt: 1 }}>
          Upload failed. Please try again.
        </Typography>
      )}
    </>
  );
};

export default VideoUploader; 