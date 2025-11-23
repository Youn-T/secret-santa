"use client"
import { Calendar, Clipboard, Coins, Cross, Eye, MoveRight, Tag, Vote, X } from 'lucide-react';
import { useState } from 'react';
/* eslint-disable react-hooks/purity */
export default function Create() {

    const [members, setMembers] = useState([{ name: "Alice", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Bob", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }]);

    return (
        <div className="bg-emerald-900 min-h-screen flex flex-col items-center justify-center relative">


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


                {/* const li = document.createElement('li');
                    
                    const isEven = index % 2 === 0;
                    const bgClass = isEven ? 'bg-green-50' : 'bg-red-50';
                    const borderClass = isEven ? 'border-green-600' : 'border-red-600';
                    const textClass = isEven ? 'text-green-800' : 'text-red-800';
                    
                    li.className = `flex justify-between items-center ${bgClass} p-3 rounded-r-lg border-l-4 ${borderClass} shadow-sm animate-fade-in transition-all hover:translate-x-1`;
                    
                    li.innerHTML = `
                        <span class="font-bold ${textClass} flex items-center">
                            <img src="${p.avatar}" class="w-10 h-10 rounded-full bg-white object-cover mr-3 border-2 border-white shadow-sm" alt="${p.name}">
                            ${p.name}
                        </span>
                        <button onclick="removeParticipant(${index})" class="text-gray-400 hover:text-red-600 transition p-2 rounded-full hover:bg-white">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    listEl.appendChild(li); */}

                <div className='w-250 h-135 flex gap-4 '>
                    <div id="memberList" className='w-full flex-2 flex flex-col gap-4'>
                        <h2 className='text-2xl text-red-700 font-bold mb-4 text-center festive-font'>Membres</h2>
                        <div className='bg-green-50 rounded-xl overflow-y-auto shadow-inner border-2 border-green-700 scrollable p-1'>
                            <li className='flex justify-between items-center bg-green-50 p-3 rounded-r-lg border-l-4 border-green-600 shadow-sm animate-fade-in transition-all hover:translate-x-1 '>
                                <span className="font-bold bg-green-50 flex items-center">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg" className="w-10 h-10 rounded-full bg-white object-cover mr-3 border-2 border-white shadow-sm" alt="${p.name}"></img>
                                    Vous
                                </span>
                                <button className="text-gray-400 hover:text-red-600 transition p-2 rounded-full hover:bg-white">
                                    <X className="w-8 h-8"></X>
                                </button>
                            </li>


                            {/* <div  className="p-2 mb-2 bg-white rounded-xl shadow flex items-center gap-x-2"><img className='w-8 h-8 rounded-full' src='https://placehold.co/400'></img> Vous</div> */}
                            {members.map((member, index) => {
                                const even = index % 2 === 0;
                                const bgClass = even ? 'bg-red-50' : 'bg-green-50';
                                const borderClass = even ? 'border-red-600' : 'border-green-600';
                                return (
                                    <li key={index} className={`flex justify-between items-center ${bgClass} p-3 rounded-r-lg border-l-4 ${borderClass} shadow-sm animate-fade-in transition-all hover:translate-x-1`}>
                                        <span className={`font-bold ${bgClass} flex items-center`}>
                                            <img src={member.avatar} className="w-10 h-10 rounded-full bg-white object-cover mr-3 border-2 border-white shadow-sm" alt={member.name}></img>
                                            {member.name}
                                        </span>
                                        <button className="text-gray-400 hover:text-red-600 transition p-2 rounded-full hover:bg-white">
                                            <X className="w-8 h-8"></X>
                                        </button>
                                    </li>
                                )
                            })}
                        </div>
                    </div>
                    <div id="settings" className='overflow-auto scrollable w-full flex-7     overflow-y-auto  '>
                        <div className="text-center mb-4 ">
                            <h3 id="display-event-name" className="text-xl font-bold text-red-700 festive-font">Mon événement</h3>
                            <div className="flex justify-center gap-4 text-sm text-gray-600 mt-1">
                                <span id="display-budget"><Coins className="w-4 h-4 inline-block mr-1 text-yellow-500"></Coins> -- €</span>
                                <span id="display-date"><Calendar className="w-4 h-4 inline-block mr-1 text-green-600"></Calendar> --/--</span>
                            </div>
                            {/* <div id="admin-indicator" className="mt-2">
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full border border-red-200 font-bold">
                                    <Eye className="w-4 h-4 inline-block mr-1"></Eye> Admin visible
                                </span>
                            </div> */}
                        </div>
                        <div className='flex  gap-x-6  rounded-xl shadow-inner border-2 border-green-700'>
                            <div className="w-full  border-r border-green-200 shadow-inner space-y-4 p-4 bg-green-50 rounded-xl">
                                <h2 className='text-2xl text-red-700 font-bold mb-4 text-center festive-font'>Paramètres</h2>

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
                                        <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Eye className="m-1 w-5 h-5"></Eye>L&apos;admin voit les tirages</div>

                                        <input type="checkbox" id="adminToggle" className="toggle-checkbox"></input>
                                        <label htmlFor="adminToggle" className="toggle-label"></label>
                                    </div>
                                </div>

                                <div>

                                    <div className="flex items-center justify-between">
                                        <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Vote className="m-1 w-5 h-5"></Vote>L&apos;admin participe au tirage</div>

                                        <input type="checkbox" id="adminParticipationToggle" className="toggle-checkbox"></input>
                                        <label htmlFor="adminParticipationToggle" className="toggle-label"></label>
                                    </div>
                                </div>



                            </div>
                            <div className="w-full  flex flex-col border-green-200 shadow-inner items-center justify-center p-4 bg-green-50 rounded-xl">
                                <h2 className='text-2xl text-red-700 font-bold mb-4 text-center festive-font'>Partager</h2>

                                {/* QR Code Section */}
                                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-green-200 inline-block mb-6 shadow-sm">
                                    <img id="qr-code-img" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://youtu.be/dQw4w9WgXcQ?si=-uUffjrITlccQsFj" alt="QR Code" className="w-32 h-32 mx-auto opacity-80"></img>
                                    <p className="text-xs text-gray-400 mt-2 font-mono">Scanner pour rejoindre</p>
                                </div>

                                {/* Actions */}
                                <div className="space-y-3 w-full">
                                    <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                                        <input value="https://youtu.be/dQw4w9WgXcQ?si=-uUffjrITlccQsFj" type="text" id="share-link-input" className="bg-transparent text-xs text-gray-600 w-full px-2 outline-none" readOnly></input>
                                        <button className="bg-white text-green-700 px-3 py-2 rounded-md shadow-sm text-xs font-bold hover:text-green-800 border border-gray-100">
                                            <Clipboard className="w-4 h-4"></Clipboard>
                                        </button>
                                    </div>

                                    <div className="flex gap-2 justify-center mt-4">
                                        <button className="flex-1 bg-[#25D366] text-white py-2 rounded-lg font-bold text-sm hover:opacity-90 shadow-md transition-transform active:scale-95">
                                            <i className="fab fa-whatsapp mr-2"></i> WhatsApp
                                        </button>
                                        <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-bold text-sm hover:opacity-90 shadow-md transition-transform active:scale-95">
                                            <i className="fas fa-envelope mr-2"></i> Email
                                        </button>
                                    </div>
                                </div>
                                {/* <button className='mt-6 w-full btn-christmas text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3'></button> */}
                            </div>



                        </div>
                        <button className="mt-6 w-full btn-christmas text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3"
                        >
                            Faire un tirage
                            <MoveRight></MoveRight>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
