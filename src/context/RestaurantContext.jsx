import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_MENU_ITEMS, INITIAL_ORDERS, DELIVERY_STAFF } from '../data/mockData';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../API';

const RestaurantContext = createContext(null);

export const RestaurantProvider = ({ children }) => {
  const formatProduct = (product) => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: Number(product.price),
    image: product.image === 'chicken-burger.jpg'
      ? 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'
      : product.image === 'beef-pizza.jpg'
        ? 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600'
        : product.image === 'chicken-chips.jpg'
          ? 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600'
          : product.image === 'fresh-juice.jpg'
            ? 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600'
            : product.image || '',
    category: ['Main Course', 'Burger', 'Pizza'].includes(product.category) ? 'Foods' : product.category || 'Foods',
    rating: Number(product.rating || 5),
    inStock: Boolean(product.available ?? product.inStock),
    prepTime: product.prep_time || product.prepTime || '15-20 min',
  });
  // Menu items
  const [menuItems, setMenuItems] = useState(() => {
  const saved = localStorage.getItem('holland_menu');
  return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
});

useEffect(() => {
  const loadProducts = async () => {
    try {
      const products = await getProducts();

      setMenuItems(products.map(formatProduct));
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  loadProducts();
}, []);

  // Orders
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('holland_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Cart
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('holland_cart');
    return saved ? JSON.parse(saved) : [
      {
        id: 'f1',
        name: 'Biryani ya Kuku (Holland Special)',
        category: 'Foods',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
      },
      {
        id: 'd1',
        name: 'Holland Fresh Passion Juice (500ml)',
        category: 'Drinks',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
        quantity: 2,
      },
    ];
  });

  // Delivery Staff
  const [deliveryStaff, setDeliveryStaff] = useState(() => {
    const saved = localStorage.getItem('holland_staff');
    return saved ? JSON.parse(saved) : DELIVERY_STAFF;
  });

  // Active navigation view (e.g. 'dashboard', 'my_orders', 'updates_orders', 'my_bill', 'personal_info', 'admin_dashboard', 'delivery_dashboard')
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Persistence
  useEffect(() => {
  if (menuItems.length > 0) {
    localStorage.setItem('holland_menu', JSON.stringify(menuItems));
  }
}, [menuItems]); 

  useEffect(() => {
    localStorage.setItem('holland_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('holland_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('holland_staff', JSON.stringify(deliveryStaff));
  }, [deliveryStaff]);

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartFee = cart.length > 0 ? (cartSubtotal >= 50000 ? 0 : 2000) : 0;
  const cartTotal = cartSubtotal + cartFee;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart Operations
  const addToCart = (item, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const updateCartQty = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order Operations
  const createOrder = ({ paymentMethod, paymentPhone, specialNotes = '', customer }) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      orderNumber: orders.length + 1,
      customerName: customer?.fullName || 'Holland Customer',
      customerUsername: customer?.username || '@customer',
      customerPhone: paymentPhone || customer?.phone || '0712 345 678',
      customerAddress: customer?.address || 'Mikocheni B, Dar es Salaam',
      date: dateStr,
      time: timeStr,
      category: cart[0]?.category || 'Foods',
      status: 'Pending',
      assignedTo: 'Unassigned',
      deliveryPhone: '',
      paymentMethod: paymentMethod || 'M-PESA (Vodacom)',
      paymentPhone: paymentPhone || '',
      paymentStatus: paymentMethod?.toLowerCase().includes('cash') ? 'Pending (Cash)' : 'Paid',
      items: [...cart],
      subtotal: cartSubtotal,
      fee: cartFee,
      total: cartTotal,
      specialNotes: specialNotes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus, extra = {}) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            ...extra,
          };
        }
        return order;
      })
    );
  };

  const assignOrderToStaff = (orderId, staffId) => {
    const staffMember = deliveryStaff.find((s) => s.id === staffId);
    if (!staffMember) return;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            assignedTo: staffMember.name,
            deliveryPhone: staffMember.phone,
            status: 'Out for Delivery',
          };
        }
        return order;
      })
    );

    setDeliveryStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, status: 'On Delivery', currentTaskOrderId: orderId }
          : s
      )
    );
  };

  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
      )
    );
  };

  // Menu Management (Admin)
  const addMenuItem = async (item) => {
    const product = await createProduct({ ...item, available: true });
    const newItem = formatProduct(product);
    setMenuItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateMenuItem = async (id, updatedFields) => {
    const existing = menuItems.find((item) => String(item.id) === String(id));
    if (!existing) return;
    const product = await updateProduct(id, { ...existing, ...updatedFields, available: updatedFields.inStock ?? existing.inStock });
    const updatedItem = formatProduct(product);
    setMenuItems((prev) => prev.map((item) => (String(item.id) === String(id) ? updatedItem : item)));
  };

  const deleteMenuItem = async (id) => {
    await deleteProduct(id);
    setMenuItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const toggleStock = async (id) => {
    const item = menuItems.find((menuItem) => String(menuItem.id) === String(id));
    if (!item) return;
    await updateMenuItem(id, { inStock: !item.inStock });
  };

  // Reset to default mock data (useful for user testing)
  const resetToDefaultData = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    setOrders(INITIAL_ORDERS);
    setDeliveryStaff(DELIVERY_STAFF);
    localStorage.removeItem('holland_menu');
    localStorage.removeItem('holland_orders');
    localStorage.removeItem('holland_staff');
  };

  return (
    <RestaurantContext.Provider
      value={{
        menuItems,
        orders,
        cart,
        deliveryStaff,
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
        assignOrderToStaff,
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
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
};
