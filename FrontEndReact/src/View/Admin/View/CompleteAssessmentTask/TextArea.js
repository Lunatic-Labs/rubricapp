import { Component } from 'react';
import Box from '@mui/material/Box';
import TextareaAutosize from '@mui/material/TextareaAutosize';



class TextArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textareaValue: this.props.currentData[this.props.categoryName]['comments'], // Set initial value from props
    };
  }
  
  handleTextareaChange = (event) => {
    if(this.props.isUnitCompleteAssessmentComplete(this.props.unitValue)) return;

    const { unitValue, categoryName, setComments } = this.props;

    const textareaValue = event.target.value;

    this.setState({ textareaValue });

    setComments(unitValue, categoryName, textareaValue);
  };
  
  componentDidUpdate() {
    if((this.props.currentData[this.props.categoryName]['comments']) !== this.state.textareaValue) {
      this.setState({
          textareaValue: this.props.currentData[this.props.categoryName]['comments']
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

            value={this.state.textareaValue}

            onChange={this.handleTextareaChange}

            disabled={this.props.isUnitCompleteAssessmentComplete(this.props.unitValue)}
        />
      </Box>
    );
  }
}
  
export default TextArea;