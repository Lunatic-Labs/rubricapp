import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import Switch, { SwitchProps } from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const FullColorGradentPill = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 72,
    height: 36,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 4,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(36px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundPosition: '100% 0',
          opacity: 1,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        border: '4px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey[100],
        ...theme.applyStyles('dark', {
          color: theme.palette.grey[600],
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.7,
        ...theme.applyStyles('dark', {
          opacity: 0.3,
        }),
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 28,
      height: 28,
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.35)',
    },
    '& .MuiSwitch-track': {
      borderRadius: 36 / 2,
      opacity: 1,
      backgroundImage: 'linear-gradient(90deg, #2E8BEF 0%, #ffffff 50%, #2E8BEF 100%)',
      backgroundSize: '200% 100%',
      backgroundPosition: '0 0',
      border: '1px solid #2E8BEF',
      boxSizing: 'border-box',
      transition: theme.transitions.create(['background-position'], {
        duration: 300,
      }),
      ...theme.applyStyles('dark', {
        backgroundImage: 'linear-gradient(90deg, #2E8BEF 0%, #39393D 50%, #2E8BEF 100%)',
      }),
    },
}));

type PillProps = SwitchProps & { leftOption:string; rightOption:string};

export default function FullColorGradentPillCustomFields({ leftOption, rightOption, ...switchProps }: PillProps) {
  return (
    <FormGroup>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Typography>{leftOption}</Typography>
        <FullColorGradentPill {...switchProps} />
        <Typography>{rightOption}</Typography>
      </Stack>
    </FormGroup>
  );
}
