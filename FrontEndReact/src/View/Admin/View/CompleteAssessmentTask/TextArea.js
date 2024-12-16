import { Component } from 'react';
import Box from '@mui/material/Box';
import TextareaAutosize from '@mui/material/TextareaAutosize';



class TextArea extends Component {
    constructor(props) {
        super(props);

<<<<<<< HEAD
    this.state = {
      textareaValue: this.props.currentData[this.props.categoryName]['comments'], // Set initial value from props
    };
  }
  
  handleTextareaChange = (event) => {
    if (this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly) return;

    const { currentUnitTabIndex, categoryName, setComments } = this.props;

    const textareaValue = event.target.value;

    this.setState({ textareaValue });

    setComments(currentUnitTabIndex, categoryName, textareaValue);
    
    this.props.autosave();
  };
  
  componentDidUpdate() {
    if((this.props.currentData[this.props.categoryName]['comments']) !== this.state.textareaValue) {
      this.setState({
          textareaValue: this.props.currentData[this.props.categoryName]['comments']
      });
=======
        this.state = {
            textAreaValue: this.props.currentValue, // Set initial value from props
        };
>>>>>>> master
    }
    
    handleTextareaChange = (event) => {
        if (this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly) return;

        const textAreaValue = event.target.value;

        this.setState({ textAreaValue });

        this.props.setComments(textAreaValue);
        
        this.props.autosave();
    };
    
    componentDidUpdate() {
        if (this.props.currentValue !== this.state.textAreaValue) {
            this.setState({
                textAreaValue: this.props.currentValue,
            });
        }
    }

    render() {
        return (
            <Box sx={{ width:"100%" }}>
                <TextareaAutosize
                        id="outlined-multiline-static"

                        minRows={4}

                        maxRows={4}

                        style={{ width:"100%" }}

                        placeholder="Comments for improvement..."

                        value={this.state.textAreaValue}

                        onChange={this.handleTextareaChange}

                        disabled={this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly}
                />
            </Box>
        );
    }
}
    
export default TextArea;