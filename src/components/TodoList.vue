<template>
  <div class="rounded p-4 shadow-lg w-full sm:max-w-lg bg-[#f9f9f9]">
    <div class="flex justify-between mb-4">
      <div>
        <h1 class="text-xl font-bold">
          Today's Task
        </h1>
        <p class="text-sm font-medium text-gray-400">
          {{ currentTime }}
        </p>
      </div>
      <el-button @click="handleClick">
        <el-icon>
          <Plus />
        </el-icon>
        <span>New Task</span>
      </el-button>
    </div>
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      @tab-click="getData()"
    >
      <el-tab-pane
        label="All"
        name="All"
      >
        <template #label>
          <span class="custom-tabs-label">
            <span>All</span>
            <el-tag
              class="mx-1"
              round
            >
              {{ countTab.all }}
            </el-tag>
          </span>
        </template>
      </el-tab-pane>
      
      <el-tab-pane
        label="Open"
        name="Open"
      >
        <template #label>
          <span class="custom-tabs-label">
            <span>Open</span>
            <el-tag
              class="mx-1"
              round
            >
              {{ countTab.open }}
            </el-tag>
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane
        label="Closed"
        name="Closed"
      >
        <template #label>
          <span class="custom-tabs-label">
            <span>Closed</span>
            <el-tag
              class="mx-1"
              round
            >
              {{ countTab.closed }}
            </el-tag>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <TodoItem
      :todos="todos"
      :loading="loading"
      @remove-task-succeeded="getData()"
    />
    <Diaglog
      v-if="dialogTableVisible"
      :dialog-table-visible="dialogTableVisible"
      @add-task-succeeded="getData()"
      @close="dialogTableVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { collection, getDocs, query, where, getCountFromServer } from 'firebase/firestore'
import { db } from '@/firebase'
import moment from 'moment'
import TodoItem from './TodoItem.vue';
import Diaglog from './Base/Diaglog.vue';

defineExpose({
  handleClick
})

// data
const todos = ref()
const loading = ref(true)
const currentTime = ref(moment().format('ddd, DD MMM hh:mm:ss'))
const countTab = reactive({
  all: 0,
  open: 0,
  closed: 0
})

// mounted
onMounted(async () => {
  getData()
  setInterval(updateCurrentTime, 1000);
});

// data
const activeName = ref<string>('All')
const dialogTableVisible = ref<boolean>(false)

// method
const updateCurrentTime = () => {
  currentTime.value = moment().format('ddd, DD MMM hh:mm:ss')
}

const getData = async () => {
  todos.value = []
  loading.value = true
  await nextTick()
  await getCountTab()
  let q = query(collection(db, "todos"))
  switch (activeName.value) {
    case 'All':
      q = query(collection(db, "todos"));
      break;
    case 'Open':
      q = query(collection(db, "todos"), where("status", "==", false));
      break
    case 'Closed':
      q = query(collection(db, "todos"), where("status", "==", true));
      break
    default:
      break;
  }
  try {
    const querySnapshot = await getDocs(q);
    todos.value = querySnapshot.docs.map((doc) => ({ idDoc: doc.id, ...doc.data() }));
    loading.value = false
  } catch (error: any) {
    throw new Error(error)
  }
};

const getCountTab = async () => {
  const all = await getCountFromServer(query(collection(db, "todos")))
  countTab.all = all.data().count

  const open = await getCountFromServer(query(collection(db, "todos"), where("status", "==", false)))
  countTab.open = open.data().count

  const closed = await getCountFromServer(query(collection(db, "todos"), where("status", "==", true)))
  countTab.closed = closed.data().count
}

function handleClick(): void {
  dialogTableVisible.value = true
}
</script>
