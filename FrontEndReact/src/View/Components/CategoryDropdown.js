import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function CategoryDropdown(props) {
    var categoryList = [];

    props.categories.map((categories) => {
        return categoryList.push(
          <MenuItem
            key={
              categories["category_id"]
            }
            value={
              categories["category_id"]
            }
          >
            {categories["category_name"]}
          </MenuItem>
        )
      });

    return (
        <FormControl sx={{ m: 3, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Category</InputLabel>

            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={props.chosenCategoryId}
              onChange={props.setChosenCategoryId}
              disabled={props.disabled}
              autoWidth
              label="Category"
            >
              { categoryList }
            </Select>
        </FormControl>
    )
}