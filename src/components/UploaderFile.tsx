import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { convertFileSize } from '../utils/uploader';
import UploaderFileIcon from './UploaderFileIcon';

export interface UploaderFileProps {
  file: File & { path?: string; url?: string };
  status?: string;
}

const UploaderFile: React.FC<UploaderFileProps> = ({ file, status }) => (
  <Box
    component={Typography}
    color="text.secondary"
    variant="subtitle2"
    display="flex"
    alignItems="center"
    mt={1}
  >
    <UploaderFileIcon status={status} />
    {file.url ? (
      <Link href={file.url} target="_blank" rel="noopener">{file.path}</Link>
    ) : `${file.path} - ${convertFileSize(file.size)}`}
  </Box>
);

export default UploaderFile; 