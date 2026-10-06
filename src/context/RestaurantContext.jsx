import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  INITIAL_MENU_ITEMS,
} from '../data/mockData';

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  deleteOrder as deleteOrderRequest,
  getDeliveryStaff,
  getOrders,
  createOrder as createOrderRequest,
  updateOrder as updateOrderRequest,
  assignOrder as assignOrderRequest,
  confirmOrderPayment as confirmOrderPaymentRequest,
  rejectOrderPayment as rejectOrderPaymentRequest,
} from '../API';
import { useAuth } from './AuthContext';

const RestaurantContext = createContext(null);

export const RestaurantProvider = ({ children }) => {
  const { currentUser, currentRole, isAuthenticated } = useAuth();

  const formatProduct = (product) => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: Number(product.price),

    image:
      product.image === 'chicken-burger.jpg'
        ? 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'
        : product.image === 'beef-pizza.jpg'
          ? 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600'
          : product.image === 'chicken-chips.jpg'
            ? 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600'
            : product.image === 'fresh-juice.jpg'
              ? 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600'
              : product.image || '',

    category: [
      'Main Course',
      'Burger',
      'Pizza',
    ].includes(product.category)
      ? 'Foods'
      : product.category || 'Foods',

    rating: Number(product.rating || 5),

    inStock: Boolean(
      product.available ?? product.inStock
    ),

    prepTime:
      product.prep_time ||
      product.prepTime ||
      '15-20 min',
  });

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem(
      'holland_menu'
    );

    return saved
      ? JSON.parse(saved)
      : INITIAL_MENU_ITEMS;
  });

  useEffect(() => {
    if (!isAuthenticated || currentRole === 'delivery') return;

    let active = true;
    const loadProducts = async () => {
      try {
        const products = await getProducts();

        if (active) {
          setMenuItems(products.map(formatProduct));
        }
      } catch (error) {
        console.error(
          'Failed to load products:',
          error
        );
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, [isAuthenticated, currentRole]);

  const ownerKey = isAuthenticated && currentUser?.id
    ? `${currentRole}:${currentUser.id}`
    : null;
  const [ordersState, setOrdersState] = useState({
    ownerKey: null,
    records: [],
  });
  const orders = ordersState.ownerKey === ownerKey
    ? ordersState.records
    : [];

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(
      'holland_cart'
    );

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'f1',
            name: 'Biryani ya Kuku (Holland Special)',
            category: 'Foods',
            price: 12000,
            image:
              'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
            quantity: 1,
          },
          {
            id: 'd1',
            name: 'Holland Fresh Passion Juice (500ml)',
            category: 'Drinks',
            price: 3500,
            image:
              'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
            quantity: 2,
          },
        ];
  });

  const [deliveryStaff, setDeliveryStaff] =
    useState([]);

  const [activeView, setActiveView] =
    useState('dashboard');

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const refreshDeliveryStaff = useCallback(async () => {
    if (!isAuthenticated || currentRole !== 'admin') return;

    try {
      const staff = await getDeliveryStaff();

      const formattedStaff = staff.map(
        (user) => ({
          id: user.id,
          name: user.full_name,
          email: user.email,
          phone: user.phone || '',
          address: user.address || '',
          vehicle: 'Motorcycle',
          status: 'Available',
          deliveriesCount: 0,
          rating: 5,
        })
      );

      setDeliveryStaff(formattedStaff);
    } catch (error) {
      console.error(
        'Failed to load delivery staff:',
        error
      );
    }
  }, [isAuthenticated, currentRole]);

  useEffect(() => {
    if (!isAuthenticated || currentRole !== 'admin') return;

    refreshDeliveryStaff();
  }, [isAuthenticated, currentRole, refreshDeliveryStaff]);

  useEffect(() => {
    if (menuItems.length > 0) {
      localStorage.setItem(
        'holland_menu',
        JSON.stringify(menuItems)
      );
    }
  }, [menuItems]);

  useEffect(() => {
    localStorage.removeItem('holland_orders');
  }, []);

  useEffect(() => {
    let active = true;
    if (!ownerKey) return () => { active = false; };

    getOrders()
      .then((loadedOrders) => {
        if (active) {
          setOrdersState({
            ownerKey,
            records: loadedOrders,
          });
        }
      })
      .catch((error) => {
        console.error('Failed to load orders:', error);
      });

    return () => {
      active = false;
    };
  }, [ownerKey]);

  useEffect(() => {
    localStorage.setItem(
      'holland_cart',
      JSON.stringify(cart)
    );
  }, [cart]);

  const cartSubtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const cartFee =
    cart.length > 0
      ? cartSubtotal >= 50000
        ? 0
        : 2000
      : 0;

  const cartTotal =
    cartSubtotal + cartFee;

  const cartCount = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  const addToCart = (item, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id
      );

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity:
                  i.quantity + qty,
              }
            : i
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: qty,
        },
      ];
    });
  };

  const updateCartQty = (
    itemId,
    newQty
  ) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQty,
            }
          : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          item.id !== itemId
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = async ({
    paymentMethod,
    paymentPhone,
    paymentReference,
    specialNotes = '',
  }) => {
    const newOrder = await createOrderRequest({
      paymentMethod:
        paymentMethod ||
        'M-PESA (Vodacom)',
      paymentPhone:
        paymentPhone || '',
      paymentReference: paymentReference || '',
      items: [...cart],
      subtotal: cartSubtotal,
      fee: cartFee,
      total: cartTotal,
      specialNotes,
    });

    setOrdersState((prev) => prev.ownerKey === ownerKey
      ? { ...prev, records: [newOrder, ...prev.records] }
      : prev);

    clearCart();

    return newOrder;
  };

  const updateOrderStatus = async (
    orderId,
    newStatus,
    extra = {}
  ) => {
    const updatedOrder = await updateOrderRequest(orderId, {
      status: newStatus,
      ...extra,
    });
    setOrdersState((prev) => prev.ownerKey === ownerKey
      ? {
          ...prev,
          records: prev.records.map((order) => order.id === orderId ? updatedOrder : order),
        }
      : prev);
    return updatedOrder;
  };

  const deleteOrder = async (orderId) => {
    await deleteOrderRequest(orderId);
    setOrdersState((prev) => prev.ownerKey === ownerKey
      ? {
          ...prev,
          records: prev.records.filter((order) => order.id !== orderId),
        }
      : prev);
  };

  const assignOrderToStaff = async (
    orderId,
    staffId
  ) => {
    const staffMember =
      deliveryStaff.find(
        (s) =>
          String(s.id) ===
          String(staffId)
      );

    if (!staffMember) throw new Error('Delivery staff hajapatikana');
    const updatedOrder = await assignOrderRequest(orderId, staffId);
    setOrdersState((prev) => prev.ownerKey === ownerKey
      ? {
          ...prev,
          records: prev.records.map((order) => order.id === orderId ? updatedOrder : order),
        }
      : prev);

    setDeliveryStaff((prev) =>
      prev.map((s) =>
        String(s.id) ===
        String(staffId)
          ? {
              ...s,
              status:
                'On Delivery',
              currentTaskOrderId:
                orderId,
            }
          : s
      )
    );
  };

  const confirmOrderPayment = async (orderId) => {
    const updatedOrder = await confirmOrderPaymentRequest(orderId);
    setOrdersState((prev) => prev.ownerKey === ownerKey
      ? {
          ...prev,
          records: prev.records.map((order) => order.id === orderId ? updatedOrder : order),
        }
      : prev);
    return updatedOrder;
  };

  const rejectOrderPayment = async (orderId) => {
    const updatedOrder = await rejectOrderPaymentRequest(orderId);
    setOrdersState((prev) => prev.ownerKey === ownerKey
      ? {
          ...prev,
          records: prev.records.map((order) => order.id === orderId ? updatedOrder : order),
        }
      : prev);
    return updatedOrder;
  };

  const cancelOrder = async (
    orderId
  ) => {
    await updateOrderStatus(orderId, 'Cancelled');
  };

  const addMenuItem = async (
    item
  ) => {
    const product =
      await createProduct({
        ...item,
        available: true,
      });

    const newItem =
      formatProduct(product);

    setMenuItems((prev) => [
      newItem,
      ...prev,
    ]);

    return newItem;
  };

  const updateMenuItem = async (
    id,
    updatedFields
  ) => {
    const existing =
      menuItems.find(
        (item) =>
          String(item.id) ===
          String(id)
      );

    if (!existing) return;

    const product =
      await updateProduct(
        id,
        {
          ...existing,
          ...updatedFields,
          available:
            updatedFields.inStock ??
            existing.inStock,
        }
      );

    const updatedItem =
      formatProduct(product);

    setMenuItems((prev) =>
      prev.map((item) =>
        String(item.id) ===
        String(id)
          ? updatedItem
          : item
      )
    );
  };

  const deleteMenuItem = async (
    id
  ) => {
    await deleteProduct(id);

    setMenuItems((prev) =>
      prev.filter(
        (item) =>
          String(item.id) !==
          String(id)
      )
    );
  };

  const toggleStock = async (
    id
  ) => {
    const item =
      menuItems.find(
        (menuItem) =>
          String(menuItem.id) ===
          String(id)
      );

    if (!item) return;

    await updateMenuItem(
      id,
      {
        inStock:
          !item.inStock,
      }
    );
  };

  const resetToDefaultData = () => {
    setMenuItems(
      INITIAL_MENU_ITEMS
    );

    refreshDeliveryStaff();

    localStorage.removeItem(
      'holland_menu'
    );

    localStorage.removeItem(
      'holland_staff'
    );
  };

  return (
    <RestaurantContext.Provider
      value={{
        menuItems,
        orders,
        cart,
        deliveryStaff,
        refreshDeliveryStaff,
        activeView,
        setActiveView,
        sidebarOpen,
        setSidebarOpen,
        isCartOpen,
        setIsCartOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cartSubtotal,
        cartFee,
        cartTotal,
        cartCount,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        assignOrderToStaff,
        confirmOrderPayment,
        rejectOrderPayment,
        cancelOrder,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleStock,
        resetToDefaultData,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context =
    useContext(
      RestaurantContext
    );

  if (!context) {
    throw new Error(
      'useRestaurant must be used within RestaurantProvider'
    );
  }

  return context;
};