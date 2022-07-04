import { 
  getAuth, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut
} from "firebase/auth";
import dom from "../dom";

// Sign-in.
async function signIn() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

// Sign-out.
function signOutUser() {
  signOut(getAuth());
}

// Initiate firebase auth.
function initFirebaseAuth() {
  onAuthStateChanged(getAuth(), authStateObserver);
}

// Returns the signed-in user's profile pic url.
function getProfilePicUrl() {
  return getAuth().currentUser.photoURL;
}

// Returns the signed-in user's display name.
function getUserName() {
  return getAuth().currentUser.displayName;
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  const userPicElement = document.querySelector('.auth-user-pic');
  const userNameElment = document.querySelector('.auth-user-name');
  const signOutButtonElement = document.querySelector('#auth-sign-out-btn');
  const signInButtonElement = document.querySelector('#auth-sign-in-btn');

  signInButtonElement.addEventListener('click', signIn);
  signOutButtonElement.addEventListener('click', signOutUser);

  if (user) {
    // User is signed in!
    // Get the signed-in user's profile pic and name.
    const profilePicUrl = getProfilePicUrl();
    const userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage = 
      'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameElment.textContent = userName;

    // Show user's profile and sign-out button.
    userPicElement.removeAttribute('hidden');
    userNameElment.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');

    // Hides sign-in button.
    signInButtonElement.setAttribute('hidden', 'true');
  } else {
    // User is signed out!
    // Hide user's profile and sign-out button.
    userPicElement.setAttribute('hidden', 'true');
    userNameElment.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');

    // Shows sign-in button.
    signInButtonElement.removeAttribute('hidden');
  }
}

const auth = () => {
  const authDiv = dom.createDiv("auth-container");

  const userPic = dom.createDiv("auth-user-pic");
  userPic.setAttribute('hidden', 'true');
  const userName = dom.createDiv("auth-user-name");
  userName.setAttribute('hidden', 'true');
  const signInBtn = dom.createBtn("auth-sign-in-btn");
  signInBtn.innerHTML = "Sign-in";
  const signOutBtn = dom.createBtn("auth-sign-out-btn");
  signOutBtn.innerHTML = "Sign-out";
  signOutBtn.setAttribute('hidden', 'true');
  
  authDiv.append(userPic, userName, signInBtn, signOutBtn);

  return authDiv;
};

export { auth, initFirebaseAuth };