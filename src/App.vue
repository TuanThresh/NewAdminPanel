<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import { useAppStore } from '@/stores/app';
import { ScrollArea, ScrollBar } from './components/ui/scroll-area';
import { Notivue, Notification } from 'notivue'
onMounted(() => {
  useAppStore().initTheme();
});
</script>

<template>
  <Notivue v-slot="item" position="top-right">
    <Notification :item="item" />
  </Notivue>
  <ScrollArea class="h-screen">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <ScrollBar class="z-50" />
  </ScrollArea>
</template>
