import React from "react";
import Modal from "@mui/material/Modal";

class ImageModal extends React.Component {
    render() {
        const { isOpen, handleClose, imageUrl } = this.props;

        return (
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="Rubric Descriptions"
                aria-describedby="Displays the descriptions of the rubric."
            >
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "auto",
                        height: "auto",
                        backgroundColor: "white",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="Rubric"
                        style={{ maxWidth: "100rem", maxHeight: "50rem" }}
                    />
                </div>
            </Modal>
        );
    }
}

export default ImageModal;
