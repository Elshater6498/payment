import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./../style/QrOrder.scss";

const PaymentScreen = ({ yourShare, onClose }) => {
  const [selectedTip, setSelectedTip] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleTipChange = (percentage) => {
    setSelectedTip(yourShare * (percentage / 100));
    setCustomTip("");
  };

  const handleCustomTipChange = (e) => {
    setCustomTip(e.target.value);
    setSelectedTip(0);
  };

  const totalPayment = yourShare + selectedTip + parseFloat(customTip || 0);

  const handlePayment = () => {
    alert("Payment Successful!");
    onClose();
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5>Your share: ryal {yourShare.toFixed(2)}</h5>
          <h6>The bill has been split as requested</h6>
        </div>
        <div className="tip-selection mb-4">
          <h6>Would you like to add a tip?</h6>
          <div className="d-flex justify-content-between gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => handleTipChange(10)}
            >
              10% ryal {(yourShare * 0.1).toFixed(2)}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => handleTipChange(15)}
            >
              15% ryal {(yourShare * 0.15).toFixed(2)}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => handleTipChange(20)}
            >
              20% ryal {(yourShare * 0.2).toFixed(2)}
            </Button>
            <Form.Control
              type="text"
              placeholder="Custom"
              value={customTip}
              onChange={handleCustomTipChange}
            />
          </div>
        </div>
        <div className="payment-summary mb-4">
          <h5>You are paying: ryal {totalPayment.toFixed(2)}</h5>
        </div>
        <div className="payment-method">
          <Button
            variant="dark"
            className="mb-2"
            block
            onClick={() => setPaymentMethod("apple_pay")}
          >
            <i className="fab fa-apple-pay"></i> Apple Pay
          </Button>
          <Form.Group controlId="cardNumber">
            <Form.Label>Card number</Form.Label>
            <Form.Control
              type="text"
              placeholder="1234 1234 1234 1234"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Form.Group controlId="expiryDate">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="cvv">
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </Form.Group>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handlePayment}>
          Pay ryal {totalPayment.toFixed(2)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentScreen;
