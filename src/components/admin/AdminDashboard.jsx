import React, {
  useEffect,
  useState,
} from 'react';

import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  ShoppingBag,
  Users,
  Truck,
  X,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react';

import { useRestaurant } from "../../context/RestaurantContext";

import {
  createDeliveryStaff,
  deleteDeliveryStaff,
} from "../../API";

const AdminDashboard = () => {

  const {
    menuItems,
    orders,
    deliveryStaff,
    refreshDeliveryStaff,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleStock,
    assignOrderToStaff,
  } = useRestaurant();


  // ===============================
  // STATES
  // ===============================

  const [activeTab, setActiveTab] =
    useState('dashboard');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [selectedStaffId, setSelectedStaffId] =
    useState('');

  const [isDeliveryModalOpen, setIsDeliveryModalOpen] =
    useState(false);

  const [isMenuModalOpen, setIsMenuModalOpen] =
    useState(false);

  const [editingMenuItem, setEditingMenuItem] =
    useState(null);

  const [toast, setToast] =
    useState(null);


  // ===============================
  // DELIVERY FORM
  // ===============================

  const [deliveryForm, setDeliveryForm] =
    useState({
      full_name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
    });


  // ===============================
  // MENU FORM
  // ===============================

  const [menuForm, setMenuForm] =
    useState({
      name: '',
      description: '',
      price: '',
      category: 'Foods',
      image: '',
      prepTime: '15-20 min',
      inStock: true,
    });


  // ===============================
  // SELECT FIRST DELIVERY STAFF
  // ===============================

  useEffect(() => {
    if (
      !selectedStaffId &&
      deliveryStaff.length > 0
    ) {
      setSelectedStaffId(
        deliveryStaff[0].id
      );
    }
  }, [
    deliveryStaff,
    selectedStaffId,
  ]);


  // ===============================
  // TOAST
  // ===============================

  const showToast = (
    message,
    type = 'success'
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };


  // ===============================
  // ADD DELIVERY ACCOUNT
  // ===============================

  const handleAddDelivery = async (
    e
  ) => {
    e.preventDefault();

    try {

      if (
        !deliveryForm.full_name ||
        !deliveryForm.email ||
        !deliveryForm.password
      ) {
        showToast(
          'Jina, email na password vinahitajika',
          'error'
        );
        return;
      }


      if (
        deliveryForm.password.length < 6
      ) {
        showToast(
          'Password lazima iwe na angalau herufi 6',
          'error'
        );
        return;
      }


      await createDeliveryStaff({
        full_name:
          deliveryForm.full_name,

        email:
          deliveryForm.email,

        password:
          deliveryForm.password,

        phone:
          deliveryForm.phone,

        address:
          deliveryForm.address,
      });


      await refreshDeliveryStaff();


      showToast(
        'Delivery account imetengenezwa successfully!',
        'success'
      );


      setDeliveryForm({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
      });


      setIsDeliveryModalOpen(false);

    } catch (error) {

      console.error(
        'CREATE DELIVERY ERROR:',
        error
      );

      showToast(
        error.message ||
          'Imeshindikana kutengeneza account',
        'error'
      );
    }
  };

  // ===============================
// DELETE DELIVERY STAFF
// ===============================

const handleDeleteDelivery = async (id) => {
  const confirmed = window.confirm(
    "Una uhakika unataka kufuta Delivery Staff huyu?"
  );

  if (!confirmed) return;

  try {
    await deleteDeliveryStaff(id);

    await refreshDeliveryStaff();

    showToast(
      "Delivery account imefutwa successfully!",
      "success"
    );
  } catch (error) {
    console.error("DELETE DELIVERY ERROR:", error);

    showToast(
      error.message ||
        "Imeshindikana kufuta Delivery account",
      "error"
    );
  }
};

  // ===============================
  // DELETE MENU
  // ===============================

  const handleDeleteMenu = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        'Una uhakika unataka kufuta bidhaa hii?'
      );

    if (!confirmed) return;

    try {

      await deleteMenuItem(id);

      showToast(
        'Product imefutwa successfully!',
        'success'
      );

    } catch (error) {

      console.error(error);

      showToast(
        error.message ||
          'Imeshindikana kufuta product',
        'error'
      );
    }
  };


  // ===============================
  // TOGGLE STOCK
  // ===============================

  const handleToggleStock = async (
    id
  ) => {

    try {

      await toggleStock(id);

      showToast(
        'Stock status imebadilishwa',
        'success'
      );

    } catch (error) {

      console.error(error);

      showToast(
        error.message ||
          'Imeshindikana kubadilisha stock',
        'error'
      );
    }
  };


  // ===============================
  // OPEN ADD MENU
  // ===============================

  const handleOpenAddMenu = () => {

    setEditingMenuItem(null);

    setMenuForm({
      name: '',
      description: '',
      price: '',
      category: 'Foods',
      image:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      prepTime: '15-20 min',
      inStock: true,
    });

    setIsMenuModalOpen(true);
  };


  // ===============================
  // OPEN EDIT MENU
  // ===============================

  const handleOpenEditMenu = (
    item
  ) => {

    setEditingMenuItem(item);

    setMenuForm({
      name: item.name || '',
      description:
        item.description || '',
      price: item.price || '',
      category:
        item.category || 'Foods',
      image: item.image || '',
      prepTime:
        item.prepTime ||
        '15-20 min',
      inStock:
        item.inStock ?? true,
    });

    setIsMenuModalOpen(true);
  };


  // ===============================
  // SAVE MENU
  // ===============================

  const handleSaveMenu = async (
    e
  ) => {

    e.preventDefault();

    try {

      if (
        !menuForm.name ||
        !menuForm.price
      ) {
        showToast(
          'Jina na price vinahitajika',
          'error'
        );
        return;
      }


      const productData = {
        name:
          menuForm.name,

        description:
          menuForm.description,

        price:
          Number(menuForm.price),

        category:
          menuForm.category,

        image:
          menuForm.image,

        prepTime:
          menuForm.prepTime,

        inStock:
          menuForm.inStock,
      };


      if (editingMenuItem) {

        await updateMenuItem(
          editingMenuItem.id,
          productData
        );

        showToast(
          'Product imeupdate successfully!',
          'success'
        );

      } else {

        await addMenuItem(
          productData
        );

        showToast(
          'Product imeongezwa successfully!',
          'success'
        );
      }


      setIsMenuModalOpen(false);

      setEditingMenuItem(null);

    } catch (error) {

      console.error(error);

      showToast(
        error.message ||
          'Imeshindikana kuhifadhi product',
        'error'
      );
    }
  };


  // ===============================
  // ASSIGN ORDER
  // ===============================

  const handleAssignOrder = (
    orderId
  ) => {

    if (!selectedStaffId) {

      showToast(
        'Chagua Delivery Staff kwanza',
        'error'
      );

      return;
    }

    assignOrderToStaff(
      orderId,
      selectedStaffId
    );

    showToast(
      'Order imepewa Delivery Staff',
      'success'
    );

    setSelectedOrder(null);
  };


  // ===============================
  // FILTER PRODUCTS
  // ===============================

  const filteredMenuItems =
    menuItems.filter((item) =>
      item.name
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
    );


  // ===============================
  // FILTER ORDERS
  // ===============================

  const filteredOrders =
    orders.filter((order) => {

      const search =
        searchQuery.toLowerCase();

      return (
        String(order.id)
          .toLowerCase()
          .includes(search) ||
        String(order.customerName)
          .toLowerCase()
          .includes(search)
      );
    });


  // ===============================
  // DASHBOARD METRICS
  // ===============================

  const totalProducts =
    menuItems.length;

  const totalOrders =
    orders.length;

  const totalCustomers =
    new Set(
      orders.map(
        (order) =>
          order.customerName
      )
    ).size;

  const totalDeliveryStaff =
    deliveryStaff.length;


  // ===============================
  // RENDER
  // ===============================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* TOAST */}

      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] rounded-lg px-5 py-3 text-white shadow-lg ${
            toast.type === 'error'
              ? 'bg-red-600'
              : 'bg-green-600'
          }`}
        >
          {toast.message}
        </div>
      )}


      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            Holland Restaurant Management
          </p>
        </div>


        <div className="flex items-center gap-3">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 outline-none focus:border-gray-900"
            />

          </div>

        </div>

      </div>


      {/* TABS */}

      <div className="mb-6 flex flex-wrap gap-2">

        <button
          onClick={() =>
            setActiveTab(
              'dashboard'
            )
          }
          className={`rounded-lg px-4 py-2 ${
            activeTab ===
            'dashboard'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          Dashboard
        </button>


        <button
          onClick={() =>
            setActiveTab('orders')
          }
          className={`rounded-lg px-4 py-2 ${
            activeTab === 'orders'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          Orders
        </button>


        <button
          onClick={() =>
            setActiveTab('menu')
          }
          className={`rounded-lg px-4 py-2 ${
            activeTab === 'menu'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          Menu
        </button>


        <button
          onClick={() =>
            setActiveTab(
              'delivery'
            )
          }
          className={`rounded-lg px-4 py-2 ${
            activeTab ===
            'delivery'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          Delivery Staff
        </button>

      </div>


      {/* DASHBOARD */}

      {activeTab ===
        'dashboard' && (

        <div className="space-y-6">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <div className="mb-3 flex items-center justify-between">

                <Package
                  size={24}
                />

              </div>

              <p className="text-sm text-gray-500">
                Total Products
              </p>

              <h2 className="text-2xl font-bold">
                {totalProducts}
              </h2>

            </div>


            <div className="rounded-xl bg-white p-5 shadow-sm">

              <div className="mb-3 flex items-center justify-between">

                <ShoppingBag
                  size={24}
                />

              </div>

              <p className="text-sm text-gray-500">
                Total Orders
              </p>

              <h2 className="text-2xl font-bold">
                {totalOrders}
              </h2>

            </div>


            <div className="rounded-xl bg-white p-5 shadow-sm">

              <div className="mb-3 flex items-center justify-between">

                <Users
                  size={24}
                />

              </div>

              <p className="text-sm text-gray-500">
                Customers
              </p>

              <h2 className="text-2xl font-bold">
                {totalCustomers}
              </h2>

            </div>


            <div className="rounded-xl bg-white p-5 shadow-sm">

              <div className="mb-3 flex items-center justify-between">

                <Truck
                  size={24}
                />

              </div>

              <p className="text-sm text-gray-500">
                Delivery Staff
              </p>

              <h2 className="text-2xl font-bold">
                {totalDeliveryStaff}
              </h2>

            </div>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <h2 className="mb-4 text-lg font-bold">
              Recent Orders
            </h2>

            <div className="space-y-3">

              {orders
                .slice(0, 5)
                .map((order) => (

                  <div
                    key={order.id}
                    className="flex flex-col gap-2 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                  >

                    <div>

                      <p className="font-semibold">
                        {order.id}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.customerName}
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <span className="font-semibold">
                        TZS{' '}
                        {Number(
                          order.total || 0
                        ).toLocaleString()}
                      </span>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                        {order.status}
                      </span>

                    </div>

                  </div>

                ))}

            </div>

          </div>

        </div>
      )}


      {/* ORDERS */}

      {activeTab ===
        'orders' && (

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-bold">
              Orders
            </h2>

          </div>


          <div className="space-y-4">

            {filteredOrders.map(
              (order) => (

                <div
                  key={order.id}
                  className="rounded-xl border p-4"
                >

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>

                      <p className="font-bold">
                        {order.id}
                      </p>

                      <p className="text-sm text-gray-600">
                        {order.customerName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.customerPhone}
                      </p>

                    </div>


                    <div className="flex items-center gap-3">

                      <span className="font-bold">
                        TZS{' '}
                        {Number(
                          order.total || 0
                        ).toLocaleString()}
                      </span>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                        {order.status}
                      </span>

                      <button
                        onClick={() =>
                          setSelectedOrder(
                            order
                          )
                        }
                        className="rounded-lg bg-gray-900 p-2 text-white"
                      >
                        <Eye
                          size={18}
                        />
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </div>
      )}


      {/* MENU */}

      {activeTab ===
        'menu' && (

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <h2 className="text-xl font-bold">
              Menu Management
            </h2>

            <button
              onClick={
                handleOpenAddMenu
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white"
            >
              <Plus size={18} />
              Add Product
            </button>

          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            {filteredMenuItems.map(
              (item) => (

                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border bg-white"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover"
                  />


                  <div className="p-4">

                    <div className="mb-2 flex items-start justify-between gap-2">

                      <h3 className="font-bold">
                        {item.name}
                      </h3>

                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          item.inStock
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.inStock
                          ? 'In Stock'
                          : 'Out of Stock'}
                      </span>

                    </div>


                    <p className="mb-2 text-sm text-gray-500">
                      {item.description}
                    </p>


                    <p className="mb-4 font-bold">
                      TZS{' '}
                      {Number(
                        item.price
                      ).toLocaleString()}
                    </p>


                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleOpenEditMenu(
                            item
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2"
                      >
                        <Edit
                          size={16}
                        />
                        Edit
                      </button>


                      <button
                        onClick={() =>
                          handleToggleStock(
                            item.id
                          )
                        }
                        className="rounded-lg border px-3 py-2"
                      >
                        {item.inStock
                          ? 'Hide'
                          : 'Show'}
                      </button>


                      <button
                        onClick={() =>
                          handleDeleteMenu(
                            item.id
                          )
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-red-600"
                      >
                        <Trash2
                          size={16}
                        />
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </div>
      )}


      {/* DELIVERY STAFF */}

      {activeTab ===
        'delivery' && (

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-xl font-bold">
                Delivery Staff
              </h2>

              <p className="text-sm text-gray-500">
                Manage Delivery accounts
              </p>

            </div>


            <button
              onClick={() =>
                setIsDeliveryModalOpen(
                  true
                )
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white"
            >
              <Plus size={18} />
              Add Delivery Staff
            </button>

          </div>


          {deliveryStaff.length ===
          0 ? (

            <div className="rounded-lg border border-dashed p-10 text-center">

              <Truck
                size={40}
                className="mx-auto mb-3 text-gray-400"
              />

              <p className="font-semibold">
                No Delivery Staff
              </p>

              <p className="text-sm text-gray-500">
                Add a Delivery Staff account
                to get started.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

              {deliveryStaff.map(
                (staff) => (

                  <div
                    key={staff.id}
                    className="rounded-xl border p-4"
                  >

                    <div className="mb-3 flex items-center justify-between">

                      <div>

                        <h3 className="font-bold">
                          {staff.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {staff.email}
                        </p>

                      </div>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                        {staff.status}
                      </span>

                    </div>


                    <div className="space-y-1 text-sm text-gray-600">

                      <p>
                        Phone:{' '}
                        {staff.phone ||
                          'Not provided'}
                      </p>

                      <p>
                        Address:{' '}
                        {staff.address ||
                          'Not provided'}
                      </p>

                      <div className="mt-4">
                       <button
                          onClick={() => handleDeleteDelivery(staff.id)}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
                        >
                         <Trash2 size={16} />
                          Delete
                       </button>
                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>
      )}


      {/* ADD DELIVERY MODAL */}

      {isDeliveryModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white p-6">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Add Delivery Staff
              </h2>

              <button
                onClick={() =>
                  setIsDeliveryModalOpen(
                    false
                  )
                }
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>


            <form
              onSubmit={
                handleAddDelivery
              }
              className="space-y-4"
            >

              <input
                type="text"
                placeholder="Full Name"
                value={
                  deliveryForm.full_name
                }
                onChange={(e) =>
                  setDeliveryForm(
                    (prev) => ({
                      ...prev,
                      full_name:
                        e.target.value,
                    })
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
              />


              <input
                type="email"
                placeholder="Email"
                value={
                  deliveryForm.email
                }
                onChange={(e) =>
                  setDeliveryForm(
                    (prev) => ({
                      ...prev,
                      email:
                        e.target.value,
                    })
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
              />


              <input
                type="text"
                placeholder="Phone"
                value={
                  deliveryForm.phone
                }
                onChange={(e) =>
                  setDeliveryForm(
                    (prev) => ({
                      ...prev,
                      phone:
                        e.target.value,
                    })
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
              />


              <input
                type="text"
                placeholder="Address"
                value={
                  deliveryForm.address
                }
                onChange={(e) =>
                  setDeliveryForm(
                    (prev) => ({
                      ...prev,
                      address:
                        e.target.value,
                    })
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
              />


              <input
                type="password"
                placeholder="Password"
                value={
                  deliveryForm.password
                }
                onChange={(e) =>
                  setDeliveryForm(
                    (prev) => ({
                      ...prev,
                      password:
                        e.target.value,
                    })
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
              />


              <button
                type="submit"
                className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white"
              >
                Create Delivery Account
              </button>

            </form>

          </div>

        </div>

      )}


      {/* MENU MODAL */}

      {isMenuModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold">

                {editingMenuItem
                  ? 'Edit Product'
                  : 'Add Product'}

              </h2>

              <button
                onClick={() =>
                  setIsMenuModalOpen(
                    false
                  )
                }
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>


            <form
              onSubmit={
                handleSaveMenu
              }
              className="space-y-4"
            >

              <input
                type="text"
                placeholder="Product Name"
                value={
                  menuForm.name
                }
                onChange={(e) =>
                  setMenuForm(
                    (prev) => ({
                      ...prev,
                      name:
                        e.target.value,
                    })
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none"
              />


              <textarea
                placeholder="Description"
                value={
                  menuForm.description
                }
                onChange={(e) =>
                  setMenuForm(
                    (prev) => ({
                      ...prev,
                      description:
                        e.target.value,
                    })
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none"
                rows="3"
              />


              <input
                type="number"
                placeholder="Price"
                value={
                  menuForm.price
                }
                onChange={(e) =>
                  setMenuForm(
                    (prev) => ({
                      ...prev,
                      price:
                        e.target.value,
                    })
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none"
              />


              <select
                value={
                  menuForm.category
                }
                onChange={(e) =>
                  setMenuForm(
                    (prev) => ({
                      ...prev,
                      category:
                        e.target.value,
                    })
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none"
              >
                <option value="Foods">
                  Foods
                </option>

                <option value="Drinks">
                  Drinks
                </option>

                <option value="Snacks">
                  Snacks
                </option>

              </select>


              <input
                type="text"
                placeholder="Image URL"
                value={
                  menuForm.image
                }
                onChange={(e) =>
                  setMenuForm(
                    (prev) => ({
                      ...prev,
                      image:
                        e.target.value,
                    })
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none"
              />


              <input
                type="text"
                placeholder="Preparation Time"
                value={
                  menuForm.prepTime
                }
                onChange={(e) =>
                  setMenuForm(
                    (prev) => ({
                      ...prev,
                      prepTime:
                        e.target.value,
                    })
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none"
              />


              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={
                    menuForm.inStock
                  }
                  onChange={(e) =>
                    setMenuForm(
                      (prev) => ({
                        ...prev,
                        inStock:
                          e.target.checked,
                      })
                    )
                  }
                />

                <span>
                  In Stock
                </span>

              </label>


              <button
                type="submit"
                className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white"
              >
                {editingMenuItem
                  ? 'Update Product'
                  : 'Add Product'}
              </button>

            </form>

          </div>

        </div>

      )}


      {/* ORDER DETAILS MODAL */}

      {selectedOrder && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Order Details
              </h2>

              <button
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>


            <div className="space-y-3">

              <p>
                <strong>
                  Order:
                </strong>{' '}
                {selectedOrder.id}
              </p>

              <p>
                <strong>
                  Customer:
                </strong>{' '}
                {
                  selectedOrder.customerName
                }
              </p>

              <p>
                <strong>
                  Phone:
                </strong>{' '}
                {
                  selectedOrder.customerPhone
                }
              </p>

              <p>
                <strong>
                  Address:
                </strong>{' '}
                {
                  selectedOrder.customerAddress
                }
              </p>

              <p>
                <strong>
                  Status:
                </strong>{' '}
                {
                  selectedOrder.status
                }
              </p>

              <p>
                <strong>
                  Total:
                </strong>{' '}
                TZS{' '}
                {Number(
                  selectedOrder.total ||
                    0
                ).toLocaleString()}
              </p>


              <div className="border-t pt-4">

                <h3 className="mb-3 font-bold">
                  Assign Delivery Staff
                </h3>


                <select
                  value={
                    selectedStaffId
                  }
                  onChange={(e) =>
                    setSelectedStaffId(
                      e.target.value
                    )
                  }
                  className="mb-3 w-full rounded-lg border px-4 py-3"
                >

                  <option value="">
                    Select Delivery Staff
                  </option>

                  {deliveryStaff.map(
                    (staff) => (

                      <option
                        key={staff.id}
                        value={staff.id}
                      >
                        {staff.name}
                      </option>

                    )
                  )}

                </select>


                <button
                  onClick={() =>
                    handleAssignOrder(
                      selectedOrder.id
                    )
                  }
                  className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white"
                >
                  Assign Order
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminDashboard;