import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from "@/views/Home.vue";
import Wheel from "@/views/Wheel.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requireAuth: false,
      },
    },
    {
      path: "/wheel",
      component: Wheel,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/Login.vue"),
    },
    {
      path: "/register",
      component: () => import("@/views/auth/Register.vue"),
    },
  ],
});

router.beforeEach(async (to, from) => {
  const auth = await getAuth();
  onAuthStateChanged(auth, (user) => {
    console.log(to, to.meta.requireAuth);
    if (to.meta.requireAuth && !user) {
      router.push("/login");
    }
  });
});

export default router;
