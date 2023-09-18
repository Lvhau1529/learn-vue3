<template>
  <div class="todo-item min-h-[255px]">
    <template v-if="!props.loading">
      <div v-if="props.todos.length">
        <template
          v-for="(item, index) in props.todos"
          :key="item.id"
        >
          <el-card
            v-if="props.todos.length > 0"
            class="box-card mb-2 relative hover:bg-[#d9ecff]"
          >
            <template #default>
              <el-popover
                ref="popover"
                :width="200"
                :hide-after="50"
                :tabindex="index"
                placement="right"
                trigger="contextmenu"
              >
                <template #reference>
                  <div class="card-content flex justify-between">
                    <div class="card-content-left">
                      <p class="font-bold mb-1">
                        {{ item.title }}
                      </p>
                      <span class="font-light text-sm">{{ item.description }}</span>
                      <div class="flex mt-1">
                        <div class="flex items-center">
                          <el-icon>
                            <Calendar />
                          </el-icon>
                          <p class="ml-1 text-sm">
                            {{ formattedDate(item?.dueDate?.seconds) }}
                          </p>
                        </div>
                        <!-- <div class="flex items-center ml-3">
                          <el-icon>
                            <User />
                          </el-icon>
                          <p class="ml-1 text-sm">
                            Esther Howard
                          </p>
                        </div> -->
                      </div>
                    </div>
                    <el-checkbox
                      v-model="item.status"
                      :label="false"
                      size="large"
                      @change="updateDocument(item)"
                    />
                  </div>
                </template>
                <template #default>
                  <ul>
                    <li
                      class="hover:bg-[#d9ecff] cursor-pointer mb-2"
                      @click="deleteDocument(item)"
                    >
                      <div class="flex items-center">
                        <el-icon>
                          <Edit />
                        </el-icon>
                        <p class="pl-2">
                          Edit Task
                        </p>
                      </div>
                    </li>
                    <li
                      class="hover:bg-[#d9ecff] cursor-pointer"
                      @click="deleteDocument(item)"
                    >
                      <div class="flex items-center text-red-500">
                        <el-icon>
                          <Delete />
                        </el-icon>
                        <p class="pl-2">
                          Delete Task
                        </p>
                      </div>
                    </li>
                  </ul>
                </template>
              </el-popover>
            </template>
          </el-card>
        </template>
      </div>
      <el-empty
        v-else
        class="max-h-[255px]"
        description="No data"
      />
    </template>
    <el-skeleton
      v-else
      :rows="6"
    />
  </div>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const emit = defineEmits(['removeTaskSucceeded'])

// eslint-disable-next-line
const props = defineProps(['todos', 'loading'])

// method
const updateDocument = async (item: any) => {
  try {
    await updateDoc(doc(db, "todos", item.idDoc), {
      status: item.status
    });
    await ElNotification({
      title: 'Success',
      message: 'Task updated successfully!',
      type: 'success',
      duration: 1000
    })
    emit('removeTaskSucceeded')
  } catch (error: any) {
    throw new Error(error);
  }
}

const deleteDocument = async (item: any) => {
  try {
    await deleteDoc(doc(db, "todos", item.idDoc));
    await ElNotification({
      title: 'Success',
      message: 'Task removed successfully!',
      type: 'success',
      duration: 1000
    })
    emit('removeTaskSucceeded')
  } catch (error: any) {
    throw new Error(error);
  }
};

const formattedDate = (timestamp: string) => {
  const date = new Date(+timestamp * 1000);
  return date.toLocaleString();
}
</script>

<style scoped>
.todo-item :deep(.el-checkbox__inner) {
  border-radius: 8px;
}

.el-checkbox:deep(.el-checkbox--large) {
  height: fit-content;
}
</style>