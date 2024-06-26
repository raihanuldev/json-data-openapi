/* eslint-disable react/display-name */
import React from "react";
import PropTypes from "prop-types";

const Invoice = React.forwardRef(({
  companyLogo,
  sellerDetails,
  billingDetails,
  shippingDetails,
  orderDetails,
  invoiceDetails,
  items,
  signatureImage,
}, ref) => {
  const computeNetAmount = (unitPrice, quantity, discount) =>
    unitPrice * quantity - discount;

  const computeTaxAmount = (netAmount, taxRate) => netAmount * (taxRate / 100);

  const computeTotalAmount = (items) =>
    items.reduce(
      (total, item) =>
        total +
        computeNetAmount(item.unitPrice, item.quantity, item.discount) +
        computeTaxAmount(
          computeNetAmount(item.unitPrice, item.quantity, item.discount),
          item.taxRate
        ),
      0
    );

  const amountInWords = (amount) => {
    // Simple function to convert amount to words (could be improved for full implementation)
    const words = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    return amount
      .toString()
      .split("")
      .map((num) => words[parseInt(num)])
      .join(" ");
  };

  return (
    <div ref={ref} className="max-w-4xl mx-auto p-8 bg-white border border-gray-200 shadow-md">
      <div className="flex justify-between mb-8">
        <img src={companyLogo} alt="Company Logo" className="h-16" />
        <div className="text-right">
          <h2 className="text-xl font-bold uppercase">Invoice</h2>
          <p>(Original for Recipient)</p>
        </div>
      </div>
      <div className="flex justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold">Sold By:</h3>
          <p>{sellerDetails.name}</p>
          <p>{sellerDetails.address}</p>
          <p>PAN No: {sellerDetails.pan}</p>
          <p>GST Registration No: {sellerDetails.gst}</p>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-bold">Billing Address:</h3>
          <p>{billingDetails.name}</p>
          <p>{billingDetails.address}</p>
          <p>State/UT Code: {billingDetails.stateCode}</p>
          <h3 className="text-lg font-bold">Shipping Address:</h3>
          <p>{shippingDetails.name}</p>
          <p>{shippingDetails.address}</p>
          <p>State/UT Code: {shippingDetails.stateCode}</p>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-bold">Order Details:</h3>
        <p>Order Number: {orderDetails.orderNo}</p>
        <p>Order Date: {orderDetails.orderDate}</p>
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-bold">Invoice Details:</h3>
        <p>Invoice Number: {invoiceDetails.invoiceNo}</p>
        <p>Invoice Date: {invoiceDetails.invoiceDate}</p>
        <p>Reverse Charge: {invoiceDetails.reverseCharge ? "Yes" : "No"}</p>
      </div>
      <table className="w-full mb-8">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Sl. No</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Unit Price</th>
            <th className="border px-4 py-2">Qty</th>
            <th className="border px-4 py-2">Net Amount</th>
            <th className="border px-4 py-2">Tax Rate</th>
            <th className="border px-4 py-2">Tax Type</th>
            <th className="border px-4 py-2">Tax Amount</th>
            <th className="border px-4 py-2">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const netAmount = computeNetAmount(
              item.unitPrice,
              item.quantity,
              item.discount
            );
            const taxAmount = computeTaxAmount(netAmount, item.taxRate);
            const totalAmount = netAmount + taxAmount;
            return (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.description}</td>
                <td className="border px-4 py-2">
                  {item.unitPrice.toFixed(2)}
                </td>
                <td className="border px-4 py-2">{item.quantity}</td>
                <td className="border px-4 py-2">{netAmount.toFixed(2)}</td>
                <td className="border px-4 py-2">{item.taxRate}%</td>
                <td className="border px-4 py-2">
                  {item.taxRate === 18 ? "IGST" : "CGST/SGST"}
                </td>
                <td className="border px-4 py-2">{taxAmount.toFixed(2)}</td>
                <td className="border px-4 py-2">{totalAmount.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-end mb-8">
        <div className="text-right">
          <h3 className="text-lg font-bold">
            TOTAL: ₹{computeTotalAmount(items).toFixed(2)}
          </h3>
          <p>Amount in Words: {amountInWords(computeTotalAmount(items))}</p>
        </div>
      </div>
      <div className="text-center mb-8">
        <p>For {sellerDetails.name}:</p>
        <img src={signatureImage} alt="Signature" className="h-16 mx-auto" />
        <p>Authorized Signatory</p>
      </div>
      <div className="text-center">
        <p>
          Whether tax is payable under reverse charge -{" "}
          {invoiceDetails.reverseCharge ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
});

Invoice.propTypes = {
  companyLogo: PropTypes.string.isRequired,
  sellerDetails: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    pan: PropTypes.string.isRequired,
    gst: PropTypes.string.isRequired,
  }).isRequired,
  billingDetails: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    stateCode: PropTypes.string.isRequired,
  }).isRequired,
  shippingDetails: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    stateCode: PropTypes.string.isRequired,
  }).isRequired,
  orderDetails: PropTypes.shape({
    orderNo: PropTypes.string.isRequired,
    orderDate: PropTypes.string.isRequired,
  }).isRequired,
  invoiceDetails: PropTypes.shape({
    invoiceNo: PropTypes.string.isRequired,
    invoiceDate: PropTypes.string.isRequired,
    reverseCharge: PropTypes.bool.isRequired,
  }).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      unitPrice: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      discount: PropTypes.number.isRequired,
      taxRate: PropTypes.number.isRequired,
    })
  ).isRequired,
  signatureImage: PropTypes.string.isRequired,
};

export default Invoice;
