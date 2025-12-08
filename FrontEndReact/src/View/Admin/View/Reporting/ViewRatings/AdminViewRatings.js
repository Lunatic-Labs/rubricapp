import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../../utility';
import ViewRatingsHeader from './ViewRatingsHeader';
import ViewRatingsTable from './ViewRatingsTable';
import { Box, Button, Tooltip } from '@mui/material';
import Loading from '../../../../Loading/Loading';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';

// Main adminstrative interface for viewing, managing, and exporting  student/team 
// rating and feedback. This is the central component that orchestrated the entire
//ratings view experience for adminstrators.
//How it works: recieves assessment taks list from parent component
//when user select an assessment, fetches rating and category data
class AdminViewRatings extends Component {
  constructor(props) {
    super(props);

    /**
     * Ratings and Feedback admin view.
     * @property {str} errorMessage: Captured error msgs.   
     * @property {bool} isLoaded: State of the view.
     * @property {number} loadedAssessmentId: Current assessment id.
     * @property {object} ratings: Ratings information is stored here.
     * @property {object} categories: Categories Information stored here. 
     * @property {object} csvCreation: CSV response from the api stored here.
     * @property {object} exportButtonId: Button ID and parsing of downloadable data.
     * @property {object} downloadedAssessment: Set to trigger a browser download. 
     * @property {number} lastSeenCsvType: Int representing the clicked button.
     */
    this.state = {
        errorMessage: null,
        isLoaded: null,
        loadedAssessmentId: this.props.chosenAssessmentId,
        ratings: null,
        categories: null,
        csvCreation: null,
        exportButtonId: {},
        downloadedAssessment: null,
        lastSeenCsvType:null,
    } 

    //Fetches ratings and category data for the currently selected assessment
    //Called: on mount and whenever chosenAssessmentId changes

    this.fetchData = () => {
      var chosenCourse = this.props.navbar.state.chosenCourse;

      if(this.props.chosenAssessmentId !== "") {
        // Fetch student ratings for the chosen assessment task
        
        var assessmentIsTeam = parseAssessmentIndividualOrTeam(this.props.assessmentTasks);
        const url = `/rating?admin_id=${chosenCourse["admin_id"]}&assessment_task_id=${this.props.chosenAssessmentId}`;
        //Add team_id=true parameter if this is a team assessment
        const urlFinal = assessmentIsTeam[this.props.chosenAssessmentId] ? `${url}&team_id=true` : url;
        
        genericResourceGET(urlFinal, "ratings", this);
        
        // plan to check for team: set up another genericResoruceGet() to retrieve the team_id for the chosenAssessment maybe?
        // genericResourceGET(
        //   `/rating?admin_id=${chosenCourse["admin_id"]}&assessment_task_id=${this.props.chosenAssessmentId}`, // does not assign a value to team_id for Rating_routes. this results in lines 35-54 being ignored
        //   "ratings", this
        // ); 
      }

      // Iterate through the already-existing list of all ATs to find the rubric_id of the chosen AT
      var rubricId = 1;
      //Loop through all assessment tasks to find matching one
      for (var i = 0; i < this.props.assessmentTasks.length; i++) {
        if (this.props.assessmentTasks[i]['assessment_task_id'] === this.props.chosenAssessmentId) {
            rubricId = this.props.assessmentTasks[i]['rubric_id'];
            break; //Found it, exit loop
        }
      }

      // Fetch the category names of the appropriate rubric 
      genericResourceGET(
        `/category?admin_id=${chosenCourse["admin_id"]}&rubric_id=${rubricId}`,
        "categories", this
      );
      // Update state to track which assessment is currently loaded
      //This prevents unnecessary re-fetching when state updates for other reasons
      this.setState({
        loadedAssessmentId: this.props.chosenAssessmentId,
    });
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    //Re-fetch data if assessment selection changed
    // Compare current selection with what we loaded
    if (this.props.chosenAssessmentId !== this.state.loadedAssessmentId) {
        this.fetchData(); //Fetch ratings and categories for new assessment
    }

    /**
     * This next check deals with preparing and triggering a download on the users pc.
     */
    if(this.state.isLoaded && this.state.csvCreation) {
      //Define suffixes for three export types
      const suffix = ["-sfis_ocs", "-ratings", "-comments"];
      //Start with course name
      let fileName = this.props.navbar.state.chosenCourse['course_name'];
      //Fiind the assessment object to get its name
      let assessment = this.props.assessmentTasks.find(obj => obj["assessment_task_id"] === this.props.chosenAssessmentId);
      //Create abbreation from assessment name
      const atName = assessment["assessment_task_name"].split(' ');
      const abreviationLetters = atName.map(word => word.charAt(0).toUpperCase());
      fileName += '-' + abreviationLetters.join('');
      //Add type suffix and extension
      fileName += suffix[this.state.lastSeenCsvType];
      fileName += '.csv';
      //Extract CSV data from state
      const fileData = this.state.csvCreation["csv_data"];
      //create downloadable blob
      const blob = new Blob([fileData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      //Create temporary link element and trigger downloads
      const link = document.createElement("a");
      link.download = this.state.downloadedAssessment + ".csv";
      link.href = url;
      link.setAttribute('download', fileName);//This and next line is what triggers the file download.J
      link.click();   //Th\riggers the browser download

      //GEt button ID for re-enabling after tiimeout
      var assessmentName = this.state.downloadedAssessment;
      const exportAssessmentTask = document.getElementById(this.state.exportButtonId[assessmentName])
      
      //Re-enable exxport button after 10 seconds
      //Prevents rapid repeated downloads that could overwhleme server
      setTimeout(() => {
          if(exportAssessmentTask) {
              exportAssessmentTask.removeAttribute("disabled");
          }
      }, 10000);
      //Clear CSV data to prevent repeated download triggers
      this.setState({
          csvCreation: null
      });
  }
  }

  /**
   * Calls api to recive csv data and stores it.
   * @param {int} type: INT that informs what csv is to be retived; sif/ocs,ratings,comments are respecitvley 1,2,3.
   */

  //Initiates CSV export generation by calling the API
  handleCsvDownloads(type) {
    let promise = genericResourceGET(
      `/csv_assessment_export?assessment_task_id=${this.state.loadedAssessmentId}&format=${type}`,
      "csv_creation",
      this,
      {dest: "csvCreation"}
    );

    /**
     * Storing csv and catching potential errors.
     */
    promise.then(result => {
      if(result !== undefined && result.errorMessage === null){
        //Assessment name for button tracking
        var assessmentName = "test"; //Hardcode - should use actul assessment name
        var newExportButtonJSON = this.state.exportButtonId;
        newExportButtonJSON[assessmentName] = "asssessment_export_"+this.state.loadedAssessmentId;
        //Update state to trigger download in componentDidUpdate
        this.setState({
          downloadedAssessment: assessmentName,
          exportButtonId: newExportButtonJSON,
          lastSeenCsvType: type,
        });
      }
    })
    .catch(error => {
      //Clear CSV dtaa on error to prevent download attempts
      this.setState({
        csvCreation: null,
      })
    })
  }

  render() {
    //Renders the complete admin rating interface
    const {
      //Destructure state for cleaner code
        errorMessage,
        isLoaded,
        ratings,
        categories,
        csvCreation,
    } = this.state;
    //Render case 1: Error occurred
    if(errorMessage) {
      return(
        <Box>
            <ErrorMessage
                fetchedResource={"Ratings"}
                errorMessage={errorMessage}
            />
        </Box>
      )
      //Render case 2: Still loading data
      //Wait for both ratings (if assessment selected) and categories
    } else if (!isLoaded || (!ratings && this.props.chosenAssessmentId !== "") || !categories) {
      return(
        <Loading />
      )
      //Render case 3: Data loaded susccessfully - Show full interface
    } else {
      return(
        <>
          {/* Top section: Header and export buttons */}
          <Box aria-label="adminViewRatingsBox">
            <Box display="flex" alignItems="center" justifyContent="space-between">
            {/* Left side: Assessment selector and type label */}
              <ViewRatingsHeader
                assessmentTasks={this.props.assessmentTasks}
                chosenAssessmentId={this.props.chosenAssessmentId}
                setChosenAssessmentId={this.props.setChosenAssessmentId}
                csvCreation={csvCreation}     
                userData = {this}    
              />
              {/* Right side: Export buttons*/}
              <Box display="flex" justifyContent="flex-end" gap="10px">
                <Tooltip
                  title={
                    <> 
                      <p>
                          SFIS = Suggestions for Improvement. OCS = Observable Characteristics.
                      </p>
                    </>
                  }>
                  <span>
                    <Button
                      variant='contained'
                      disabled={!this.props.assessmentTasks || this.props.assessmentTasks.length === 0}
                      onClick={()=>{this.handleCsvDownloads(0)}} //Type 0 = SFIS and OCS
                    >
                      Export SFIS & OCS
                    </Button>
                  </span>
                </Tooltip>
                {/* Export button 2: Ratings */}
                <Button
                  variant='contained'
                  disabled={!this.props.assessmentTasks || this.props.assessmentTasks.length === 0}
                  onClick={()=>{this.handleCsvDownloads(1)}}
                >
                  Export Ratings
                </Button>
                {/* Export button 3: comments */}
                <Button
                  variant='contained'
                  disabled={!this.props.assessmentTasks || this.props.assessmentTasks.length === 0}
                  onClick={()=>{this.handleCsvDownloads(2)}}
                >
                  Export Comments
                </Button>
              </Box>

            </Box>
        
          </Box>
          {/* Bottom section: Rating data table */}
          <Box>
            <ViewRatingsTable
              assessmentTasks={this.props.assessmentTasks}
              chosenAssessmentId={this.props.chosenAssessmentId}
              ratings={ratings ? ratings : []} //Provide empty array if no ratings
              categories={categories}
            />
          </Box>
        </>
      )
    }
  }
}

export default AdminViewRatings;