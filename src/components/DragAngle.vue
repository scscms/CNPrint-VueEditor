<template>
    <div @mousedown.stop="mouseDown" :style="getStyle"></div>
</template>

<script>
    //功能：拖曳角标  负责：shine    说明：
    export default {
        name: 'DragAngle-component',
        props:{
            sign:{
                type:String,
                required:true,
                validator:function(s){
                    return ['n','ne','nw','e','se','s','sw','w'].includes(s);
                }
            }
        },
        data() {
            return {
                dragging: false,//是否正在拖动标识
                x: 0,
                y: 0,
            }
        },
        computed: {
            getStyle () {
                let _border = '3px solid rgba(0,0,0,0.5)';
                let _px = '-2px';
                let _center = 'calc(50% - 3px)';
                let sign = this.sign;
                let obj = {position:'absolute',height:'6px',width:'6px',cursor:sign+'-resize',zIndex:2};
                if(sign.includes('w')){
                    obj.borderLeft = _border;
                    obj.left = _px;
                    if (sign === 'w') obj.top = _center;
                }
                if(sign.includes('n')){
                    obj.borderTop = _border;
                    obj.top = _px;
                    if (sign === 'n') obj.left = _center;
                }
                if(sign.includes('e')){
                    obj.borderRight = _border;
                    obj.right = _px;
                    if (sign === 'e') obj.top = _center;
                }
                if(sign.includes('s')){
                    obj.borderBottom = _border;
                    obj.bottom = _px;
                    if (sign === 's') obj.left = _center;
                }
                return obj
            },
        },
        methods: {
            mouseUp(){
                if(this.dragging){
                    this.dragging = false;
                    document.removeEventListener('mousemove', this.drag);
                    document.removeEventListener('mouseup', this.mouseUp);
                    this.$emit('reSize','mouseUp');
                }
            },
            mouseDown (event) {
                let e = event||window.event;
                this.x = e.pageX;
                this.y = e.pageY;
                this.dragging = true;
                document.addEventListener('mousemove', this.drag);
                document.addEventListener('mouseup', this.mouseUp);
            },
            drag (event) {
                if(this.dragging){
                    let e = event||window.event;
                    this.$emit('reSize',{x:e.pageX - this.x,y:e.pageY - this.y,sign:this.sign});
                }
            }
        }
    }
</script>
