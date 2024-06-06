import { defineStore } from "pinia";

interface User {
  id: Number;
  name: String;
  email: String;
}

export const useAuth = defineStore("auth", () => {
  const token = useCookie("token", { maxAge: 30 * 24 * 60 * 60 });
  const user = ref<User | null>(null);

  async function getUser() {
    if (token.value) {
      let { data } = await eFetch<{ status: Number; msg: String; data: User }>(
        "/api/auth/me",
        { method: "POST" }
      );

      if (data.value?.status == 200) {
        user.value = data.value.data;
      } else if (data.value?.status == 401) {
        navigateTo("/");
        signOut();
      }
    }
  }

  async function setToken(t: string) {
    token.value = t;
    await getUser();
  }

  async function signOut() {
    await eFetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    token.value = null;
    user.value = null;
    navigateTo({ path: "/" });
  }

  function getToken() {
    return token.value;
  }

  return { user, signOut, setToken, getUser, getToken };
});