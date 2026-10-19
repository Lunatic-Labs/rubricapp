/**
 * Two-option toggle: a pill-shaped MUI Switch with a label on each side.
 *
 * - FullColorGradentPill: the styled Switch. Its track is a blue gradient that
 *   cross-fades to the reverse gradient when checked (light and dark variants).
 * - FullColorGradentPillCustomFields (default export): wraps the pill between two
 *   Typography labels. leftOption is the unchecked value and rightOption the
 *   checked value. All other props are standard SwitchProps (checked, onChange,
 *   disabled, ...) and pass through to the Switch.
 *
 * Used by ManageAdminAccessDialog for the Demote/Promote choice.
*/

import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import Switch, { SwitchProps } from "@mui/material/Switch";

const FullColorGradentPill = styled((props: SwitchProps) => (
	<Switch
		focusVisibleClassName=".Mui-focusVisible"
		disableRipple
		{...props}
	/>
))(({ theme }) => ({
	width: 72,
	height: 36,
	padding: 0,
	"& .MuiSwitch-switchBase": {
		padding: 0,
		margin: 4,
		transition: theme.transitions.create(["transform", "color"], {
			duration: 300,
		}),
		"&.Mui-checked": {
			transform: "translateX(36px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				opacity: 1,
				"&::before": {
					opacity: 1,
				},
			},
			"&.Mui-disabled + .MuiSwitch-track": {
				opacity: 0.5,
			},
		},
		"&.Mui-focusVisible .MuiSwitch-thumb": {
			border: "4px solid #fff",
		},
		"&.Mui-disabled .MuiSwitch-thumb": {
			color: theme.palette.grey[100],
			...theme.applyStyles("dark", {
				color: theme.palette.grey[600],
			}),
		},
		"&.Mui-disabled + .MuiSwitch-track": {
			opacity: 0.7,
			...theme.applyStyles("dark", {
				opacity: 0.3,
			}),
		},
	},
	"& .MuiSwitch-thumb": {
		boxSizing: "border-box",
		width: 28,
		height: 28,
		boxShadow: "0 1px 4px rgba(0, 0, 0, 0.35)",
	},
	"& .MuiSwitch-track": {
		borderRadius: 36 / 2,
		opacity: 1,
		position: "relative",
		backgroundImage: "linear-gradient(90deg, #2E8BEF 0%, #ffffff 100%)",
		border: "1px solid #2E8BEF",
		boxSizing: "border-box",
		"&::before": {
			content: '""',
			position: "absolute",
			inset: 0,
			borderRadius: "inherit",
			backgroundImage: "linear-gradient(90deg, #ffffff 0%, #2E8BEF 100%)",
			opacity: 0,
			transition: theme.transitions.create(["opacity"], {
				duration: 300,
			}),
		},
		...theme.applyStyles("dark", {
			backgroundImage: "linear-gradient(90deg, #2E8BEF 0%, #39393D 100%)",
			"&::before": {
				backgroundImage:
					"linear-gradient(90deg, #39393D 0%, #2E8BEF 100%)",
			},
		}),
	},
}));

type PillProps = SwitchProps & { leftOption: string; rightOption: string };

/**
 * Two-option toggle: a gradient pill Switch with a text label on each side.
 *
 * @param props.leftOption - Label shown to the left of the pill (the default checked option).
 * @param props.rightOption - Label shown to the right of the pill (the unchecked option).
 * @param props.switchProps - Remaining SwitchProps (checked, onChange, disabled, ...), passed through to the Switch.
 * @returns A FormGroup containing the left label, the pill, and the right label in a centered row.
 */
export default function FullColorGradentPillCustomFields({
	leftOption,
	rightOption,
	...switchProps
}: PillProps) {
	return (
		<FormGroup>
			<Stack
				direction="row"
				spacing={1}
				sx={{ alignItems: "center", justifyContent: "center" }}
			>
				<Typography>{leftOption}</Typography>
				<FullColorGradentPill {...switchProps} />
				<Typography>{rightOption}</Typography>
			</Stack>
		</FormGroup>
	);
}
