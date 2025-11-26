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
        const { groupId, name, budget, date, adminSeesDraws, adminParticipates } = body;

        const secret_santa = await collection.findOne({ id: groupId });
        if (!secret_santa) {
            return NextResponse.json({ message: 'Id de groupe invalide' }, { status: 404 });
        }

        if (secret_santa.adminId !== (await auth())?.user?.id) {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
        }

        secret_santa.name = name;
        secret_santa.budget = budget;
        secret_santa.date = date;
        secret_santa.adminSeesDraws = adminSeesDraws;
        secret_santa.adminParticipates = adminParticipates;
        console.log(secret_santa);
        collection.updateOne({ id: groupId }, { $set: secret_santa });

        // 3. Réponse (avec l'ID généré par MongoDB)
        return NextResponse.json(
            { message: 'Groupe Mis à Jour'},
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