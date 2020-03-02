<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="handleAddRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-row>
        <el-col>
          <el-table :data="roleList" stripe row-key='index' :tree-props="{children: 'childrens', hasChildren: 'hasChildren'}">
            <el-table-column type="expand" label="展开">
              <template slot-scope="scope">
                <el-row
                  v-for="(item1, index1) in scope.row.children"
                  :key="item1.id"
                  :class="['bdbottom',index1 === 0 ? 'bdtop':' ','vcenter' ]"
                >
                  <!-- 渲染一级权限 -->
                  <el-col :span="5">
                    <el-tag closable @close="removeTagById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染二级权限和三级权限 -->
                  <el-col :span="19">
                    <!-- 通过for循环渲染二级权限 -->
                    <el-row
                      v-for="(item2,index2) in item1.children"
                      :key="item2.id"
                      :class="[index2===0?'':'bdtop','vcenter']"
                    >
                      <el-col :span="6">
                        <el-tag
                          type="success"
                          closable
                          @close="removeTagById(scope.row,item2.id)"
                        >{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-tag
                          type="warning"
                          v-for="(item3) in item2.children"
                          :key="item3.id"
                          closable
                          @close="removeTagById(scope.row,item3.id)"
                        >{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <!-- <pre>
                          {{scope.row}}
                </pre>-->
              </template>
            </el-table-column>
            <!-- 索引 -->
            <el-table-column type="index" label="索引"></el-table-column>
            <el-table-column prop="roleDesc" label="角色名称"></el-table-column>
            <el-table-column prop="roleName" label="角色描述"></el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="modifyRole(scope.row.id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteRole(scope.row.id)"
                  size="mini"
                >删除</el-button>
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="showSetRightDialog(scope.row)"
                >分配权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoledialogVisible"
      width="30%"
      @close="handleAddRoleClosed"
    >
      <el-form
        ref="addRoleForm"
        :rules="addRules"
        :model="addRoleForm"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="id" prop="id" v-if="flag">
          <el-input v-model="addRoleForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加角色脚步 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddRoleForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 对话框内容 -->
      <!-- 树形控件 -->
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 角色列表
      roleList: [],
      // 控制分配权限对话框显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点的id值
      defKeys: [],
      // 当前即将分配权限的id
      roleId: '',
      // 添加角色对话框显示
      addRoledialogVisible: false,
      // 角色添加时候的表单输入框
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的验证
      addRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      flag: false
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status === 200) {
        this.roleList = res.data
        this.$message.success('角色列表获取成功')
      } else {
        this.$message.error('角色列表获取失败')
      }
    },
    // 删除角色
    async deleteRole(id) {
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status === 200) {
        this.getRoleList()
        this.$message.success('用户角色删除成功')
      } else {
        this.$message.error('用户角色删除失败')
      }
    },
    // 根据id删除指定的权限
    async removeTagById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status === 200) {
          role.children = res.data
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除权限失败')
        }
      } else {
        this.$message.info('取消了删除操作')
      }
    },
    // 分配权限按钮
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status === 200) {
        // 把获取到的权限数据保存到data数据中
        this.rightList = res.data
        this.$message.success('获取权限数据成功')
      } else {
        this.$message.error('获取权限数据失败')
      }
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式获取角色下所有三级权限的id,并保存到defKeys数组之中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性,则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话库关闭的事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status === 200) {
        this.$message.success('用户权限更新成功')
        this.getRoleList()
        this.setRightDialogVisible = false
      } else {
        this.$message.error('用户权限更新失败')
      }
    },
    // 点击添加按钮显示添加角色对话框
    handleAddRole() {
      this.addRoledialogVisible = true
    },
    // 添加角色对话框退出
    handleAddRoleClosed() {
      // 对表单中的内容进行重置
      this.$refs.addRoleForm.resetFields()
      this.addRoleForm.roleId = ''
      this.addRoleForm.roleName = ''
      this.addRoleForm.roleDesc = ''
      this.flag = false
    },
    // 提交添加角色表单
    async handleAddRoleForm() {
      if (this.flag) {
        const { data: res } = await this.$http.put(`roles/${this.addRoleForm.roleId}`, this.addRoleForm)
        if (res.meta.status === 200) {
          this.getRoleList()
          this.addRoledialogVisible = false
          this.$message.success('用户角色编辑成功')
        } else {
          this.$message.error('用户角色编辑失败')
        }
      } else {
        this.$refs.addRoleForm.validate(async config => {
          if (config) {
            // 向服务器发送添加角色请求
            const { data: res } = await this.$http.post('roles', this.addRoleForm)
            if (res.meta.status === 201) {
              this.$message.success('用户角色添加成功')
              this.getRoleList()
              this.addRoledialogVisible = false
            } else {
              this.$message.error('用户角色添加失败')
            }
          }
        })
      }
    },
    // 修改角色
    async modifyRole(id) {
      this.flag = true
      this.addRoledialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      this.addRoleForm.roleId = res.data.roleId
      this.addRoleForm.roleName = res.data.roleName
      this.addRoleForm.roleDesc = res.data.roleDesc
    }
  }
}
</script>
<style lang="css" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
