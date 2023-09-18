<template>
  <div>
    Hello
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
<!-- <template>
  <div class="p-4">
    <h1 class="text-center font-bold text-lg">
      Choose food eating today!
    </h1>
    <div class="flex mt-5 justify-center">
      <Roulette
        ref="wheel"
        v-bind="wheelSettings"
        :first-item-index="{ value: 0 }"
        :base-html-content="'Hello'"
        :items="items"
        @click="launchWheel"
      >
        <template #baseContent>
          <div
            class="text-center w-20"
          >
            <img
              class="object-cover"
              src="@/assets/cat.png"
              alt="Logo"
            >
          </div>
        </template>
      </Roulette>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const wheel = ref();
const items = [
  { id: 1, name: "Banana", htmlContent: "Banana", textColor: "#00000", background: "#CDB4DB" },
  { id: 2, name: "Apple", htmlContent: "Apple", textColor: "#00000", background: "#FFC8DD" },
  { id: 3, name: "Orange", htmlContent: "Orange", textColor: "#00000=", background: "#FFAFCC" },
  { id: 4, name: "Cherry", htmlContent: "Cherry", textColor: "#00000", background: "#BDE0FE" },
  { id: 5, name: "Strawberry", htmlContent: "Strawberry", textColor: "#00000", background: "#A2D2FF" },
  { id: 6, name: "Grape", htmlContent: "Grape", textColor: "", background: "" },
]
const wheelSettings = reactive({
  centeredIndicator: true,
  indicatorPosition: "top",
  size: 350,
  displayShadow: true,
  duration: 5,
  resultVariation: 50,
  easing: "bounce",
  counterClockwise: false,
  horizontalContent: false,
  displayBorder: false,
  displayIndicator: true,
  baseDisplay: true,
  baseSize: 100,
  baseDisplayShadow: true,
  baseDisplayIndicator: true,
  baseBackground: "#EEAA33"
})

function launchWheel() {
  wheel.value.launchWheel();
}

</script>

<style>
.wheel-container-indicator:before {
  left: 50%;
}

.wheel-base-indicator:before {
  left: 50%;
}
</style> -->