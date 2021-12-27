<template>
  <div>这是主页</div>
  <video-background :src="require(`@/assets/video/AmarrSpace.mp4`)" id="video_background"> </video-background>
</template>

<script>
export default {
  name: 'Main',
};
</script>

<style scoped>
#video_background {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  height: auto;
  width: auto;
  overflow: hidden;
  z-index: -1000;
  opacity: 0.8;
}
</style>
