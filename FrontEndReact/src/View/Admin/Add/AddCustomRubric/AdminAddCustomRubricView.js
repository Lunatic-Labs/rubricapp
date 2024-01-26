import React from "react";
import CustomDataTable from "../../../Components/CustomDataTable";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { parseCategoriesByRubrics } from "../../../../utility";

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

    const columns = [
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
        label: "VIEW",
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
                columns={columns}
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
                  padding: "10px",
                  width: "48%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: "20px",
                }}
              >
                <div className="d-flex mt-3 mb-3">
                  <h3>
                    Custom Rubric
                  </h3>
                </div>
                <p>{this.state.chosen_rubric}</p>
                <CustomDataTable
                  data={rubrics ? rubrics : []}
                  columns={columns}
                  options={options}
                />
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
              data={rubrics ? rubrics : []}
              columns={columns}
              options={options}
            />
          </div>
        </>
      </div>
    );
  }
}

export default AdminAddCustomRubricView;
