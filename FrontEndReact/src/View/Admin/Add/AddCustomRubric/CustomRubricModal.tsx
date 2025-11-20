// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React from "react";
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Modal' or its co... Remove this comment to see the full error message
import Modal from "@mui/material/Modal";

class ImageModal extends React.Component {
    props: any;
    render() {
        const { isOpen, handleClose, imageUrl, imageUrl2 } = this.props;

        return (
            // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="Rubric Descriptions"
                aria-describedby="Displays the descriptions of the rubric."

            >
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div
                    style={{
                            display: "block",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "60%",    // fixed width
                            height: "96%",   // fixed height
                            backgroundColor: "white",
                            border: "2px solid #095b9eff",
                            boxShadow: 24, 
                            overflow: "auto",  // enable both x and y scrolling 
                    }}
                >
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <img
                        src={imageUrl}
                        alt="Rubric"
                        style={{ width: "100%" }}/>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <img
                        src={imageUrl2}
                        alt="Rubric2"
                        style={{ width: "100%" }}/>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
            </Modal>
        );
    }
}

export default ImageModal;