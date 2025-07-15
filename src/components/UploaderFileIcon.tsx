import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { CircularProgress } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { UPLOADER_STATUS } from '../utils/constants';

export interface UploaderFileIconProps {
  status?: string;
}

const UploaderFileIcon: React.FC<UploaderFileIconProps> = ({ status }) => {
  switch (status) {
    case UPLOADER_STATUS.loading:
      return <CircularProgress size={20} />;
    case UPLOADER_STATUS.success:
      return <DoneIcon color="success" />;
    case UPLOADER_STATUS.error:
      return <ErrorIcon color="error" />;
    default:
      return null;
  }
};

export default UploaderFileIcon; 