<template>
  <div>
    <el-container>
      <el-aside width="270px">
        <el-menu
          router
          :default-active="$router.path"
          class="el-menu-vertical-demo"
          background-color="rgb(38,48,69)"
          text-color="#fff"
        >
          <el-menu-item index="manage" style="text-align:center;font-size:20px">后台管理系统</el-menu-item>
          <el-submenu  index="2">
            <template slot="title">
              <i class="el-icon-document"></i>数据管理
            </template>
            <el-menu-item index="/user">用户列表</el-menu-item>
            <el-menu-item index="/busLine">公交线路列表</el-menu-item>
          </el-submenu>
          <el-submenu   index="3">
            <template slot="title">
              <i class="el-icon-plus"></i>添加数据
            </template>
            <el-menu-item index="/search">添加线路</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container direction="vertical">
        <!-- header头 -->
        <el-header height="70px">
          <template class="header_container">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- <el-dropdown>
              <span class="el-dropdown-link">下拉菜单</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="home">首页</el-dropdown-item>
                <el-dropdown-item command="signout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </template>
        </el-header>
        <el-main>
          <el-scrollbar>
            <router-view></router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss"  scoped>
.el-header {
  background-color: rgb(239, 242, 247);
  color: rgb(0, 0, 0);
  line-height: 60px;
  padding: 0%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 80px;
  
}

.el-aside {
  background-color: rgb(38, 48, 69);
  color: rgb(0, 0, 0);
  line-height: 200px;
  height: 100vh;
}

.el-main {
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  height: 100vh;
  overflow: hidden;
}
.el-menu {
  width: 270px;
  
}
.el-menu-item.is-active {
  background-color: rgb(23, 33, 46) !important;
}
.el-menu-item:hover {
  background-color: rgb(23, 33, 46) !important;
  color: #409EFF !important;
}

.el-icon-plus {
  text-align: center;
}
.el-dropdown {
  display: inline-block;
  position: absolute;
  right: 40px;
  color: #000000;
  font-size: 20px;
}
</style>


<style >
  .el-submenu__title:focus, .el-submenu__title:hover{
    outline: 0 !important;
    color: #409EFF !important;
    background: none !important;
}
.el-menu-vertical-demo:hover{
  background-color: rgb(23, 33, 46) !important;
}
</style>