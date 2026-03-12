const BASE_URL = "https://zenter-backend-production.up.railway.app";

export const signup = async (data) => {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  console.log("SIGNUP RESPONSE:", json);

  if (!json.success) {
    throw new Error("Signup failed");
  }

  return json;
};