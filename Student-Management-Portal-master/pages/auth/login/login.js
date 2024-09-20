
import {
  auth,
  signInWithEmailAndPassword,
  db,
  doc,
  getDoc,
} from "../../../utlis/firebase.js";


let email = document.getElementById("email");
let password = document.getElementById("password");

window.loginUser = async () => {
  try {
    const emailValue = email.value;
    const passwordValue = password.value;

    // Validate email and password fields
    if (!emailValue || !passwordValue) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please enter both email and password.',
      });
      return;
    }

    // Sign in the user with email and password
    const { user } = await signInWithEmailAndPassword(auth, emailValue, passwordValue);
    const userId = user.uid;
    
    // Fetch student data from Firestore
    const studentRef = doc(db, "users", userId);
    const studentSnap = await getDoc(studentRef);
    

    if (studentSnap.exists()) {
      // Store student data in localStorage
      const studentData = studentSnap.data();
      localStorage.setItem("student", JSON.stringify(studentData));

      // Display success message
      Swal.fire({
        icon: 'success',
        title: 'Logged In!',
        text: 'You have successfully logged in!',
      });

      // Redirect after a delay
      setTimeout(() => {
        window.location.replace("../../../index.html");
      }, 1000);
    } else {
      // Handle case where student data is not found
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Student data not found!',
      });
    }
  } catch (error) {
    // Handle login errors
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: error.message.includes("user-not-found") || error.message.includes("wrong-password")
        ? 'Invalid email or password.'
        : 'An unexpected error occurred. Please try again later.',
    });
  }
};
