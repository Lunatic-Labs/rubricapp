import React from 'react';
import Box from '@mui/material/Box';
import TextareaAutosize from '@mui/material/TextareaAutosize';



class TextArea extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          textareaValue: this.props.currentData[this.props.categoryName]['comments'], // Set initial value from props
        };
      }
    
    handleTextareaChange = (event) => {
        const { teamValue, categoryName, setComments } = this.props;
        const textareaValue = event.target.value;
    
        this.setState({ textareaValue });
        setComments(teamValue, categoryName, textareaValue);
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
            <Box sx={{width:"100%"}}>
            <TextareaAutosize
                style={{width:"100%"}}
                onChange={this.handleTextareaChange}
                id="outlined-multiline-static"
                minRows={4}
                maxRows={4}
                placeholder="Comments for improvement..."
                value={this.state.textareaValue}
            />
            </Box>
        );
    }
  }
  
  export default TextArea;