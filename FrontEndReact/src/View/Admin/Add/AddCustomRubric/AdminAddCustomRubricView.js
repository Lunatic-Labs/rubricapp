import React from "react";
import CustomDataTable from "../../../Components/CustomDataTable";
import { IconButton, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { parseCategoriesByRubrics } from "../../../../utility";
import CustomButton from "./Components/CustomButton";

// TODO: Change the name of this file and component from AdminAddCustomRubricView to AddCustomRubricView!
// TODO: Also change the imported component name in AppState.js!

class AdminAddCustomRubricView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chosen_rubric: null
    }
  }

  render() {
    var rubrics = this.props.rubrics;
    var rubric_names = this.props.rubric_names;
    var categories = this.props.categories;
    var categories_by_rubric_id = parseCategoriesByRubrics(rubrics, categories);

    const rubricTablecolumns = [
      {
        name: "rubric_name",
        label: "Rubric",
        options: {
          filter: true,
          align: "center",
          customBodyRender: (rubric_name) => {
            return(
              <p>{rubric_name}</p>
            )
          }
        },
      },
      {
        name: "category_total",
        label: "Category Total",
        options: {
          filter: true,
          align: "center",
          customBodyRender: (category_total) => {
            return(
              <p>{category_total} Categories</p>
            )
          }
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
                <IconButton
                  id=""
                  onClick={() => {
                    this.setState({
                      chosen_rubric: rubric_id
                    })
                  }}
                >
                  <VisibilityIcon sx={{ color: "black" }} />
                </IconButton>
              );
            } else {
              return <p>{"N/A"}</p>;
            }
          },
        },
      },
    ];

    const categoryTableColumns = [
      {
        name: "category_name",
        label: "Category",
        options: {
          filter: true,
          align: "center",
          customBodyRender: (category_name) => {
            return(
              <p>{category_name}</p>
            )
          }
        },
      },
      {
        name: "rubric_name",
        label: "Rubric",
        options: {
          filter: true,
          align: "center",
          customBodyRender: (rubric_name) => {
            return(
              <p>{rubric_name}</p>
            )
          }
        },
      },
      {
        name: "rubric_id", // What should the name of this be?
        label: "Add",
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
                <IconButton
                  id=""
                  onClick={() => {
                    this.setState({
                      chosen_rubric: rubric_id
                    })
                  }}
                >
                  <AddCircleIcon sx={{ color: "black" }} />
                </IconButton>
              );
            } else {
              return <p>{"N/A"}</p>;
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

    // NOTE: Use this variable to pass to the MUIDataTable to display selected categories!
    var chosen_categories = this.state.chosen_rubric === null ? []: categories_by_rubric_id[this.state.chosen_rubric];

    console.log(chosen_categories);

    // NOTE: Use rubric_names to get the Rubric Name given the rubric_id!
    console.log(rubric_names);

    // NOTE: Pass the rubric_id you to get the Rubric Name!
    console.log(rubric_names[0]);

    return (
      <div style={{ backgroundColor: "#F8F8F8" }}>
        <>
          <h2
            style={{
              paddingTop: "16px",
              textAlign: "left",
              marginBottom: "20px",
              marginLeft: "20px",
              bold: true,
              borderBottom: '1px solid #D9D9D9',
            }}
          >
            Customize Your Rubric
          </h2>
          <div className="d-flex flex-row">
            <div
              style={{
                borderRadius: "10px",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "10px",
                width: "48%",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "20px",
              }}
            >
              {/* 
                  TODO: Will also need to work on the sizing of the table
              */}
              <div className="d-flex mt-3 mb-3">
                <h3>Rubrics</h3>
              </div>
              <CustomDataTable
                data={rubrics ? rubrics : []}
                columns={rubricTablecolumns}
                options={options}
              />
            </div>
            { this.state.rubric_id !== null &&
              <div
                style={{
                  borderRadius: "10px",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "50%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: "20px",
                  marginTop: "15px",
                }}
              >
                <div className="d-flex mt-3 mb-3">
                  <h3>
                    Custom Rubric
                  </h3>
                </div>
                <div
                  style={{
                    borderTop: '3px solid #4A89E8', 
                    border: '3px, 0px, 0px, 0px',
                    borderRadius: '10px', 
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    backgroundColor: "white",
                    marginBottom: "20px",
                    padding: "35px",
                    width: "100%",
                    gap: "20px"
                  }}
                >
                <div className="d-flex mt-3 mb-3"
                    style={{
                      gap: "56px"
                    }}
                >
                  <TextField
                    Rubric Name
                    id="Rubric Name"
                    label="Rubric Name"
                    style={{ width: "70%" }}
                  />

                  <CustomButton
                    label="Create Rubric"
                    isOutlined={false}
                  />
                </div>
                  <p>{this.state.chosen_rubric}</p>
                  <CustomDataTable
                    data={categories ? chosen_categories : []}
                    columns={categoryTableColumns}
                    options={options}
                  />
                </div>
              </div>
            }
          </div>
          <div
            style={{
              borderRadius: "10px",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              padding: "10px",
              width: "48%",
              marginBottom: "20px",
              marginLeft: "12px"
            }}
          >
            {/* 
                TODO: Will also need to work on the sizing of the table
            */}

            <div className="d-flex mt-3 mb-3">
              <h3>Categories</h3>
            </div>

            <CustomDataTable
              data={categories ? chosen_categories : []}
              columns={categoryTableColumns}
              options={options}
            />
          </div>
        </>
      </div>
    );
  }
}

export default AdminAddCustomRubricView;
