// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Card, Collapse, IconButton } from "@mui/material";
// @ts-expect-error TS(2307): Cannot find module '@mui/icons-material' or its co... Remove this comment to see the full error message
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
// @ts-expect-error TS(2307): Cannot find module '@mui/material/styles' or its c... Remove this comment to see the full error message
import { createTheme, ThemeProvider } from '@mui/material/styles';
// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { useState } from "react";
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Button' or its c... Remove this comment to see the full error message
import Button from "@mui/material/Button";

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

const CollapsableRubricCategoryTable = ({
  categories,
  rubrics,
  onCategorySelect,
  readOnly,
  showEditButton,
  selectedCategories,
  navbar
}: any) => {

  // NOTE: Manage whether the rubric was clicked or not
  const [openRubric, setOpenRubric] = useState(null);

  const handleRubricClick = (rubricId: any) => {
    setOpenRubric(openRubric === rubricId ? null : rubricId);
  };
  
  // NOTE: Manage whether the category was clicked or not
  const [checkedCategories, setCheckedCategories] = useState(
    readOnly ? [] : selectedCategories.map((category: any) => category.category_id)
  );

  const handleCheckboxChange = (categoryId: any) => {
    const isChecked = checkedCategories.includes(categoryId);

    if (isChecked) {
      setCheckedCategories(
        checkedCategories.filter((id: any) => id !== categoryId),
      );

      // Call onCategorySelect with isSelected set to false
      onCategorySelect(categoryId, false);

    } else {
      setCheckedCategories([...checkedCategories, categoryId]);

      // Call onCategorySelect with isSelected set to true
      onCategorySelect(categoryId, true);
    }
  };

  // Handle keyboard events for the chevron button
  const handleChevronKeyDown = (event: any, rubricId: any) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation(); // Prevent the TableRow click event
      handleRubricClick(rubricId);
    }
  };

  // Handle chevron click separately from row click
  const handleChevronClick = (event: any, rubricId: any) => {
    event.stopPropagation(); // Prevent the TableRow click event
    handleRubricClick(rubricId);
  };

  return (
    // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
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
              rubrics.map((rubric: any) => <React.Fragment key={rubric["rubric_id"]}>
                <TableRow onClick={() => handleRubricClick(rubric["rubric_id"])}>
                  <TableCell>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between' 
                    }}>
                      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        <span>{rubric["rubric_name"]}</span>
                        <IconButton
                          onClick={(event: any) => handleChevronClick(event, rubric["rubric_id"])}
                          onKeyDown={(event: any) => handleChevronKeyDown(event, rubric["rubric_id"])}
                          aria-label={`${openRubric === rubric["rubric_id"] ? 'Collapse' : 'Expand'} ${rubric["rubric_name"]} categories`}
                          aria-expanded={openRubric === rubric["rubric_id"]}
                          tabIndex={0}
                          size="small"
                          sx={{
                            marginLeft: 1,
                            '&:focus': {
                              outline: '2px solid #1976d2',
                              outlineOffset: '2px',
                            },
                            '&:focus-visible': {
                              outline: '2px solid #1976d2',
                              outlineOffset: '2px',
                            }
                          }}
                        >
                          {openRubric === rubric["rubric_id"] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                      </div>
                      
                      {showEditButton && (
                        <Button
                          variant="contained"
                          label="Edit Custom Rubric"
                          isOutlined={false}
                          onClick={(event: any) => {
                            event.stopPropagation(); // Prevent row click
                            navbar.rubricId = rubric["rubric_id"];
                            navbar.setAddCustomRubric(false)
                          }}
                          style={{
                            fontSize: '14px',       
                            minWidth: '70px',
                          }}
                          aria-label="myCustomRubricsEditCustomRubricButton"
                        >Edit</Button>
                      )}
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    </div>
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
                              (category: any) => category["rubric_id"] === rubric["rubric_id"],
                            )
                            .map((category: any) => <TableRow key={category["category_id"]}>
                            <TableCell component="th" scope="row" aria-label="rubricCategoryNames">
                              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: readOnly ? "space-around": "",
                                }}
                              >
                                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
                                  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                  <p
                                    style={{
                                      marginTop: "1rem",
                                      minWidth: "10rem"
                                    }}
                                  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                  >{category["category_name"]}</p>
                                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                </div>

                                { readOnly &&
                                  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                  <p
                                    style={{
                                      marginTop: "1rem",
                                      minWidth: "10rem"
                                    }}
                                  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                  >{category["default_rubric"] ? category["default_rubric"] : "N/A"}</p>
                                }
                              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                              </div>
                            </TableCell>
                          </TableRow>)}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>))}
           </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
};

export default CollapsableRubricCategoryTable;