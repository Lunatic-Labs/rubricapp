import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



export default function CategoryDropdown(props) {
  var categoryList = [];

  // Check if categories exists and is not empty to prevent null reference errors
  if (props.categories && props.categories.length > 0) {
    props.categories.map((category) => {

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


