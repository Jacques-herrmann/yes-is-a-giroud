<script setup>
import Engine from "@/webgl/engine";
import Loader from "@/webgl/utils/loader";
import toLoad from "@/webgl/toLoad";
import {onMounted, ref} from "vue";
import BeginScreen from '@/components/BeginScreen.vue'
import EndGame from '@/components/EndGame.vue'
import EndWave from '@/components/EndWave.vue'
let engine, loader

let started = ref(false)
let gameEnded = ref(false)
let waveEnded = ref(false)

onMounted(() => {
  loader = new Loader(toLoad)
  loader.on('ready', () => {
    engine = new Engine(document.getElementById('webgl'))

    engine.addEventListener('endGame', () => gameEnded.value = true)
    engine.addEventListener('endWave', () => waveEnded.value = true)
  })
  loader.load(toLoad)
})

const start = () => {
  started.value = true
  engine.start()
}

const restart = () => {
  gameEnded.value = false
  engine.reset()
}
const next = () => {
  waveEnded.value = false
  engine.next()
  start()
}
</script>

<template>
  <div class="game-manager">
    <canvas id="webgl"></canvas>
    <BeginScreen @start="start()" v-if="!started"></BeginScreen>
    <EndGame @restart="restart()" v-if="gameEnded"></EndGame>
    <EndWave @next="next()" v-if="waveEnded"></EndWave>
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
