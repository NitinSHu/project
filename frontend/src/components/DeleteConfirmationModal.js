import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeleteConfirmationModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  title, 
  message,
  isLoading = false,
  error = null
}) => {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <FaExclamationTriangle className="me-2" />
          {title || 'Confirm Deletion'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger mb-3">
            {error}
          </div>
        )}
        {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          variant="danger" 
          onClick={onConfirm}
          disabled={isLoading}
          className="d-flex align-items-center gap-2"
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span>Deleting...</span>
            </>
          ) : (
            'Delete'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal; 