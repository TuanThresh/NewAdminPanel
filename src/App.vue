<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import { useAppStore } from '@/stores/app';
import { ScrollArea, ScrollBar } from './components/ui/scroll-area';
import { Notivue, Notification } from 'notivue'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
onMounted(() => {
  useAppStore().initTheme();
});

const store = useAppStore();


</script>

<template>
  <Notivue v-slot="item" position="top-right">
    <Notification :item="item" />
  </Notivue>
  <Loading v-model:active="store.isloading"
                 :can-cancel="false"
                 :is-full-page="true"/>
  <ScrollArea class="h-screen">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <ScrollBar class="z-50" />
  </ScrollArea>
</template>
