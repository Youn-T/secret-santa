import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { EmailTemplate } from '../../../components/email-template';
import { Resend } from 'resend';
import * as React from 'react';
import dotenv from 'dotenv';
import { auth } from '@/auth';
import { Db, ObjectId } from 'mongodb';
import { use } from 'react';
const resend = new Resend(process.env.RESEND_API_KEY);
dotenv.config();

const SECRET_SANTA_COLLECTION = process.env.SECRET_SANTA_COLLECTION;
const USERS_COLLECTION = process.env.USERS_COLLECTION;



export async function POST(request: Request) {
    const { db } = await dbConnect(); // Récupère l'objet DB

    if (!SECRET_SANTA_COLLECTION) {
        throw new Error('Please define the SECRET_SANTA_COLLECTION environment variable');
    }

    const collection = db.collection(SECRET_SANTA_COLLECTION);

    try {

        const body = await request.json();
        const { groupId } = body;

        const secret_santa = await collection.findOne({ id: groupId });
        if (!secret_santa) {
            return NextResponse.json({ message: 'Id de groupe invalide' }, { status: 404 });
        }

        if (secret_santa.adminId !== (await auth())?.user?.id) {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
        }

        const members: string[] = secret_santa.members.slice();
        const adminParticipates = secret_santa.adminParticipates;
        if (!adminParticipates) {
            const adminId = secret_santa.adminId;
            const index = members.indexOf(adminId);
            if (index > -1) {
                members.splice(index, 1);
            }
        }

        // const users = [];
        // members.forEach(async memberId => {
        //     const user = await getMemberById(memberId, db);
        //     // console.log(user);
        //     users.push({ name: user?.name || 'Utilisateur inconnu', avatar: user?.image || '', id: memberId, mail: user?.email || ''});
        //     console.log(users);
        // })

        const membersData = [];
        for (const memberId of members) {
            // if (memberId === (await auth())?.user?.id) continue;
            const member = await getMemberById(memberId, db);
            // console.log(member);
            membersData.push({ name: member?.name || 'Utilisateur inconnu', avatar: member?.image || '', id: memberId, mail: member?.email || '' });
        }
        // console.log(membersData);

        const pairs = [];

        const firstGiverIndex = Math.floor(Math.random() * members.length);
        const firstGiver = members.splice(firstGiverIndex, 1)
        let giver = firstGiver;
        while (members.length > 0) {
            const recieverIndex = Math.floor(Math.random() * members.length);
            const reciever = members.splice(recieverIndex, 1);
            pairs.push({ giver: giver[0], reciever: reciever[0] })
            giver = reciever;
        }
        pairs.push({ giver: giver[0], reciever: firstGiver[0] })

        // secret_santa.draw = pairs
        collection.updateOne({ id: groupId }, { $set: { draw: pairs } })

        const formatedPairs = [];
        pairs.forEach(async pair => {
            const giver = membersData.find(user => user.id == pair.giver)
            const reciever = membersData.find(user => user.id == pair.reciever)
            // console.log(giver, reciever);
            formatedPairs.push({ giver: { name: giver?.name || 'Utilisateur inconnu', avatar: giver?.avatar || '', id: pair.giver }, reciever: { name: reciever?.name || 'Utilisateur inconnu', avatar: reciever?.avatar || '', id: pair.reciever } })
            // fetch('/api/mails', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: 
            // }).then(res => {
            //     if (!res.ok) {
            //         console.error('Erreur lors de l\'envoi de l\'email');
            //     }
            // }).catch(err => {
            //     console.error('Erreur lors de l\'envoi de l\'email', err);
            // });


            // fetch('/api/mails', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ mail: giver?.mail, firstName: giver?.name, recieverName: reciever?.name }),
            // }).then(async (res) => {
            //     // if (!res.ok) throw new Error('Échec de la suppression');
            //     const { members } = await res.json(); // l’API doit renvoyer { id }
            //     console.log(members);
            // });
            if (giver?.mail && reciever?.name && giver?.name) {
                console.log('Envoi du mail à ', giver?.mail);
                const { data, error } = await resend.emails.send({
                    from: 'Acme <onboarding@resend.dev>',
                    to: [giver?.mail],
                    subject: 'Hello world',
                    // eslint-disable-next-line react-hooks/error-boundaries
                    react: <EmailTemplate name={giver?.name} recieverName={reciever?.name} eventName={secret_santa.name} eventBudget={secret_santa.budget} eventDate={secret_santa.date} recieverAvatar={reciever?.avatar} />,
                });
                console.log('Email sent from Resend: ', data, error);
                if (error) {
                    return NextResponse.json({ message: 'Erreur lors du tirage' },
                        { status: 500 });
                }
            }
        })


        // 3. Réponse (avec l'ID généré par MongoDB)
        return NextResponse.json(
            { message: 'Groupe Mis à Jour', pairs: formatedPairs },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Erreur lors de la création du groupe' },
            { status: 500 }
        );
    }
}

function getMemberById(id: string, db: Db) {
    if (!USERS_COLLECTION) {
        throw new Error('Please define the USERS_COLLECTION environment variable');
    }
    const collection = db.collection(USERS_COLLECTION);
    const o_id = new ObjectId(id);
    return collection.findOne({ "_id": o_id });

}