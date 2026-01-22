import { Component } from 'react';
import Box from '@mui/material/Box';
import TextareaAutosize from '@mui/material/TextareaAutosize';

interface TextAreaProps {
    navbar: any;
    setComments: (value: string) => void;
    currentValue: string;
    autosave: () => void;
}

class TextArea extends Component<TextAreaProps> {

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