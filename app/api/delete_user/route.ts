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
        const { groupId, userName } = body;

        const secret_santa = await collection.findOne({ id: groupId });
        if (!secret_santa) {
            return NextResponse.json({ message: 'Id de groupe invalide' }, { status: 404 });
        }

        secret_santa.members.splice(secret_santa.members.indexOf(userName), 1);

        collection.updateOne({ id: groupId }, { $set: { members: secret_santa.members } });

        // 3. Réponse (avec l'ID généré par MongoDB)
        return NextResponse.json(
            { message: 'Element Supprimé', members: secret_santa.members },
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