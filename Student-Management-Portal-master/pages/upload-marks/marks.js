
import {
  db,
  collection, getDocs, query, where, addDoc, serverTimestamp
} from "../../utlis/firebase.js";



const form = document.getElementById('uploadMarksForm');
const loading = document.getElementById('loading');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Show loading state
  loading.classList.remove('hidden');

  // Get form values
  const cnic = document.getElementById('cnic').value;
  const course = document.getElementById('course').value;
  const marks = document.getElementById('marks').value;
  const totalMarks = document.getElementById('totalMarks').value;
  const grade = document.getElementById('grade').value;

  try {
      // Fetch student by CNIC
      const studentQuery = query(collection(db, 'users'), where('cnic', '==', cnic));
      const querySnapshot = await getDocs(studentQuery);

      // Check if student exists
      if (querySnapshot.empty) {
          alert('No student found with this CNIC');
          return;
      }

      // Get student document reference
      let studentDocRef;
      querySnapshot.forEach((doc) => {
          studentDocRef = doc.ref; // Reference to the student's document
      });

      // Create an object for the marks
      const marksData = {
          course: course,
          marks: parseInt(marks),
          totalMarks: parseInt(totalMarks),
          grade: grade,
          timestamp: serverTimestamp()  // Add timestamp for better tracking
      };

      // Add marks to Firestore under the student's document (subcollection "marks")
      await addDoc(collection(studentDocRef, 'marks'), marksData);

      // Show success message and redirect after 3 seconds
      setTimeout(() => {
          loading.classList.add('hidden');
          alert('Marks uploaded successfully!');
          window.location.href = "../admin-pannel/admin.html";
      }, 3000); // 3000 milliseconds = 3 seconds

  } catch (error) {
      console.error('Error uploading marks:', error.message);
      loading.classList.add('hidden'); // Hide loading state on error
  }
});
