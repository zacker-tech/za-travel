import { Button, type SxProps, type Theme } from '@mui/material';

interface Props {
  isSmall: boolean;
  onClick: () => void;
  'aria-label': string;
  children: JSX.Element;
  sx?: SxProps<Theme>;
}

export default function AppIconButton(props: Props) {
  return (
    <Button
      onClick={props.onClick}
      aria-label={props['aria-label']}
      variant="outlined"
      sx={{
        borderRadius: 2,
        minWidth: 'auto',
        width: props.isSmall ? 34 : 58,
        height: props.isSmall ? 34 : 58,
        ...props.sx,
      }}
    >
      {props.children}
    </Button>
  );
}
