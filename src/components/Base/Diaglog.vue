<template>
  <el-dialog
    :model-value="props.dialogTableVisible"
    :title="'Add new task'"
    :width="widthScreen <= 1024 ? '90%' : '40%'"
    @close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="task"
      :rules="rules"
    >
      <el-form-item prop="title">
        <el-input
          v-model="task.title"
          placeholder="Task name here..."
        />
      </el-form-item>
      <el-form-item prop="description">
        <el-input
          v-model="task.description"
          :autosize="{ minRows: 4, maxRows: 5 }"
          :resize="'none'"
          type="textarea"
          placeholder="Description"
        />
      </el-form-item>
      <el-row :gutter="10">
        <el-col
          :span="12"
          :md="12"
        >
          <el-form-item prop="dueDate">
            <el-date-picker
              v-model="task.dueDate"
              format="DD/MM/YYYY hh:mm"
              type="datetime"
              placeholder="Due date"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          :md="12"
        >
          <el-form-item>
            <el-select
              v-model="task.priority"
              placeholder="Priority"
            >
              <el-option
                v-for="item in priorityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="handleClose()">
        Cancel
      </el-button>
      <el-button
        class="bg-[#409eff]"
        type="primary"
        @click="handleAddTask()"
      >
        Save
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { v4 as uuidv4 } from 'uuid';
import { ElNotification } from 'element-plus'
import { PRIORITY } from '@/interface/const'

interface ITask {
  title?: string,
  description: string,
  dueDate: string,
  priority: number
}

const props = defineProps({
  dialogTableVisible: Boolean
})

const emit = defineEmits(['close', 'addTaskSucceeded'])

// data
const ruleFormRef = ref<FormInstance>()
const task = reactive<ITask>({
  title: '',
  description: '',
  dueDate: '',
  priority: 0,
})
const priorityOptions = [
  {
    value: PRIORITY.NORMAL,
    label: 'Normal'
  },
  {
    value: PRIORITY.HIGH,
    label: 'High'
  },
  {
    value: PRIORITY.CRITICAL,
    label: 'Critical'
  },
]
const widthScreen = ref(window.innerWidth)

onMounted(() => {
  window.addEventListener("resize", getScreenSize);
})

// method
const getScreenSize = () => {
  widthScreen.value = window.innerWidth
}
const rules = reactive<FormRules>({
  title: [
    { required: true, message: 'Please input title', trigger: ['blur'] },
    { min: 3, message: 'Length should be at least 3', trigger: ['blur', 'change'] }
  ],
  description: [{ max: 500, message: 'Max length is 500 characters', trigger: ['blur', 'change'] }],
  dueDate: [{ required: true, message: 'Please choose due date', trigger: 'blur' }],
  priority: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }],
})

const handleAddTask = () => {
  const payload = {
    id: uuidv4(),
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    createAt: '',
    priority: task.priority,
    status: false
  }
  ruleFormRef.value?.validate(async valid => {
    if (!valid) return
    try {
      const documentsCollection = collection(db, 'todos')
      await addDoc(documentsCollection, payload)
      await ElNotification({
        title: 'Success',
        message: 'Task added successfully!',
        type: 'success',
        duration: 1000
      })
      emit('addTaskSucceeded')
      handleClose()
    } catch (error) {
      console.error(error)
    }
  })
}
const handleClose = () => {
  emit('close')
}
</script>
<style scoped lang="scss">
.dialog {
  :deep(.el-dialog__body) {
    padding-top: 0 !important;
  }
}
</style>
