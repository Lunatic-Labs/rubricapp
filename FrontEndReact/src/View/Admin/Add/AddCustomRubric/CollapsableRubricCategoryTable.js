import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Card, Collapse } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState } from "react";



// NOTE: Custom Theme for the Collapsible table
const customTheme = createTheme({
  components: {
    // NOTE: Style for the table head
    MuiTableCell: { 
      styleOverrides: {
        head: { 
          backgroundColor: "#A4C4F4", 
          padding: "23px",
        },
        root: {
          padding: "19px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "baseline",
          padding: "0.5rem",
        },
      },
    },
  },
});

const CollapsableRubricCategoryTable = ({ categories, rubrics, onCategorySelect }) => {

  // NOTE: Manage whether the rubric was clicked or not
  const [openRubric, setOpenRubric] = useState(null);

  const handleRubricClick = (rubric_id) => {
    setOpenRubric(openRubric === rubric_id ? null : rubric_id);
  };

  // NOTE: Manage whether the category was clicked or not
  const [checkedCategories, setCheckedCategories] = useState([]);

  const handleCheckboxChange = (category_id) => {
    const isChecked = checkedCategories.includes(category_id);

    if (isChecked) {
      setCheckedCategories(
        checkedCategories.filter((id) => id !== category_id),
      );

      // Call onCategorySelect with isSelected set to false
      onCategorySelect(category_id, false);

    } else {
      setCheckedCategories([...checkedCategories, category_id]);

      // Call onCategorySelect with isSelected set to true
      onCategorySelect(category_id, true);
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rubric</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rubrics.map((rubric) => (
              <React.Fragment key={rubric.rubric_id}>
                <TableRow onClick={() => handleRubricClick(rubric.rubric_id)}>
                  <TableCell>
                    {rubric.rubric_name}
                    {openRubric === rubric.rubric_id ? (
                      <KeyboardArrowUp />
                    ) : (
                        <KeyboardArrowDown />
                      )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openRubric === rubric.rubric_id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Table>
                        <TableBody>
                          {categories
                            .filter(
                              (category) =>
                                category.rubric_id === rubric.rubric_id,
                            )
                            .map((category) => (
                              <TableRow key={category.category_id}>
                                <TableCell component="th" scope="row">
                                  <Checkbox
                                    checked={checkedCategories.includes(
                                      category.category_id,
                                    )}

                                    onChange={() =>
                                      handleCheckboxChange(category.category_id)
                                    }
                                  />
                                  {category.category_name}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
};

export default CollapsableRubricCategoryTable;