<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容"
                    clearable
                    v-model="queryInfo.query"
                    @clear="getUserList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域-->
      <el-table :data="userList"
                height="250"
                border
                stripe
                style="width: 100%">
        <el-table-column type="index"
                         label="#"
                         width="60">
        </el-table-column>
        <el-table-column prop="username"
                         label="姓名"
                         width="180">
        </el-table-column>
        <el-table-column prop="email"
                         label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile"
                         label="电话">
        </el-table-column>
        <el-table-column prop="role_name"
                         label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditDialog(scope.row)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="deleteUser(scope.row)"></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark"
                        content="分配角色"
                        placement="top"
                        :enterable="false">

              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               @close="addDialogClosed('addForm')"
               width="50%">
      <!-- 内容主体 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addForm"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addForm.password"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser('addForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户"
               :visible.sync="editDialogVisible"
               @close="editDialogClosed('editForm')"
               width="50%">
      <!-- 内容主体 -->
      <el-form :model="editForm"
               :rules="addFormRules"
               ref="editForm"
               label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"
                    disabled>></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUser('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    //验证邮箱规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法邮箱'))
      }
    }
    //验证手机号规则
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^1[012345789]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法手机号'))
      }
    }
    return {
      //获取用户列表的对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      //控制用户添加对话框显示隐藏
      addDialogVisible: false,
      //添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: 'blur' },
          { min: 3, max: 10, message: '密码的长度在3~10个字符之间', trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: 'blur' },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: 'blur' },
          { validator: checkMobile, trigger: "blur" }
        ],

      },
      //控制修改用户对话框
      editDialogVisible: false,
      editForm: {}
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      this.$http.getUsers(this.queryInfo).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.userList = res.data.users;
        this.total = res.data.total
      })
    },
    //监听pagesize改变
    handleSizeChange (newsize) {
      // console.log(newsize)
      this.queryInfo.pagesize = newsize;
      this.getUserList()

    },
    //监听页码值改变的事件
    handleCurrentChange (newpage) {
      // console.log(newpage)
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    //监听用户 switch开关状态变化
    userStateChange (userinfo) {
      let param = {
        uId: userinfo.id,
        type: userinfo.mg_state
      }
      this.$http.changeUserState(param).then(res => {
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
      })
    },
    //监听添加用户对话框关闭
    addDialogClosed (fromname) {
      this.$refs[fromname].resetFields();
    },
    //添加用户
    addUser (formname) {
      this.$refs[formname].validate(valid => {
        if (!valid) return
        this.$http.addUser(this.addForm).then(res => {
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg)
          //隐藏添加用户对话框
          this.addDialogVisible = false
          //重新获取用户列表
          this.getUserList()

        })


      })
    },
    //展示修改对话框
    showEditDialog (userinfo) {
      this.editDialogVisible = true;
      this.searchUserById(userinfo.id)
    },
    //根据ID查询用户信息
    searchUserById (id) {
      this.$http.searchUserById({ id: id }).then(res => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.editForm = res.data
      })
    },
    //监听添加用户对话框关闭
    editDialogClosed (fromname) {
      this.$refs[fromname].resetFields();
    },
    //修改用户
    editUser (formname) {
      this.$refs[formname].validate(valid => {
        if (!valid) return
        this.$http.editUser(this.editForm).then(res => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg)
          //隐藏添加用户对话框
          this.addDialogVisible = false
          //重新获取用户列表
          this.getUserList()
        })
      })
    },
    //删除用户
    deleteUser (userinfo) {
      let params = {
        id: userinfo.id
      }
      //询问用户是否删除该数据
      this.MessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteUser(params).then(res => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg)
          this.getUserList()
        })
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });

    }
  }
}
</script>

<style lang="less" scpoed>
</style>