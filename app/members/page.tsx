"use client"
// TODO : filtrage member actuel dans la liste des membres -> plus solide -> inclure en paramètre API
import { Calendar, Clipboard, Coins, Cross, Eye, Gift, Link, Mail, MoveRight, QrCode, RectangleEllipsis, Share2, Tag, Vote, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, redirect, useRouter } from 'next/navigation';
import { signIn, useSession } from "next-auth/react"
/* eslint-disable react-hooks/purity */


const MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const host = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
export default function Create() {

    const [isMobile, setIsMobile] = useState(false);
    const [showDrawPopup, setShowDrawPopup] = useState(false);

    useEffect(() => {
        if (navigator) setIsMobile(MOBILE.test(navigator.userAgent));
    }, []);

    // const session = useSession();
    // if (!session.data) {
    //     redirect('/');
    // }

    const [members, setMembers] = useState([{ name: "Alice", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Bob", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }, { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg" }]);
    const searchParams = useSearchParams();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [budget, setBudget] = useState(0);
    const [date, setDate] = useState('');
    const [adminId, setAdminId] = useState('');
    const [adminSeesDraws, setAdminSeesDraws] = useState(false);
    const [adminParticipates, setAdminParticipates] = useState(false);
    const [groupId, setGroupId] = useState('');
    const [loading, setLoading] = useState(true);
    const [drawData, setDrawData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (!searchParams) return;
        setGroupId(searchParams.get('eventId') || '');

        // const name = searchParams.get('name') ?? '';
        // const budget = searchParams.get('budget');
        // const date = searchParams.get('date') ?? '';
        // const adminSees = searchParams.get('adminSeesDraws');
        // const adminPart = searchParams.get('adminParticipates');
        // setName(name);
        // setBudget(budget ? parseInt(budget, 10) : 0);
        // setDate(date);
        // setAdminSeesDraws(adminSees === 'true');
        // setAdminParticipates(adminPart === 'true');
        // const payload = {
        //     groupId
        // }
        if (groupId !== '') {
            fetch(`/api/get_group?groupId=${groupId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(async (res) => {
                    console.log(res);
                    if (!res.ok) {
                        // console.error('Groupe introuvable ou accès refusé');
                        router.push('/');
                        return;
                    }
                    setLoading(false);
                    // if (!res.ok) throw new Error('Échec de la récupération');
                    const { name, budget, date, adminSeesDraws, adminParticipates, code, members, adminId } = await res.json(); // l’API doit renvoyer { id }
                    setName(name);
                    setBudget(budget);
                    setDate(date);
                    setAdminSeesDraws(adminSeesDraws);
                    setAdminParticipates(adminParticipates);
                    setMembers(members);
                    setAdminId(adminId);
                    const codeStr: string = code;


                    setCode(codeStr?.slice(0, 3) + ' ' + codeStr?.slice(3, 6));
                })
                .catch((err) => {
                    console.error(err);
                    // Optionnel: afficher un message d’erreur à l’utilisateur
                });
        }

    }, [searchParams, groupId, router]);

    const { status } = useSession();
    const sessionData = useSession().data;
    useEffect(() => {
        if (status === 'unauthenticated') {
            // router.push('/');
            signIn("google", { redirectTo: "/members" })
        }
    }, [status, router]);

    function dateToString(date: Date) {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    if (status === 'loading') return null;
    if (status === 'unauthenticated') return null;

    function deleteUser(userId: string) {
        fetch('/api/delete_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId, userName: userId }),
        }).then(async (res) => {
            // if (!res.ok) throw new Error('Échec de la suppression');
            const { members } = await res.json(); // l’API doit renvoyer { id }
            console.log(members);
            redirect(`/members?eventId=${groupId}`);
        });
    }

    function draw() {
        console.log('Drawing...');
        fetch('/api/draw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId }),
        }).then(async (res) => {
            // if (!res.ok) throw new Error('Échec du tirage');
            const data = await res.json(); // l’API doit renvoyer { id }
            console.log(data);
            setDrawData(data.pairs);
            // setShowDrawPopup(false); // Fermer la popup après le tirage
        });
        console.log('Drawing2...');

    }

    function updateGroup({ name_ = name, budget_ = budget, date_ = date, adminSeesDraws_ = adminSeesDraws, adminParticipates_ = adminParticipates } = {}) {
        console.log(budget);
        fetch('/api/update_group', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId, name: name_, budget: budget_, date: date_, adminSeesDraws: adminSeesDraws_, adminParticipates: adminParticipates_ }),
        }).then(async (res) => {
            // if (!res.ok) throw new Error('Échec de la mise à jour');
            const data = await res.json();
            console.log(data);
        });

        setName(name_);
        setBudget(budget_);
        setDate(date_);
        setAdminSeesDraws(adminSeesDraws_);
        setAdminParticipates(adminParticipates_);
    }

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
            {loading && <h1 className='text-6xl md:text-8xl text-white font-bold mb-6 drop-shadow-lg leading-tight'>Loading...</h1>}
            {!loading && <><div
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
                        <h2 className='text-2xl text-red-700 font-bold mb-5 text-center festive-font'>Membres</h2>
                        <div className='relative bg-green-50 rounded-xl overflow-y-auto shadow-inner border-2 border-green-700 scrollable pt-2 z-0 h-full'>
                            <div className=" absolute inset-x-0 top-0 h-full candy-stripe z-[-10]"></div>
                            <li className='flex justify-between items-center bg-green-50 p-3  border-l-4 border-green-600 shadow-sm animate-fade-in transition-all '>

                                <span className="font-bold bg-green-50 flex items-center">

                                    <img src={sessionData?.user?.image} className="w-10 h-10 rounded-full bg-white object-cover mr-3 border-2 border-white shadow-sm" alt="${p.name}"></img>
                                    Vous

                                </span>
                                {
                                    adminId !== sessionData?.user?.id && <button className="text-gray-400 hover:text-red-600 transition p-2 rounded-full hover:bg-white"
                                        onClick={() => deleteUser(sessionData?.user?.id || '')}>
                                        <X className="w-8 h-8"></X>
                                    </button>
                                }

                            </li>


                            {/* <div  className="p-2 mb-2 bg-white rounded-xl shadow flex items-center gap-x-2"><img className='w-8 h-8 rounded-full' src='https://placehold.co/400'></img> Vous</div> */}
                            {(() => {
                                const filteredMembers = members.filter(member => member.name != sessionData?.user?.name);
                                const minSlots = 7; // Nombre minimum de lignes souhaitées
                                const emptySlotsCount = Math.max(0, minSlots - filteredMembers.length);

                                return (
                                    <>
                                        {filteredMembers.map((member, index) => {
                                            const even = index % 2 === 0;
                                            const bgClass = even ? 'bg-red-50' : 'bg-green-50';
                                            const borderClass = even ? 'border-red-600' : 'border-green-600';
                                            return (
                                                <li key={index} className={`flex justify-between items-center ${bgClass} p-3  border-l-4 ${borderClass} shadow-sm animate-fade-in transition-all hover:translate-x-1`}>
                                                    <span className={`font-bold ${bgClass} flex items-center`}>
                                                        <img src={member.avatar} className="w-10 h-10 rounded-full bg-white object-cover mr-3 border-2 border-white shadow-sm" alt={member.name}></img>
                                                        {member.name}
                                                    </span>
                                                    {
                                                        adminId !== member.id && <button className="text-gray-400 hover:text-red-600 transition p-2 rounded-full hover:bg-white"
                                                            onClick={() => deleteUser(member.id)}>
                                                            <X className="w-8 h-8"></X>
                                                        </button>
                                                    }

                                                </li>
                                            )
                                        })}

                                        {/* Slots vides pour remplir la liste */}
                                        {Array.from({ length: emptySlotsCount }).map((_, i) => {
                                            // On continue l'indexation pour garder l'alternance des couleurs
                                            const globalIndex = filteredMembers.length + i;
                                            const even = globalIndex % 2 === 0;
                                            const bgClass = even ? 'bg-red-50' : 'bg-green-50';
                                            // Bordure plus claire pour indiquer que c'est vide
                                            const borderClass = even ? 'border-red-200' : 'border-green-200';

                                            return (
                                                <li key={`empty-${i}`} className={`flex justify-between items-center ${bgClass} p-3 border-l-4 ${borderClass} shadow-sm`}>
                                                    <span className={`font-bold ${bgClass} flex items-center text-gray-400 italic opacity-50`}>
                                                        <div className="w-10 h-10 rounded-full bg-transparent mr-3 border-2 border-dashed border-gray-400 flex items-center justify-center">
                                                            <span className="text-xs">+</span>
                                                        </div>
                                                        En attente...
                                                    </span>
                                                </li>
                                            )
                                        })}
                                    </>
                                )
                            })()}

                        </div>
                    </div>
                    <div id="settings" className='overflow-auto scrollable w-full flex-7     overflow-y-auto  '>
                        <div className="text-center mb-4 ">
                            <h3 id="display-event-name" className="text-xl font-bold text-red-700 festive-font">{name}</h3>
                            <div className="flex justify-center gap-4 text-sm text-gray-600 mt-1">
                                <span id="display-budget"><Coins className="w-4 h-4 inline-block mr-1 text-yellow-500"></Coins> {budget} €</span>
                                <span id="display-date"><Calendar className="w-4 h-4 inline-block mr-1 text-green-600"></Calendar> {dateToString(new Date(date))}</span>
                            </div>
                            {/* <div id="admin-indicator" className="mt-2">
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full border border-red-200 font-bold">
                                    <Eye className="w-4 h-4 inline-block mr-1"></Eye> Admin visible
                                </span>
                            </div> */}
                        </div>
                        <div className=' rounded-xl shadow-inner border-2 border-green-700 overflow-hidden'> {/* gap-x-6 */}

                            <div className='flex   gap-x-2 flex relative z-10 pt-2'>
                                <div className="w-full  border-t-2 border-r-2 border-green-700 shadow-inner space-y-4 p-4 bg-green-50 rounded-tr-xl ">
                                    <div className=" absolute inset-x-0 top-0 h-full candy-stripe z-[-10]"></div>

                                    <h2 className='text-2xl text-red-700 font-bold mb-4 text-center festive-font'>Paramètres</h2>

                                    <div>
                                        <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Tag className="m-1 w-5 h-5"></Tag>Nom de l&apos;événement</div>
                                        <input type="text" id="eventNameInput" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700" placeholder="Ex: Secret Santa 2025" readOnly={adminId !== sessionData?.user?.id}
                                            value={name} onChange={(e) => { updateGroup({ name_: e.target.value }); }}></input>
                                    </div>



                                    <div className="flex gap-3">
                                        <div className="w-1/2">
                                            <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Coins className="m-1 w-5 h-5"></Coins>Budget Max</div>
                                            <input type="number" min={0} id="eventBudgetInput" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700" placeholder="Ex: 20"
                                                value={budget} readOnly={adminId !== sessionData?.user?.id} onChange={(e) => { updateGroup({ budget_: Number(e.target.value) }); }}></input>
                                        </div>
                                        <div className="w-1/2">
                                            <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Calendar className="m-1 w-5 h-5"></Calendar>Date</div>
                                            <input type="date" id="eventDateInput" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700" value={date} readOnly={adminId !== sessionData?.user?.id} onChange={(e) => { updateGroup({ date_: e.target.value }); }}></input>
                                        </div>
                                    </div>

                                    <div>

                                        {/* <input type="checkbox" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700" placeholder="Ex: Noël des Copains 2025"></input> */}
                                        {/* <div><input type="checkbox" id="adminToggle" className="toggle-checkbox"></input>
            <label htmlFor="adminToggle" className="toggle-label"></label></div> */}
                                        <div className="flex items-center justify-between">
                                            <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Eye className="m-1 w-5 h-5"></Eye>L&apos;admin voit les tirages</div>

                                            <input type="checkbox" id="adminToggle" className="toggle-checkbox" checked={adminSeesDraws} readOnly={adminId !== sessionData?.user?.id} onChange={(e) => { if (adminId === sessionData?.user?.id) updateGroup({ adminSeesDraws_: e.target.checked }); }}></input>
                                            <label htmlFor="adminToggle" className="toggle-label"></label>
                                        </div>
                                    </div>

                                    <div>

                                        <div className="flex items-center justify-between">
                                            <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Vote className="m-1 w-5 h-5"></Vote>L&apos;admin participe au tirage</div>

                                            <input type="checkbox" id="adminParticipationToggle" className="toggle-checkbox" checked={adminParticipates} readOnly={adminId !== sessionData?.user?.id} onChange={(e) => { if (adminId === sessionData?.user?.id) updateGroup({ adminParticipates_: e.target.checked }); }}></input>
                                            <label htmlFor="adminParticipationToggle" className="toggle-label"></label>
                                        </div>
                                    </div>



                                </div>
                                {/* <div className=" w-6  candy-stripe "></div> */}
                                <div className="w-full border-t-2 border-l-2 flex flex-col border-green-700 shadow-inner items-center justify-center p-4 bg-green-50 rounded-tl-xl">
                                    <h2 className='text-2xl text-red-700 font-bold mb-4 text-center festive-font'>Partager</h2>

                                    {/* QR Code Section */}
                                    <div className="bg-white p-4 rounded-xl border-2 border-dashed border-green-200 inline-block mb-6 shadow-sm">
                                        <img id="qr-code-img" src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${host}/invite_link?groupId=${groupId}`} alt="QR Code" className="w-30 h-30 mx-auto opacity-80"></img>
                                        {/* <p className="text-xs text-gray-400 mt-2 font-mono">Scanner pour rejoindre</p> */}
                                    </div>



                                    {/* Actions */}
                                    <div className="space-y-3 w-full">
                                        <div>
                                            <div className='flex items-center text-green-800 bg-gray-100 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1" htmlFor="share-code-input"></label><RectangleEllipsis className="m-1 w-5 h-5"></RectangleEllipsis>Code de l&apos;événement</div>
                                            <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200  border border-2 border-green-700">
                                                <input value={code} type="text" id="share-code-input" className="bg-transparent text-lg text-gray-600 w-full px-2 outline-none " readOnly ></input>
                                                <button className="bg-white text-green-700 px-3 py-2 rounded-md shadow-sm text-xs font-bold hover:text-green-800 border border-2 border-green-700"
                                                    onClick={() => navigator.clipboard.writeText(code)}>
                                                    <Clipboard className="w-4 h-4"></Clipboard>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 justify-center mt-4">
                                            {!isMobile && <><button className="flex-1 flex bg-blue-500 text-white items-center justify-center py-2 rounded-lg font-bold text-sm hover:opacity-90 shadow-md transition-transform active:scale-95"
                                                onClick={() => navigator.clipboard.writeText(`${host}/invite_link?groupId=${groupId}`)}>
                                                <Link className="w-4 h-4 mr-2"></Link> Link
                                            </button>
                                                <button className="flex-1 flex bg-blue-500 text-white items-center justify-center py-2 rounded-lg font-bold text-sm hover:opacity-90 shadow-md transition-transform active:scale-95">
                                                    <Mail className="w-4 h-4 mr-2"></Mail> Email
                                                </button></>}
                                            {isMobile && <button className="flex-1 flex bg-blue-500 text-white items-center justify-center py-2 rounded-lg font-bold text-sm hover:opacity-90 shadow-md transition-transform active:scale-95"
                                                onClick={() => {
                                                    if (navigator.share) {
                                                        navigator.share({
                                                            title: 'Rejoindre mon Secret Santa !',
                                                            text: `Rejoins mon Secret Santa "${name}" avec un budget de ${budget}€ prévu pour le ${dateToString(new Date(date))} !`,
                                                            url: `${host}/invite_link?groupId=${groupId}`,
                                                        });
                                                    }
                                                }}>
                                                <Share2 className="w-4 h-4 mr-2"></Share2> Share
                                            </button>}
                                        </div>
                                    </div>
                                    {/* <button className='mt-6 w-full btn-christmas text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3'></button> */}
                                </div>
                            </div>




                        </div>
                        <button className="mt-4 w-full btn-christmas-v text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3" onClick={() => setShowDrawPopup(true)}
                        >
                            {drawData.length === 0 ? "Faire un tirage" : "Refaire un tirage/Voir les résultats"}
                            <Gift></Gift>
                        </button>
                    </div>

                </div>

            </div>

                {/* Popup de confirmation */}
                {showDrawPopup && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
                    // onClick={() => setShowDrawPopup(false)}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl p-6 relative overflow-hidden max-w-md w-full animate-fade-in"
                            style={{ border: '3px solid #c53030' }}
                        >
                            {/* Candy Stripe Header */}
                            <div className="h-2 w-full absolute top-0 left-0 candy-stripe"></div>

                            {drawData.length === 0 && <><h3 className="text-2xl text-red-700 font-bold mb-4 text-center festive-font mt-2">Lancer le tirage ?</h3>

                                <p className="text-gray-600 text-center mb-6 font-medium">
                                    Êtes-vous sûr de vouloir lancer le tirage au sort ? <br />
                                    <span className="text-sm text-gray-500">Chaque participant recevra son destinataire par email.</span>
                                    {adminSeesDraws && <div id="admin-indicator" className="mt-2">
                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full border border-red-200 font-bold">
                                            <Eye className="w-4 h-4 inline-block mr-1"></Eye> Admin visible
                                        </span>
                                    </div>}
                                </p>

                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => draw()}
                                        className="px-5 py-2 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors flex items-center gap-2 border-2 border-red-700 btn-christmas"
                                    >
                                        <Gift className="w-4 h-4" />
                                        Confirmer
                                    </button>
                                    <button
                                        onClick={() => setShowDrawPopup(false)}
                                        className="px-5 py-2 rounded-xl font-bold text-gray-600 bg-gray-100 border-2 border-gray-200 hover:bg-gray-200 transition-colors"
                                    >
                                        Annuler
                                    </button>

                                </div></>}
                            {
                                drawData.length > 0 && <><h3 className="text-2xl text-red-700 font-bold mb-4 text-center festive-font mt-2">{adminSeesDraws ? "Résultats du Tirage" : "Tirage effectué"}</h3>
                                    {adminSeesDraws && drawData.map((pair, i) => {
                                        return (<div key={i} className={`${i % 2 === 0 ? "bg-green-50" : "bg-red-50"} p-4  mb-3 border-l-4 ${i % 2 === 0 ? "border-green-600" : "border-red-600"} shadow-sm flex justify-between items-center`}>
                                            <span className={`font-bold text-${i % 2 === 0 ? "green" : "red"}-800`}><img src={pair.giver.avatar} alt={pair.giver.name} className="inline-block w-6 h-6 rounded-full mr-2" />{pair.giver.name}</span>
                                            <span className="text-gray-600">→</span>
                                            <span className={`font-bold text-${i % 2 === 0 ? "red" : "green"}-800`}><img src={pair.reciever.avatar} alt={pair.reciever.name} className="inline-block w-6 h-6 rounded-full mr-2" />{pair.reciever.name}</span>
                                        </div>
                                        )
                                    })}
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={() => setShowDrawPopup(false)}
                                            className="px-5 py-2 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors flex items-center gap-2 border-2 border-red-700 btn-christmas"
                                        >
                                            <Gift className="w-4 h-4" />
                                            Okay
                                        </button>
                                        <button
                                            onClick={() => setDrawData([])}
                                            className="px-5 py-2 rounded-xl font-bold text-gray-600 bg-gray-100 border-2 border-gray-200 hover:bg-gray-200 transition-colors"
                                        >
                                            Refaire Un Tirage
                                        </button>

                                    </div>
                                </>

                            }
                        </div>
                    </div>
                )}
            </>}
        </div>
    );
}
