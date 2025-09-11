import React from "react";
import Modal from "@mui/material/Modal";

class ImageModal extends React.Component {
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
                        display: "flex",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "auto",
                        height: "auto",
                        backgroundColor: "white",
                        border: "2px solid #0b0e6eff",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="Rubric"
                        style={{ maxWidth: "50rem", maxHeight: "50rem" }}
                    />
                    <img
                        src={imageUrl2}
                        alt="Rubric2"
                        style={{ maxWidth: "75rem", maxHeight: "75rem" }}
                    />
                </div>
            </Modal>
        );
    }
}

export default ImageModal;
