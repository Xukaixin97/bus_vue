<template>
  <div id="app">
    <!-- <transition
      name="custom-classes-transition"
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutLeft"
      style="animation-duration: .8s;"
    > -->
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


