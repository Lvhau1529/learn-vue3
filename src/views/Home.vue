<template>
  <div class="p-4">
    <!-- <div class="flex justify-center"> -->
    <div>
      <!-- <MicTable /> -->
      <ReadXlsx />
      <!-- <TodoList /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// import MicTable from '@/components/MicTable.vue';

import ReadXlsx from '@/components/ReadXlsx.vue';
// import TodoList from "@/components/TodoList.vue";

</script>

<style>
.wheel-container-indicator:before {
  left: 50%;
}

.wheel-base-indicator:before {
  left: 50%;
}
</style>
