import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../../utility';
import ViewRatingsHeader from './ViewRatingsHeader';
import ViewRatingsTable from './ViewRatingsTable';
import { Box, Button } from '@mui/material';
import Loading from '../../../../Loading/Loading';



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

    this.fetchData = () => {
      var chosenCourse = this.props.navbar.state.chosenCourse;

      if(this.props.chosenAssessmentId !== "") {
        // Fetch student ratings for the chosen assessment task
        genericResourceGET(
          `/rating?admin_id=${chosenCourse["admin_id"]}&assessment_task_id=${this.props.chosenAssessmentId}`,
          "ratings", this
        );  
      }

      // Iterate through the already-existing list of all ATs to find the rubric_id of the chosen AT
      var rubricId = 1;

      for (var i = 0; i < this.props.assessmentTasks.length; i++) {
        if (this.props.assessmentTasks[i]['assessment_task_id'] === this.props.chosenAssessmentId) {
            rubricId = this.props.assessmentTasks[i]['rubric_id'];
            break; 
        }
      }

      // Fetch the category names of the appropriate rubric 
      genericResourceGET(
        `/category?admin_id=${chosenCourse["admin_id"]}&rubric_id=${rubricId}`,
        "categories", this
      );

      this.setState({
        loadedAssessmentId: this.props.chosenAssessmentId,
    });
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    if (this.props.chosenAssessmentId !== this.state.loadedAssessmentId) {
        this.fetchData();
    }

    /**
     * This next check deals with preparing and triggering a download on the users pc.
     */
    if(this.state.isLoaded && this.state.csvCreation) {
      const suffix = ["-sfis_ocs", "-ratings", "-comments"];
      let fileName = this.props.navbar.state.chosenCourse['course_name'];

      let assessment = this.props.assessmentTasks.find(obj => obj["assessment_task_id"] === this.props.chosenAssessmentId);
      const atName = assessment["assessment_task_name"].split(' ');
      const abreviationLetters = atName.map(word => word.charAt(0).toUpperCase());
      fileName += '-' + abreviationLetters.join('');

      fileName += suffix[this.state.lastSeenCsvType];
      fileName += '.csv';

      const fileData = this.state.csvCreation["csv_data"];

      const blob = new Blob([fileData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = this.state.downloadedAssessment + ".csv";
      link.href = url;
      link.setAttribute('download', fileName);//This and next line is what triggers the file download.J
      link.click();

      var assessmentName = this.state.downloadedAssessment;
      
      const exportAssessmentTask = document.getElementById(this.state.exportButtonId[assessmentName])
      
      setTimeout(() => {
          if(exportAssessmentTask) {
              exportAssessmentTask.removeAttribute("disabled");
          }
      }, 10000);

      this.setState({
          csvCreation: null
      });
  }
  }

  /**
   * Calls api to recive csv data and stores it.
   * @param {int} type: INT that informs what csv is to be retived; sif/ocs,ratings,comments are respecitvley 1,2,3.
   */
  handleCsvDownloads(type){
    console.log(typeof this.state.downloadedAssessment);

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
        var assessmentName = "test";
        var newExportButtonJSON = this.state.exportButtonId;
        newExportButtonJSON[assessmentName] = "asssessment_export_"+this.state.loadedAssessmentId;

        this.setState({
          downloadedAssessment: assessmentName,
          exportButtonId: newExportButtonJSON,
          lastSeenCsvType: type,
        });
      }
    })
    .catch(error => {
      this.setState({
        csvCreation: null,
      })
    })
  }

  render() {
    const {
        errorMessage,
        isLoaded,
        ratings,
        categories,
        csvCreation,
    } = this.state;

    if(errorMessage) {
      return(
        <Box>
            <ErrorMessage
                fetchedResource={"Ratings"}
                errorMessage={errorMessage}
            />
        </Box>
      )

    } else if (!isLoaded || (!ratings && this.props.chosenAssessmentId !== "") || !categories) {
      return(
        <Loading />
      )

    } else {
      return(
        <>
          <Box aria-label="adminViewRatingsBox">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <ViewRatingsHeader
                assessmentTasks={this.props.assessmentTasks}
                chosenAssessmentId={this.props.chosenAssessmentId}
                setChosenAssessmentId={this.props.setChosenAssessmentId}
                csvCreation={csvCreation}     
                userData = {this}    
              />
              <Box display="flex" justifyContent="flex-end" gap="10px">
                <Button
                  variant='contained'
                  onClick={()=>{this.handleCsvDownloads(0)}}
                >
                  Export SFIS & OCS
                </Button>
                <Button
                  variant='contained'
                  onClick={()=>{this.handleCsvDownloads(1)}}
                >
                  Export Ratings
                </Button>

                <Button
                  variant='contained'
                  onClick={()=>{this.handleCsvDownloads(2)}}
                >
                  Export Comments
                </Button>
              </Box>

            </Box>
        
          </Box>
          
          <Box>
            <ViewRatingsTable
              ratings={ratings ? ratings : []}
              categories={categories}
            />
          </Box>
        </>
      )
    }
  }
}

export default AdminViewRatings;