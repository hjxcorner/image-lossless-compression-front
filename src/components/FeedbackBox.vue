<template>
  <div class="FeedbackBox">
    <div class="title">
      <el-divider content-position="center">个人反馈</el-divider>
    </div>
    <template v-if="recordList.length">
      <el-card
        v-for="(record) in recordList"
        :key="record.timestamp"
        class="box-card"
      >
        <div class="content">
          {{record.content}}
        </div>
        <span class="date">{{record.date}}</span>
      </el-card>
    </template>
    <template v-else>
      暂无数据
    </template>
  </div>
</template>

<script>
export default {
  props: {
    recordList: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped>
.FeedbackBox {
  .title {
    .el-divider__text {
      background-color: transparent;
      color: rgb(88, 88, 88);
      font-size: 16px;
      font-weight: bold;
    }
  }
  .box-card {
    text-align: left;
    margin-bottom: 10px;
    .content {
      font-size: 14px;
      color: #303133;
    }
    .date {
      font-size: 12px;
      color: #67C23A;
    }
  }
}
</style>