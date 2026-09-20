import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  CreditCard,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Receipt,
} from 'lucide-react';

export const PaymentBill = () => {
  const {
    cart,
    cartSubtotal,
    cartFee,
    cartTotal,
    createOrder,
    setActiveView,
    clearCart,
  } = useRestaurant();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // Selected payment method: 'mpesa' | 'card' | 'cash'
  const [paymentMethod, setPaymentMethod] = useState('mpesa');

  // Mobile Money Provider: 'vodacom' | 'tigo' | 'airtel' | 'halopesa'
  const [mobileProvider, setMobileProvider] = useState('vodacom');
  const [mobilePhone, setMobilePhone] = useState('712345678');

  // Bank Card Form
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');

  // Special Notes
  const [specialNotes, setSpecialNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatTsh = (val) => Number(val || 0).toLocaleString('en-US');

  // Transaction fee calculation (Sketch: "Ada ya Muamala: (Itahasabiwa)")
  const calculateTransactionFee = () => {
    if (paymentMethod === 'mpesa') {
      if (cartSubtotal > 50000) return 1200;
      if (cartSubtotal > 20000) return 800;
      return 500;
    }
    if (paymentMethod === 'card') {
      return Math.round(cartSubtotal * 0.015); // 1.5% bank processing
    }
    return 0; // Cash
  };

  const transactionFee = calculateTransactionFee();
  const grandTotal = cartTotal + transactionFee;

  const handlePayNow = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Kapu lako halina chakula! Tafadhali chagua chakula kwanza.', 'error');
      setActiveView('dashboard');
      return;
    }

    if (paymentMethod === 'mpesa' && (!mobilePhone || mobilePhone.length < 9)) {
      showToast('Tafadhali weka namba sahihi ya simu (mfano: 712345678)', 'error');
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      showToast('Tafadhali kamilisha maelezo yote ya kadi ya benki', 'error');
      return;
    }

    setIsProcessing(true);

    // Simulate USSD push prompt or card processing
    setTimeout(() => {
      let methodLabel = 'M-PESA (Vodacom)';
      if (paymentMethod === 'mpesa') {
        const providerName =
          mobileProvider === 'vodacom'
            ? 'Vodacom M-PESA'
            : mobileProvider === 'tigo'
            ? 'Tigo Pesa'
            : mobileProvider === 'airtel'
            ? 'Airtel Money'
            : 'Halopesa';
        methodLabel = `${providerName} (+255 ${mobilePhone})`;
      } else if (paymentMethod === 'card') {
        methodLabel = `Kadi ya Benki (**** ${cardNumber.slice(-4)})`;
      } else {
        methodLabel = 'Lipa Baadaye (Cash on Delivery)';
      }

      const newOrder = createOrder({
        paymentMethod: methodLabel,
        paymentPhone: `+255 ${mobilePhone}`,
        specialNotes: specialNotes,
        customer: currentUser,
      });

      setIsProcessing(false);
      showToast(`Malipo ya TSh ${formatTsh(grandTotal)} yamefanikiwa! Oda #${newOrder.id} imeundwa.`, 'success', 4000);
      setActiveView('my_orders');
    }, 1500);
  };

  const handleCancel = () => {
    if (window.confirm('Je, unataka kubatilisha (Cancel) na kurudi kwenye Dashboard?')) {
      setActiveView('dashboard');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Header matching Sketch Page 6: My Bills */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Holland Restaurant
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-amber-500" />
            <span>My Bills (Ukurasa wa Bili & Malipo)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Confirm payment. Choose method of payment.
          </p>
        </div>

        <button
          onClick={() => setActiveView('updates_orders')}
          className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Rudi kwenye Cart</span>
        </button>
      </div>

      {/* Main Payment Container */}
      <form onSubmit={handlePayNow} className="space-y-6">
        {/* Method Selector Tabs (Sketch Page 6: M-PESA Box & VISA/Mastercard Box) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* BOX 1: M-PESA (Vodacom) - Lipa kwa simu (Sketch Page 6) */}
          <div
            onClick={() => setPaymentMethod('mpesa')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              paymentMethod === 'mpesa'
                ? 'bg-amber-50/50 border-amber-500 shadow-md shadow-amber-500/10'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    M
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 leading-tight">
                      M-PESA (Vodacom)
                    </h2>
                    <span className="text-xs font-bold text-amber-600">
                      Lipa kwa simu
                    </span>
                  </div>
                </div>

                <input
                  type="radio"
                  name="payment_choice"
                  checked={paymentMethod === 'mpesa'}
                  onChange={() => setPaymentMethod('mpesa')}
                  className="w-4 h-4 text-amber-600"
                />
              </div>

              {/* Provider Buttons */}
              <div className="grid grid-cols-3 gap-1.5 mb-4">
                {[
                  { id: 'vodacom', label: 'Vodacom (M-Pesa)' },
                  { id: 'tigo', label: 'Tigo (Pesa)' },
                  { id: 'airtel', label: 'Airtel Money' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileProvider(p.id);
                      setPaymentMethod('mpesa');
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      mobileProvider === p.id && paymentMethod === 'mpesa'
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Phone Input matching sketch: Namba ya simu. (255) [________] */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Namba ya simu:
                </label>
                <div className="flex items-center rounded-2xl bg-white border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                  <span className="px-3.5 py-2.5 bg-slate-100 text-xs font-black text-slate-700 border-r border-slate-200">
                    (255)
                  </span>
                  <input
                    type="tel"
                    value={mobilePhone}
                    onChange={(e) => setMobilePhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="712 345 678"
                    maxLength={9}
                    className="flex-1 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Utapokea ujumbe kwenye simu yako kuthibitisha nenosiri la M-PESA.
                </p>
              </div>
            </div>

            {/* Sketch button: [Chagua] */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-xl ${
                  paymentMethod === 'mpesa'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {paymentMethod === 'mpesa' ? 'Imechaguliwa ✓' : 'Chagua'}
              </span>
            </div>
          </div>

          {/* BOX 2: VISA / MASTERCARD - Lipa kwa kadi ya Benki (Sketch Page 6) */}
          <div
            onClick={() => setPaymentMethod('card')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              paymentMethod === 'card'
                ? 'bg-blue-50/50 border-blue-600 shadow-md shadow-blue-600/10'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 leading-tight">
                      VISA / MASTERCARD
                    </h2>
                    <span className="text-xs font-bold text-blue-600">
                      Lipa kwa kadi ya Benki
                    </span>
                  </div>
                </div>

                <input
                  type="radio"
                  name="payment_choice"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="w-4 h-4 text-blue-600"
                />
              </div>

              {/* Inputs matching sketch: Namba ya kadi, Tarehe (mm/yy), CVV */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Namba ya kadi:
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    className="w-full px-3.5 py-2 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tarehe (mm/yy):
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full px-3.5 py-2 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      CVV:
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={4}
                      placeholder="•••"
                      className="w-full px-3.5 py-2 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-xl ${
                  paymentMethod === 'card'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {paymentMethod === 'card' ? 'Imechaguliwa ✓' : 'Chagua'}
              </span>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80">
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Maagizo Maalum kwa Holland Restaurant (Hiari):
          </label>
          <input
            type="text"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="mfano: Mchuzi uwe pembeni, pilipili nyingi, nitaipokea getini..."
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Bottom Bill Summary Box (Exact matching sketch Page 6) */}
        {/* Bill: _____ | Ada ya Muamala: (Itahasabiwa) _____ | Total: _____ */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Mchanganuo wa Bili (Bill Breakdown):
          </h2>

          <div className="flex justify-between items-center text-sm font-bold text-slate-700">
            <span>Bill (Gharama ya Vyakula):</span>
            <span className="font-black text-slate-900">TSh {formatTsh(cartSubtotal)}</span>
          </div>

          <div className="flex justify-between items-center text-sm font-bold text-slate-700">
            <span>Uwasilishaji (Delivery):</span>
            <span className="font-black text-slate-900">
              {cartFee === 0 ? 'BURE (Free Promo)' : `TSh ${formatTsh(cartFee)}`}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm font-bold text-slate-700">
            <span>Ada ya Muamala: (Itahasabiwa)</span>
            <span className="font-black text-slate-900">TSh {formatTsh(transactionFee)}</span>
          </div>

          <div className="pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block">
                Jumla Kamili
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                Total:
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-amber-600">
              TSh {formatTsh(grandTotal)}
            </span>
          </div>

          {/* Action Buttons (Sketch Page 6: [LIPA SASA] [Batilisha]) */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isProcessing || cart.length === 0}
              className={`flex-1 py-4 px-6 rounded-2xl font-black text-base transition-all shadow-lg flex items-center justify-center gap-2 ${
                isProcessing || cart.length === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white shadow-emerald-600/25'
              }`}
            >
              {isProcessing ? (
                <span>Inashughulikia Malipo...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>LIPA SASA</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
            >
              Batilisha
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
