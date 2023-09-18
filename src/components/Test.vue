<template>
  <div>
    <div class="flex">
      <input
        type="file"
        @change="handleFileChange"
      >
      <el-select
        v-model="selected"
        placeholder="Select"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div>
      <span>{{ copyData || "No data" }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import { read } from 'xlsx';
import * as XLSX from 'xlsx';

export default {
  setup() {
    const resultXlsx = ref();
    const copyData = ref<any>();
    const options = [
      { label: "name", value: 0 },
      { label: "nameEn", value: 1 }
    ]
    const selected = ref(0);

    const handleFileChange = async (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      watch(selected, () => {
        getDataByCol();
      });


      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const result = jsonData.map((row: any) => {
          const obj: any = {};
          jsonData[0].forEach((header: any, index: number) => {
            if (header === "Sample code") {
              obj["code"] = row[index].substring(3);
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

    return {
      resultXlsx,
      copyData,
      options,
      selected,
      handleFileChange,
    };
  },
};
</script>