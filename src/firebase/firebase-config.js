const config = {
  apiKey: "AIzaSyDXx7vBPdyAisuAx5IR6lJtkxyc9CxSn2c",
  authDomain: "todooo-ed49d.firebaseapp.com",
  projectId: "todooo-ed49d",
  storageBucket: "todooo-ed49d.appspot.com",
  messagingSenderId: "649525384140",
  appId: "1:649525384140:web:a0a3766974d7925a51c369"
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error ('No Firebase configuration object provided.' + '\n' + 
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}