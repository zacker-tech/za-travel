import dayjs from 'dayjs';
import { type Control, Controller, type Validate } from 'react-hook-form';

import type { SxProps, Theme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, unknown>;
  name: string;
  label: string;
  fullWidth?: boolean;
  requireErrorText?: string;
  maxDate?: Date | null;
  minDate?: Date | null;
  validate?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Validate<any, any> | Record<string, Validate<any, any>> | undefined;
  sx?: SxProps<Theme>;
}

export default function DateSelectInput({
  control,
  name,
  requireErrorText,
  label,
  maxDate,
  minDate,
  fullWidth,
  validate,
  sx,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: requireErrorText, validate }}
      render={({ field: { ref, ...field }, fieldState }) => (
        <DatePicker
          label={label}
          slotProps={{
            textField: {
              inputRef: ref,
              variant: 'standard',
              helperText: fieldState.error?.message,
              error: Boolean(fieldState.error),
            },
            inputAdornment: { position: 'start' },
          }}
          {...field}
          onChange={(newValue) => {
            let value;
            try {
              value = dayjs(newValue).toISOString();
            } catch (_) {
              /* empty */
            }
            field.onChange(value ?? newValue);
          }}
          sx={{
            width: fullWidth ? '100%' : 'auto',
            '& .MuiSvgIcon-root': { ml: 0.1 },
            ...sx,
          }}
          value={field.value ? dayjs(field.value) : null}
          maxDate={maxDate ? dayjs(maxDate) : null}
          minDate={minDate ? dayjs(minDate) : null}
        />
      )}
    />
  );
}
