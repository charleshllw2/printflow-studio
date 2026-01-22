import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const q = query(collection(db, "motions"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const motions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
        }));
        return NextResponse.json(motions);
    } catch (error) {
        console.error("Error fetching motion requests:", error);
        return NextResponse.json({ error: "Failed to fetch motions" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        await deleteDoc(doc(db, "motions", id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete motion request" }, { status: 500 });
    }
}
