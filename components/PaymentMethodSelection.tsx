import { useState } from "react";

export default function PaymentMethodSelection() {
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Payment Method
      </h2>

      {/* Bank Transfer Option */}
      <div
        className={`flex items-center p-4 mb-3 border-2 rounded-lg cursor-pointer ${
          paymentMethod === "bank"
            ? "border-blue-700 bg-blue-50"
            : "border-gray-200 bg-white"
        }`}
        onClick={() => handlePaymentMethodChange("bank")}
      >
        <div className="p-2 rounded-full bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-800"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </div>

        <div className="ml-3 flex-1">
          <h3 className="font-medium text-gray-800">Bank Transfer</h3>
          <p className="text-sm text-gray-600">CRDB Bank</p>
          <p className="text-sm text-gray-600">Account: USEDBATTERY LTD</p>
          <p className="text-sm text-gray-600">Number: 123456787</p>
        </div>

        {paymentMethod === "bank" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-700"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )}
      </div>

      {/* Mobile Money Option */}
      <div
        className={`flex items-center p-4 mb-3 border-2 rounded-lg cursor-pointer ${
          paymentMethod === "mobile_money"
            ? "border-blue-700 bg-blue-50"
            : "border-gray-200 bg-white"
        }`}
        onClick={() => handlePaymentMethodChange("mobile_money")}
      >
        <div className="p-2 rounded-full bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-800"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" y2="18" x2="12.01" />
          </svg>
        </div>

        <div className="ml-3 flex-1">
          <h3 className="font-medium text-gray-800">Mobile Money</h3>
          <p className="text-sm text-gray-600">M-PESA</p>
          <p className="text-sm text-gray-600">Account: USEDBATTERY LTD</p>
          <p className="text-sm text-gray-600">Number: 591234</p>
        </div>

        {paymentMethod === "mobile_money" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-700"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )}
      </div>

      {/* Status Display */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {paymentMethod
            ? `Selected payment method: ${
                paymentMethod === "bank" ? "Bank Transfer" : "Mobile Money"
              }`
            : "Please select a payment method"}
        </p>
      </div>
    </div>
  );
}
