import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyCV_8uz2wBUDPOTbXiElm1kjp7CUOr1NNM",
  authDomain: "eventree-chat.firebaseapp.com",
  databaseURL: "https://eventree-chat.firebaseio.com",
  projectId: "eventree-chat",
  storageBucket: "eventree-chat.appspot.com",
  messagingSenderId: "184043612419",
  appId: "1:184043612419:web:87382ec6c24db784882136",
  measurementId: "G-VX0JD8LLZF"
};

export async function initFirebase() {
  if (!firebase.apps.length) {
    await firebase.initializeApp(firebaseConfig);
  }
}

export async function createChat(myinfo, userinfo) {
  const user_ids = myinfo.id > userinfo.id ? [myinfo.id, userinfo.id] : [userinfo.id, myinfo.id];
  const user_names = myinfo.id > userinfo.id ? [`${myinfo.first_name} ${myinfo.last_name}`, `${userinfo.first_name} ${userinfo.last_name}`] : [`${userinfo.first_name} ${userinfo.last_name}`, `${myinfo.first_name} ${myinfo.last_name}`];
  const user_photos = myinfo.id > userinfo.id ? [myinfo.photo, userinfo.photo] : [userinfo.photo, myinfo.photo];
  const room_name = myinfo.id > userinfo.id ? `room-${myinfo.id}-${userinfo.id}` : `room-${userinfo.id}-${myinfo.id}`;
  try {
    const checkResponse = await firestore().collection('rooms')
                        .where('room_name', '==', room_name)
                        .get();
    if (!checkResponse.empty) {
      return checkResponse.docs[0].id;
    }
    const createInfo = {
      user_ids,
      user_names,
      user_photos,
      messages: [],
      room_name,
      createdAt: firestore.FieldValue.serverTimestamp(),
    }
    const response = await firestore().collection('rooms').add(createInfo);
    return response.id
  } catch (err) {
    console.log("ERROR ADDING", err)
  }
}

export async function sendMessage(room_id, user_id, message) {
  console.log("ROOM_ID", room_id)
  console.log("ROOM_ID", user_id)
  console.log("ROOM_ID", message)
  try {
    const roomRef = firestore().collection('rooms').doc(room_id);
    let roomInfo = await roomRef.get();
    let messages = roomInfo.data().messages;
    messages.unshift({
      user_id,
      message,
      createdAt: new Date(),
    })
    roomRef.update({ messages: messages })
  } catch (err) {
    console.log("ERROR SENDING MESSAGE: ", err)
  }
}