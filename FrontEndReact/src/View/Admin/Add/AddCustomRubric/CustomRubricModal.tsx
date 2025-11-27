import React from "react";
import Modal from "@mui/material/Modal";

class ImageModal extends React.Component {
    props: any;
    render() {
        const { isOpen, handleClose, imageUrl, imageUrl2 } = this.props;

        return (
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="Rubric Descriptions"
                aria-describedby="Displays the descriptions of the rubric."

            >
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
                    <img
                        src={imageUrl}
                        alt="Rubric"
                        style={{ width: "100%" }}/>
                    <img
                        src={imageUrl2}
                        alt="Rubric2"
                        style={{ width: "100%" }}/>
                </div>
            </Modal>
        );
    }
}

export default ImageModal;