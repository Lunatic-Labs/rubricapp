import React from "react";
import customDataTable from "../../../Components/CustomDataTable.js"

class AdminAddCustomRubricView extends React.Component {
  render() {
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
        name: "Categories",
        label: "Categories",
        options: {
          filter: true,
          align: "center",
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
          <h2 style={{ paddingTop: "16px", textAlign: "left", marginBottom: "20px", marginLeft: "20px", bold: true, }}> Customize Your Rubric </h2>
          <div classname='container'
            style={{
              backgroundColor: "#FFF",
              borderTop: '3px solid #4A89E8',
              borderRadius: "10px",
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: "10px",
              width: "80%",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "20px",
            }}
          >
            <customDataTable
              data={"data"}
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
