import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Card, Collapse } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState } from "react";
import  Button from "@mui/material/Button";



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

const CollapsableRubricCategoryTable = ({ categories, rubrics, onCategorySelect, readOnly, showEditButton, showDeleteButton }) => {

  // NOTE: Manage whether the rubric was clicked or not
  const [openRubric, setOpenRubric] = useState(null);

  const handleRubricClick = (rubricId) => {
    setOpenRubric(openRubric === rubricId ? null : rubricId);
  };

  // NOTE: Manage whether the category was clicked or not
  const [checkedCategories, setCheckedCategories] = useState([]);

  const handleCheckboxChange = (categoryId) => {
    const isChecked = checkedCategories.includes(categoryId);

    if (isChecked) {
      setCheckedCategories(
        checkedCategories.filter((id) => id !== categoryId),
      );

      // Call onCategorySelect with isSelected set to false
      onCategorySelect(categoryId, false);

    } else {
      setCheckedCategories([...checkedCategories, categoryId]);

      // Call onCategorySelect with isSelected set to true
      onCategorySelect(categoryId, true);
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
            {rubrics.length === 0 ? (
              <TableRow>
                <TableCell>No Custom Rubrics Found</TableCell>
              </TableRow>
            ) : (
              rubrics.map((rubric) => (
                <React.Fragment key={rubric["rubric_id"]}>
                  <TableRow onClick={() => handleRubricClick(rubric["rubric_id"])}>
                    <TableCell>
                      {rubric["rubric_name"]}
                      {openRubric === rubric["rubric_id"] ? (
                        <KeyboardArrowUp />
                      ) : (
                          <KeyboardArrowDown />
                        )}
                        {showEditButton && (
                          <Button
                            variant="contained"
                            label="Edit Custom Rubric"
                            isOutlined={false}
                            // onClick={}
                            style={{
                              marginLeft: '330px',
                              marginRight: '15px',
                              fontSize: '14px',       
                              minWidth: '70px',
                              spacing: '80px'
                            }}
                            aria-label="myCustomRubricsEditCustomRubricButton"
                          >Edit</Button>
                        )}
                        {showDeleteButton && (
                          <Button
                            variant="contained"
                            label="Edit Custom Rubric"
                            isOutlined={false}
                            // onClick={}
                            aria-label="myCustomRubricsDeleteCustomRubricButton"
                          >Delete</Button>
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={openRubric === rubric["rubric_id"]}
                        timeout="auto"
                        unmountOnExit
                        aria-label="rubricCategoryIcon"
                      >
                        <Table>
                          <TableBody>
                            {categories
                              .filter(
                                (category) =>
                                  category["rubric_id"] === rubric["rubric_id"],
                              )
                              .map((category) => (
                                <TableRow key={category["category_id"]}>
                                  <TableCell component="th" scope="row" aria-label="rubricCategoryNames">
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: readOnly ? "space-around": "",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "row",
                                        }}
                                      >
                                        { !readOnly &&
                                          <Checkbox
                                            checked={checkedCategories.includes(
                                              category["category_id"],
                                            )}
                                          aria-label="rubricNamesCheckBox"
                                            onChange={() =>
                                              handleCheckboxChange(category["category_id"])
                                            }
                                          />
                                        }
                                        <p
                                          style={{
                                            marginTop: "1rem",
                                            minWidth: "10rem"
                                          }}
                                        >{category["category_name"]}</p>
                                      </div>

                                      { readOnly &&
                                        <p
                                          style={{
                                            marginTop: "1rem",
                                            minWidth: "10rem"
                                          }}
                                        >{category["default_rubric"] ? category["default_rubric"] : "N/A"}</p>
                                      }
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
            )))}
           </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
};

export default CollapsableRubricCategoryTable;