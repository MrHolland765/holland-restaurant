import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  ShieldCheck,
  Receipt,
  Smartphone,
} from 'lucide-react';

const MOBILE_MONEY_PROVIDERS = [
  { id: 'tigo', label: 'Tigo Pesa', paymentMethod: 'Tigo Pesa (Manual)' },
  { id: 'mpesa', label: 'M-Pesa', paymentMethod: 'M-Pesa (Manual)' },
  { id: 'airtel', label: 'Airtel Money', paymentMethod: 'Airtel Money (Manual)' },
  { id: 'halopesa', label: 'Halo Pesa', paymentMethod: 'Halo Pesa (Manual)' },
];

export const PaymentBill = () => {
  const {
    cart,
    cartSubtotal,
    cartFee,
    cartTotal,
    createOrder,
    setActiveView,
  } = useRestaurant();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('tigo');

  const [mobilePhone, setMobilePhone] = useState(
    currentUser?.phone?.replace(/\D/g, '').slice(-9) || ''
  );
  const [paymentReference, setPaymentReference] = useState('');

  // Special Notes
  const [specialNotes, setSpecialNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatTsh = (val) => Number(val || 0).toLocaleString('en-US');

  const grandTotal = cartTotal;

  const handlePayNow = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Kapu lako halina chakula! Tafadhali chagua chakula kwanza.', 'error');
      setActiveView('dashboard');
      return;
    }

    if (paymentMethod !== 'cash' && (!mobilePhone || mobilePhone.length < 9)) {
      showToast('Tafadhali weka namba sahihi ya simu (mfano: 712345678)', 'error');
      return;
    }

    if (paymentMethod !== 'cash' && !/^[A-Z0-9-]{6,40}$/i.test(paymentReference.trim())) {
      showToast(`Weka transaction ID ya ${MOBILE_MONEY_PROVIDERS.find((provider) => provider.id === paymentMethod)?.label} baada ya kutuma pesa.`, 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const newOrder = await createOrder({
        paymentMethod: MOBILE_MONEY_PROVIDERS.find((provider) => provider.id === paymentMethod)?.paymentMethod || 'Lipa Baadaye (Cash on Delivery)',
        paymentPhone: paymentMethod === 'cash' ? currentUser?.phone || '' : `+255 ${mobilePhone}`,
        paymentReference: paymentMethod === 'cash' ? '' : paymentReference.trim().toUpperCase(),
        specialNotes: specialNotes,
      });

      showToast(
        paymentMethod !== 'cash'
          ? `Oda #${newOrder.id} imetumwa. Malipo yatasubiri uthibitisho wa admin.`
          : `Oda #${newOrder.id} imeundwa; utalipa unapopokea.`,
        'success',
        4000
      );
      setActiveView('my_orders');
    } catch (error) {
      showToast(error.message || 'Imeshindikana kutuma oda. Jaribu tena.', 'error');
    } finally {
      setIsProcessing(false);
    }
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
            Chagua mtandao wa simu, tuma malipo kwa namba ya biashara, au ulipe taslimu unapopokea.
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
          {/* Mobile money manual payment */}
          <div
            onClick={() => setPaymentMethod((previous) => previous === 'cash' ? 'tigo' : previous)}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              paymentMethod !== 'cash'
                ? 'bg-amber-50/50 border-amber-500 shadow-md shadow-amber-500/10'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    T
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 leading-tight">
                      Malipo ya simu
                    </h2>
                    <span className="text-xs font-bold text-amber-600">
                      Malipo ya moja kwa moja (manual)
                    </span>
                  </div>
                </div>

                <input
                  type="radio"
                  name="payment_choice"
                  checked={paymentMethod !== 'cash'}
                  onChange={() => setPaymentMethod('tigo')}
                  className="w-4 h-4 text-amber-600"
                />
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-2">
                  {MOBILE_MONEY_PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPaymentMethod(provider.id);
                      }}
                      className={`rounded-xl border px-3 py-2 font-bold ${
                        paymentMethod === provider.id
                          ? 'border-amber-600 bg-amber-500 text-white'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {provider.label}
                    </button>
                  ))}
                </div>
                <p className="rounded-xl bg-white p-3 border border-slate-200">
                  Tuma <strong>TSh {formatTsh(grandTotal)}</strong> kupitia {MOBILE_MONEY_PROVIDERS.find((provider) => provider.id === paymentMethod)?.label} kwenda namba
                  <strong className="ml-1 text-base text-slate-900">0657281070</strong>.
                  Chagua huduma ya kutuma kwenda mitandao mingine, na thibitisha jina la mpokeaji ni Holland Restaurant. Namba hii ni ya Tigo Pesa.
                </p>
                <label className="block font-bold">
                  Namba yako ya {MOBILE_MONEY_PROVIDERS.find((provider) => provider.id === paymentMethod)?.label}:
                  <input
                    type="tel"
                    value={mobilePhone}
                    onChange={(event) => setMobilePhone(event.target.value.replace(/\D/g, ''))}
                    placeholder="712345678"
                    maxLength={9}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal"
                  />
                </label>
                <label className="block font-bold">
                  Transaction ID (kutoka kwenye SMS ya malipo):
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(event) => setPaymentReference(event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 40))}
                    placeholder="Andika transaction ID iliyo kwenye SMS"
                    maxLength={40}
                    required={paymentMethod !== 'cash'}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal uppercase"
                  />
                </label>
                <p className="text-amber-800">
                  Hii ni manual: oda itasubiri admin athibitishe muamala. Cross-network transfer itumie tu ikiwa huduma yako inaruhusu; usitumie transaction ID ya kubuni.
                </p>
              </div>
            </div>

            {/* Sketch button: [Chagua] */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-xl ${
                  paymentMethod !== 'cash'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {paymentMethod !== 'cash' ? `${MOBILE_MONEY_PROVIDERS.find((provider) => provider.id === paymentMethod)?.label} imechaguliwa ✓` : 'Chagua'}
              </span>
            </div>
          </div>

          {/* Cash on delivery */}
          <div
            onClick={() => setPaymentMethod('cash')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              paymentMethod === 'cash'
                ? 'bg-emerald-50/50 border-emerald-600 shadow-md shadow-emerald-600/10'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 leading-tight">
                      Lipa unapopokea
                    </h2>
                    <span className="text-xs font-bold text-emerald-700">
                      Cash on Delivery
                    </span>
                  </div>
                </div>

                <input
                  type="radio"
                  name="payment_choice"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="w-4 h-4 text-emerald-600"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
                Lipa fedha taslimu kwa delivery staff baada ya oda kufikishwa.
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-xl ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {paymentMethod === 'cash' ? 'Imechaguliwa ✓' : 'Chagua'}
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
            <span>Ada ya malipo ya mtandaoni:</span>
            <span className="font-black text-slate-900">Hakuna</span>
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

          {/* Submit the order or return to the menu */}
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
                <span>Inatuma oda...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>{paymentMethod !== 'cash' ? 'NIMELIPA / WEKA ODA' : 'WEKA ODA'}</span>
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
