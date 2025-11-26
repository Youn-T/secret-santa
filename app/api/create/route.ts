import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import dotenv from 'dotenv';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Collection } from 'mongodb';
dotenv.config();

const SECRET_SANTA_COLLECTION = process.env.SECRET_SANTA_COLLECTION;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generateJoinCode(collection: Collection<any>): Promise<string> {
    let used = true
    while (used) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const existing = await collection.findOne({ code: code });
        if (!existing) {
            used = false
            return code.toString();
        }
    }
    return '000000'; // Fallback, should never reach here
}

export async function POST(request: Request) {
    const { db } = await dbConnect(); // Récupère l'objet DB

    if (!SECRET_SANTA_COLLECTION) {
        throw new Error('Please define the SECRET_SANTA_COLLECTION environment variable');
    }

    const collection = db.collection(SECRET_SANTA_COLLECTION);

    try {

        const body = await request.json();
        const { name, budget, date, adminSeesDraws, adminParticipates } = body;
        const adminId = (await auth())?.user?.id;
        // 1. Préparation des données
        const id = Date.now().toString()
        const document = {
            id: id,
            name: name,
            budget: budget,
            date: new Date(date),
            adminSeesDraws: adminSeesDraws,
            adminParticipates: adminParticipates,
            createdAt: new Date(),
            draw: [],
            adminId: adminId,
            members: [adminId],
            code: await generateJoinCode(collection),
        };

        const result = await collection.insertOne(document);
        // 3. Réponse (avec l'ID généré par MongoDB)
        return NextResponse.json(
            { message: 'Groupe créé', groupId: id },
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