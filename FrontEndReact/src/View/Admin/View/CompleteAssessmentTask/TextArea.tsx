import { Component } from 'react';
import Box from '@mui/material/Box';
import TextareaAutosize from '@mui/material/TextareaAutosize';



class TextArea extends Component {
    props: any;

    handleTextareaChange = (event: any) => {
        if (this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly) return;

        const textAreaValue = event.target.value;

        this.props.setComments(textAreaValue);
        
        this.props.autosave();
    };


    render() {
        return (
            <Box sx={{ width:"100%" }}>
                <TextareaAutosize
                        id="outlined-multiline-static"

                        minRows={4}

                        maxRows={4}

                        style={{ width:"100%" }}

                        placeholder="Comments for improvement..."

                        value={this.props.currentValue}

                        onChange={this.handleTextareaChange}

                        disabled={this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly}
                />
            </Box>
        );
    }
}
    
export default TextArea;