<template>
  <div>
    <div class="flex justify-center w-full mb-4">
      <div class="flex items-center justify-center mr-8 w-[512px]">
        <label
          for="dropzone-file"
          class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              class="w-10 h-10 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or
              drag and drop</p>
            <p class="text-xs text-gray-500">Xlsx file</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            class="hidden"
            @change="handleFileChange"
          >
        </label>
      </div>
      <div>
        <p class="mb-1 text-sm">
          Select language
        </p>
        <el-select
          v-model="selected"
          placeholder="Select"
          :disabled="!copyData"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <p
          class="mt-2 cursor-pointer italic hover:text-blue-300 hover:underline"
          @click="handleBeautify"
        >
          Beautify result
        </p>
      </div>
    </div>
    <div
      :class="{ 'text-center': !copyData, 'flex justify-center': isBeautify }"
      class="p-3 border rounded-lg bg-gray-50"
    >
      <p :class="{ 'whitespace-break-spaces': isBeautify }">
        {{ copyData || "No data!" }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { read } from 'xlsx';
import * as XLSX from 'xlsx';

const resultXlsx = ref();
const copyData = ref<any>();
const options = [
  { label: "Vietnamese", value: 0 },
  { label: "English", value: 1 }
]
const selected = ref(0);
const isBeautify = ref(false);

watch(selected, () => {
  getDataByCol();
});

const handleBeautify = () => {
  isBeautify.value = !isBeautify.value
}

const handleFileChange = async (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const result = jsonData.map((row: any) => {
      const obj: any = {};
      jsonData[0].forEach((header: any, index: number) => {
        if (header === "Sample code") {
          obj["code"] = row[index]?.substring(3);
        } else if (header === "Sample name") {
          obj["name"] = row[index];
        } else if (header === "Sample name En") {
          obj["nameEn"] = row[index];
        }
      });
      return obj;
    });
    resultXlsx.value = result;
    getDataByCol();
  };

  reader.readAsArrayBuffer(file);
};

const getDataByCol = () => {
  const result: any = {}
  resultXlsx.value.forEach((item: any) => {
    result[item.code] = selected.value ? item.nameEn : item.name;
  });
  copyData.value = result;
}
</script>