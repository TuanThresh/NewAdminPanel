<script setup lang="ts">
import { Toggle } from '@/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import router from '@/router';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { APP_MENU } from '@/config/app';
import { ArrowLeftToLine } from 'lucide-vue-next';
import { useAppStore } from '@/stores/app';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import Icon from '@/components/ui/Icon.vue';
import type { Employee } from '@/interfaces';
const route = useRoute()
const userJson = localStorage.getItem("currentEmployeeContent");
const user = userJson ? (JSON.parse(userJson) as Employee) : null;


const menus = computed(() => Object.entries(APP_MENU).map(([key, value]) => ({

    key,
    name: value.name,
    icon : value.icon,
    routes: value.children.map((r) => ({
      ...r,
      accessible: user?.hasRoles.some(role => (router.resolve(r.path).meta?.roles as string[]).includes(role)),
      active: `/dashboard/${r.path}` === route.path,
    })),
  })
));

// if(!employeeStore.employee?.hasRoles.includes("Quản trị viên")){
//   menus.value = menus.value.filter(x => x.key !== "system");
// }

const handleNavigate = (path: string) => {
  router.push(path);
  if (window.innerWidth < 1025) {
    store.toggleSidebar();
  }
};

const store = useAppStore();

const toggleSidebar = () => {
  store.toggleSidebar();
};
</script>

<template>
  <div class="sidebar transition-all duration-400 h-screen overflow-hidden bg-background border-r-[1px] fixed" :style="{ width:`${store.wrapperWidth}px`}">
    <div class="relative h-full flex flex-col justify-between">
      <div>
        <div class="h-[64px]">
          <div class="px-4 h-[64px] flex fixed z-10 items-center justify-between border-b-[1px]" :style="{ width: `${store.sidebarExpanded ? 280 : 64}px` }">
            <transition name="fade">
              <h2 v-show="store.sidebarExpanded" class="text-2xl font-semibold flex items-center">
                <span class="text-foreground "><span class="mr-2 flex items-center"><Icon name="Boxes" /></span></span>
                ABSolTech
              </h2>
            </transition>
            <Button
              variant="outline"
              class="p-[6px] w-8 h-8 transition-all duration-200"
              :class="store.sidebarExpanded ? 'bg-transparent' : 'dark:bg-white'"
              @click="toggleSidebar"
            >
              <ArrowLeftToLine class="transition-all duration-500" :class="!store.sidebarExpanded && 'rotate-180 text-black'" />
            </Button>
          </div>
        </div>
        <ScrollArea style="height: calc(100vh - 64px)">
          <div v-for="menu in menus" :key="menu.key" class="border-b-[1px] transition-all" :class="store.sidebarExpanded ? 'p-4' : 'p-2'" v-show="menu.routes.filter(x => x.accessible).length > 0">
            <Collapsible :open="store.sidebarExpanded">
              <CollapsibleTrigger class="w-full">
                <Toggle
                  class="w-full overflow-x-hidden justify-start duration-150"
                  :pressed="false"
                >
                <span class="flex items-center" :class="store.sidebarExpanded ? 'mr-4' : 'm-0'" >
                  <Icon :name="menu.icon" />
                </span>
                <p
                v-show="store.sidebarExpanded"
                class="uppercase text-xs font-light text-gray-400 mb-2 tracking-widest transition-all duration-300 delay-100"
                :class="store.sidebarExpanded ? 'visible opacity-100' : 'invisible opacity-0'"
                >
                {{ menu.name }}
                </p>
                
                </Toggle>
              </CollapsibleTrigger>
            <CollapsibleContent class="mt-2" >
              <ul>
                <li v-for="child in menu.routes" :key="`${menu.key}-${child.path}`" class="flex items-center mb-1 rounded-md" v-show="child.accessible">
                <TooltipProvider :disable-hoverable-content="true">
                  <Tooltip :delay-duration="0">
                    <TooltipTrigger class="w-full">
                        <Toggle
                        class="w-full overflow-x-hidden justify-start duration-150"
                        :pressed="child.active"
                        @click="handleNavigate(child.path)"
                      >
                      <span class="flex items-center" :class="store.sidebarExpanded ? 'mr-4' : 'm-0'">
                        <Icon :name="child.icon" />
                      </span>
                        <transition name="fade" :duration="300">
                          <span v-show="store.sidebarExpand">{{ child.title }}</span>
                        </transition>
                      </Toggle>
          
                    </TooltipTrigger>
                    
                    <template v-if="!store.sidebarExpanded">
                      <TooltipContent side="right">
                        <p class="text-sm">{{ child.title }}</p>
                      </TooltipContent>
                    </template>
                  </Tooltip>
                </TooltipProvider>
              </li>
            </ul>
            </CollapsibleContent>
            </Collapsible>
          </div>

        </ScrollArea>
      </div>

      <div class="border-t-[1px] transition-all duration-400 py-4" :class="store.sidebarExpanded ? 'opacity-100' : 'opacity-0'">
        <p class="text-xs text-foreground/50 text-center">&copy; 2024 Dashcn</p>
      </div>
    </div>
  </div>
</template>
