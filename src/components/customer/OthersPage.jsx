import React from 'react';
import { UtensilsCrossed, Phone, MapPin, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export const OthersPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Kuhusu Sisi (About Us)
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              HOLLAND RESTAURANT
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Holland Restaurant ni mgahawa wa kisasa unaotoa huduma bora za vyakula asilia vya Kitanzania na kimataifa. Tunajivunia usafi, viungo asilia vyenye ladha halisi, na usafirishaji wa haraka popote ulipo jijini.
        </p>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>Muda wa Kazi (Working Hours)</span>
          </div>
          <p className="text-xs text-slate-600">
            Jumatatu – Jumapili: Saa 2:00 Asubuhi – Saa 5:00 Usiku. Jiko linapika mfululizo.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <MapPin className="w-4 h-4" />
            <span>Mahali Tulipo (Location)</span>
          </div>
          <p className="text-xs text-slate-600">
            Holland Plaza, Mikocheni B, Mwai Kibaki Road, Dar es Salaam, Tanzania.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
            <Phone className="w-4 h-4" />
            <span>Mawasiliano & Oda za Simu</span>
          </div>
          <p className="text-xs text-slate-600">
            Simu / WhatsApp: +255 712 345 678 au +255 788 000 111.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
            <Mail className="w-4 h-4" />
            <span>Barua Pepe Rasmi</span>
          </div>
          <p className="text-xs text-slate-600">
            info@hollandrestaurant.co.tz / orders@hollandrestaurant.co.tz
          </p>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white text-center space-y-2 shadow-md">
        <Heart className="w-8 h-8 mx-auto text-white/90 fill-white" />
        <h3 className="text-base font-black">Holland Restaurant – Ladha ya Nyumbani</h3>
        <p className="text-xs text-amber-100 max-w-md mx-auto">
          Asante kwa kuchagua huduma zetu. Furahia chakula kitamu na safi kila siku!
        </p>
      </div>
    </div>
  );
};
