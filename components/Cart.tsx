
import React, { useState } from 'react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const Cart: React.FC<CartProps> = ({ items, onRemove, onClear }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsCheckingOut(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        onClear();
        setPaymentSuccess(false);
      }, 3000);
    }, 2000);
  };

  if (items.length === 0 && !paymentSuccess) {
    return (
      <div className="max-w-xl mx-auto py-24 px-6 text-center">
        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-400">Looks like you haven't added any premium soundscapes yet.</p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-xl mx-auto py-24 px-6 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12 text-green-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-400">Your tracks are ready for download in your library.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-extrabold mb-8">Checkout</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-[#111] p-4 rounded-xl border border-white/5">
              <img src={item.coverUrl} className="w-20 h-20 object-cover rounded-lg" alt={item.title} />
              <div className="flex-1">
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.artist}</p>
                <p className="text-sm font-mono mt-1 text-purple-400">BWP {item.price}</p>
              </div>
              <button 
                onClick={() => onRemove(item.id)}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>BWP {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Platform Fee</span>
                <span>BWP 0.00</span>
              </div>
              <div className="h-px bg-white/5 my-4" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-purple-400">BWP {total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full mt-8 bg-white text-black font-black py-4 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
            >
              {isCheckingOut ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent animate-spin rounded-full" />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l1.906 2.859a.75.75 0 010 .828l-1.906 2.86a.75.75 0 11-1.248-.832L12.738 12l-1.64-2.46a.75.75 0 01.286-1.048zm6.126 5.404a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H5.25A.75.75 0 014.5 12zm2.136 5.636a.75.75 0 011.06 0l1.591 1.592a.75.75 0 01-1.06 1.061l-1.591-1.591a.75.75 0 010-1.061zm10.607 0a.75.75 0 010 1.06l-1.592 1.591a.75.75 0 01-1.06-1.06l1.59-1.592a.75.75 0 011.061 0z" clipRule="evenodd" />
                  </svg>
                  One-Click Checkout
                </>
              )}
            </button>
            <p className="text-[10px] text-gray-500 mt-4 text-center px-4 uppercase tracking-widest">
              Secure payments powered by SonicArt Gateway
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
