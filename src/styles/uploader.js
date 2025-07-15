import { styled } from '@mui/material/styles';
import { Avatar, Box } from '@mui/material';
import { blue, grey } from '@mui/material/colors';

export const StyledUploader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  backgroundColor: grey[100],
  border: `1px dashed ${grey[300]}`,
  cursor: 'pointer',
}));

export const StyledUploaderAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: blue[100],
  marginBottom: theme.spacing(1),
})); 