<template>
    <div class="drag_div" draggable="false" :style="divStyle" @click.stop="handleClick">
        <div class="drag_div_in" draggable="false" :style="inStyle" @mousedown.stop="mouseDown">
            <template v-if="config.type==='text'">{{getText}}</template>
            <canvas ref="can" v-if="config.type==='qrcode'"></canvas>
            <p v-if="config.type==='barcode'&&!config.config.hideText" :style="pStyle">{{getText}}</p>
        </div>
        <drag-angle v-for="item in array" v-if="isShow(item)" :key="item" @reSize="handleResize" :sign="item"></drag-angle>
    </div>
</template>

<script>
    //功能：DIV拖曳  负责：shine    说明：
    import DragAngle from './DragAngle.vue';
    import QR from 'utils/qr';
    export default {
        name: 'Drag-component',
        props: {
            config: {
                type: Object,
                required: true,
                validator(obj){
                    obj.editable = obj.editable !== false;
                    return true;
                }
            }
        },
        data() {
            return {
                rate:3.78,//比率
                min:10,//最小值
                array:['n','s','w','e','ne','nw','se','sw'],
                dragging: false,//是否在拖动中
                divStyle:{},//div样式
                inStyle:{},//文本样式
                pStyle:{},//条形码文本样式
                startPageX: 0,
                startPageY: 0,
                x: 0,
                y: 0,
                h: 0,
                w: 0
            }
        },
        mounted(){
            this.init();
        },
        computed:{
            getText(){
                let c = this.config.config;
                if(c.alias){
                    return c.value.includes('<%=') ? c.alias : c.value;
                }else{
                    return c.value||'请输入文本';
                }
            }
        },
        methods: {
            isShow(s){
                //['n','s','w','e','ne','nw','se','sw']
                if(!this.config.editable||!this.config.active)return false;
                let t = this.config.type;
                if(s === 's'||s === 'n'){
                    return t !== 'h-line';
                }else if(s === 'w'||s === 'e'){
                    return t !== 'v-line';
                }else{
                    return !t.includes('-line');
                }
            },
            //mm转px
            getExchange(x,suf){
                return this.getZoom(x * this.rate) + (suf ? suf : 0);
            },
            getZoom(v){
                return v * this.config.zoom;//转放大倍数后的值
            },
            divideZoom(v){
                return (v / this.config.zoom).toFixed(2);
            },
            init(){
                let obj = this.config;
                let c = obj.config;
                let e = this.getExchange;
                let z = this.getZoom;
                if(obj.type === 'h-line'||obj.type === 'v-line'){
                    this.x = e(c.startX);
                    this.y = e(c.startY);
                    this.w = e(c.endX - c.startX);
                    this.h = z(c.lineWidth);
                    if(obj.type === 'v-line'){
                        this.w = z(c.lineWidth);
                        this.h = e(c.endY - c.startY)
                    }
                }else{
                    this.x = e(c.left);
                    this.y = e(c.top);
                    this.h = e(c.height);
                    this.w = e(c.width);
                }
            },
            //点击激活当前layout
            handleClick(){
                if(this.config.editable){
                    this.dragging = true;
                    this.$emit('activate',this.config);
                }else{
                    this.$emit('activate',null);
                }
            },
            handleResize(obj){
                if(obj === 'mouseUp'){
                    this.dragging = false;
                    return this.init();
                }
                this.dragging = true;
                let sign = obj.sign;
                let type = this.config.type;
                let conf = this.config.config;
                let dz = this.divideZoom;
                let _x,_y;
                if(sign === 'n'|| sign === 's'){
                    obj.x = 0;
                    if (type === 'v-line') {
                        let o = {};
                        if(sign === 'n'){
                            o.startY = dz((this.y + obj.y) / this.rate);
                            if(conf.endY > o.startY){
                                this.$emit('update', o);
                            }
                        }else{
                            o.endY = dz((this.y + this.h + obj.y) / this.rate);
                            if(o.endY > conf.startY){
                                this.$emit('update', o);
                            }
                        }
                        return;
                    }
                }else if(sign === 'e'|| sign === 'w'){
                    obj.y = 0;
                    if (type === 'h-line') {
                        let o = {};
                        if(sign === 'w'){
                            o.startX = dz((this.x + obj.x) / this.rate);
                            if(conf.endX > o.startX){
                                this.$emit('update', o);
                            }
                        }else{
                            o.endX = dz((this.x + this.w + obj.x) / this.rate);
                            if(o.endX > conf.startX){
                                this.$emit('update', o);
                            }
                        }
                        return;
                    }
                }

                if(sign.includes('n')){
                    _x = this.y + obj.y;
                    obj.y *= -1;
                }
                if(sign.includes('w')){
                    _y = this.x + obj.x;
                    obj.x *= -1;
                }
                let _h = this.h + obj.y;
                let _w = this.w + obj.x;

                let config = this.config.config;
                let c = {};
                if(_h >= this.min){
                    if(type === 'v-line'){
                        if(sign === 's'){
                            c.endY = dz((this.y + obj.y)/this.rate);
                        }else if(sign === 'n'){
                            c.startY = dz((this.y + obj.y)/this.rate);
                        }
                    }else{
                        c.height = dz(_h/this.rate);
                        if(_x){
                            c.top = dz(_x/this.rate);
                        }
                    }
                }
                if(_w >= this.min){
                    if(type === 'h-line'){
                        c.endX = dz(config.endX + _w/this.rate);
                    }else{
                        c.width = dz(_w/this.rate);
                    }
                    if(_y){
                        if(type === 'h-line'){
                            c.startX = dz(config.startX + _y/this.rate);
                        }else{
                            c.left = dz(_y/this.rate);
                        }
                    }
                }
                this.$emit('update',c);
            },
            mouseUp(){
                this.init();
                this.dragging = false;
                document.removeEventListener('mousemove', this.drag);
                document.removeEventListener('mouseup', this.mouseUp);
            },
            mouseDown (event) {
                this.handleClick();//激活
                let e = event || window.event;
                this.startPageX = e.pageX;
                this.startPageY = e.pageY;
                document.addEventListener('mousemove', this.drag);
                document.addEventListener('mouseup', this.mouseUp);
            },
            drag (event) {
                if (this.config.editable && this.dragging) {
                    let e = event || window.event;
                    let x = this.x + e.pageX - this.startPageX;
                    let y = this.y + e.pageY - this.startPageY;
                    let dz = this.divideZoom;
                    let left = dz(x/this.rate);
                    let top = dz(y/this.rate);
                    let type = this.config.type;
                    if(type === 'h-line'||type === 'v-line'){
                        let endX = type === 'v-line' ? left : dz((this.w + x) / this.rate);
                        let endY = type === 'h-line' ? top : dz((this.h + y) / this.rate);
                        this.$emit('update',{
                            startX:left,
                            startY:top,
                            endX,
                            endY
                        });
                    }else{
                        this.$emit('update',{left,top});
                    }
                }
            },
        },
        watch: {
            config: {
                handler(obj){
                    !this.dragging && this.init();
                    let inDiv = {};
                    let c = obj.config;
                    let z = this.getZoom;
                    let div = {zIndex:c.zIndex,border:"1px dashed rgba(0,0,0,0.6)"};
                    ['top', 'left', 'height', 'width','rotation'].forEach(k => {
                        let v = obj.config[k];
                        if(k === 'rotation'){
                            v && (div.transform = 'rotate('+v+'deg)');
                        }else{
                            div[k] = z(v * this.rate) + 'px';
                        }
                    });
                    let b = `${z(c.lineWidth)}pt ${c.lineType} ${c.lineColor}`;
                    let e = this.getExchange;
                    if (obj.type === 'h-line') {
                        div = {
                            left: e(c.startX,'px'),
                            top: e(c.startY,'px'),
                            width: e(Math.max(1,c.endX - c.startX), 'px'),
                            height: z(c.lineWidth) + 'pt'
                        };
                        inDiv = {borderTop: b}
                    } else if (obj.type === 'v-line') {
                        div = {
                            left: e(c.startX, 'px'),
                            top: e(c.startY , 'px'),
                            width: z(c.lineWidth) + 'pt',
                            height: e(Math.max(1,c.endY - c.startY), 'px')
                        };
                        inDiv = {borderLeft: b}
                    } else {
                        if (obj.type === 'text') {
                            inDiv = {
                                fontFamily:c.fontFamily,
                                fontSize:z(c.fontSize)+'pt',
                                letterSpacing:z(c.letterSpacing)+'pt',
                                fontWeight:c.fontWeight,
                                color:c.fontColor,
                                //verticalAlign:c.valign,
                            };
                            if(c.orientation === 'vertical'){
                                //垂直排版
                                inDiv.writingMode = 'tb-rl';
                            }
                            inDiv.display = 'flex';
                            let o = {left:'flex-start',top:'flex-start',center:'center',middle:'center',right:'flex-end',bottom:'flex-end'};
                            inDiv.justifyContent = o[c.align];
                            inDiv.alignItems = o[c.valign];
                            inDiv.textAlign = c.align;
                            if(c.lineHeight){
                                inDiv.lineHeight = c.lineHeight + (c.lineHeight.includes('%') ? '' : 'mm')
                            }
                            if(c.wrap){
                                inDiv.whiteSpace = 'nowrap';
                                inDiv.overflow = 'hidden';
                            }
                            if(c.fontStyle.includes('fontItalic')){
                                inDiv.fontStyle = 'italic';
                            }
                            if(c.fontStyle.includes('fontUnderline')){
                                inDiv.textDecoration = 'underline';
                            }
                        }else if (obj.type === 'barcode') {
                            inDiv.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATAAAAABCAIAAADWyGUYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAF9JREFUeNqMkkEKADEIA/X/j3YXvAihw+RQikoS0/bMVFV3/+feF1m5eHW3vngx5+QFe7gV001O7yG7qWv8mB15d/8Who1zMDzGrcmTU2V1v6P/FTzJ6pwP+7+6nwADABUFff9mVhECAAAAAElFTkSuQmCC)';
                            this.pStyle = {fontSize:z(14)+'px'}
                        }else if (obj.type === 'qrcode') {
                            this.$nextTick(()=>{
                                let can = this.$refs.can;
                                can.width = can.height = z(this.w);
                                QR.draw(c.value,can,can.width);
                            })
                        }else if (obj.type === 'image') {
                            inDiv.backgroundImage = 'url(' + c.src + ')';
                        }else if (obj.type === 'rect') {
                            inDiv = {};
                            if(c.fillColor){
                                inDiv.backgroundColor = c.fillColor;
                            }
                            if(c.borderWidth){
                                inDiv.border = `${z(c.borderWidth)}pt ${c.borderStyle} ${c.borderColor}`;
                            }
                        }
                    }
                    if(c.alpha){
                        inDiv.opacity = c.alpha;
                    }
                    if(obj.reject){
                        Object.getOwnPropertyNames(obj.reject).forEach(k=>{
                            div[k] = obj.reject[k];
                        })
                    }
                    this.divStyle = div;
                    this.inStyle = inDiv;
                },
                deep: true,
                immediate: true //立刻执行
            }
        },
        components: {
            'drag-angle': DragAngle
        }
    }
</script>
<style lang='less'>
    .drag_div {
        position: absolute;
        box-sizing: border-box;
        left: 0;
        top: 0;
        user-select: none;
        z-index: 1;
        .drag_div_in {
            cursor: move;
            width: 100%;
            height: 100%;
            overflow:hidden;
            background-repeat : no-repeat;
            background-size : 100% 100%;
            canvas{
                width:100%;
                height:100%
            }
            p{
                background-color: #fff;
                text-align: center;
                position: absolute;
                bottom: 0;
                font-size:14px;
                width: 100%;
            }
        }
    }
</style>
