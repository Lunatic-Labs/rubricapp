// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import * as React from 'react';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/InputLabel' or i... Remove this comment to see the full error message
import InputLabel from '@mui/material/InputLabel';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/MenuItem' or its... Remove this comment to see the full error message
import MenuItem from '@mui/material/MenuItem';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/FormControl' or ... Remove this comment to see the full error message
import FormControl from '@mui/material/FormControl';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Select' or its c... Remove this comment to see the full error message
import Select from '@mui/material/Select';



export default function CategoryDropdown(props: any) {
  var categoryList = [];

  // Check if categories exists and is not empty to prevent null reference errors
  if (props.categories && props.categories.length > 0) {
    props.categories.map((category: any) => {

    return categoryList.push(
      <MenuItem 
        key={category} 
        value={category}
        sx={{
          // sx -> system extensions (writes css directly as Java Script).
          // The code here handles the 'text overflow' when re-sizing the page and/or creating a very long
          // assessment task name.
          //
          // The 'nowrap' prevents the text from wrapping around (more than 1 line of text)
          // The 'ellipsis' ends the truncated text with ...
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%'
        }}
      >
        {category}
      </MenuItem>
    )
  });
  } else {
    // Display placeholder when no categories are available
    categoryList.push(
      // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
      <MenuItem key="no-categories" value="" disabled>
        No categories available
      </MenuItem>
    );
  }

  return (
    <FormControl 
    // controlls the way the 'dropdown' is displayed.
      sx={{ 
        m: 3,           // margin
        width: '95%'    // width
      }}
    >
        <InputLabel id="demo-simple-select-autowidth-label">Category</InputLabel>

        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={props.chosenCategoryId}
          onChange={props.setChosenCategoryId}
          disabled={props.disabled}
          autoWidth={"false"}
          label="Category"
          sx={{
          // This handles the text overflow
          '& .MuiSelect-select': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }}
        >
          { categoryList }
        </Select>
    </FormControl>
  )
}

//testing//


