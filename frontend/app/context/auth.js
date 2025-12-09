import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);

  // When user logs in
  const login = async (userData, tokens) => {
    setUser(userData);
    setAccess(tokens.access);
    setRefresh(tokens.refresh);

    await AsyncStorage.setItem("access", tokens.access);
    await AsyncStorage.setItem("refresh", tokens.refresh);
  };

  // When tokens expire
  const logout = async () => {
    setUser(null);
    setAccess(null);
    setRefresh(null);

    await AsyncStorage.removeItem("access");
    await AsyncStorage.removeItem("refresh");
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,

      access,
      refresh,
      setAccess,
      setRefresh,

      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
