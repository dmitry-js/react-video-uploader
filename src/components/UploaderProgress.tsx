import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { bytesInMb, getFileDescription, UPLOADER_SIZE_UNIT } from '../utils/uploader';

export interface UploaderProgressProps {
  progress: number;
  loaded: number;
  fileSize?: number;
}

const UploaderProgress: React.FC<UploaderProgressProps> = ({ progress, loaded, fileSize = 0 }) => {
  if (!progress) return null;

  const fileUnit = fileSize < bytesInMb ? UPLOADER_SIZE_UNIT.kb : UPLOADER_SIZE_UNIT.mb;
  const loadedDescription = getFileDescription({
    accept: [],
    size: { value: loaded, unit: fileUnit },
  });
  const fileSizeDescription = getFileDescription({
    accept: [],
    size: { value: fileSize, unit: fileUnit },
  });

  const loadedSize = parseFloat(loadedDescription.size) > parseFloat(fileSizeDescription.size)
    ? fileSizeDescription.size
    : loadedDescription.size;

  return (
    <Box display="flex" width="100%" alignItems="center">
      <LinearProgress variant="determinate" value={progress} sx={{ flexGrow: 1 }} />
      <Typography paddingLeft={2}>
        {`${loadedSize} / ${fileSizeDescription.size}`}
      </Typography>
    </Box>
  );
};

export default UploaderProgress; 