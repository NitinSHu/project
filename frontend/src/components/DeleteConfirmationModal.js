import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeleteConfirmationModal = ({ show, onClose, onConfirm, title, message }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <FaExclamationTriangle className="me-2" />
          {title || 'Confirm Deletion'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal; 