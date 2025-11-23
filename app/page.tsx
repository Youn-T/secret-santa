import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 dark:from-black dark:to-black font-sans text-zinc-900">
      <main className="mx-auto max-w-5xl py-20 px-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-red-600">Secret Santa</h1>
            <p className="text-xs text-zinc-600">Organisez des échanges anonymes en toute simplicité</p>
          </div>
          <nav className="flex gap-4">
            <a href="#features" className="text-sm text-zinc-700 hover:underline">Fonctionnalités</a>
            <a href="#how" className="text-sm text-zinc-700 hover:underline">Comment ça marche</a>
          </nav>
        </header>

        <section className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-4xl font-bold leading-tight">Organisez votre Secret Santa en quelques clics</h2>
            <p className="mt-4 text-lg text-zinc-700">Créez un groupe, définissez le budget et laissez notre système tirer les noms et envoyer les invitations — tout en gardant le secret.</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/create" className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-3 text-white hover:bg-red-700">Créer un échange</Link>
              <Link href="/join" className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 py-3 text-zinc-900 hover:bg-zinc-100">Rejoindre</Link>
            </div>

            <p className="mt-4 text-sm text-zinc-500">Gratuit · Rapide · Confidentialité respectée</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold">Exemple rapide</h3>
            <ol className="mt-4 space-y-3 list-decimal list-inside text-zinc-700">
              <li>Créer un échange et définir la date</li>
              <li>Inviter les participants par e‑mail</li>
              <li>Le tirage est effectué automatiquement</li>
              <li>Envoyer les instructions et idées cadeaux</li>
            </ol>
          </div>
        </section>

        <section id="features" className="mt-16">
          <h3 className="text-2xl font-bold">Fonctionnalités</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <strong className="block text-lg">Tirage aléatoire</strong>
              <p className="mt-2 text-sm text-zinc-600">Tirage sécurisé pour garder l&apos;anonymat entre participants.</p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <strong className="block text-lg">Budget & règles</strong>
              <p className="mt-2 text-sm text-zinc-600">Fixez un budget et ajoutez des règles ou exclusions.</p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <strong className="block text-lg">Invitations automatiques</strong>
              <p className="mt-2 text-sm text-zinc-600">Envoi d&apos;e‑mails et rappels pour tous les participants.</p>
            </div>
          </div>
        </section>

        <section id="how" className="mt-16">
          <h3 className="text-2xl font-bold">Comment ça marche</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-2xl font-semibold text-red-600">1</div>
              <p className="mt-2 text-sm text-zinc-700">Créez un échange et invitez des amis.</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-2xl font-semibold text-red-600">2</div>
              <p className="mt-2 text-sm text-zinc-700">Les participants confirment leur présence.</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-2xl font-semibold text-red-600">3</div>
              <p className="mt-2 text-sm text-zinc-700">Le tirage est effectué et les notifications envoyées.</p>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t pt-6 text-sm text-zinc-600">
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} Secret Santa</span>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Politique de confidentialité</a>
              <a href="#" className="hover:underline">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
