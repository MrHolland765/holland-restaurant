import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { FoodImage } from '../common/FoodImage';
import {
  Shield,
  ChefHat,
  Bike,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Search,
  Phone,
  MapPin,
  UtensilsCrossed,
  Package,
  TrendingUp,
  X,
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    orders,
    menuItems,
    deliveryStaff,
    updateOrderStatus,
    assignOrderToStaff,
    cancelOrder,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleStock,
  } = useRestaurant();
  const { showToast } = useToast();

  const [adminTab, setAdminTab] = useState('orders'); // 'orders' | 'menu' | 'riders' | 'reports'
  const [orderFilter, setOrderFilter] = useState('All');
  const [menuFilter, setMenuFilter] = useState('All');

  // Menu item modal state
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: '',
    category: 'Foods',
    price: '',
    prepTime: '15 mins',
    image: '',
    description: '',
  });

  // Rider assignment modal state
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(deliveryStaff[0]?.id || '');

  const formatTsh = (val) => Number(val || 0).toLocaleString('en-US');

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const preparingOrders = orders.filter((o) => o.status === 'Preparing').length;
  const outForDelivery = orders.filter((o) => o.status === 'Out for Delivery').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'All') return true;
    return o.status.toLowerCase() === orderFilter.toLowerCase();
  });

  const filteredMenuItems = menuItems.filter((i) => {
    if (menuFilter === 'All') return true;
    return i.category.toLowerCase() === menuFilter.toLowerCase();
  });

  const handleOpenAddMenu = () => {
    setEditingItem(null);
    setMenuForm({
      name: '',
      category: 'Foods',
      price: '',
      prepTime: '15 mins',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      description: '',
    });
    setIsMenuModalOpen(true);
  };

  const handleOpenEditMenu = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      category: item.category,
      price: item.price,
      prepTime: item.prepTime || '15 mins',
      image: item.image,
      description: item.description || '',
    });
    setIsMenuModalOpen(true);
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    if (!menuForm.name || !menuForm.price) {
      showToast('Tafadhali jaza jina na bei ya chakula', 'error');
      return;
    }

    if (editingItem) {
      await updateMenuItem(editingItem.id, {
        ...menuForm,
        price: Number(menuForm.price),
      });
      showToast(`${menuForm.name} imesasishwa kikamilifu!`, 'success');
    } else {
      await addMenuItem({
        ...menuForm,
        price: Number(menuForm.price),
      });
      showToast(`${menuForm.name} imeongezwa kwenye menyu ya Holland!`, 'success');
    }

    setIsMenuModalOpen(false);
  };

  const handleAssignRiderSubmit = (e) => {
    e.preventDefault();
    if (!assigningOrder || !selectedStaffId) return;

    assignOrderToStaff(assigningOrder.id, selectedStaffId);
    const staff = deliveryStaff.find((s) => s.id === selectedStaffId);
    showToast(`Oda #${assigningOrder.id} imepewa ${staff?.name}!`, 'success');
    setAssigningOrder(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-purple-900/30">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30 text-xs font-bold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Holland Restaurant (HQ)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Holland Restaurant Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Simamia mapokezi ya oda, jiko, madereva wa pikipiki (delivery riders) na bei za vyakula.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleOpenAddMenu}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Foods</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Mapato Yote (Sales)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            TSh {formatTsh(totalRevenue)}
          </h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">
            Kutoka oda {orders.length} zilizowekwa
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Oda Mpya (Pending)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-600 mt-2">
            {pendingOrders}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Zinahitaji kuidhinishwa
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Jikoni (Preparing)
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-blue-600 mt-2">
            {preparingOrders}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Zinaandaliwa na wapishi
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Njiani (On Road)
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-purple-600 mt-2">
            {outForDelivery}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Riders wanapeleka kwa wateja
          </p>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 flex flex-wrap gap-1.5">
        {[
          { id: 'orders', label: `Usimamizi wa Oda (${orders.length})`, icon: Package },
          { id: 'menu', label: `Menyu ya Vyakula (${menuItems.length})`, icon: UtensilsCrossed },
          { id: 'riders', label: `Madereva wa Delivery (${deliveryStaff.length})`, icon: Bike },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDERS DISPATCH PIPELINE */}
      {adminTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
            <h2 className="text-sm font-bold text-slate-800">
              Chuja kwa Hatua (Filter Status):
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Hakuna oda katika hatua hii.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:border-purple-300 transition-all"
                >
                  {/* Left: Customer & Items Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-900 text-white text-xs font-black rounded-lg">
                        #{order.id}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        {order.customerName} ({order.customerUsername})
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        • {order.date} saa {order.time}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                          order.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'Preparing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Out for Delivery'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Customer Details */}
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-800 font-bold">{order.customerPhone}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.customerAddress}</span>
                      </span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs">
                      <span className="font-bold text-slate-700 block mb-1">
                        Vyakula vilivyoagizwa:
                      </span>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600">
                        {order.items?.map((item) => (
                          <span key={item.id} className="font-medium">
                            • <b className="text-slate-900">{item.quantity}x</b> {item.name}
                          </span>
                        ))}
                      </div>
                      {order.specialNotes && (
                        <p className="mt-1.5 text-[11px] text-amber-800 font-semibold italic">
                          Maelezo ya mteja: "{order.specialNotes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons & Status Controllers */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Jumla ya Malipo
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        TSh {formatTsh(order.total)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(order.id, 'Preparing');
                            showToast(`Oda #${order.id} imepelekwa jikoni!`, 'info');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Peleka Jikoni (Preparing)</span>
                        </button>
                      )}

                      {order.status === 'Preparing' && (
                        <button
                          onClick={() => {
                            setAssigningOrder(order);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Choose Rider (Assign Staff)</span>
                        </button>
                      )}

                      {order.status === 'Out for Delivery' && (
                        <div className="text-xs text-purple-700 font-bold bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1.5">
                          <Bike className="w-4 h-4" />
                          <span>Rider: {order.assignedTo}</span>
                        </div>
                      )}

                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Ghairi oda #${order.id}?`)) {
                              cancelOrder(order.id);
                              showToast(`Oda #${order.id} imeghairiwa.`, 'error');
                            }
                          }}
                          className="px-2.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MENU MANAGEMENT (CRUD) */}
      {adminTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Kitengo:</span>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Foods', 'Snacks', 'Drinks', 'Sauces'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMenuFilter(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      menuFilter === cat
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleOpenAddMenu}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Food</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between gap-3"
              >
                <div className="flex gap-3">
                  <FoodImage
                    src={item.image}
                    alt={item.name}
                    category={item.category}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-purple-600">
                        {item.category}
                      </span>
                      <button
                        onClick={() => toggleStock(item.id).catch(() => showToast('Imeshindikana kubadili hali ya bidhaa', 'error'))}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.inStock
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                      {item.name}
                    </h4>
                    <span className="text-xs font-black text-slate-900 block mt-1">
                      TSh {formatTsh(item.price)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Muda: {item.prepTime || '15 mins'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleStock(item.id).catch(() => showToast('Imeshindikana kubadili hali ya bidhaa', 'error'))}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    {item.inStock ? 'Badili: Imeisha' : 'Badili: Ipo'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditMenu(item)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-purple-600 transition-colors"
                      title="Hariri"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Je, una uhakika unataka kufuta "${item.name}"?`)) {
                          deleteMenuItem(item.id)
                            .then(() => showToast(`${item.name} imefutwa!`, 'info'))
                            .catch(() => showToast('Imeshindikana kufuta bidhaa', 'error'));
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Futa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RIDERS / DELIVERY STAFF */}
      {adminTab === 'riders' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deliveryStaff.map((staff) => (
            <div
              key={staff.id}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-black text-lg flex items-center justify-center">
                  {staff.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{staff.name}</h4>
                  <p className="text-xs text-slate-500">{staff.vehicle}</p>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                      staff.status === 'Available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {staff.status}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone Number:</span>
                  <span className="font-bold text-slate-900">{staff.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Oda Zilizowasilishwa:</span>
                  <span className="font-bold text-slate-900">{staff.deliveriesCount} trips</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kiwango (Rating):</span>
                  <span className="font-bold text-amber-600">★ {staff.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD / EDIT MENU ITEM */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Hariri Chakula' : 'Add New Food (Holland Menu)'}
              </h3>
              <button
                onClick={() => setIsMenuModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Food Name:
                </label>
                <input
                  type="text"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  placeholder="mfano: Wali wa Nazi & Samaki"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category:
                  </label>
                  <select
                    value={menuForm.category}
                    onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Foods">Foods</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Sauces">Sauces</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (TSh):
                  </label>
                  <input
                    type="number"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                    placeholder="12000"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image URL:
                </label>
                <input
                  type="url"
                  value={menuForm.image}
                  onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description:
                </label>
                <textarea
                  rows={2}
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  placeholder="Viungo asilia, ladha nzuri..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  {editingItem ? 'Hifadhi Mabadiliko' : 'Add to Menu'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN STAFF TO ORDER */}
      {assigningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Mpe Dereva Oda #{assigningOrder.id}
              </h3>
              <button
                onClick={() => setAssigningOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Chagua dereva wa pikipiki (rider) atakayepeleka oda kwa mteja ({assigningOrder.customerName}, {assigningOrder.customerAddress}):
            </p>

            <form onSubmit={handleAssignRiderSubmit} className="space-y-3">
              {deliveryStaff.map((staff) => (
                <label
                  key={staff.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedStaffId === staff.id
                      ? 'bg-purple-50 border-purple-500 text-purple-950'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="staff_select"
                      checked={selectedStaffId === staff.id}
                      onChange={() => setSelectedStaffId(staff.id)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div>
                      <div className="text-xs font-bold">{staff.name}</div>
                      <div className="text-[11px] text-slate-500">{staff.vehicle} • {staff.phone}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {staff.status}
                  </span>
                </label>
              ))}

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Tuma Dereva (Out for Delivery)
                </button>
                <button
                  type="button"
                  onClick={() => setAssigningOrder(null)}
                  className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Funga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
