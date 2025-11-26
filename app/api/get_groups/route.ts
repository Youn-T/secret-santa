import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import dotenv from 'dotenv';
import { auth } from '@/auth';
import { Db, ObjectId } from 'mongodb';
dotenv.config();

const SECRET_SANTA_COLLECTION = process.env.SECRET_SANTA_COLLECTION;
const USERS_COLLECTION = process.env.USERS_COLLECTION;



export async function GET(request: Request) {
    const { db } = await dbConnect(); // Récupère l'objet DB

    if (!SECRET_SANTA_COLLECTION) {
        throw new Error('Please define the SECRET_SANTA_COLLECTION environment variable');
    }

    const collection = db.collection(SECRET_SANTA_COLLECTION);

    try {

        const adminId = (await auth())?.user?.id;
        if (!adminId) {
            return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
        }

        const group = await collection.find({ members: adminId }).toArray();
        if (!group) {
            return NextResponse.json({ message: 'Groupe introuvable' }, { status: 404 });
        }

        
        for (const groupItem of group) {
            const membersData = [];
            for (const memberId of groupItem.members) {
                // if (memberId === (await auth())?.user?.id) continue;
                const member = await getMemberById(memberId, db);
                console.log(member);
                membersData.push({ name: member?.name || 'Utilisateur inconnu', avatar: member?.image || '' });
            }
            groupItem.membersData = membersData;
        }
        return NextResponse.json(
            group.map(group =>
            ({
                id: group.id,
                name: group.name,
                budget: group.budget,
                date: group.date,
                adminSeesDraws: group.adminSeesDraws,
                adminParticipates: group.adminParticipates,
                code: group.code,
                members: group.membersData,
            })),
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

function getMemberById(id: string, db: Db) {
    if (!USERS_COLLECTION) {
        throw new Error('Please define the USERS_COLLECTION environment variable');
    }
    const collection = db.collection(USERS_COLLECTION);
    const o_id = new ObjectId(id);
    return collection.findOne({ "_id": o_id });

}