import React from "react";
import CustomDataTable from "../../../Components/CustomDataTable";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

class AdminAddCustomRubricView extends React.Component {
  render() {

    var rubrics = this.props.rubrics;
    var categories = this.props.categories;

    console.log(rubrics);
    console.log(categories);

    const columns = [
      {
        name: "Rubric",
        label: "Rubric",
        options: {
          filter: true,
          align: "center",
        },
      },
      {
        name: "Categories",
        label: "Categories",
        options: {
          filter: true,
          align: "center",
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
                    console.log("View Rubric");
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
            }}
          >
            {" "}
            Customize Your Rubric{" "}
          </h2>
          <div
            className="container"
            style={{
              backgroundColor: "#FFF",
              borderTop: "3px solid #4A89E8",
              borderRadius: "10px",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: "10px",
              width: "80%",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "20px",
            }}
          >
            {/* 
                TODO: Need to retrieve data from backend 
                Will also need to work on the sizing of the table
            */}
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
