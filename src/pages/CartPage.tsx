import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, CheckCircle, Copy, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fallbackCourses } from '../data/fallbackCourses';
import toast from 'react-hot-toast';

export function CartPage() {
  const { courses, cart, removeFromCart, getCartTotal, user, submitPayment, settings } = useApp();
  const [step, setStep] = useState<'cart' | 'payment' | 'confirmation'>('cart');
  const [transactionId, setTransactionId] = useState('');
  const navigate = useNavigate();

  // Use fallback if needed
  const allCourses = courses.length > 0 ? courses : fallbackCourses;
  const cartCourses = allCourses.filter(c => cart.includes(c.id));
  const { subtotal, discount, total } = getCartTotal();

  const handleProceedToPayment = () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    setStep('payment');
  };

  const handleConfirmPayment = () => {
    if (!transactionId.trim()) {
      toast.error('Please enter Transaction ID / UTR Number');
      return;
    }
    submitPayment(transactionId);
    setStep('confirmation');
    toast.success('Payment submitted! Waiting for verification.');
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(settings.upiId);
    toast.success('UPI ID copied!');
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Submitted!</h1>
            <p className="text-gray-600 mt-4">
              Thank you for your purchase! Your payment is being verified by our team. 
              You will receive access within 24 hours.
            </p>
            <p className="text-gray-600 mt-2">
              For faster verification, contact us on WhatsApp:
            </p>
            <a 
              href={`https://wa.me/917903421482?text=Hi, I just made a payment with Transaction ID: ${transactionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-4 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              <Phone className="w-5 h-5 mr-2" />
              WhatsApp Now
            </a>
            <div className="mt-6">
              <Link to="/dashboard" className="text-indigo-600 font-semibold hover:underline">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Complete Payment</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Instructions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Instructions</h2>
              
              <div className="text-center mb-6">
                <img 
                  src={settings.qrCodeImage}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto border-4 border-indigo-100 rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-2">Scan QR Code to Pay</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">UPI ID</label>
                  <div className="flex items-center mt-1">
                    <input 
                      type="text" 
                      value={settings.upiId}
                      readOnly
                      className="flex-1 bg-gray-100 px-4 py-2 rounded-l-lg"
                    />
                    <button 
                      onClick={copyUPI}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <p className="bg-gray-100 px-4 py-2 rounded-lg">{settings.phoneNumber}</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800">Amount to Pay</h3>
                  <p className="text-3xl font-bold text-yellow-900">₹{total.toFixed(0)}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">Steps:</h3>
                <ol className="mt-2 space-y-2 text-sm text-blue-700">
                  <li>1. Open any UPI app (GPay, PhonePe, Paytm)</li>
                  <li>2. Scan QR Code or use UPI ID</li>
                  <li>3. Pay ₹{total.toFixed(0)}</li>
                  <li>4. Copy Transaction ID / UTR Number</li>
                  <li>5. Enter below and submit</li>
                </ol>
              </div>
            </div>

            {/* Transaction Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cartCourses.map(course => (
                  <div key={course.id} className="flex justify-between items-center">
                    <span className="text-gray-700">{course.title}</span>
                    <span className="font-semibold">₹{course.price}</span>
                  </div>
                ))}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Bundle Discount</span>
                      <span>-₹{discount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold mt-2">
                    <span>Total</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID / UTR Number *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter 12 digit UTR number"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Find this in your payment app after successful payment
                  </p>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition"
                >
                  Confirm Payment
                </button>

                <button
                  onClick={() => setStep('cart')}
                  className="w-full text-gray-600 hover:text-gray-900"
                >
                  ← Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
            <p className="text-gray-500 mt-2">Start learning by adding courses to your cart</p>
            <Link 
              to="/courses" 
              className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartCourses.map(course => (
                <div key={course.id} className="bg-white rounded-xl shadow-md p-4 flex gap-4">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.instructor}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-lg font-bold text-gray-900">₹{course.price}</span>
                      {course.originalPrice > course.price && (
                        <span className="text-sm text-gray-400 line-through ml-2">₹{course.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(course.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCourses.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bundle Discount ({cartCourses.length} courses)</span>
                    <span>-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Proceed to Payment
              </button>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 text-center">
                  🎉 Buy more courses to get more discount!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
