<script setup>

const emit = defineEmits(['restart'])


const onRestart = () => {
  emit('restart')
}
</script>

<template>
  <div class="end-screen__overlay">
    <div class="end-screen">
      <h1>Nope</h1>
      <button class="end-screen__restart-btn" @click="onRestart()">Restart</button>
    </div>
  </div>
</template>

<style scoped lang="scss">

.end-screen {
  width: 60vw;
  height: 50vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;

  & h1 {
    flex-grow: 1;
  }

  &__overlay {
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .2);
  }
  &__restart-btn{
    height: 50px;
    width: 200px;
    margin: 2rem;
    background-color: red;
    color: white;
    cursor: pointer;
  }
}
</style>
