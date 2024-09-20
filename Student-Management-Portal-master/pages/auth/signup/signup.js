import {
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
} from "../../../utlis/firebase.js";




let username = document.getElementById("username");
let email = document.getElementById("email");
let password = document.getElementById("password");

window.signupUser = () => {
  let obj = {
    username: username.value,
    email: email.value,
    password: password.value,
  };

  createUserWithEmailAndPassword(auth, obj.email, obj.password)
    .then((res) => {
      obj.id = res.user.uid;
      obj.userType = "user";

      Swal.fire({
        icon: "success",
        title: "Loged In!",
        text: "You have successfully sign up!",
      });

      const reference = doc(db, "users", obj.id);
      setDoc(reference, obj)
        .then(() => {
          const userObj = JSON.stringify(obj);
          localStorage.setItem("user", userObj);
          setTimeout(() => {
            window.location.replace("../login/login.html");
          }, 3000);
        })
        .catch((e) => {
          alert("E-message", e.message);
        });
    })
    .catch((err) => {
      console.log("Error-message", err.message);
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Please enter all fields",
      });
    });
};
