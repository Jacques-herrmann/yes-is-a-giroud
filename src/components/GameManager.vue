<script setup>
import Engine from "@/webgl/engine";
import Loader from "@/webgl/utils/loader";
import toLoad from "@/webgl/toLoad";
import {onMounted, ref} from "vue";
import BeginScreen from '@/components/BeginScreen.vue'
let engine, loader

let started = ref(false)

onMounted(() => {
  loader = new Loader(toLoad)
  loader.on('ready', () => {
    engine = new Engine(document.getElementById('webgl'))
  })
  loader.load(toLoad)
})

const start = () => {
  started.value = true
  engine && engine.start()
}
</script>

<template>
  <div class="game-manager">
    <canvas id="webgl"></canvas>
    <BeginScreen @start="start()" v-if="!started"></BeginScreen>
  </div>
</template>

<style scoped>

#webgl {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
</style>
