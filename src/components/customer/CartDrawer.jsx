import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { FoodImage } from '../common/FoodImage';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartFee,
    cartTotal,
    setActiveView,
  } = useRestaurant();

  if (!isCartOpen) return null;

  const formatTsh = (val) => Number(val || 0).toLocaleString('en-US');

  const handleCheckout = () => {
    setIsCartOpen(false);
    setActiveView('my_bill');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-500/10">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-black text-slate-900">
              Kapu Lako (Cart)
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Kapu lako lipo tupu</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Chagua vyakula vitamu vya Holland Restaurant ili kuanza kuagiza.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <FoodImage
                    src={item.image}
                    alt={item.name}
                    category={item.category}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-black text-amber-600">
                      TSh {formatTsh(item.price)}
                    </p>
                  </div>

                  {/* Qty */}
                  <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg bg-white px-1.5 py-0.5">
                    <button
                      onClick={() => updateCartQty(item.id, item.quantity - 1)}
                      className="p-1 text-slate-600 hover:text-slate-900"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.id, item.quantity + 1)}
                      className="p-1 text-slate-600 hover:text-slate-900"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200/80 bg-slate-50 space-y-3">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Gharama ya Vyakula:</span>
              <span className="font-bold">TSh {formatTsh(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Uwasilishaji:</span>
              <span className="font-bold">
                {cartFee === 0 ? 'BURE' : `TSh ${formatTsh(cartFee)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Jumla Yote:</span>
              <span className="text-amber-600 text-base">TSh {formatTsh(cartTotal)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Lipa Sasa (My Bills)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
