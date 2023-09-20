<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
  >
    <el-menu-item
      class="logo"
      index="1"
    >
      <router-link to="/">
        <img
          src="@/assets/vue.svg"
          alt="Logo"
        >
      </router-link>
    </el-menu-item>
    <el-menu-item index="1">
      <router-link to="/">
        Home
      </router-link>
    </el-menu-item>
    <!-- <el-menu-item index="2">
      <router-link to="/wheel">
        Wheel
      </router-link>
    </el-menu-item> -->
    <div class="flex-grow" />
    <el-sub-menu index="3">
      <template #title>
        <div class="flex items-center">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        </div>
      </template>
      <el-menu-item index="3-1">
        Settings
      </el-menu-item>
      <el-menu-item
        index="3-2"
        @click="logout"
      >
        Logout
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
  <router-view />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { getAuth, signOut } from "firebase/auth";
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = getAuth();

const activeIndex = ref('1')
const logout = async () => {
  signOut(auth).then(() => {
    ElMessage({
      message: 'Sign-out successful',
      type: 'success',
    })
    activeIndex.value = '1'
    router.push('/')
  }).catch((error) => {
    ElMessage({
      message: error.message,
      type: 'error',
    })
  });
}
</script>

<style lang="scss" scoped>
.logo {
  height: 58px !important;
  border: none !important;
}
</style>
