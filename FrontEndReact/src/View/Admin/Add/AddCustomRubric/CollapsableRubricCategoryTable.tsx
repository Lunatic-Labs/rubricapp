import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Card, Collapse, IconButton, Box, Paper, Stack, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { createTheme, ThemeProvider } from '@mui/material';
import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Rubric } from "../../../../types/Rubric";
import { Category } from "../../../../types/Category";

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

interface CollapsableRubricCategoryTableProps {
    categories: Category[];
    rubrics: Rubric[];
    onCategorySelect?: (categoryId: number, isSelected: boolean) => void;
    readOnly: boolean;
    showEditButton?: boolean;
    selectedCategories?: Category[];
    navbar?: any;
}

const CollapsableRubricCategoryTable = ({
  categories,
  rubrics,
  onCategorySelect,
  readOnly,
  showEditButton,
  selectedCategories,
  navbar
}: CollapsableRubricCategoryTableProps) => {

  // NOTE: Manage whether the rubric was clicked or not
  const [openRubric, setOpenRubric] = useState<number | null>(null);

  const handleRubricClick = (rubricId: number) => {
    setOpenRubric(openRubric === rubricId ? null : rubricId);
  };
  
  // NOTE: Manage whether the category was clicked or not
  const [checkedCategories, setCheckedCategories] = useState(
    readOnly ? [] : (selectedCategories ?? []).map((category: Category) => category.category_id)
  );

  const handleCheckboxChange = (categoryId: number) => {
    const isChecked = checkedCategories.includes(categoryId);

    if (isChecked) {
      setCheckedCategories(
        checkedCategories.filter((id: number) => id !== categoryId),
      );

      // Call onCategorySelect with isSelected set to false
      onCategorySelect?.(categoryId, false);

    } else {
      setCheckedCategories([...checkedCategories, categoryId]);

      // Call onCategorySelect with isSelected set to true
      onCategorySelect?.(categoryId, true);
    }
  };

  // Handle keyboard events for the chevron button
  const handleChevronKeyDown = (event: React.KeyboardEvent, rubricId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation(); // Prevent the TableRow click event
      handleRubricClick(rubricId);
    }
  };

  // Handle chevron click separately from row click
  const handleChevronClick = (event: React.MouseEvent, rubricId: number) => {
    event.stopPropagation(); // Prevent the TableRow click event
    handleRubricClick(rubricId);
  };

  // The read-only "My Custom Rubrics" list (showEditButton) is shown as
  // cards — matching the paused native MobileApp's screen — rather than the
  // compact checkbox-selection table used when this component is embedded
  // in the Edit Rubric form's category picker.
  if (showEditButton) {
    return (
      <Stack spacing={1.5} data-testid="my-custom-rubrics-card-list">
        {rubrics.length === 0 ? (
          <Typography sx={{ color: 'var(--table-text)' }}>No Custom Rubrics Found</Typography>
        ) : (
          rubrics.map((rubric: Rubric) => {
            const rubricId = rubric["rubric_id"];
            const categoryCount = categories.filter(
              (category: Category) => category["rubric_id"] === rubricId,
            ).length;
            const isOpen = openRubric === rubricId;

            return (
              <Paper
                key={rubricId}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  backgroundColor: 'var(--light_grey_ADA)',
                  boxShadow: '0 0 0.3em var(--box-shadow)',
                }}
              >
                <Box
                  onClick={() => handleRubricClick(rubricId)}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                  }}
                >
                  <Box>
                    <Typography sx={{ color: '#2E8BEF', fontWeight: 700, fontSize: '1.1rem' }}>
                      {rubric["rubric_name"]}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-color-secondary)' }}>
                      {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {showEditButton && (
                      <Button
                        variant="contained"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                          event.stopPropagation(); // Prevent the card's own click (expand/collapse)
                          navbar.setAddCustomRubric(false);
                          navbar.setSelectedRubricId(rubricId);
                        }}
                        className="primary-color white-text-button"
                        sx={{ borderRadius: '10px', minWidth: '70px', fontSize: '14px' }}
                        data-testid="my-custom-rubrics-edit-custom-rubric-button"
                      >
                        Edit
                      </Button>
                    )}
                    <IconButton
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleChevronClick(event, rubricId)}
                      onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => handleChevronKeyDown(event, rubricId)}
                      aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${rubric["rubric_name"]} categories`}
                      aria-expanded={isOpen}
                      tabIndex={0}
                      size="small"
                    >
                      {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </Box>
                </Box>

                <Collapse in={isOpen} timeout="auto" unmountOnExit data-testid="rubric-category-icon">
                  <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                    {categories
                      .filter((category: Category) => category["rubric_id"] === rubricId)
                      .map((category: Category) => (
                        <Box
                          key={category["category_id"]}
                          data-testid="rubric-category-names"
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 1,
                            backgroundColor: 'var(--table-odd-row)',
                            borderRadius: '8px',
                            px: 1.5,
                            py: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ color: 'var(--table-text)' }}>
                            {category["category_name"]}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'var(--text-color-secondary)' }}>
                            {category["default_rubric"] ? category["default_rubric"] : "N/A"}
                          </Typography>
                        </Box>
                      ))}
                  </Stack>
                </Collapse>
              </Paper>
            );
          })
        )}
      </Stack>
    );
  }

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
              rubrics.map((rubric: Rubric) => <React.Fragment key={rubric["rubric_id"]}>
                <TableRow onClick={() => handleRubricClick(rubric["rubric_id"])}>
                  <TableCell>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>{rubric["rubric_name"]}</span>
                        <IconButton
                          onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleChevronClick(event, rubric["rubric_id"])}
                          onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => handleChevronKeyDown(event, rubric["rubric_id"])}
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
                      </div>
                      
                      {showEditButton && (
                        <Button
                          variant="contained"
                          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation(); // Prevent row click
                            navbar.setAddCustomRubric(false)
                            navbar.setSelectedRubricId(rubric["rubric_id"]);
                          }}
                          className="white-text-button"
                          style={{
                            fontSize: '14px',
                            minWidth: '70px',
                            color: 'white',
                          }}
                          data-testid="my-custom-rubrics-edit-custom-rubric-button"
                        >Edit</Button>
                      )}
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
                      data-testid="rubric-category-icon"
                    >
                      <Table>
                        <TableBody>
                          {categories
                            .filter(
                              (category: Category) => category["rubric_id"] === rubric["rubric_id"],
                            )
                            .map((category: Category) => <TableRow key={category["category_id"]}>
                            <TableCell component="th" scope="row" data-testid="rubric-category-names">
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
                                    inputProps={{ "aria-label": `Select ${category["category_name"]}` }}
                                    data-testid="rubric-names-check-box"
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