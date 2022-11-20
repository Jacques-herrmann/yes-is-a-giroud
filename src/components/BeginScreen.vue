<script setup>

const emit = defineEmits(['start'])


const onStart = () => {
  emit('start')
}
</script>

<template>
  <div class="begin-screen__overlay">
    <div class="begin-screen">
      <h1>Yes, is a Giroud !</h1>
      <button class="begin-screen__start-btn" @click="onStart()">Start</button>
    </div>
  </div>
</template>

<style scoped lang="scss">

.begin-screen {
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
  &__start-btn{
    height: 50px;
    width: 200px;
    margin: 2rem;
    background-color: red;
    color: white;
    cursor: pointer;
  }
}
</style>
