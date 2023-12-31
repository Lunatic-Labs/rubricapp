import React from 'react';
import Box from '@mui/material/Box';
import TextareaAutosize from '@mui/material/TextareaAutosize';


class TextArea extends React.Component {

    render() {
        const { teamValue, categoryName, currentData, setComments } = this.props;

        return (
            <Box sx={{width:"100%"}}>
            <TextareaAutosize
                style={{width:"100%"}}
                onChange={(event) => {
                    setComments(teamValue, categoryName, event.target.value);
                }}
                id="outlined-multiline-static"
                minRows={4}
                maxRows={4}
                placeholder="Comments for improvement..."
                defaultValue={currentData[categoryName]['comments']}
            />
            </Box>
        );
    }
  }
  
  export default TextArea;