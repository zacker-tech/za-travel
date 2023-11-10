import { APP_NAME } from '@config/constants';
import { Box, Typography } from '@mui/material';

function LogoIcon() {
  return (
    <svg
      width="46"
      height="46"
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.1882 17.4784L12.7333 1H19.0314L31.4549 17.4784M21.1882 17.4784H31.4549M21.1882 17.4784H12.3419M21.1882 17.4784H12.7333M31.4549 17.4784C41.3937 17.4784 45 21 45 22.8274M45 22.8274C31.2536 23.0288 3 24 2.55294 22.8274M45 22.8274C45 24.5 41.3939 28.5469 31.4549 28.5216M12.7333 17.4784H12.3419M12.7333 17.4784C12.6115 17.4784 12.4806 17.4803 12.3419 17.4784M1 17.4784V7.81569H5.14118C5.57255 8.64967 6.83216 11.1286 8.41961 14.3725C9.82028 17.2348 11.3016 17.4641 12.3419 17.4784M1 17.4784C1.11503 19.0601 2.16807 21.818 2.55294 22.8274M1 17.4784H12.3419M2.55294 22.8274C4.89961 27.1067 9.22484 28.4065 11.0941 28.5216H21.1882M31.4549 28.5216C23 28.5 21.5312 28.5216 21.1882 28.5216M31.4549 28.5216L19.0314 45H12.7333L21.1882 28.5216"
        stroke="#729E65"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function Logo() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: '100%',
        gap: 2.5,
      }}
    >
      <LogoIcon />
      <Typography variant="h4">{APP_NAME}</Typography>
    </Box>
  );
}
