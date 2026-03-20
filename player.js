import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
    getFirestore,
    doc,
    onSnapshot,
    collection,
    addDoc,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCMFCpMca97TM1ZH6rEDddgKAZCfWys6po",
  authDomain: "test-1f67e.firebaseapp.com",
  projectId: "test-1f67e",
  storageBucket: "test-1f67e.firebasestorage.app",
  messagingSenderId: "497473439103",
  appId: "1:497473439103:web:69857c01ff839d5fc2864a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// elements
const img = document.getElementById("randomImage");
const aiBtn = document.getElementById("aiBtn");
const realBtn = document.getElementById("realBtn");

// 👉 user id (anti double vote)
const userId = localStorage.getItem("userId") || crypto.randomUUID();
localStorage.setItem("userId", userId);

let currentImage = "";
let currentType = "";

// 🔥 live image από Firebase
onSnapshot(doc(db, "game", "current"), (docSnap) => {
    if (docSnap.exists()) {
        const data = docSnap.data();

        console.log("📥 Game update:", data);

        currentImage = data.image;
        currentType = data.type;

        img.src = currentImage;
    }
});

// 🗳️ function vote
async function vote(choice) {

    console.log("🗳️ Voting:", choice);

    if (!currentImage) {
        alert("Δεν υπάρχει εικόνα!");
        return;
    }

    // έλεγχος αν έχει ήδη ψηφίσει
    const q = query(
        collection(db, "votes"),
        where("userId", "==", userId),
        where("image", "==", currentImage)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        alert("Έχεις ήδη ψηφίσει!");
        return;
    }

    // αποθήκευση vote
    await addDoc(collection(db, "votes"), {
        userId: userId,
        image: currentImage,
        choice: choice,
        correct: currentType,
        time: Date.now()
    });

    console.log("✅ Saved");

    // WIN
    if (choice === currentType) {
        alert("🏆 WIN!");
    }
}

// 👉 κουμπιά
aiBtn.addEventListener("click", () => vote("ai"));
realBtn.addEventListener("click", () => vote("real"));