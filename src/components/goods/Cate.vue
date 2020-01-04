<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table :data="cateList" :columns="columns" :selection-type="false" show-row-hover>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" :id="scope.row.id" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 6, 8]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>-->
      <page
        :total="total"
        @handleCurrentChange="handleCurrentChange($event)"
        @handleSizeChange="handleSizeChange($event)"
      ></page>
    </el-card>
    <!-- 点击添加对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close='addCateDialogClosed'>
      <!-- 对话框主体内容 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
            <el-cascader expandTrigger='hover' v-model="selectedKeys" :options="parentCateList" :props="cascadeProps" @change="parentCateChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Page from '../plugin/Page.vue'
export default {
  components: { Page },
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分页数据列表
      cateList: [],
      //  总数据条数
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //   表示将当前定义为模板列
          type: 'template',
          //   表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      // 添加分类
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级,默认要添加的是一级分类
        cat_level: 0
      },
      // 添加分类的表单验证规则
      addCateFormRules: {
        cat_name: [ { required: true, message: '请输入分类名称', trigger: 'blur' } ],
        cat_pid: [ { required: true, message: '请输入分类id', trigger: 'blur' } ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascadeProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数目
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   获取商品数据
    async getCateList() {
      const { data: res } = await this.$http.get('/categories', {
        params: this.queryInfo
      })
      if (res.meta.status === 200) {
        //   把数据列表赋值给this.cateList
        this.cateList = res.data.result
        // 为总条数赋值
        this.total = res.data.total
        this.$message.success('获取商品分类成功')
      } else {
        this.$message.error('获取商品分类失败')
      }
    },
    // handleSizeChange每页显示的页数改变
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    // 当前页改变
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current
      this.getCateList()
    },
    // 点击按钮展示分类按钮对话框
    showAddCateDialog() {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前父类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前父类等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 确定添加按钮
    addCate() {
      this.$refs.addCateFormRef.validate(async config => {
        if (config) {
          const { data: res } = await this.$http.post('categories', this.addCateForm)
          if (res.meta.status === 201) {
            this.getCateList()
            this.addCateDialogVisible = false
            this.$message.success('添加分类成功')
          } else {
            this.$message.error('添加分类失败')
          }
        }
      })
    },
    // 关闭添加分类对话框
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>
<style lang="css" scoped>
.el-cascader {
  width: 100%;
}
</style>
