<script setup lang="ts">
import { VisAxis, VisStackedBar, VisXYContainer } from '@unovis/vue'
import { computed, onMounted } from 'vue';


const props = defineProps<{
  dataProp: number[]
}>();

const maxValue = computed(() => Math.ceil(Math.max(...props.dataProp) * 1.2));

const data = computed(() =>
[  { name: 'Jan', total: props.dataProp[0] },
  { name: 'Feb', total: props.dataProp[1] },
  { name: 'Mar', total: props.dataProp[2] },
  { name: 'Apr', total: props.dataProp[3] },
  { name: 'May', total: props.dataProp[4] },
  { name: 'Jun', total: props.dataProp[5] },
  { name: 'Jul', total: props.dataProp[6] },
  { name: 'Aug', total: props.dataProp[7] },
  { name: 'Sep', total: props.dataProp[8] },
  { name: 'Oct', total: props.dataProp[9] },
  { name: 'Nov', total: props.dataProp[10] },
  { name: 'Dec', total: props.dataProp[11] },]
)

type Data = { name: string; total: number }


</script>

<template>
  <VisXYContainer  height="350px"
  :margin="{ left: 20, right: 20 }"
  :data="data">
    <VisStackedBar
      :x="(d: Data, i: number) => i"
      :y="(d: Data) => d.total "
      color="#41b883"
      :rounded-corners="4"
      :bar-padding="0.15"
    />
    <VisAxis
      type="x"
      :num-ticks="data.length"
      :tick-format="(index: number) => data[index]?.name"
      :grid-line="false"
      :tick-line="false" color="#888888"
    />
    <VisAxis
  type="y"
  :num-ticks="5"
  :tick-format="(val : number) => val.toString()"
  :grid-line="true"
  color="#888"
/>

  </VisXYContainer>
</template>