import React from 'react';
import './Modal.css'; // For modal styling

const Modal = ({ showModal, handleClose, paymentInfo }) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <span className="modal-title">Payment Successful</span>
        </div>
        <div className="modal-body">
          <div className="payment-details">
            <p><strong>Name:</strong> {paymentInfo.name}</p>
            <p><strong>Email:</strong> {paymentInfo.email}</p>
            <p><strong>Contact:</strong> {paymentInfo.contact}</p>
            <p><strong>Transaction ID:</strong> {paymentInfo.transactionId}</p>
            <p><strong>Package:</strong> {paymentInfo.package}</p>
            <p><strong>Total:</strong> ${paymentInfo.total}</p>
            <p><strong>Amount Paid:</strong> ${paymentInfo.amountPaid}</p>
          </div>
          <p className="payment-info">
            * {paymentInfo.paymentNote}
          </p>
        </div>
        <div className="modal-footer">
          <button className="close-button" onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
