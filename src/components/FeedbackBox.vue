<template>
  <div class="FeedbackBox">
    <div class="title">
      <el-divider content-position="center">个人反馈</el-divider>
    </div>
    <template v-if="recordList.length">
      <el-card
        v-for="(record) in cardList"
        :key="record.timestamp"
        class="box-card"
        :class="bg[record.status]"
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
  },
  data() {
    return {
      bg: ["", "bg-1", "bg-2", "bg-3"]
    };
  },
  computed: {
    unsolvedList() {
      return this.recordList.filter(item => item.status === 1)
    },
    solvingList() {
      return this.recordList.filter(item => item.status === 2)
    },
    solvedList() {
      return this.recordList.filter(item => item.status === 3)
    },
    cardList() {
      return [...this.unsolvedList, ...this.solvingList, ...this.solvedList]
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
      color: #67c23a;
    }
  }
  .bg-1 {
    background-color: #f6f7d4;
  }
  .bg-2 {
    background-color: #d2f6c5;
  }
  .bg-3 {
    background-color: #99f3bd;
  }
}
</style>