/**
 * Lightweight, controlled checkbox list for picking many items (e.g. inside a dialog).
 * The parent owns `selectedIds`; this component only reports changes through `onChange`.
 * Reach for CustomDataTable instead when you need sorting, filtering or paging.
 *
 **/

import { ReactNode } from "react";
import {
	Box,
	List,
	Checkbox,
	ListItem,
	ListItemText,
	ListItemIcon,
	ListItemButton,
} from "@mui/material";

interface CustomCheckboxListProps<T> {
	/** Items to show. */
	items: T[];
	/** Returns a unique id for an Item. */
	getId: (item: T) => string | number;
	/** Returns the main text/node show for an item. */
	getPrimary: (item: T) => ReactNode;
	/** Ids of the currently checked items. */
	selectedIds: (string | number)[];
	/** Called with teh full new selection whenever an item is toggled. */
	onChange: (selectedIds: (string | number)[]) => void;
	/** Height at which the list starts scrolling. Default is 320. */
	maxHeight?: number | string | undefined;
}

/**
 * Scrollable list of items with a checkbox each and a "Select all" row on top.
 *
 * Clicking anywhere on a row toggles it. "Select all" shows a dash when only some
 * items are selected and clears the selection when every item already is.
 *
 * @param items - Items to show.
 * @param getId - Unique id for an item.
 * @param getPrimary - Main text for an item.
 * @param selectedIds - Currently checked ids.
 * @param onChange - Receives the new selection on every toggle.
 * @param maxHeight - Scroll height of the item list. Defaults to 320.
 */
function CustomCheckboxList<T>({
	items,
	getId,
	getPrimary,
	selectedIds,
	onChange,
	maxHeight = 320,
}: CustomCheckboxListProps<T>) {
	const allIds = items.map(getId);
	const selectedCount = allIds.filter((id) =>
		selectedIds.includes(id),
	).length;
	const allSelected = allIds.length > 0 && selectedCount === allIds.length;
	const someSelected = selectedCount > 0 && !allSelected;

	const toggleItem = (id: string | number) => {
		onChange(
			selectedIds.includes(id)
				? selectedIds.filter((selectedId) => selectedId !== id)
				: [...selectedIds, id],
		);
	};

	const toggleAll = () => {
		onChange(allSelected ? [] : allIds);
	};

	return (
		<Box>
			<ListItemButton dense onClick={toggleAll}>
				<ListItemIcon>
					<Checkbox
						edge="start"
						checked={allSelected}
						indeterminate={someSelected}
						disableRipple
						tabIndex={-1}
					/>
				</ListItemIcon>
				<ListItemText
					primary="Select all"
					secondary={`${selectedCount} of ${allIds.length} selected`}
				/>
			</ListItemButton>
			<List dense disablePadding sx={{ maxHeight, overflowY: "auto" }}>
				{items.map((item) => {
					const id = getId(item);
					return (
						<ListItem key={id} disablePadding>
							<ListItemButton onClick={() => toggleItem(id)}>
								<ListItemIcon>
									<Checkbox
										edge="start"
										checked={selectedIds.includes(id)}
										disableRipple
										tabIndex={-1}
									/>
								</ListItemIcon>
								<ListItemText primary={getPrimary(item)} />
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>
		</Box>
	);
}

export default CustomCheckboxList;
