"use client"
import { Calendar, Coins, MoveRight, Tag } from 'lucide-react';
import { useState } from 'react';
/* eslint-disable react-hooks/purity */
export default function Create() {

  const [view, setView] = useState('create');

  return (
    <div className="bg-emerald-900 min-h-screen flex flex-col items-center justify-center relative">
      {/* <input type="checkbox" id="adminToggle" className="toggle-checkbox"></input> */}
      {/* <label htmlFor="adminToggle" className="toggle-label"></label> */}
      {/* <span className="slider"></span> */}

      {/* Couche de neige derrière tout */}
      <div className="snow-layer">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              opacity: Math.random(),
              left: Math.random() * 100 + 'vw',
              animationDuration: (Math.random() * 3 + 2) + 's',
              fontSize: (Math.random() * 10 + 10) + 'px',
              animationDelay: Math.random() * 5 + 's'
            }}
          >
            ❆
          </div>
        ))}
      </div>

      <div className="h-2 w-full absolute top-0 left-0 candy-stripe z-10"></div>

      <div
        id="screen-setup"
        className="bg-white rounded-2xl shadow-2xl p-6 relative z-10 overflow-hidden"
        style={{ border: '3px solid #c53030' }}
      >
        <div className="h-2 w-full absolute top-0 left-0 candy-stripe"></div>

        {/* <div className="flex gap-2 mb-6 mt-2"></div> */}

        {view === 'create' && <div>
          <button className="mt-6 w-full btn-christmas text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3"
            onClick={() => setView('setup')}>
            Create a Secret Santa
            <MoveRight></MoveRight>
          </button>
        </div>}

        {view === 'setup' &&
          <div className='space-y-4'>
          <h2 className='text-2xl text-red-700 font-bold mb-4 text-center festive-font'>Paramètres du Secret Santa</h2>

          <div>
            <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Tag className="m-1 w-5 h-5"></Tag>Nom de l&apos;événement</div>
            <input type="text" id="eventNameInput" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700" placeholder="Ex: Secret Santa 2025"></input>
          </div>



          <div className="flex gap-3">
            <div className="w-1/2">
              <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Coins className="m-1 w-5 h-5"></Coins>Budget Max</div>
              <input type="number" id="eventBudgetInput" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700" placeholder="Ex: 20"></input>
            </div>
            <div className="w-1/2">
              <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Calendar className="m-1 w-5 h-5"></Calendar>Date</div>
              <input type="date" id="eventDateInput" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700"></input>
            </div>
          </div>

          <div>

            {/* <input type="checkbox" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700" placeholder="Ex: Noël des Copains 2025"></input> */}
            {/* <div><input type="checkbox" id="adminToggle" className="toggle-checkbox"></input>
            <label htmlFor="adminToggle" className="toggle-label"></label></div> */}
            <div className="flex items-center justify-between">
              <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Tag className="m-1 w-5 h-5"></Tag>L&apos;admin voit les tirages</div>

              <input type="checkbox" id="adminToggle" className="toggle-checkbox"></input>
              <label htmlFor="adminToggle" className="toggle-label"></label>
            </div>
          </div>

          <button className="mt-6 w-full btn-christmas text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3"
            onClick={() => setView('members')}>
            Next
            <MoveRight></MoveRight>
          </button>
        </div>}

      </div>
    </div>
  );
}
