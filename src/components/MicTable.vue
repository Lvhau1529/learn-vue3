<template>
  <el-table
    class="mt-2"
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column width="55">
      <template #default="{ row }">
        <el-checkbox
          :disabled="disableCheckbox(row)"
          @change="handleCheckboxChange(row)"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="date"
      label="Date"
      width="180"
    />
    <el-table-column
      prop="name"
      label="Name"
      width="180"
    />
    <el-table-column
      prop="address"
      label="Address"
    />
  </el-table>
  <div class="block">
    <p>{{ selectedRows }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]);
const selectedRows = ref<any[]>([]);

const disableCheckbox = computed(() => {
  return (row: any) => {
    return selectedRows.value.length === 2 && !selectedRows.value.includes(row);
  };
})

function handleCheckboxChange(row: any) {
  if (!selectedRows?.value?.some((item: any) => item.date === row.date)) {
    selectedRows.value.push(row)
  } else {
    const index = selectedRows.value.findIndex((item: any) => item.date === row.date);
    if (index !== -1) {
      selectedRows.value.splice(index, 1);
    }
  }
}
</script>