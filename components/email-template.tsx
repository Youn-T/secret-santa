import * as React from "react";
// En environnement de compilation en ligne, parfois les imports groupés sont problématiques. 
// Je vais les importer un par un pour assurer la résolution.
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Font,
  Link,
} from "@react-email/components"; 

interface SecretSantaEmailProps {
  name?: string;
  eventName?: string;
  eventDate?: string;
  eventBudget?: string;
  recieverName?: string;
  recieverAvatar?: string;
}

// Export par défaut du composant
export function EmailTemplate({
  name = "Lutin",
  eventName = "Noël des Copains",
  eventDate = "25 Décembre",
  eventBudget = "20",
  recieverName = "Ami Secret",
  recieverAvatar = "",
}: SecretSantaEmailProps) {
  return (
    <Html lang="fr">
      <Head>
        {/* Police Mountains of Christmas pour le style festif */}
        <Font
          fontFamily="Mountains of Christmas"
          fallbackFontFamily="cursive"
          webFont={{
            url: "https://fonts.gstatic.com/s/mountainsofchristmas/v15/xn7_YHE41ni1AdIRqAuZuw1zCx2xo_uPvL2u.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        {/* Police Nunito pour le corps du texte */}
        <Font
          fontFamily="Nunito"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.gstatic.com/s/nunito/v26/XRXV3I6Li01BKofINeaB.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Ton Secret Santa t'attend ! 🎅</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                sapin: "#1a4731", // Vert sapin
                rouge: "#c53030", // Rouge Noël
                creme: "#fbd38d", // Jaune crème
              },
            },
          },
        }}
      >
        <Body className="bg-sapin my-auto mx-auto font-sans">
          <Container className="bg-white rounded-2xl overflow-hidden shadow-2xl my-[40px] mx-auto max-w-[600px] w-full">
            
            {/* Bandeau Candy Stripe */}
            <Section
              className="h-3 w-full bg-rouge"
              style={{
                // Utilisation de CSS pour le motif rayé (fallback couleur unie)
                backgroundImage:
                  "repeating-linear-gradient(45deg, #c53030, #c53030 10px, #fbd38d 10px, #fbd38d 20px)",
              }}
            />

            {/* En-tête avec Icône */}
            <Section className="px-5 pt-10 pb-5 text-center">
              <div className="inline-block p-4 bg-white rounded-full border-4 border-solid border-rouge shadow-md">
                <Text className="text-[40px] leading-none m-0">🎅</Text>
              </div>
            </Section>

            {/* Titre */}
            <Section className="px-5 text-center">
              <Text className="m-0 text-rouge text-4xl font-bold leading-tight font-[Mountains_of_Christmas]">
                Ho Ho Ho !
              </Text>
              <Text className="mt-2 mb-0 text-sapin text-lg font-bold font-[Nunito]">
                Tu es invité(e) au Secret Santa !
              </Text>
            </Section>

            {/* Contenu / Message */}
            <Section className="px-10 py-8 text-center">
              <Text className="text-gray-600 text-base leading-relaxed m-0 mb-5 font-[Nunito]">
                Bonjour <strong>{name}</strong>,
                <br />
                <br />
                Les lutins ont travaillé dur et le tirage au sort a été effectué
                pour l'événement <strong>{eventName}</strong>. Il est temps de
                découvrir à qui tu vas offrir un cadeau !
              </Text>

              {/* Bloc Informations */}
              <Section className="bg-green-50 rounded-lg border border-dashed border-green-600 mb-8 p-4">
                <Text className="text-sapin text-sm font-[Nunito] m-0">
                  📅 <strong>Date :</strong> {eventDate}
                  <br />
                  💰 <strong>Budget :</strong> {eventBudget} € max
                </Text>
              </Section>

              {/* Bouton d'action */}
              {/* <Button
                className="bg-rouge text-white font-bold text-lg no-underline py-4 px-8 rounded-full border border-solid border-rouge uppercase tracking-wider font-[Nunito] hover:bg-red-800 cursor-pointer"
                href={actionUrl}
              >
                🎁 Révéler ma cible
              </Button> */}
              <h2 className="text-sapin text-xl font-bold mb-4 font-[Nunito]">
                Ta cible est :
              </h2>
              <Text className="text-gray-800 text-2xl font-semibold font-[Nunito]">
                {recieverName} <img src={recieverAvatar} alt="Avatar" className="inline-block w-8 h-8 rounded-full ml-2 align-middle" />
              </Text>

              <Text className="mt-6 mb-0 text-gray-400 text-xs italic font-[Nunito]">
                Chut... garde le secret ! 🤫
              </Text>
            </Section>

          </Container>


        </Body>
      </Tailwind>
    </Html>
  );
}