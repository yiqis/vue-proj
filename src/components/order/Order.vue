<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 顶部搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 渲染table -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="索引"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | dateFormate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="125px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditAddress(scope.row)"
              size="mini"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              @click="showProgressBox(scope.row)"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <page
        :total="total"
        @handleCurrentChange="handleCurrentChange($event)"
        @handleSizeChange="handleSizeChange($event)"
      ></page>
    </el-card>
    <!-- 省市区级联动 -->
    <el-dialog title="修改收货地址" :visible.sync="addressVisible" width="50%">
      <!-- 主体 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input :options="cityData" v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 脚部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--  展示物流进度的对话框-->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 主体 -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>-
  </div>
</template>
<script>
import cityData from '../../citydata.js'
import Page from '../plugin/Page.vue'
export default {
  components: { Page },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //   计算订单总数
      total: 0,
      //   存储获取到的订单数据
      orderList: [],
      //   省市区级联动对话框显示和隐藏
      addressVisible: false,
      //   修改收货地址的表单
      addressForm: {
        address1: [],
        address2: ''
      },
      //   收货地址验证
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请选择省市区县', trigger: 'blur' }]
      },
      //   将导入的citiData保存起来
      cityData: cityData,
      //   物流进度对话框的显示和隐藏
      progressVisible: false,
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //   获取订单数据列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status === 200) {
        this.orderList = res.data.goods
        this.total = res.data.total
      } else {
        this.$message.error('订单数据列表获取失败')
      }
    },
    // handleSizeChange每页显示的页数改变
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    // 当前页改变
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current
      this.getOrderList()
    },
    // 展示物流进度的对话框
    async showProgressBox(row) {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      this.progressVisible = true
      if (res.meta.status === 200) {
        this.progressInfo = res.data
      } else {
        this.$message.error('物流进度信息获取失败')
      }
    },
    // 省市区及联动
    showEditAddress(row) {
      this.addressVisible = true
    }
  }
}
</script>
<style lang="css" scoped>
.el-cascader {
  width: 100%;
}
</style>
