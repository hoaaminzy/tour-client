import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/FirebaseConfig';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return user ? children : <div>Please log in</div>;
};

export default ProtectedRoute;
