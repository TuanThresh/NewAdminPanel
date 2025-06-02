import type { PaginationInterface } from '@/interfaces';
import { defineStore } from 'pinia';
import router from '@/router';

interface IAppStore {
  themeMode: 'light' | 'dark'
  sidebarExpand: boolean
  wrapperWidth: number | string
  wrapperLeftOffset: number | string
  navWidth: number | string,
  loading: boolean,
  pagination: PaginationInterface | null
}

const LIGHT = 'light';
const DARK = 'dark';
const THEME_KEY = 'themeMode';
const EXPAND = 280;
const SHRINKED = 72;
let json = localStorage.getItem("pagination");


export const useAppStore = defineStore('app', {
  state: () => <IAppStore>({
    themeMode: LIGHT,
    sidebarExpand: true,
    wrapperWidth: 0,
    wrapperLeftOffset: 0,
    navWidth: '100%',
    loading: false,
    pagination: json ? JSON.parse(json) as PaginationInterface : null
  }),
  getters: {
    theme: (state) => state.themeMode,
    isDark: (state) => state.themeMode === DARK,
    sidebarExpanded: (state) => state.sidebarExpand,
    isloading: (state) => state.loading,
    paginationGetter: (state) => state.pagination
  },
  actions: {
    toggleSidebar() {
      this.sidebarExpand = !this.sidebarExpand;
      if (window.innerWidth > 1024) {
        this.initWrapper();
      }
    },
    initWrapper() {
      if (window.innerWidth > 1024) {
        if (this.sidebarExpand) {
          this.wrapperWidth = EXPAND;
          this.wrapperLeftOffset = EXPAND;
        } else {
          this.wrapperWidth = SHRINKED;
          this.wrapperLeftOffset = SHRINKED;
        }
        this.navWidth = `calc(100% - ${this.wrapperWidth}px)`
      } else {
        this.navWidth = '100%';
        this.sidebarExpand = false;
        this.wrapperWidth = '100%';
        this.wrapperLeftOffset = '100%';
      }
    },
    initTheme() {
      const cache = localStorage.getItem(THEME_KEY);
      if (cache) {
        this.themeMode = cache as 'light' | 'dark';
      }
      window.addEventListener('resize', this.initWrapper);
      this.applyTheme();
      this.initWrapper();
    },
    toggleTheme() {
      this.themeMode = this.themeMode === LIGHT ? DARK : LIGHT;
      this.applyTheme();
      localStorage.setItem(THEME_KEY, this.themeMode);
    },
    appUnmount() {
      window.removeEventListener('resize', this.initWrapper);
    },
    applyTheme() {
      document.documentElement.classList.remove(LIGHT, DARK);
      document.body.classList.remove(LIGHT, DARK);
      document.documentElement.classList.add(this.themeMode);
      document.body.classList.add(this.themeMode);
    },
    setLoading(value : boolean) {
      this.loading = value;
    },
    setPagination(){

      json = localStorage.getItem("pagination");

      this.pagination = json ? JSON.parse(json) as PaginationInterface : null

      router.push({query: {currentPage : this.paginationGetter?.currentPage ?? 1}})
    }
  },
});
