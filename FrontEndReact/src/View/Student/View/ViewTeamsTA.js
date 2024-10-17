import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../Components/CustomDataTable";



class ViewTeamsTA extends Component{
  render() {
    var teams = this.props.teams;

    const columns = [
      {
        name: "teamName",
        label: "Team Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"230px" } },
          setCellProps: () => { return { width:"230px" } },
        }
      },
      {
        name: "studentNames",
        label: "Team Member Names",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"230px" } },
          setCellProps: () => { return { width:"230px" } },
          customBodyRender: (users) => {
            return(
              <p className="pt-3" variant="contained">{users}</p>
            )
          }
        }
      },
    ];

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      viewColumns: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "vertical",
      tableBodyMaxHeight: "21rem"
    };

    return (
      <CustomDataTable
        data={teams ? teams : []}
        columns={columns}
        options={options}
      />
    )
  }
}

export default ViewTeamsTA;