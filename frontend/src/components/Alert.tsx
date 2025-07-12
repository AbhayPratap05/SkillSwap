import { Alert as MuiAlert, Snackbar } from '@mui/material';
import type { AlertProps as MuiAlertProps } from '@mui/material';

interface AlertProps extends Omit<MuiAlertProps, 'onClose'> {
  open: boolean;
  message: string;
  onClose: () => void;
  autoHideDuration?: number;
}

const Alert = ({
  open,
  message,
  onClose,
  autoHideDuration = 6000,
  severity = 'info',
  ...props
}: AlertProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={severity}
        {...props}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert; 