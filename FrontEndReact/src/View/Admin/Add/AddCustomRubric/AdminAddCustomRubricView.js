import React from "react";
import CustomDataTable from "../../../Components/CustomDataTable";
import { IconButton, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { genericResourcePOST, parseCategoriesByRubrics } from "../../../../utility";
import CustomButton from "./Components/CustomButton";
import Cookies from "universal-cookie";
import ErrorMessage from "../../../Error/ErrorMessage";

class AdminAddCustomRubricView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chosen_rubric: null,
      selected_categories: this.props.chosen_category_json,
      category_map: this.props.category_map,
      isLoaded: null,
      errorMessage: null,
    }

    this.add_category = (category_id) => {
      var updated_categories = this.state.selected_categories;

      updated_categories[category_id] = true;

      this.setState({
        selected_categories: updated_categories
      });
    }

    this.remove_category = (category_id) => {
      var updated_categories = this.state.selected_categories;

      updated_categories[category_id] = false;

      this.setState({
        selected_categories: updated_categories
      });
    }

  }

  handleCreateRubric = (picked_categories) => {
    var category_ids = [];
  
    for (var category_index = 0; category_index < picked_categories.length; category_index++) {
      category_ids = [...category_ids, picked_categories[category_index]["category_id"]];
    }

    if (document.getElementById("rubric_name_input").value === "") {
      this.setState({
        isLoaded: true,
        errorMessage: "Missing Rubric Name."
      });

      return;
    }

    if (document.getElementById("rubric_description_input").value === "") {
      this.setState({
        isLoaded: true,
        errorMessage: "Missing Rubric Description."
      });

      return;
    }

    if (category_ids.length === 0) {
      this.setState({
        isLoaded: true,
        errorMessage: "Missing categories, at least one category must be selected."
      });

      return;
    }

    var cookies = new Cookies();

    genericResourcePOST(
      `/rubric`,
      this,
      JSON.stringify({
        rubric: { 
              rubric_name: document.getElementById("rubric_name_input").value,
              rubric_description: document.getElementById("rubric_description_input").value, 
              owner: cookies.get('user')['user_id'],
        },

        categories: category_ids,
      })
    );
  };

  componentDidUpdate() {
    if (this.state.isLoaded === true && this.state.errorMessage === null) {
      this.props.navbar.confirmCreateResource("AssessmentTask");
    }
  }

  render() {
    var rubrics = this.props.rubrics;
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
            return <p>{rubric_name}</p>;
          },
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
                <IconButton
                  id=""
                  onClick={() => {
                    this.setState({
                      chosen_rubric: rubric_id,
                    });
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

    const categoryTableColumnsAdd = [
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
          filter: true,
          align: "center",
          customBodyRender: (rubric_name) => {
            return <p>{rubric_name}</p>;
          },
        },
      },
      {
        name: "category_id",
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
          customBodyRender: (category_id) => {
            return (
              <IconButton
                id=""
                onClick={() => {
                  this.add_category(category_id);
                }}
              >
                <AddCircleIcon sx={{ color: "black" }} />
              </IconButton>
            );
          },
        },
      },
    ];

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
          filter: true,
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

    var categories_of_chosen_rubric = this.state.chosen_rubric === null ? []: categories_by_rubric_id[this.state.chosen_rubric];

    var picked_categories = [];

    Object.keys(this.state.selected_categories).map((category_id) => {
      if(this.state.selected_categories[category_id]) {
        picked_categories = [...picked_categories, this.state.category_map[category_id]];
      }

      return category_id;
    });

    return (
      <>
        { this.state.isLoaded && this.state.errorMessage &&
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
              }}
            >
              Customize Your Rubric
            </h2>

            <div className="d-flex flex-row gap-3 justify-content-center mt-5">
              <div style={{ width: "25%"}}>
                <h3 className="mb-3">New Custom Rubric</h3>
                <div className="d-flex flex-column justify-content-center align-items-center"
                  style={{
                    borderTop: "3px solid #4A89E8",
                    border: "3px, 0px, 0px, 0px",
                    borderRadius: "10px",
                    backgroundColor: "white",
                    gap: "10px",
                    padding: "1rem",
                    paddingTop: "1.5rem"
                  }}
                >

                  <TextField id="rubric_name_input" label="Rubric Name" style={{ width: "70%" }}/>

                  <TextField id="rubric_description_input" label="Rubric Description" style={{ width: "70%" }}/>

                  <CustomButton label="Create Rubric" isOutlined={false} onClick={() => {this.handleCreateRubric(picked_categories)}}/>

                </div>
              </div>

              <div style={{ width: "25%"}}>
                <h3 className="d-flex mb-3">Rubrics</h3>

                <CustomDataTable
                  data={rubrics ? rubrics : []}
                  columns={rubricTablecolumns}
                  options={options}
                />
              </div>

              <div style={{ width: "25%"}}>
                <h3 className="d-flex mb-3">Categories</h3>

                <CustomDataTable
                  data={categories ? categories_of_chosen_rubric : []}
                  columns={categoryTableColumnsAdd}
                  options={options}
                />
              </div>

              <div style={{ width: "25%"}}>
                <h3 className="mb-3">Selected Categories</h3>

                <CustomDataTable
                  data={categories ? picked_categories : []}
                  columns={categoryTableColumnsRemove}
                  options={options}
                />

              </div>
            </div>
        </div>
      </>
    );
  }
}

export default AdminAddCustomRubricView;
