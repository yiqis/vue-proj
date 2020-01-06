<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="索引"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <!-- 操作按钮 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoods(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page
        :total="total"
        @handleCurrentChange="handleCurrentChange($event)"
        @handleSizeChange="handleSizeChange($event)"
      ></page>
    </el-card>
  </div>
</template>
<script>
import Page from '../plugin/Page.vue'
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品列表
      goodsList: [],
      // 商品总数
      total: 0
    }
  },
  components: { Page },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据获取所有的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get(`goods`, {
        params: this.queryInfo
      })
      if (res.meta.status === 200) {
        this.goodsList = res.data.goods
        this.total = res.data.total
      } else {
        this.$message.error('商品列表获取失败')
      }
    },
    // 当前页改变执行的函数
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current
      this.getGoodsList()
    },
    // 每一页显示的条数改变
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getGoodsList()
    },
    // 根据id删除商品
    async deleteGoods(row) {
      const deleteConfirm = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (deleteConfirm === 'confirm') {
        const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
        if (res.meta.status === 200) {
          this.getGoodsList()
        } else {
          this.$$message.error('删除失败')
        }
      } else {
        this.$message.info('取消删除')
      }
    },
    // 跳转到添加商品页面
    addGoodsPage() {
      this.$router.push('goods/add')
    },
    // 点击按钮编辑商品
    editGoods(row) {
      console.log(row)
      this.$router.push({ path: '/goods/add', query: { id: row.goods_id } })
    }
  }
}
</script>
<style lang="css" scoped>
</style>
