<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info"
                 @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-btn"
             @click="toggleCollapse">|||</div>
        <el-menu background-color="#373d41"
                 text-color="#fff"
                 active-text-color="#409eff"
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :router="true"
                 :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''"
                      v-for="item in menuList"
                      :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="`/${subItem.path}`"
                          v-for="subItem in item.children"
                          :key="subItem.id"
                          @click="saveNavState(`/${subItem.path}`)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconsObj: {
        '125': 'el-icon-s-custom',
        '103': 'el-icon-s-opportunity',
        '102': 'el-icon-s-order',
        '101': 'el-icon-goods',
        '145': 'el-icon-s-marketing',
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenus();
    this.activePath = window.sessionStorage.getItem("activePath")
  },
  methods: {
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    getMenus () {
      this.$http.getMenus().then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menuList = res.data
      })
    },
    //点击按钮菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (path) {

      window.sessionStorage.setItem("activePath", path)
      this.activePath = path
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #ffffff;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
    }
  }
}
.el-aside {
  background-color: #373d41;
  .toggle-btn {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #ffffff;
    text-align: center;
    letter-spacing: 0.2em;
  }
  .el-menu {
    border-right: none;
    .el-menu-item {
      padding: 0;
    }
  }
}
.el-main {
  background-color: #f6f6f6;
}
</style>