import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FireRegisterView from '@/views/FirebaseRegisterView.vue'
import AddBookView from '@/views/AddBookView.vue'
import WhetherView from '@/views/WhetherView.vue'
import CountBookAPI from '@/views/CountBookAPI.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FireRegisterView
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path: '/addbook',
    name: 'Addbook',
    component: AddBookView
  },
  {
    path: '/WeatherCheck',
    name: 'WeatherCheck',
    component: WhetherView

  },
  {
    path: '/CountBookAPI',
    name: '/CountBookAPI',
    component: CountBookAPI
  }



]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router