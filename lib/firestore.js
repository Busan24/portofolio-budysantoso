import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

// ============ PROJECTS ============
export const projectsCollection = collection(db, "projects");

export const getProjects = async () => {
    const q = query(projectsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const getProject = async (id) => {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
};

export const addProject = async (data) => {
    const docRef = await addDoc(projectsCollection, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
};

export const updateProject = async (id, data) => {
    const docRef = doc(db, "projects", id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

export const deleteProject = async (id) => {
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
};

// ============ ACHIEVEMENTS ============
export const achievementsCollection = collection(db, "achievements");

export const getAchievements = async () => {
    const q = query(achievementsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const addAchievement = async (data) => {
    const docRef = await addDoc(achievementsCollection, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
};

export const updateAchievement = async (id, data) => {
    const docRef = doc(db, "achievements", id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

export const deleteAchievement = async (id) => {
    const docRef = doc(db, "achievements", id);
    await deleteDoc(docRef);
};

// ============ SERVICES ============
export const servicesCollection = collection(db, "services");

export const getServices = async () => {
    const q = query(servicesCollection, orderBy("num", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const addService = async (data) => {
    const docRef = await addDoc(servicesCollection, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
};

export const updateService = async (id, data) => {
    const docRef = doc(db, "services", id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

export const deleteService = async (id) => {
    const docRef = doc(db, "services", id);
    await deleteDoc(docRef);
};

// ============ SINGLE DOCUMENTS (Hero, About, Contact) ============
export const getSingleDoc = async (docName) => {
    const docRef = doc(db, "settings", docName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
};

export const updateSingleDoc = async (docName, data) => {
    const docRef = doc(db, "settings", docName);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

// ============ IMAGE UPLOAD ============
export const uploadImage = async (file, folder = "images") => {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, path: fileName };
};

export const deleteImage = async (path) => {
    if (!path) return;
    const storageRef = ref(storage, path);
    try {
        await deleteObject(storageRef);
    } catch (error) {
        console.error("Error deleting image:", error);
    }
};
