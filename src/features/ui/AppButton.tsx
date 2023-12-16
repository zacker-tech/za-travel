import LoadingButton from '@mui/lab/LoadingButton';
import { type SxProps, type Theme, Typography } from '@mui/material';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'text' | 'contained' | 'outlined';
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  LinkComponent?: React.ElementType;
  disabled?: boolean;
  href?: string;
  sx?: SxProps<Theme>;
}

export default function AppButton({
  type = 'button',
  variant = 'contained',
  fullWidth,
  loading,
  LinkComponent,
  href,
  children,
  endIcon,
  startIcon,
  disabled,
  sx,
  onClick,
}: Props) {
  return (
    <LoadingButton
      loading={loading}
      LinkComponent={LinkComponent}
      href={href}
      fullWidth={fullWidth}
      type={type}
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      disabled={disabled}
      sx={{
        borderRadius: 2,
        height: {
          xs: variant === 'text' ? 42 : 48,
          md: variant === 'text' ? 48 : 56,
        },
        textTransform: 'none',
        width: fullWidth ? '100%' : 'fit-content',
        ...sx,
      }}
    >
      <Typography component="span" variant="body2">
        {children}
      </Typography>
    </LoadingButton>
  );
}
