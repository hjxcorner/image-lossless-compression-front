<template>
  <div
    class="UploadImage"
    ref='select_frame'
    ondragstart="return false"
  >
    <div class="uploadText">
      <i class="iconfont icon-load"></i>
      <span>将jpg格式或png格式的图片拖动到这里</span>
      <span>最多可添加20张图片，且图片不得大于5MB</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [],
      imgNumberLimit: 9,
      maxSize: 10240000 / 2
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.select_frame.ondragleave = e => {
        e.preventDefault(); // 阻止离开时的浏览器默认行为
      };
      this.$refs.select_frame.ondrop = e => {
        e.preventDefault();
        const files = [...e.dataTransfer.files];
        let isImage;
        const images = files.filter(item => {
          isImage = item.type.indexOf("image") > -1;
          if (!isImage) {
            this.$message({
              showClose: true,
              message: `文件${item.name}不是图片`,
              type: "error"
            });
          }
          return isImage;
        });
        this.render(images);
      };
      this.$refs.select_frame.ondragenter = e => {
        e.preventDefault();
      };
      this.$refs.select_frame.ondragover = e => {
        e.preventDefault();
      };
    });
  },
  methods: {
    render(files) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result;
          this.images.push(reader.result);
          img.style.height = "100px";
          this.$refs.select_frame.appendChild(img);
          console.log(file);
          this.$http
            .post("/images/saveImage", {
              name: file.name,
              content: reader.result
            })
            .then(data => console.log(data))
            .catch(err => console.log(err));
        };
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.UploadImage {
  width: 500px;
  height: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  border: 1px #333 dashed;
  border-radius: 5%;
  .uploadText {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    i {
      font-size: 100px;
    }
    span {
      font-size: 18px;
      &:last-child {
        font-size: 14px;
        color: rgb(173, 173, 173);
      }
    }
  }
}
</style>
