<template>
  <h1 class="text-center my-3">
    Login
  </h1>
  <div class="flex justify-center">
    <el-form
      ref="loginForm"
      :model="state"
      :rules="rules"
    >
      <el-form-item
        label="Email"
        prop="email"
      >
        <el-input v-model="state.email" />
      </el-form-item>
      <el-form-item
        label="Password"
        prop="password"
      >
        <el-input
          v-model="state.password"
          type="password"
          placeholder="Please input password"
          show-password
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          Login
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useMainStore } from '@/stores';

const router = useRouter()
const auth = getAuth();
const store = useMainStore()

interface IState {
  email: string,
  password: string
}

// data
const loginForm = ref<FormInstance>()
const state = reactive<IState>({
  email: '',
  password: ''
})

// method
const rules = reactive<FormRules>({
  email: [
    { required: true, message: 'Please input email', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: ['blur', 'change'] }
  ]
})

const onSubmit = () => {
  signInWithEmailAndPassword(auth, state.email, state.password)
    .then((userCredential) => {
      const user = userCredential.user;
      store.getUser(user)
      ElMessage({
        message: 'Logged in successfully',
        type: 'success',
      })
      router.push('/')
    })
    .catch((error) => {
      ElMessage({
        message: error.message,
        type: 'error',
      })
    });
}

</script>

<style lang="scss" scoped></style>