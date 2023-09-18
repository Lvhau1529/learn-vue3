<template>
  <div>
    <input
      type="file"
      @change="handleFileChange"
    >
    <div>
      <span>{{ copyData || "No data" }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { read } from 'xlsx';
import * as XLSX from 'xlsx';

export default {
  setup() {
    const resultXlsx = ref();
    const copyData = ref<any>({});
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
        result[item.code] = item.name;
      });
      copyData.value = result;
    }

    return {
      resultXlsx,
      copyData,
      handleFileChange,
    };
  },
};
</script>