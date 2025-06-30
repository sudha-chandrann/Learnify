/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface PayPalButtonProps {
  courseId: string;
  price:number;
  disabled?: boolean;
}

type PaymentStatus = 'idle' | 'creating' | 'processing' | 'success' | 'error' | 'cancelled';

export default function PayPalButton({
  courseId,
  price,
  disabled = false,
}: PayPalButtonProps) {

  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [orderID, setOrderID] = useState<string | null>(null);
  const router = useRouter();

  const resetState = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const createOrder = async () => {
    try {
      setStatus('creating');
      resetState();

      const response = await axios.post("/api/paypal/create-order", {
        courseId: courseId,
        amount: price,
      });

      if (!response.data?.orderID) {
        throw new Error("Failed to create PayPal order");
      }

      const createdOrderID = response.data.orderID;
      setOrderID(createdOrderID);
      return createdOrderID;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || err.message 
        : err instanceof Error 
        ? err.message 
        : "Failed to create order";
      
      setError(errorMessage);
      setStatus('error');
      console.log(" the error is ",err)
      throw err;
    }
  };

  const onApprove = async (data: any) => {
    try {
      setStatus('processing');
      resetState();

      const response = await axios.post("/api/paypal/capture-order", {
        orderID: data.orderID
      });

      if (!response.data?.success) {
        throw new Error("Payment capture failed");
      }

      setStatus('success');
      setSuccessMessage(`Successfully purchased !`)
      setTimeout(() => {
        router.push(`/courses/${courseId}/success`);
      }, 2000);

    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || err.message 
        : err instanceof Error 
        ? err.message 
        : "Payment capture failed";
      
      setError(errorMessage);
      setStatus('error');

      if (data.orderID) {
        handleOrderCleanup(data.orderID);
      }
    }
  };

  const onCancel = async (data: any) => {
    try {
      setStatus('cancelled');
      resetState();

      if (data.orderID) {
        await axios.post("/api/paypal/cancel", {
          orderID: data.orderID
        });
      }

      setError("Payment was cancelled. You can try again anytime.");
      
      setTimeout(() => {
        setStatus('idle');
        setError(null);
      }, 3000);

    } catch (err) {
      console.error("Cancel cleanup failed:", err);
      setStatus('idle');
      setError("Payment was cancelled.");
    }
  };

  const onPayPalError = async (err: any) => {
    console.error("PayPal error:", err);
    setStatus('error');
    setError("PayPal payment error occurred. Please try again.");
    
    if (orderID) {
      handleOrderCleanup(orderID);
    }
  };

  const handleOrderCleanup = async (orderIdToCleanup: string) => {
    try {
      await axios.post("/api/paypal/cancel", {
        orderID: orderIdToCleanup
      });
    } catch (cleanupErr) {
      console.error("Failed to cleanup order:", cleanupErr);
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    resetState();
    setOrderID(null);
  };

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: 'USD',
    intent: "capture" as const,
    components: "buttons",
    enableFunding: "venmo,card",
    disableFunding: "",
  };

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    return (
      <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <XCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700">PayPal configuration missing</span>
      </div>
    );
  }

  const isLoading = status === 'creating' || status === 'processing';
  const isDisabled = disabled || isLoading || status === 'success';

  return (
    <div className="w-full max-w-md mx-auto space-y-4">

      {status === 'success' && successMessage && (
        <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <div>
            <p className="text-green-800 font-medium">{successMessage}</p>
            <p className="text-green-600 text-sm">Redirecting to course...</p>
          </div>
        </div>
      )}

      {error && status !== 'success' && (
        <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800">{error}</p>
            {status === 'error' && (
              <button
                onClick={handleRetry}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      )}

      <PayPalScriptProvider options={initialOptions}>
        <div className="relative">
          {isDisabled && (
            <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg z-10 flex items-center justify-center">
              {isLoading && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">
                    {status === 'creating' ? 'Creating order...' : 'Processing payment...'}
                  </span>
                </div>
              )}
            </div>
          )}
          
          <PayPalButtons
            disabled={isDisabled}
            createOrder={createOrder}
            onApprove={onApprove}
            onCancel={onCancel}
            onError={onPayPalError}
            style={{
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal",
              height: 45,
            }}
            fundingSource={undefined}
          />
        </div>
      </PayPalScriptProvider>

      {status === 'cancelled' && (
        <div className="flex items-center justify-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
          <span className="text-yellow-800 text-sm">Payment cancelled</span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600 mr-2" />
          <span className="text-blue-800 text-sm">
            {status === 'creating' ? 'Setting up payment...' : 'Completing purchase...'}
          </span>
        </div>
      )}
    </div>
  );
}