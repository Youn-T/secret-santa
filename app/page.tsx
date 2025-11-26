"use client"
import { signIn, signOut } from "next-auth/react";
import { Dices, Gift, UserRoundCog, WandSparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { redirect } from "next/navigation";
import { use, useEffect, useState } from "react";
// import GoogleLogo from "@/public/google_logo.svg"

/* eslint-disable react-hooks/purity */
export default function Home() {
  const { status, data } = useSession();
  const [loggedIn, setLoggedIn] = useState(false);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    if (status === 'authenticated') {
      setLoggedIn(true);
      setImage(data?.user?.image || "");
      setName(data?.user?.name || "");
    } else {
      setLoggedIn(false);
      setImage("");
      setName("");
    }
  }, [status, loggedIn, data]);
  function startButton() {
    console.log(status);
    if (status === 'unauthenticated') {
      handleLogin();
      return;
    }
    redirect('/create');
  }

  function handleLogin() {
    signIn("google", { redirectTo: "/create" })
  }


  function handleLogout() {
    signOut();
  }

  function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  }

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

      <nav className="opaque-nav fixed w-full z-50 top-0 px-6 pt-3 pb-5 flex justify-between items-center transition-all duration-300 bg-emerald-900 shadow-2xl">
        <div className="flex items-center gap-3">
          {/* <div
            className="bg-white text-red-700 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-red-700">
            <i className="fas fa-sleigh text-xl"></i>
          </div> */}
          <span className="text-2xl font-bold festive-font tracking-wide hidden sm:block text-white drop-shadow-md">Secret
            Santa</span>
        </div>

        <div id="auth-section">
          {!loggedIn && <div id="logged-out-view" className="flex gap-4">
            <button onClick={() => handleLogin()}
              className="btn-primary text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg flex  gap-2">
              S&apos;inscrire/Se connecter avec <Image src="/google_logo.svg" alt="Google Logo" width={16} height={16}/>
            </button>
          </div>}
          

          {loggedIn && <div id="logged-in-view" className=" flex items-center gap-4">
            <div className="flex items-center gap-2 text-right">
                          <button onClick={() => handleLogout()}
              className="btn-primary text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg flex  gap-2">
              Se déconnecter
            </button>
              <div className="hidden md:block">
                {/* <p className="text-sm font-bold" id="user-name-display">{name}</p> */}
              </div>
              <img src={image}
                className="w-10 h-10 rounded-full border-2 border-white bg-white" alt="Avatar"/>
            </div>

          </div>}
        </div>
        <div className="h-2 w-full absolute bottom-0 left-0 candy-stripe z-10"></div>
      </nav>
<header className="relative flex-grow flex items-center justify-center text-center px-4 pt-32 pb-12 z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">

          <h1 className="text-6xl md:text-8xl text-white font-bold mb-6 drop-shadow-lg leading-tight">
            Organisez votre <br></br>
            <span className="text-red-500 text-shadow-white">Secret Santa</span> <br></br>
            en un clic !
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-10 max-w-2xl mx-auto font-light">
            Fini les papiers tirés au sort. Créez votre événement, invitez vos amis et laissez la magie faire
            le reste.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => startButton()}
              className="btn-primary text-white px-8 py-4 rounded-full text-xl font-bold shadow-xl flex items-center justify-center gap-3">
              <WandSparkles className="w-6 h-6"></WandSparkles> Commencer
            </button>
            <button onClick={() => scrollToFeatures()}
              className="btn-outline px-8 py-4 rounded-full text-xl font-bold shadow-xl">
              Comment ça marche ?
            </button>
          </div>
        </div>
      </header>

      <section id="features" className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl text-center mb-16 font-bold festive-font text-green-100">La magie en 3 étapes</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card p-8 rounded-2xl shadow-2xl border-b-8 border-red-600">
              <div
                className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600 text-2xl shadow-inner">
                <UserRoundCog ></UserRoundCog>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-green-900">1. Créez</h3>
              <p className="text-gray-600">Configurez votre événement : nom, date, budget et thème. Ajoutez les
                participants manuellement ou partagez le lien.</p>
            </div>

            <div className="feature-card p-8 rounded-2xl shadow-2xl border-b-8 border-green-600">
              <div
                className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 text-2xl shadow-inner">
                <Dices></Dices>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-green-900">2. Tirez au sort</h3>
              <p className="text-gray-600">Tirez au sort les participants en présentiel ou en ligne. Notifiez par mail les participants de qui ils ont tiré.</p>
            </div>

            <div className="feature-card p-8 rounded-2xl shadow-2xl border-b-8 border-yellow-500">
              <div
                className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-yellow-600 text-2xl shadow-inner">
                <Gift></Gift>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-green-900">3. Offrez</h3>
              <p className="text-gray-600">Révélez les résultats ensemble ou à distance. Échangez les cadeaux le jour
                J et profitez de la fête.</p>
            </div>
          </div>
        </div>
      </section>


      {/* <div className="h-2 w-full absolute top-0 left-0 candy-stripe z-10"></div> */}

      {/* <div
        id="screen-setup"
        className="bg-white rounded-2xl shadow-2xl p-6 relative z-10 overflow-hidden"
        style={{ border: '3px solid #c53030' }}
      >
        <div className="h-2 w-full absolute top-0 left-0 candy-stripe"></div>

        <form
          action={async () => {
                        "use server"

            await signIn("google", { redirectTo: "/create" })
          }}
        >

          <button type="submit" className="mt-6 w-full btn-christmas text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider flex items-center justify-center gap-3"><Image src="/google_logo.svg" alt="Google Logo" width={32} height={32}/>Sign in with Google</button>
        </form>

      </div> */}
      
    </div>
  );
}
