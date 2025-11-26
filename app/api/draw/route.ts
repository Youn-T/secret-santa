import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import dotenv from 'dotenv';
import { auth } from '@/auth';

dotenv.config();

const SECRET_SANTA_COLLECTION = process.env.SECRET_SANTA_COLLECTION;



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

        const members: unknown[] = secret_santa.members.slice();
        const adminParticipates = secret_santa.adminParticipates;
        if (!adminParticipates) {
            const adminId = secret_santa.adminId;
            const index = members.indexOf(adminId);
            if (index > -1) {
                members.splice(index, 1);
            }
        }

        const pairs = [];

        const firstGiverIndex = Math.floor(Math.random() * members.length);
        const firstGiver = members.splice(firstGiverIndex, 1)
        let giver = firstGiver;
        while (members.length > 1) {
            const recieverIndex = Math.floor(Math.random() * members.length);
            const reciever = members.splice(recieverIndex, 0);
            pairs.push({ giver: giver, reciever: reciever })
            giver = reciever;
        }
        pairs.push({ giver: giver, reciever: firstGiver })

        // secret_santa.draw = pairs
        collection.updateOne({ id: groupId }, { $set: { draw: pairs } })

        // 3. Réponse (avec l'ID généré par MongoDB)
        return NextResponse.json(
            { message: 'Groupe Mis à Jour', pairs: pairs },
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