import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import dotenv from 'dotenv';
import { auth } from '@/auth';
import { Collection } from 'mongodb';
import { group } from 'console';
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
        const { code } = body;

        const secret_santa = await collection.findOne({ code: code });
        if (!secret_santa) {
            return NextResponse.json({ message: 'Code de groupe invalide' }, { status: 404 });
        }

        if (secret_santa.members.includes((await auth())?.user?.id)) {
            return NextResponse.json(
                { message: 'Groupe déjà rejoint', groupId: secret_santa.id },
                { status: 201 }
            );
        }

        secret_santa.members.push((await auth())?.user?.id);

        collection.updateOne({ code: code }, { $set: { members: secret_santa.members } });

        // 3. Réponse (avec l'ID généré par MongoDB)
        return NextResponse.json(
            { message: 'Groupe rejoint', groupId: secret_santa.id },
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