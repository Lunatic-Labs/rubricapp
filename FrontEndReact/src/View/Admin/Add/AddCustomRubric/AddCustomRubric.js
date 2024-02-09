import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Card, Collapse, IconButton } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid } from "@mui/material";
import ErrorMessage from "../../../Error/ErrorMessage";
import CustomDataTable from "../../../Components/CustomDataTable";
import CustomButton from "./Components/CustomButton";

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

const CollapsableTableComponent = ({ categories, rubrics, onCategorySelect }) => {

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
class AddCustomRubric extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chosen_rubric: null,
      selected_categories: {},
      category_map: {},
      isLoaded: null,
      errorMessage: null,
    };
  }

  componentDidUpdate() {
    if (this.state.isLoaded === true && this.state.errorMessage === null) {
      this.props.navbar.confirmCreateResource("AssessmentTask");
    }
  }

  handleCategorySelect = (category_id, isSelected) => {
    const selectedCategories = {...this.state.selected_categories };
    if (isSelected) {
      selectedCategories[category_id] = true;
    } else {
      delete selectedCategories[category_id];
    }
    this.setState({ selected_categories: selectedCategories });
  };

  render() {
    const { rubrics, categories } = this.props;
    const { selected_categories, category_map } = this.state;

    // NOTE: May be moved outside of the render function
    const categoryTableColumnsRemove = [
      {
        name: "category_name",
        label: "Category",
        options: {
          filter: true,
          align: "center",
          customBodyRender: (category_name) => {
            return <p>{category_name}</p>;
          },
        },
      },
      {
        name: "rubric_name",
        label: "Rubric",
        options: {
          align: "center",
          customBodyRender: (rubric_name) => {
            return <p>{rubric_name}</p>;
          },
        },
      },
      {
        name: "category_id",
        label: "Remove",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => {
            return {
              align: "center",
              width: "100px",
              className: "button-column-alignment",
            };
          },
          setCellProps: () => {
            return {
              align: "center",
              width: "100px",
              className: "button-column-alignment",
            };
          },
          customBodyRender: (category_id) => {
            return (
              <IconButton
                id=""
                onClick={() => {
                  this.remove_category(category_id);
                }}
              >
                <RemoveCircleIcon sx={{ color: "black" }} />
              </IconButton>
            );
          },
        },
      },
    ];

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "vertical",
      tableBodyMaxHeight: "21rem",
      search: false,
      filter: false,
      viewColumns: false,
    };

    var picked_categories = [];

    Object.keys(this.state.selected_categories).map((category_id) => {
      if(this.state.selected_categories[category_id]) {
        picked_categories = [...picked_categories, this.state.category_map[category_id]];
      }

      return category_id;
    });


    return (
      <>
        {this.state.isLoaded && this.state.errorMessage && (
          <ErrorMessage errorMessage={this.state.errorMessage} />
        )}
        <div>
          <Grid container spacing={10}>
            <Grid item xs={6}>
              <h2
                style={{
                  borderBottom: "1px solid #D9D9D9",
                  paddingTop: "16px",
                  paddingBottom: "16px",
                  textAlign: "left",
                  bold: true,
                }}
              >
                Customize Your Rubric
              </h2>
            </Grid>
            <Grid item xs={6} container justifyContent="flex-end">
              <CustomButton label="Create Rubric" isOutlined={false} onClick={() => {this.handleCreateRubric(picked_categories)}}/>
            </Grid>
          </Grid>

          {/* NOTE: Displays Tables */}
          <Grid container spacing={6.5}>
            <Grid item xs={6}>
              <h3 className="d-flex mb-3">Rubrics</h3>
              <CollapsableTableComponent
                categories={categories}
                rubrics={rubrics}
                onCategorySelect={this.handleCategorySelect}
              />
            </Grid>
            <Grid item xs={6}>
              <h3 className="d-flex mb-3">Selected Categories</h3>
              <CustomDataTable
                data={categories ? Object.keys(selected_categories).map(category_id => ({
                  category_id,
                  category_name: category_map[category_id] // Retrieve category name from category_map
                })) : []}
                columns={categoryTableColumnsRemove}
                options={options}
              />
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}

export default AddCustomRubric;
