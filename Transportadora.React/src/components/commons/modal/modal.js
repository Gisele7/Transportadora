import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import '../modal/modal.css'

const ComponentModal = ({ abrir = false, close = false, index, componente }) => {
  const [open, setOpen] = useState(abrir);
  const handleOpen = () => setOpen(true);

  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    height: 700,
    bgcolor: "#ffc6001a",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
    zIndex: -1
  };

  return (
    <>
      <Modal
        id={"modal" + index}
        open={abrir}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            {componente}
        </Box>
      </Modal>
    </>
  );
};

export default ComponentModal;
