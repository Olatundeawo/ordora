import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export async function apiFetch(url, options = {}) {
  let access = await AsyncStorage.getItem("access");
  let refresh = await AsyncStorage.getItem("refresh");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${access}`
  };

  // First attempt
  let response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });

  // If access expired → try refresh
  if (response.status === 401 && refresh) {
    const refreshResp = await fetch(`${BASE_URL}auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh })
    });

    if (refreshResp.status === 200) {
      const { access: newAccess } = await refreshResp.json();

      // Save new access token
      await AsyncStorage.setItem("access", newAccess);

      // Retry original request
      headers.Authorization = `Bearer ${newAccess}`;
      return fetch(`${BASE_URL}${url}`, { ...options, headers });
    }

    // Refresh expired → logout user
    await AsyncStorage.removeItem("access");
    await AsyncStorage.removeItem("refresh");

    throw new Error("Session expired. Please log in again.");
  }

  return response;
}
