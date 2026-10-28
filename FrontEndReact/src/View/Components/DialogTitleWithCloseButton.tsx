/**
 * Centered MUI DialogTitle with a close (X) button pinned to the right.
 * Shared by dialogs that need a standard header; the parent owns
 * open/close state and just passes `onClose`.
 **/

import { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, IconButton } from "@mui/material";

interface DialogTitleWithCloseProps {
	children: ReactNode;
	onClose: () => void;
	disabled?: boolean | undefined;
	testId?: string | undefined;
}

/**
 * Dialog header with a centered title and a close (X) button pinned to the right.
 *
 * @param children - Title content; usually a string, but any node works.
 * @param onClose  - Called when the close button is clicked. The parent owns the
 *                  open state, so it should flip it here.
 * @param disabled - Disables the close button, e.g. while a request is in flight.
 * @param testId   - `data-testid` for the close button. Defaults to "dialog-close".
 */
function DialogTitleWithClose({
	children,
	onClose,
	disabled = false,
	testId = "dialog-close",
}: DialogTitleWithCloseProps) {
	return (
		<DialogTitle sx={{ position: "relative", textAlign: "center", px: 6 }}>
			{children}
			<IconButton
				aria-label="Close"
				onClick={onClose}
				disabled={disabled}
				data-testid={testId}
				sx={{
					position: "absolute",
					right: (t) => t.spacing(1),
					top: "50%",
					transform: "translateY(-50%)",
				}}
			>
				<CloseIcon />
			</IconButton>
		</DialogTitle>
	);
}

export default DialogTitleWithClose;
