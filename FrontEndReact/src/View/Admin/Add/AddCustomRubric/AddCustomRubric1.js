import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import ErrorMessage from "../../../Error/ErrorMessage";
import { Grid } from "@mui/material";
import CustomDataTable from "../../../Components/CustomDataTable";

const CollapsableTableComponent = ({ categories, rubrics }) => {
  const [openRubric, setOpenRubric] = useState(null);

  const handleRubricClick = (rubricId) => {
    setOpenRubric(openRubric === rubricId ? null : rubricId);
  };

  return (
    <TableContainer component={Table}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rubric</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rubrics.map((rubric) => (
            <React.Fragment key={rubric.id}>
              <TableRow onClick={() => handleRubricClick(rubric.id)}>
                <TableCell>
                  {rubric.name}
                  {openRubric === rubric.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={openRubric === rubric.id} timeout="auto" unmountOnExit>
                    <Table>
                      <TableBody>
                        {categories
                          .filter((category) => category.rubricId === rubric.id)
                          .map((category) => (
                            <TableRow key={category.id}>
                              <TableCell component="th" scope="row">
                                {category.name}
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
  );
}
class AddCustomRubric extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chosen_rubric: null,
      selected_categories: this.props.chosen_category_json,
      category_map: this.props.category_map,
      isLoaded: null,
      errorMessage: null,
    }
  }

  render(){
    const { rubrics, categories } = this.props;
    var categories_by_rubric_id = {};

    const rubricTablecolumns = [
      {
        name: "rubric_name",
        label: "Rubric Name",
        options: {
          filter: true,
          sort: true,
        }
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
        {this.state.isLoaded && this.state.errorMessage && 
          <ErrorMessage
            errorMessage={this.state.errorMessage}
          />
        }
        <div>
          <h2
            style={{
              borderBottom: "1px solid #D9D9D9",
              paddingTop: "16px",
              textAlign: "left",
              bold: true
            }}>
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
              <h3 className="d-flex mb-3">Rubrics</h3>
              <CustomDataTable
                data={rubrics ? rubrics : []}
                columns={rubricTablecolumns}
                options={options}
              />
            </Grid>
          </Grid>

        </div>
      </>
    )
  }
}

export default AddCustomRubric;
