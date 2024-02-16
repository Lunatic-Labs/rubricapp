import React from "react";
import Cookies from "universal-cookie";
import { Grid, TextField } from "@mui/material";
import CustomButton from "./Components/CustomButton.js";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import { genericResourcePOST } from "../../../../utility";
import CustomDataTable from "../../../Components/CustomDataTable.js";
import CollapsableRubricCategoryTable from "./CollapsableRubricCategoryTable.js";



class AddCustomRubric extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_categories: {},
      chosen_rubric: null,
      errorMessage: null,
      isLoaded: null,
    };

    this.handleCreateRubric = (picked_categories) => {
      var category_ids = [];
    
      for (var category_index = 0; category_index < picked_categories.length; category_index++) {
        category_ids = [...category_ids, picked_categories[category_index]["category_id"]];
      }

      if (document.getElementById("rubric_name_input").value === "") {
        this.setState({
          isLoaded: true,
          errorMessage: "Missing New Rubric Name."
        });

        return;
      }

      if (document.getElementById("rubric_description_input").value === "") {
        this.setState({
          isLoaded: true,
          errorMessage: "Missing New Rubric Description."
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
    const { selected_categories } = this.state;

    const categoryTableColumns = [
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
      }
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

    Object.keys(selected_categories).map((category_id) => {
      if(selected_categories[category_id]) {
        for(var i=0; i<categories.length; i++) {
          if(categories[i]["category_id"] === (category_id-"0")) {
            picked_categories = [...picked_categories, categories[i]];
          }
        }
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

          <Grid
            style={{
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '0.5rem',
              display: 'flex',
              width: '100%',
            }}
          >
            <Grid style={{ width: '48.25%' }} >
              <TextField id="rubric_name_input" label="Rubric Name" style={{ width: "100%" }}/>
            </Grid>

            <Grid style={{ width: '48.5%' }} >
              <TextField id="rubric_description_input" label="Rubric Description" multiline style={{ width: "100%" }}/>
            </Grid>
          </Grid>


          {/* NOTE: Displays Tables */}
          <Grid container spacing={6.5}>
            <Grid item xs={6}>
              <h3 className="d-flex mb-3">Rubrics</h3>

              <CollapsableRubricCategoryTable
                categories={categories}
                rubrics={rubrics}
                onCategorySelect={this.handleCategorySelect}
              />
            </Grid>

            <Grid item xs={6}>
              <h3 className="d-flex mb-3">Your Selected Categories</h3>

              <CustomDataTable
                data={picked_categories}
                columns={categoryTableColumns}
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
