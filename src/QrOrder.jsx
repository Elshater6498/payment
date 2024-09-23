import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import "././style/QrOrder.scss";
import PaymentScreen from "./components/PaymentScreen";

const QrOrder = ({ language }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      description: "Description 1",
      price: 10,
      quantity: 1,
      selected: false,
    },
    {
      id: 2,
      name: "Product 2",
      description: "Description 2",
      price: 15,
      quantity: 1,
      selected: false,
    },
    {
      id: 3,
      name: "Product 3",
      description: "Description 3",
      price: 20,
      quantity: 1,
      selected: false,
    },
  ]);

  const [showFullBillModal, setShowFullBillModal] = useState(false);
  const [showSplitBillModal, setShowSplitBillModal] = useState(false);
  const [showSplitEquallyModal, setShowSplitEquallyModal] = useState(false);
  const [showPayForItemsModal, setShowPayForItemsModal] = useState(false);
  const [showPaySpecificAmountModal, setShowPaySpecificAmountModal] =
    useState(false);
  const [totalPeople, setTotalPeople] = useState(1);
  const [payForPeople, setPayForPeople] = useState(0);
  const [yourShare, setYourShare] = useState(0);
  const [specificAmount, setSpecificAmount] = useState("");
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [error, setError] = useState("");
  const [splitEquallyError, setSplitEquallyError] = useState("");
  const [specificAmountError, setSpecificAmountError] = useState("");

  const handleQuantityChange = (id, delta) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };

  const handleSelectChange = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, selected: !product.selected }
          : product
      )
    );
  };

  const totalQuantity = products.reduce(
    (total, product) => total + product.quantity,
    0
  );
  const totalPrice = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  const selectedSum = products
    .filter((product) => product.selected)
    .reduce((total, product) => total + product.price * product.quantity, 0);

  const handlePayForPeopleChange = (newPayForPeople) => {
    setPayForPeople(newPayForPeople);
    if (newPayForPeople === 0) {
      setYourShare(0);
    } else {
      const newShare = (selectedSum / totalPeople) * newPayForPeople;
      setYourShare(newShare);
    }
  };

  const handleConfirmPayment = (amount) => {
    if (amount === 0) {
      setSplitEquallyError("Please specify the number of people you will pay");
      return;
    }
    setYourShare(amount);
    setShowPaymentScreen(true);
    // Close all other modals
    setShowSplitEquallyModal(false);
    setShowPayForItemsModal(false);
    setShowPaySpecificAmountModal(false);
    setSplitEquallyError("");
    setSpecificAmountError("");
  };

  const handleConfirmSpecificAmount = () => {
    const amount = parseFloat(specificAmount);
    if (amount > selectedSum) {
      setSpecificAmountError(
        "Please enter a value less than or equal to the value of the total bill"
      );
      return;
    }
    handleConfirmPayment(amount);
  };

  const isCounterDisabled = selectedSum === 0;

  const isRtl = language === "ar";

  const handleSplitBill = () => {
    if (selectedSum === 0) {
      setError("Please select a product");
    } else {
      setError("");
      setShowSplitBillModal(true);
    }
  };

  const handlePayFullBill = () => {
    if (selectedSum === 0) {
      setError("Please select a product");
    } else {
      setError("");
      setShowFullBillModal(true);
    }
  };

  return (
    <div className={`container my-4 ${isRtl ? "rtl" : ""}`}>
      <h2>Order List</h2>
      <ul className="list-group">
        {products.map((product) => (
          <li
            key={product.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`product-info d-flex align-items-center ${
                isRtl ? "justify-content-between" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={product.selected}
                onChange={() => handleSelectChange(product.id)}
              />
              <div
                className={`d-flex w-100 justify-content-between ms-2 me-5 ${
                  isRtl ? "me-2 ms-5" : ""
                }`}
              >
                <div className="">
                  <span className="fw-bold">{product.name}</span>
                  <p className="text-muted mb-1">{product.description}</p>
                </div>
                <div className="quantity-controls d-flex align-items-center">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleQuantityChange(product.id, -1)}
                  >
                    -
                  </Button>
                  <span className="mx-2">{product.quantity}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleQuantityChange(product.id, 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            <span className="product-price">
              ${(product.price * product.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-center">
        <h4>Total Products: {totalQuantity}</h4>
        <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
        <h4>Selected Products Total: ${selectedSum.toFixed(2)}</h4>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Payment Buttons */}
        <div className="mt-4">
          <Button variant="primary" onClick={handlePayFullBill}>
            Pay Full Bill
          </Button>
          <Button
            variant="secondary"
            className="ms-3"
            onClick={handleSplitBill}
          >
            Split the Bill
          </Button>
        </div>
      </div>
      {/* Full Bill Modal */}
      <Modal
        show={showFullBillModal}
        onHide={() => setShowFullBillModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pay Full Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You will pay the full amount: ${selectedSum.toFixed(2)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowFullBillModal(false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setYourShare(selectedSum);
              setShowFullBillModal(false);
              setShowPaymentScreen(true);
            }}
          >
            Pay Now
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Split Bill Modal */}
      <Modal
        show={showSplitBillModal}
        onHide={() => setShowSplitBillModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Split the Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You can split the bill to pay your share only</p>
          <div className="d-flex flex-column">
            <Button
              variant="outline-primary"
              className="mb-2"
              onClick={() => setShowSplitEquallyModal(true)}
            >
              Split the bill equally
            </Button>
            <Button
              variant="outline-primary"
              className="mb-2"
              onClick={() => setShowPayForItemsModal(true)}
            >
              Pay for your items
            </Button>
            <Button
              variant="outline-primary"
              className="mb-2"
              onClick={() => setShowPaySpecificAmountModal(true)}
            >
              Pay a specific amount
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSplitBillModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Split Equally Modal */}
      <Modal
        show={showSplitEquallyModal}
        onHide={() => setShowSplitEquallyModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Split the Bill Equally</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <label>Total people in your table:</label>
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    setTotalPeople((prev) => Math.max(1, prev - 1))
                  }
                  disabled={isCounterDisabled}
                >
                  -
                </Button>
                <span className="mx-3">{totalPeople}</span>
                <Button
                  variant="outline-secondary"
                  onClick={() => setTotalPeople((prev) => prev + 1)}
                  disabled={isCounterDisabled}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <label>People you pay for:</label>
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    handlePayForPeopleChange(Math.max(0, payForPeople - 1))
                  }
                  disabled={isCounterDisabled}
                >
                  -
                </Button>
                <span className="mx-3">{payForPeople}</span>
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    handlePayForPeopleChange(
                      Math.min(totalPeople, payForPeople + 1)
                    )
                  }
                  disabled={isCounterDisabled}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <div>
              <strong>Total Order:</strong> ${selectedSum.toFixed(2)}
            </div>
            <div>
              <strong>Your Share:</strong> ${yourShare.toFixed(2)}
            </div>
          </div>
          {splitEquallyError && (
            <Alert variant="danger">{splitEquallyError}</Alert>
          )}
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button
            variant="secondary"
            onClick={() => setShowSplitEquallyModal(false)}
          >
            Remove Split
          </Button>
          <Button
            variant="primary"
            onClick={() => handleConfirmPayment(yourShare)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pay for Your Items Modal */}
      <Modal
        show={showPayForItemsModal}
        onHide={() => setShowPayForItemsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pay for Your Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You will pay for the items you've selected:</p>
          <ul>
            {products
              .filter((product) => product.selected)
              .map((product) => (
                <li key={product.id}>
                  {product.name} - $
                  {(product.price * product.quantity).toFixed(2)}
                </li>
              ))}
          </ul>
          <hr />
          <div>
            <strong>Your Total:</strong> ${selectedSum.toFixed(2)}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPayForItemsModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleConfirmPayment(selectedSum)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pay Specific Amount Modal */}
      <Modal
        show={showPaySpecificAmountModal}
        onHide={() => setShowPaySpecificAmountModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pay a Specific Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Enter the amount you want to pay:</p>
          <Form.Group>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              value={specificAmount}
              onChange={(e) => setSpecificAmount(e.target.value)}
            />
          </Form.Group>
          <hr />
          <div>
            <strong>Total Bill:</strong> ${selectedSum.toFixed(2)}
          </div>
          {specificAmountError && (
            <Alert variant="danger">{specificAmountError}</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPaySpecificAmountModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmSpecificAmount}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Screen Modal */}
      {showPaymentScreen && (
        <PaymentScreen
          yourShare={yourShare}
          onClose={() => setShowPaymentScreen(false)}
        />
      )}
    </div>
  );
};

export default QrOrder;
