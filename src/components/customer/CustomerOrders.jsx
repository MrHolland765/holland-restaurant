import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Clock,
  CheckCircle2,
  Bike,
  ChefHat,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  ChevronRight,
  ExternalLink,
  Plus,
  RefreshCw,
} from 'lucide-react';

export const CustomerOrders = () => {
  const { orders, updateOrderStatus, setActiveView } = useRestaurant();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateNotes, setUpdateNotes] = useState('');

  const formatTsh = (val) => Number(val || 0).toLocaleString('en-US');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Clock,
          label: 'Inasubiri (Pending)',
        };
      case 'Preparing':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: ChefHat,
          label: 'Inapikwa Jikoni (Preparing)',
        };
      case 'Out for Delivery':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          icon: Bike,
          label: 'Njiani Inakuja (On the way)',
        };
      case 'Delivered':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
          label: 'Imefika / Imekabidhiwa (Delivered)',
        };
      case 'Cancelled':
        return {
          bg: 'bg-red-50 text-red-800 border-red-200',
          icon: AlertCircle,
          label: 'Imeghairiwa (Cancelled)',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-800 border-slate-200',
          icon: Clock,
          label: status,
        };
    }
  };

  const handleOpenUpdate = (order) => {
    setSelectedOrder(order);
    setUpdateNotes(order.specialNotes || '');
    setUpdateModalOpen(true);
  };

  const handleSaveUpdate = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateOrderStatus(selectedOrder.id, selectedOrder.status, {
      specialNotes: updateNotes,
    });
    showToast(`Taarifa za oda ${selectedOrder.id} zimebadilishwa kikamilifu!`, 'success');
    setUpdateModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header matching Sketch Page 4: My Orders */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Holland Restaurant
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" />
            <span>My Orders (Oda Zangu)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fuatilia hatua za chakula chako kuanzia jikoni hadi mlangoni kwako.
          </p>
        </div>

        <button
          onClick={() => setActiveView('dashboard')}
          className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Weka Oda Mpya</span>
        </button>
      </div>

      {/* Orders Table / List (Direct from Sketch Page 4) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Orodha ya Oda ({orders.length})
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            Bofya "Updates" kurekebisha au kuona maelezo
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Huna oda yoyote kwa sasa</h3>
            <p className="text-xs text-slate-500 mt-1">Chagua vyakula na uweke oda sasa.</p>
            <button
              onClick={() => setActiveView('dashboard')}
              className="mt-4 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl"
            >
              Nenda Kwenye Menu
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((order, index) => {
              const badge = getStatusBadge(order.status);
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Row Number / Checkbox & Order Info (Sketch Page 4 format: 1. Foods Dates Time) */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">
                          #{order.id}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">
                          {order.items?.map((i) => i.name).join(', ') || 'Chakula'}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${badge.bg}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      {/* Dates & Time (From Sketch Page 4: Dates | Time) */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Dates: {order.date}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Time: {order.time}</span>
                        </span>
                        <span className="text-slate-700 font-bold">
                          Jumla: TSh {formatTsh(order.total)}
                        </span>
                        {order.assignedTo && order.assignedTo !== 'Unassigned' && (
                          <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-semibold text-[11px] flex items-center gap-1">
                            <Bike className="w-3 h-3" />
                            <span>Rider: {order.assignedTo} ({order.deliveryPhone})</span>
                          </span>
                        )}
                      </div>

                      {order.specialNotes && (
                        <p className="text-[11px] text-amber-800 bg-amber-50/70 px-2.5 py-1 rounded-lg inline-block border border-amber-200/60 mt-1">
                          Maelezo: "{order.specialNotes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: [Updates] Action Button (Exact from Sketch Page 4) */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleOpenUpdate(order)}
                      className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                      <span>Updates</span>
                    </button>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3.5 py-2 rounded-2xl bg-amber-50 text-amber-900 hover:bg-amber-100 font-bold text-xs transition-all"
                    >
                      Fuatilia Ramani
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visual Step-by-Step Tracker Modal / Drawer */}
      {selectedOrder && !updateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-fade-in space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Ufuatiliaji wa Oda
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Oda #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Stepper Progress */}
            <div className="space-y-4">
              {[
                { step: 'Pending', title: '1. Oda Imepokelewa', desc: 'Mteja ameweka oda na malipo yamehakikiwa.' },
                { step: 'Preparing', title: '2. Inapikwa Jikoni', desc: 'Wapishi wa Holland Restaurant wanaandaa chakula safi.' },
                { step: 'Out for Delivery', title: '3. Njiani Inakuja', desc: `Rider ${selectedOrder.assignedTo || 'wa Holland'} anakuja na oda yako.` },
                { step: 'Delivered', title: '4. Imekabidhiwa', desc: 'Chakula kimewasili salama. Karibu tena!' },
              ].map((s, idx) => {
                const statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
                const currentIdx = statuses.indexOf(selectedOrder.status);
                const isCompleted = currentIdx >= idx;
                const isCurrent = currentIdx === idx;

                return (
                  <div key={s.step} className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-amber-600 text-sm' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {s.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-snug">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Items Summary */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-2">
              <div className="font-bold text-slate-800">Vyakula Vilivyoagizwa:</div>
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-slate-600">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-semibold">TSh {formatTsh(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900">
                <span>Jumla Yote:</span>
                <span>TSh {formatTsh(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleOpenUpdate(selectedOrder)}
                className="flex-1 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
              >
                Fanya Marekebisho (Updates)
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Funga
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sketch Page 4 & 5 Update Modal */}
      {updateModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Updates My Orders: #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setUpdateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Ongeza maagizo au mabadiliko maalum kwa ajili ya jiko au msafirishaji:
            </p>

            <form onSubmit={handleSaveUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Changes Orders / Maelezo ya Ziada:
                </label>
                <textarea
                  rows={3}
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="mfano: Ongeza pilipili na kachumbari pembeni, au badilisha muda..."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  Hifadhi Marekebisho
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(false)}
                  className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Batilisha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
