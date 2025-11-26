"use client"
import { Calendar, ChevronLeft, Coins, MoveRight, SquarePlus, Tag, Vote } from 'lucide-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { signIn, useSession } from "next-auth/react"
import Image from 'next/image';


/* eslint-disable react-hooks/purity */
export default function Create() {

  const router = useRouter();
  // const session = useSession();
  // console.log(session);
  // if (!session.data) {
  //   redirect('/');
  // }

  const [view, setView] = useState('create');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [budget, setBudget] = useState(0);
  const [date, setDate] = useState('');
  const [adminSeesDraws, setAdminSeesDraws] = useState(false);
  const [adminParticipates, setAdminParticipates] = useState(false);
  const [groups, setGroups] = useState([]);
  const { status } = useSession();
  const { data: session } = useSession();
  function createSecretSanta() {
    // Ancien code (params dans l’URL)
    // const params = new URLSearchParams({
    //   name,
    //   budget: String(budget),
    //   date,
    //   adminSeesDraws: String(adminSeesDraws),
    //   adminParticipates: String(adminParticipates)
    // });
    // router.push(`/members?${params.toString()}`);

    // Nouveau: POST avec body JSON
    const payload = {
      name,
      budget,
      date,
      adminSeesDraws,
      adminParticipates,
    };

    fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        // if (!res.ok) throw new Error('Échec de la création');
        console.log(res);
        const { groupId } = await res.json(); // l’API doit renvoyer { id }
        // Redirection avec l’identifiant
        // Adaptez la route selon votre design (/members/[id] ou query ?eventId=)
        router.push(`/members?eventId=${encodeURIComponent(groupId)}`);
      })
      .catch((err) => {
        console.error(err);
        // Optionnel: afficher un message d’erreur à l’utilisateur
      });
  }

  function joinSecretSanta() {
    const payload = {
      code: code.replace(' ', ''),
    };
    fetch('/api/join_group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        // if (!res.ok) throw new Error('Échec de la création');
        console.log(res);
        const { groupId } = await res.json(); // l’API doit renvoyer { id }
        // Redirection avec l’identifiant
        // Adaptez la route selon votre design (/members/[id] ou query ?eventId=)
        router.push(`/members?eventId=${encodeURIComponent(groupId)}`);
      })
      .catch((err) => {
        console.error(err);
        // Optionnel: afficher un message d’erreur à l’utilisateur
      });
  }

  function listSecretSantas() {
    fetch('/api/get_groups', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (res) => {
        // if (!res.ok) throw new Error('Échec de la création');
        console.log(res);
        setGroups(await res.json()); // l’API doit renvoyer { id }

      })
      .catch((err) => {
        console.error(err);
        // Optionnel: afficher un message d’erreur à l’utilisateur
      });
  }

  function dateToString(date: Date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  // if (!session) {
  //   return ( <button onClick={() => redirect('/')}>You must be logged in to create a Secret Santa. Click to go back.</button> );
  // }
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn("google", { redirectTo: "/create" })
    }
  }, [status, router]);

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;

  // console.log(session.user?.email);

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
        className="bg-white rounded-2xl shadow-2xl pt-6 relative z-10 overflow-hidden"
        style={{ border: '3px solid #c53030' }}
      >
        <div className="h-2 w-full absolute top-0 left-0 candy-stripe"></div>

        {/* <div className="flex gap-2 mb-6 mt-2"></div> */}

        {view === 'create' && <div className='p-6'>
          <button className="mt-6 w-full btn-christmas text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3"
            onClick={() => setView('setup')}>
            Create a Secret Santa
            <SquarePlus></SquarePlus>
          </button>
          <button className="mt-6 w-full btn-christmas text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3"
            onClick={() => { listSecretSantas(); setView('list'); }}>
            My Secret Santas
            <SquarePlus></SquarePlus>
          </button>
          <button className="mt-6 w-full btn-christmas text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3"
            onClick={() => { setView('join'); }}>
            Join a Secret Santa
            <MoveRight></MoveRight>
          </button>
        </div>}

        {view === 'join' &&
          <div className=''>
            <div className='flex space-between items-center gap-x-3 px-6 pt-3'>
              <button className="text-red-700 font-bold" onClick={() => setView("create")}><ChevronLeft></ChevronLeft></button>
              <h2 className='text-2xl text-red-700 font-bold mb-4 text-center festive-font'>Rejoindre un Secret Santa</h2>
            </div>
            <div className='p-6'>
              <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Tag className="m-1 w-5 h-5"></Tag>Code de l&apos;événement</div>
              <input type="text" id="eventNameInput" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700" placeholder="Ex: 123 456"
                value={code} onChange={(e) => setCode(e.target.value)}
              ></input>
            </div>


            <div className='pb-6 px-6'>
              <button className="w-full btn-christmas text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3"
                onClick={() => joinSecretSanta()}>
                Join
                <MoveRight></MoveRight>
              </button>
            </div></div>}

        {view === 'list' &&
          <div className='space-y-4 w-250 h-135'>
            <div className='flex gap-x-80 px-6 w-full'>
              <button className="text-red-700 font-bold" onClick={() => setView("create")}><ChevronLeft></ChevronLeft></button>
              <h2 className='text-2xl text-red-700 font-bold mb-4 text-center festive-font'>Paramètres du Secret Santa</h2>
            </div>
            <div className='grid grid-cols-4 gap-4 overflow-y-auto pr-6 pb-6 pl-6 pt-4'>
              {groups.map((group, j) => (
                <div key={j} className="border border-red-300 rounded-lg p-4 shadow-md secret-santa-card"
                  onClick={() => redirect(`/members?eventId=${group.id}`)}>
                  {/* <h3 className="text-lg font-bold text-red-700 mb-2">{group.name}</h3>
                <p className="text-sm text-gray-600 mb-1"><strong>Budget:</strong> {group.budget} €</p> */}
                  <div className='flex justify-between'>
                    <h3 id="display-event-name" className="text-xl font-bold text-red-700 festive-font relative">{group.name}</h3>
                    <div className="flex items-center">
                      {/* empilement léger : images côte à côte et légèrement superposées */}
                      {group.members.map((element, i) => (
                        <img key={i} src={element.avatar}
                          alt={element.name}
                          title={element.name}
                          className={`w-6 h-6 rounded-full border-2 border-white shadow-md ${i === 0 ? '' : '-ml-2'}`}
                          style={{ zIndex: 100 - i }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex  gap-4 text-sm text-gray-600 mt-1">
                    <span id="display-budget"><Coins className="w-4 h-4 inline-block mr-1 text-yellow-500"></Coins> {group.budget} €</span>
                    <span id="display-date"><Calendar className="w-4 h-4 inline-block mr-1 text-green-600"></Calendar> {dateToString(new Date(group.date))}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>}

        {view === 'setup' &&
          <div className='space-y-4 p-6'>
            {/* <h2 className='text-2xl text-red-700 font-bold mb-4 text-center festive-font'>Paramètres du Secret Santa</h2>
            <div className='flex space-between items-center gap-x-3 px-6 pt-3'>
              <button className="text-red-700 font-bold" onClick={() => setView("create")}><ChevronLeft></ChevronLeft></button>
            </div> */}
            <div className='flex  gap-x-12 w-full'>
              <button className="text-red-700 font-bold" onClick={() => setView("create")}><ChevronLeft></ChevronLeft></button>
              <h2 className='text-2xl text-red-700 font-bold mb-4 text-center festive-font'>Paramètres du Secret Santa</h2>
            </div>

            <div>
              <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Tag className="m-1 w-5 h-5"></Tag>Nom de l&apos;événement</div>
              <input type="text" id="eventNameInput" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700" placeholder="Ex: Secret Santa 2025"
                value={name} onChange={(e) => setName(e.target.value)}
              ></input>
            </div>



            <div className="flex gap-3">
              <div className="w-1/2">
                <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Coins className="m-1 w-5 h-5"></Coins>Budget Max</div>
                <input type="number" id="eventBudgetInput" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700" placeholder="Ex: 5"
                  value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                ></input>
              </div>
              <div className="w-1/2">
                <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Calendar className="m-1 w-5 h-5"></Calendar>Date</div>
                <input type="date" id="eventDateInput" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700"
                  value={date} onChange={(e) => setDate(e.target.value)}
                ></input>
              </div>
            </div>

            <div>

              {/* <input type="checkbox" className="input-christmas w-full px-3 py-2 rounded-lg text-gray-700" placeholder="Ex: Noël des Copains 2025"></input> */}
              {/* <div><input type="checkbox" id="adminToggle" className="toggle-checkbox"></input>
            <label htmlFor="adminToggle" className="toggle-label"></label></div> */}
              <div className="flex items-center justify-between">
                <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Tag className="m-1 w-5 h-5"></Tag>L&apos;admin voit les tirages</div>

                <input type="checkbox" id="adminToggle" className="toggle-checkbox"
                  checked={adminSeesDraws} onChange={(e) => setAdminSeesDraws(e.target.checked)}></input>
                <label htmlFor="adminToggle" className="toggle-label"></label>
              </div>
            </div>
            <div>

              <div className="flex items-center justify-between">
                <div className='flex items-center text-green-800 text-sm font-bold'><label className="block text-green-800 text-sm font-bold mb-1"></label><Vote className="m-1 w-5 h-5"></Vote>L&apos;admin participe au tirage</div>

                <input type="checkbox" id="adminParticipationToggle" className="toggle-checkbox"
                  checked={adminParticipates} onChange={(e) => setAdminParticipates(e.target.checked)}></input>
                <label htmlFor="adminParticipationToggle" className="toggle-label"></label>
              </div>
            </div>

            <button className="mt-6 w-full btn-christmas text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3"
              onClick={() => createSecretSanta()}>
              Next
              <MoveRight></MoveRight>
            </button>
          </div>}

      </div>
    </div>
  );
}
