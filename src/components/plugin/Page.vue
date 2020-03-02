<template>
  <div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 6, 8]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: 'Pagination',
  props: ['total'],
  data() {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      }
    }
  },
  methods: {
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.$emit('handleSizeChange', this.queryInfo.pagesize)
    },
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current
      this.$emit('handleCurrentChange', this.queryInfo.pagenum)
    }
  }
}
</script>
