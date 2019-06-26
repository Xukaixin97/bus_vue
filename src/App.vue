<template>
  <div id="app">
    <!-- 自带的过度效果 -->
     <transition name="el-fade-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {};
</script>
<style  scoped >
.animated {
  animation-duration: 0.8s;
}
</style>


