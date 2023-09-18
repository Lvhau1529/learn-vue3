<template>
  <h1 class="text-center my-3">
    Register
  </h1>
  <div class="flex justify-center">
    <el-form
      ref="registerForm"
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
        <el-button @click="onRegister">
          Register
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const router = useRouter();

interface IState {
  email: string,
  password: string
}

// data
const registerForm = ref<FormInstance>()
const state = reactive<IState>({
  email: '',
  password: ''
})

// method
const onRegister = () => {
  registerForm.value?.validate(async valid => {
    if (!valid) return
    try {
      await createUserWithEmailAndPassword(getAuth(), state.email, state.password)
      ElMessage({
        message: 'Congrats, Register success.',
        type: 'success',
      })
      await router.push('/')
    } catch (error: any) {
      throw new Error(error);
    }
  })
}

const rules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: 'Please input email address',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: 'Please input correct email address',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    { required: true, message: 'Please input the password', trigger: ['blur', 'change'] }
  ]
})

</script>

<style lang="scss" scoped></style>