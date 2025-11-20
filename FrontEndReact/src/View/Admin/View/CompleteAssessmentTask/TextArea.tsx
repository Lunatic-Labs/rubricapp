// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import { Component } from 'react';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Box' or its corr... Remove this comment to see the full error message
import Box from '@mui/material/Box';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/TextareaAutosize... Remove this comment to see the full error message
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
            // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
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