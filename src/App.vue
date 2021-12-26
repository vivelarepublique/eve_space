<template>
  <div>
    <router-link active-class="active" to="/main">Main</router-link>
    <router-link to="/almanac">Almanac</router-link>
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {
    
  },
};
</script>
