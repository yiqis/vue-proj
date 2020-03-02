<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="索引"></el-table-column>
        <el-table-column prop="authName" label="权限列表"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created() {
    // 获取用户权限列表
    this.getRightList()
  },
  methods: {
    async getRightList() {
      // 获取用户权限列表
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status === 200) {
        this.$message.success('用户权限列表获取成功')
      } else {
        this.$message.error('用户权限列表获取失败')
      }
      this.rightsList = res.data
    }
  }
}
</script>
<style lang="css" scoped>
</style>
