import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Card, Collapse, } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import ErrorMessage from "../../../Error/ErrorMessage";
import { Grid } from "@mui/material";
import CustomDataTable from "../../../Components/CustomDataTable";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const CollapsableTableComponent = ({ categories, rubrics }) => {

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
    } else {
      setCheckedCategories([...checkedCategories, category_id]);
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
      selected_categories: this.props.chosen_category_json,
      category_map: this.props.category_map,
      isLoaded: null,
      errorMessage: null,
    };
  }

  componentDidUpdate() {
    if (this.state.isLoaded === true && this.state.errorMessage === null) {
      this.props.navbar.confirmCreateResource("AssessmentTask");
    }
  }

  render() {
    const { rubrics, categories } = this.props;

    const rubricTablecolumns = [
      {
        name: "rubric_name",
        label: "Rubric Name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "category_total",
        label: "Category Total",
        options: {
          filter: true,
          align: "center",
          customBodyRender: (category_total) => {
            return <p>{category_total} Categories</p>;
          },
        },
      },
      {
        name: "rubric_id",
        label: "View",
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
          customBodyRender: (rubric_id) => {
            if (rubric_id && categories) {
              return (
                <button
                  className="btn btn-primary"
                  onClick={() => this.handleViewRubric(rubric_id)}
                >
                  View
                </button>
              );
            }
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

    return (
      <>
        {this.state.isLoaded && this.state.errorMessage && (
          <ErrorMessage errorMessage={this.state.errorMessage} />
        )}
        <div>
          <h2
            style={{
              borderBottom: "1px solid #D9D9D9",
              paddingTop: "16px",
              textAlign: "left",
              bold: true,
            }}
          >
            Customize Your Rubric
          </h2>

          <Grid container spacing={6.5}>
            <Grid item xs={6}>
              <h3 className="d-flex mb-3">Rubrics</h3>
              <CollapsableTableComponent
                categories={categories}
                rubrics={rubrics}
              />
            </Grid>
            <Grid item xs={6}>
              <h3 className="d-flex mb-3">Selected Categories</h3>
              <CustomDataTable
                data={rubrics ? rubrics : []}
                columns={rubricTablecolumns}
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
