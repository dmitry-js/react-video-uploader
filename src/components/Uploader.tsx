import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { getFileDescription, isExtensionValid, addUppercaseExtensions, UPLOADER_SIZE_UNIT } from '../utils/uploader';
import { StyledUploader, StyledUploaderAvatar } from '../styles/uploader';
import UploaderFile from './UploaderFile';

export interface UploaderProps {
  accept: string[];
  maxSize: number;
  onLoad: (file: File) => void;
  status?: string;
  files?: File[];
  showPreview?: boolean;
}

const Uploader: React.FC<UploaderProps> = ({
  accept,
  maxSize,
  onLoad,
  status,
  files = [],
  showPreview = true,
}) => {
  const [validFiles, setValidFiles] = useState<File[]>(files);
  const acceptList = addUppercaseExtensions(accept);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: acceptList.join(','),
    maxSize,
    onDrop: (dropFiles: File[]) => {
      const filteredFiles = dropFiles.filter(file => isExtensionValid({ accept: acceptList, file }));
      setValidFiles(filteredFiles);
      if (filteredFiles.length && onLoad) {
        onLoad(filteredFiles[0]);
      }
    },
  });

  useEffect(() => {
    if (!files.length) return;
    setValidFiles(files);
  }, [files]);

  const validFilesList = showPreview && validFiles.map(file => (
    <UploaderFile key={(file as any).path || file.name} file={file} status={status} />
  ));

  const hasValidFiles = !!validFiles.length;
  const isAcceptedValid = !!acceptedFiles.length && hasValidFiles;

  const { extensions, size } = getFileDescription({ accept: acceptList, size: { value: maxSize, unit: UPLOADER_SIZE_UNIT.gb } });

  return (
    <>
      <StyledUploader {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <StyledUploaderAvatar>
          <UploadFileIcon color="primary" />
        </StyledUploaderAvatar>
        <Typography gutterBottom>
          Drag & drop a video file here, or click to select
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Allowed: {extensions}, up to {size}
        </Typography>
      </StyledUploader>
      {hasValidFiles && validFilesList}
      {!isAcceptedValid && !!acceptedFiles.length && (
        <Typography color="error" variant="subtitle2">Invalid file type or size</Typography>
      )}
    </>
  );
};

export default Uploader; 