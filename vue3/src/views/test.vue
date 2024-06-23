<template>

  <h1>{{ user }}</h1>
  <h1>{{ number }}</h1>
  <h1>{{ arryint }}</h1>
  <h1>{{ value0 }}</h1>
  <button class="btn btn-success">
    <router-link to="/">按钮
    </router-link>
  </button>
  <header class="navbar navbar-expand-lg bg-primary navbar-dark">
    <nav class="container">
      <a href="#" class="navbar-brand">Bootstrap</a>
      <ul class="navbar-nav me-auto">
        <li class="nav-item"><a class="nav-link" href="#">vite</a></li>
        <li class="nav-item"><a class="nav-link" href="#">a</a></li>
        <li class="nav-item"><a class="nav-link" href="#">f</a></li>
        <li class="nav-item"><a class="nav-link" href="#">c</a></li>
      </ul>
    </nav>

  </header>

</template>
<script setup>
import {ref, watch,toRefs } from 'vue';

const user = 'ad'
const number = ref(1)
const arryint = ref([1, 2, 3])

const value0 = ref(100)
setInterval(() => {
  value0.value = Math.random()
}, 2000)
watch(value0, (newValue, oldValue) => {
  console.log('00')
  console.log(newValue, oldValue)
})
// setInterval(() => {
//     number.value = Math.random()
// }, 1000);
// setInterval(() => {
//     arryint.value.push(Math.random())
// }, 1000);
</script>