import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import dotenv from 'dotenv';
import { auth } from '@/auth';
dotenv.config();

const SECRET_SANTA_COLLECTION = process.env.SECRET_SANTA_COLLECTION;



export async function GET(request: Request) {
    const { db } = await dbConnect(); // Récupère l'objet DB

    if (!SECRET_SANTA_COLLECTION) {
        throw new Error('Please define the SECRET_SANTA_COLLECTION environment variable');
    }

    const collection = db.collection(SECRET_SANTA_COLLECTION);

    try {
        const url = new URL(request.url);
        const groupId = url.searchParams.get('groupId') || '';
        if (!groupId) {
            return NextResponse.json({ message: 'Paramètre groupId manquant' }, { status: 400 });
        }

        const adminId = (await auth())?.user?.id;
        if (!adminId) {
            return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
        }

        const group = await collection.findOne({ id: groupId });
        if (!group) {
            return NextResponse.json({ message: 'Groupe introuvable' }, { status: 404 });
        }
        console.log(group);
        console.log(adminId);
        console.log(group.members.includes(adminId));
        if (group.adminId !== adminId && !group.members.includes(adminId)) {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
        }

        return NextResponse.json(
            {
                name: group.name,
                budget: group.budget,
                date: group.date,
                adminSeesDraws: group.adminSeesDraws,
                adminParticipates: group.adminParticipates,
                code: group.code,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Erreur lors de la récupération du groupe' },
            { status: 500 }
        );
    }
}