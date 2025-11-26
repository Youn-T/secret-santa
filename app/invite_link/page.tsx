"use client"
import { Calendar, Coins, MoveRight, SquarePlus, Tag, Vote } from 'lucide-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from "next-auth/react"
import Image from 'next/image';


/* eslint-disable react-hooks/purity */
export default function InviteLink() {

  const router = useRouter();


  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [budget, setBudget] = useState(0);
  const [date, setDate] = useState('');
  const [members, setMembers] = useState([]);
  const [adminSeesDraws, setAdminSeesDraws] = useState(false);
  const [adminParticipates, setAdminParticipates] = useState(false);
  const { status } = useSession();
  const { data: session } = useSession();

  const [groupId, setGroupId] = useState("");
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!searchParams) return;
    setGroupId(searchParams.get('groupId') || '');
    if (groupId !== '') {
      fetch(`/api/get_group?groupId=${groupId}&public=true`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(async (res) => {
          // console.log(await res.json());
          // if (!res.ok) throw new Error('Échec de la récupération');
          const { name, budget, date, adminSeesDraws, adminParticipates, code, members } = await res.json(); // l’API doit renvoyer { id }
          setName(name);
          setBudget(budget);
          setDate(date);
          setAdminSeesDraws(adminSeesDraws);
          setAdminParticipates(adminParticipates);
          setMembers(members);
          const codeStr: string = code;
          console.log(code);

          setCode(codeStr.slice(0, 3) + ' ' + codeStr.slice(3, 6));
        })
        .catch((err) => {
          console.error(err);
          // Optionnel: afficher un message d’erreur à l’utilisateur
        });
    }
  }, [searchParams, groupId]);

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


  function dateToString(date: Date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn("google", { redirectTo: `/invite_link?groupId=${groupId}` })
    }
  }, [status, groupId]);

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

        <div className='p-4'>
          <h2 className='text-2xl text-red-700 font-bold mb-4 text-center festive-font'>Rejoindre le Secret Santa</h2>
          <div className="">

            <div className='flex justify-between'>
              <h3 id="display-event-name" className="text-xl font-bold text-red-700 festive-font relative">{name}</h3>
              <div className="flex items-center">
                {members.map((element, i) => (
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
              <span id="display-budget"><Coins className="w-4 h-4 inline-block mr-1 text-yellow-500"></Coins> {budget} €</span>
              <span id="display-date"><Calendar className="w-4 h-4 inline-block mr-1 text-green-600"></Calendar> {dateToString(new Date(date))}</span>
            </div>
            <button className="mt-6 w-full btn-christmas text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3"
              onClick={() => joinSecretSanta()}>
              Join now
              <MoveRight></MoveRight>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
