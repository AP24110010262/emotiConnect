import { db } from "./firebase.js";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const chatBox = document.getElementById("chatBox");
const mood = localStorage.getItem("selectedMood") || "Neutral";
document.getElementById("displayMood").innerText = mood;

const roomInfo = document.getElementById("roomInfo");
roomInfo.innerText = "You are connected to the " + mood + " Room 🤝";

const username = prompt("Enter your name:");
const messagesRef = collection(db, "rooms", mood, "messages");

// Emotion detector
function detectEmotion(text){
  text = text.toLowerCase();
  if (text.includes("sad") || text.includes("cry")) return "Sad 😢";
  if (text.includes("happy") || text.includes("great")) return "Happy 😊";
  if (text.includes("angry")) return "Angry 😡";
  if (text.includes("alone") || text.includes("lonely")) return "Lonely 🥺";
  return "Neutral 😐";
}

window.sendMessage = async function(){
  const input = document.getElementById("messageInput");
  const msg = input.value;

  if(msg.trim() === "") return;

  const emotion = detectEmotion(msg);

  await addDoc(messagesRef, {
    sender: username,
    text: msg,
    emotion: emotion,
    time: serverTimestamp()
  });

  input.value = "";
};

// Query for realtime updates
const q = query(messagesRef, orderBy("time"));

onSnapshot(q, (snapshot) => {
  chatBox.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();

    chatBox.innerHTML += `
      <p>
        <b>${data.sender}:</b> ${data.text}<br/>
        <small>Emotion: ${data.emotion}</small>
      </p>
      <hr/>
    `;
  });

  chatBox.scrollTop = chatBox.scrollHeight;
});

// Support message
const supportBox = document.getElementById("supportBox");
if (mood === "Sad") supportBox.innerText = "It’s okay to feel sad. You’re not alone 💙";
else if (mood === "Angry") supportBox.innerText = "Pause and breathe. Let’s calm down together 🧘";
else if (mood === "Lonely") supportBox.innerText = "Someone is here with you 🤝";
else supportBox.innerText = "Hope you’re having a good moment 🌟";