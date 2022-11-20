<script setup>

const emit = defineEmits(['next'])


const onNext = () => {
  emit('next')
}
</script>

<template>
  <div class="wave-screen__overlay">
    <div class="wave-screen">
      <h1>You win this one</h1>
      <button class="wave-screen__next-btn" @click="onNext()">Next Wave</button>
    </div>
  </div>
</template>

<style scoped lang="scss">

.wave-screen {
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
  &__next-btn{
    height: 50px;
    width: 200px;
    margin: 2rem;
    background-color: red;
    color: white;
    cursor: pointer;
  }
}
</style>
