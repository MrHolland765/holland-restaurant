import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { FoodImage } from '../common/FoodImage';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  RefreshCw,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export const OrderUpdateCart = () => {
  const {
    menuItems,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartFee,
    cartTotal,
    setActiveView,
  } = useRestaurant();
  const { showToast } = useToast();

  const [localSearch, setLocalSearch] = useState('');

  const formatTsh = (val) => Number(val || 0).toLocaleString('en-US');

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(localSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header matching Sketch Page 5: Updates my orders: */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Holland Restaurant
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-amber-500" />
          <span>Updates my orders:</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          &rarr; My orders, Changes orders. Ongeza au badilisha vyakula kwenye kapu lako kabla ya kulipa.
        </p>

        {/* Sketch Page 5: Q Search foods */}
        <div className="mt-4 relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Q Search foods (Tafuta chakula, juisi au michuzi)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Food Quick Add Grid (Sketch Page 5: Cards with [add Cart]) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-700 px-1">
          Chagua Vyakula vya Kuongeza (Add to Cart):
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between gap-3 hover:border-amber-300 transition-all"
            >
              <div className="flex gap-3">
                <FoodImage
                  src={item.image}
                  alt={item.name}
                  category={item.category}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase">
                    {item.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="text-xs font-black text-slate-800">
                    TSh {formatTsh(item.price)}
                  </span>
                </div>
              </div>

              {/* Sketch button: [add Cart] */}
              <button
                onClick={() => {
                  addToCart(item, 1);
                  showToast(`${item.name} imeongezwa!`, 'success', 2000);
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>add Cart</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sketch Page 5: 🚚 Carts: Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-amber-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-black text-slate-900">
              Carts (Vyakula Vilivyomo Kwenye Kapu):
            </h2>
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Je, una uhakika unataka kufuta vyote kwenye cart?')) {
                  clearCart();
                }
              }}
              className="text-xs text-red-500 hover:text-red-700 font-bold"
            >
              Futa Vyote
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="p-10 text-center">
            <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Kapu lako (Cart) lipo tupu</p>
            <p className="text-xs text-slate-500 mt-1">
              Chagua chakula hapo juu kisha bofya "add Cart".
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <FoodImage
                      src={item.image}
                      alt={item.name}
                      category={item.category}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        TSh {formatTsh(item.price)} kila kimoja
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateCartQty(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-black text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs sm:text-sm font-black text-slate-900 w-24 text-right">
                      TSh {formatTsh(item.price * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Ondoa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary & Proceed to Payment */}
            <div className="pt-4 border-t border-slate-200/80 bg-slate-50 -mx-5 -mb-5 p-5 rounded-b-3xl space-y-3">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Jumla Ndogo (Subtotal):</span>
                <span className="font-bold">TSh {formatTsh(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Ada ya Uwasilishaji:</span>
                <span className="font-bold">
                  {cartFee === 0 ? 'BURE' : `TSh ${formatTsh(cartFee)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Jumla Yote (Total):</span>
                <span className="text-amber-600">TSh {formatTsh(cartTotal)}</span>
              </div>

              <button
                onClick={() => setActiveView('my_bill')}
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Endelea Kwenye Malipo (My Bills)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
