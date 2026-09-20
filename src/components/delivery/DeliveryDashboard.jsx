import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Bike,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  Navigation,
  DollarSign,
  Receipt,
  AlertCircle,
  PackageCheck,
  ChevronRight,
} from 'lucide-react';

export const DeliveryDashboard = () => {
  const { orders, updateOrderStatus } = useRestaurant();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' | 'completed'

  const formatTsh = (val) => Number(val || 0).toLocaleString('en-US');

  // Filter orders assigned to delivery or ready for delivery
  const assignedOrders = orders.filter(
    (o) => o.status === 'Out for Delivery' || o.status === 'Preparing'
  );

  const completedOrders = orders.filter((o) => o.status === 'Delivered');

  const handleAdvanceStatus = (order, nextStatus, label) => {
    updateOrderStatus(order.id, nextStatus);
    showToast(`Oda #${order.id} imebadilishwa kuwa: ${label}!`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Rider Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-900/30">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
              <Bike className="w-3.5 h-3.5" />
              <span>Holland Express Delivery</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Rider: {currentUser?.fullName || 'Juma Said'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Delivery Staff Portal
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Pokea oda zilizoidhinishwa, wasiliana na mteja, na kamilisha safari za uwasilishaji kwa wakati.
          </p>
        </div>

        {/* Rider Status Badge */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-xs">
            <span className="block font-bold text-white">Hali ya Dereva: Tayari</span>
            <span className="text-emerald-300">Bodaboda (MC 342 DJP)</span>
          </div>
        </div>
      </div>

      {/* Metrics for Rider */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Safari za Leo (Assigned)
          </span>
          <h3 className="text-2xl font-black text-amber-600 mt-2">
            {assignedOrders.length}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Zinahitaji kufikishwa kwa wateja
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Safari Zilizokamilika (Delivered)
          </span>
          <h3 className="text-2xl font-black text-emerald-600 mt-2">
            {completedOrders.length}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Zimekabidhiwa salama
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Makadirio ya Posho ya Uwasilishaji
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">
            TSh {formatTsh(completedOrders.length * 2500)}
          </h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">
            TSh 2,500 kwa kila safari
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 flex gap-2">
        <button
          onClick={() => setActiveTab('assigned')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'assigned'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Oda za Kupeleka ({assignedOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Safari Zilizokamilika ({completedOrders.length})</span>
        </button>
      </div>

      {/* TAB 1: ASSIGNED DELIVERIES */}
      {activeTab === 'assigned' && (
        <div className="space-y-4">
          {assignedOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <PackageCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">
                Hakuna oda ya uwasilishaji kwa sasa
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Ukipangiwa oda mpya na admin wa Holland Restaurant, itaonekana hapa moja kwa moja.
              </p>
            </div>
          ) : (
            assignedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-emerald-400 transition-all space-y-4"
              >
                {/* Header of Task */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-black">
                      #{order.id}
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        {order.customerName}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        Iliwekwa: {order.date} saa {order.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.status === 'Out for Delivery'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {order.status === 'Out for Delivery' ? 'Njiani (On the way)' : 'Jikoni (Preparing)'}
                    </span>
                    <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                      TSh {formatTsh(order.total)}
                    </span>
                  </div>
                </div>

                {/* Customer Location & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>Anwani ya Kufikisha (Delivery Address):</span>
                    </div>
                    <p className="text-slate-900 font-black pl-5 text-sm">
                      {order.customerAddress}
                    </p>
                  </div>

                  <div className="space-y-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span>Namba ya Simu ya Mteja:</span>
                      </div>
                      <p className="text-slate-900 font-black pl-5 text-sm">
                        {order.customerPhone}
                      </p>
                    </div>

                    <a
                      href={`tel:${order.customerPhone}`}
                      className="self-start ml-5 mt-1 px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Piga Simu kwa Mteja</span>
                    </a>
                  </div>
                </div>

                {/* Items & Payment Info */}
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-700">Mizigo / Vyakula vya Mteja:</div>
                  <div className="flex flex-wrap gap-2">
                    {order.items?.map((item) => (
                      <span
                        key={item.id}
                        className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-semibold"
                      >
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                  {order.specialNotes && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">
                      Kumbuka: "{order.specialNotes}"
                    </div>
                  )}
                  <div className="pt-1 text-[11px] text-slate-500">
                    Hali ya Malipo: <b className="text-emerald-700">{order.paymentMethod} - {order.paymentStatus}</b>
                  </div>
                </div>

                {/* Delivery Progression Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
                  {order.status === 'Preparing' && (
                    <button
                      onClick={() =>
                        handleAdvanceStatus(
                          order,
                          'Out for Delivery',
                          'Nimechukua Jikoni Holland'
                        )
                      }
                      className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                    >
                      <Bike className="w-4 h-4" />
                      <span>Chukua Jikoni & Anza Safari (Pick Up)</span>
                    </button>
                  )}

                  {order.status === 'Out for Delivery' && (
                    <>
                      <button
                        onClick={() =>
                          showToast(
                            `Ramani ya kwenda ${order.customerAddress} inafunguliwa!`,
                            'info'
                          )
                        }
                        className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Fungua Ramani (Directions)</span>
                      </button>

                      <button
                        onClick={() =>
                          handleAdvanceStatus(
                            order,
                            'Delivered',
                            'Chakula Kimewasilishwa kwa Mteja'
                          )
                        }
                        className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Thibitisha Kukabidhi (Mark as Delivered)</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: COMPLETED TRIPS */}
      {activeTab === 'completed' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-xs text-slate-700 uppercase">
            Historia ya Safari Zilizokamilika ({completedOrders.length})
          </div>
          <div className="divide-y divide-slate-100">
            {completedOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      #{order.id}
                    </span>
                    <span className="text-xs text-slate-700 font-semibold">
                      {order.customerName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Delivered ✓
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {order.customerAddress} • {order.date} {order.time}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 block">
                    TSh {formatTsh(order.total)}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold">
                    Posho ya dereva: TSh 2,500
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
