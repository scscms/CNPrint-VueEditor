<template>
    <div @mousedown.stop="mouseDown" :style="getStyle"></div>
</template>

<script>
// 功能：拖曳角标  负责：shine    说明：
export default {
  name: 'DragAngle-component',
  props: {
    sign: {
      type: String,
      required: true,
      validator(s) {
        return ['n', 'ne', 'nw', 'e', 'se', 's', 'sw', 'w'].includes(s);
      },
    },
  },
  data() {
    return {
      dragging: false, // 是否正在拖动标识
      x: 0,
      y: 0,
    };
  },
  computed: {
    getStyle() {
      const border = '3px solid rgba(0,0,0,0.5)';
      const px = '-2px';
      const center = 'calc(50% - 3px)';
      const {sign} = this;
      const obj = {
        position: 'absolute', height: '6px', width: '6px', cursor: `${sign}-resize`, zIndex: 2,
      };
      if (sign.includes('w')) {
        obj.borderLeft = border;
        obj.left = px;
        if (sign === 'w') obj.top = center;
      }
      if (sign.includes('n')) {
        obj.borderTop = border;
        obj.top = px;
        if (sign === 'n') obj.left = center;
      }
      if (sign.includes('e')) {
        obj.borderRight = border;
        obj.right = px;
        if (sign === 'e') obj.top = center;
      }
      if (sign.includes('s')) {
        obj.borderBottom = border;
        obj.bottom = px;
        if (sign === 's') obj.left = center;
      }
      return obj;
    },
  },
  methods: {
    mouseUp() {
      if (this.dragging) {
        this.dragging = false;
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mouseup', this.mouseUp);
        this.$emit('reSize', 'mouseUp');
      }
    },
    mouseDown(event) {
      const e = event || window.event;
      this.x = e.pageX;
      this.y = e.pageY;
      this.dragging = true;
      document.addEventListener('mousemove', this.drag);
      document.addEventListener('mouseup', this.mouseUp);
    },
    drag(event) {
      if (this.dragging) {
        const e = event || window.event;
        this.$emit('reSize', { x: e.pageX - this.x, y: e.pageY - this.y, sign: this.sign });
      }
    },
  },
};
</script>
