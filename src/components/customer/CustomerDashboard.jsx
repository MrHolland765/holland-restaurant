import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { Plus, Check, Star, Clock, ShoppingCart, Search, Utensils } from 'lucide-react';
import { FoodImage } from '../common/FoodImage';

export const CustomerDashboard = () => {
  const {
    menuItems,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    addToCart,
    setIsCartOpen,
    cartCount,
    setActiveView,
  } = useRestaurant();
  const { showToast } = useToast();

  const categories = [
    { id: 'All', label: 'Zote (All)' },
    { id: 'Foods', label: 'Foods' },
    { id: 'Snacks', label: 'Snaks / Snacks' },
    { id: 'Drinks', label: 'Drinks' },
    { id: 'Sauces', label: 'Sauce of Food' },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    showToast(`${item.name} imeongezwa kwenye Cart!`, 'success', 2500);
  };

  const formatTsh = (val) => {
    return Number(val).toLocaleString('en-US');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white p-6 sm:p-8 shadow-lg shadow-amber-500/15">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Karibu Holland Restaurant
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Vyakula Vyetu Vizuri & Vinywaji Baridi
          </h1>
          <p className="mt-2 text-sm sm:text-base text-amber-50 leading-relaxed font-medium">
            Agiza biryani, mishkaki, vitafunio na juisi asilia moja kwa moja kutoka jikoni kwetu kuelekea nyumbani au ofisini kwako.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setSelectedCategory('Foods');
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-amber-50 transition-all shadow-sm"
            >
              Tazama Vyakula Vikuu
            </button>
            <button
              onClick={() => setActiveView('my_orders')}
              className="px-5 py-2.5 rounded-2xl bg-amber-700/60 hover:bg-amber-700/80 backdrop-blur-md text-white font-bold text-xs sm:text-sm transition-all"
            >
              Fuatilia Oda Zangu
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-2xl transform translate-x-1/3 translate-y-1/3 pointer-events-none" />
      </div>

      {/* Sketch Page 3: Top Filter Tabs [Snaks] [Foods] [Drinks] */}
      <div id="catalog-section" className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Dashboard / Vitengo
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Chagua Kitengo cha Chakula
            </h2>
          </div>

          {/* Category Pills */}
          <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Food Items (Sketch Page 3 Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Vyakula vilivyopo ({filteredItems.length}):
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-amber-600 font-bold hover:underline"
            >
              Futa utafutaji ("{searchQuery}")
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
            <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">
              Hakuna chakula kilichopatikana
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Hakuna matokeo ya "{searchQuery}". Tafadhali jaribu kutafuta jina lingine au chagua kitengo cha "Zote".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold"
            >
              Onyesha Vyakula Vyote
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/70 overflow-hidden shadow-xs hover:shadow-lg hover:border-amber-300/80 transition-all flex flex-col group"
              >
                {/* Food Image Container */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <FoodImage
                    src={item.image}
                    alt={item.name}
                    category={item.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category Tag */}
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>

                  {/* Rating / Stock Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{item.rating || '4.8'}</span>
                  </div>

                  {!item.inStock && (
                    <div className="absolute inset-0 bg-slate-950/65 flex items-center justify-center text-white text-xs font-black uppercase tracking-wider">
                      Imekwisha (Out of stock)
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.prepTime && (
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Muda wa maandalizi: {item.prepTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Price & Add to Cart button (Page 3 & 5) */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Bei
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        TSh {formatTsh(item.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className={`py-2 px-3.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        item.inStock
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25 active:scale-95'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Quick Bar if items in cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center justify-between font-bold text-sm border border-slate-700 hover:bg-slate-800 transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                {cartCount}
              </div>
              <span>Vitu vipo kwenye Cart</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <span>Angalia Bili</span>
              <ShoppingCart className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
