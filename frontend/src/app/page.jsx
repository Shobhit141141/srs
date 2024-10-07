// src/pages/index.js (Home page)
import ProtectedRoute from "@/components/Protected";
import StudentsPage from "@/components/students";

function Home() {
  return (
    <ProtectedRoute>
      <div>
        <StudentsPage />
      </div>
    </ProtectedRoute>
  );
}

// Wrap the Home component with the `withAuth` HOC to protect it
export default Home;
