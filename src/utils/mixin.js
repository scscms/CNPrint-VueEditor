module.exports = {
    //模板编辑器
    Editor: {
        data() {
            return {
                rate: 3.78,//mm px比率
                typeArray: ['h-text', 'v-text', 'h-line', 'v-line', 'rect', 'barcode', 'qrcode', 'image'],
                pageZoom: 1,//文档放大缩小的倍数
                caiNiaoPageStyle: {},//菜鸟不可编辑样式
                pageStyle: {width: 0, height: 0},//文档大小
                offset_h: {},
                offset_v: {},
                layout: [],
                styleKeys: ['id', 'height', 'width', 'left', 'top', 'ref', 'src', 'value', 'type', 'ratioMode', 'zIndex', 'rules', 'alias'],
                disMenu: [],//右键菜单
                menuList: {'Delete': '删除', 'Ctrl+c': '复制', 'Ctrl+up': '置顶', 'Ctrl+down': '置底'},
                menuStyle: {zIndex: 1000, visibility: 'hidden', left: 0, top: 0},//右键菜单样式
                activeName: 'config',
                print: [],
                config: {
                    pageSize: {
                        '自定义': '',
                        A4: '210X297',
                        A5: '148X210',
                        A6: '105X148',
                        A3: '297X420',
                        B5: '176X250',
                        B4: '250X353',
                        B3: '353X500',
                        C6: '114X162',
                        C5: '162X229',
                        C4: '229X324'
                    },
                    fontFamilyList: ['宋体', '黑体', '楷体', '仿宋体'],
                    fontWeightList: {normal: '默认', bold: '粗体', light: '细体'},
                    valignList: {top: 'left', middle: 'center', bottom: 'right'},
                    fontAlign: ['left', 'center', 'right'],
                    barcodeType: ['code128a', 'code128b', 'code128c', 'code11', 'postnet', 'Code39', 'Code93', 'upca', 'upce', 'ean8', 'ean13', 'itf14', 'c25inter', 'maxicode', 'datamatrix'],//条形码
                    qrcodeType: ['qrcode','pdf417'],
                    lineType: {solid: '实线条', dashed: '破折线', dotted: '点线条'},
                    page: {
                        size: '210X297',
                        width: 210,
                        height: 297,
                        name: '',
                        splitable: false,
                        describe: '',
                        horizontalOffset: 0,
                        verticalOffset: 0,
                        backgroundImage: '',
                        id: '',
                        rules: {
                            width: {type: 'number', required: true, message: '请设置模板宽度', trigger: 'change'},
                            height: {type: 'number', required: true, message: '请设置模板高度', trigger: 'change'},
                            name: [{required: true, message: '请输入模板名称', trigger: 'change'}]
                        }
                    },
                    text: {
                        zIndex: 1, id: '',
                        left: 0, top: 0, width: 30, height: 8,
                        orientation: 'horizontal',//方向
                        rotation: 0, alpha: 1,
                        fontFamily: '宋体', fontSize: 8,
                        letterSpacing: '', lineHeight: '',
                        fontColor: '', fontWeight: 'normal',
                        wrap: false,
                        fontStyle: [],
                        align: 'left', valign: 'left',
                        value: '请输入文本',
                        alias: '',
                        rules: {
                            lineHeight: {pattern: /^\d+%?$/, message: '请设置正确的行高', trigger: 'change'},
                            value: {required: true, message: '请输入文本内容', trigger: 'change'}
                        },
                    },
                    barcode: {
                        zIndex: 1, id: '', left: 0, top: 0,
                        width: 60, height: 30, alpha: 1,
                        value: '请输入条形码',
                        type: 'code128',
                        hideText: false,
                        rules: {
                            value: {required: true, message: '请输入条形码内容', trigger: 'change'}
                        }
                    },
                    qrcode: {
                        zIndex: 1, id: '', left: 0, top: 0,
                        width: 30, height: 30, alpha: 1,
                        value: '',
                        type: 'qrcode',
                        ratioMode: 'keepRatio',//保持正方形
                        rules: {
                            value: {required: true, message: '请输入二维码内容', trigger: 'change'}
                        }
                    },
                    line: {
                        zIndex: 1, id: '', startX: 10, startY: 10,
                        endX: 40, endY: 40,
                        lineColor: '#000000',
                        lineWidth: 1,
                        lineType: 'solid',
                        rules: {}
                    },
                    rect: {
                        zIndex: 1, id: '', left: 50, top: 50,
                        width: 50, height: 50,
                        rotation: 0, fillColor: '',
                        borderWidth: 0,
                        borderColor: '',
                        borderStyle: '',
                        rules: {}
                    },
                    image: {
                        zIndex: 1, id: '', left: 0, top: 0, width: 100, height: 100, rotation: 0, alpha: 1,
                    }
                }
            }
        },
        mounted() {
            //备份配置
            const C = this.CONFIG = JSON.parse(JSON.stringify(this.config));
            for (let k in C) {
                if(C.hasOwnProperty(k)) delete C[k].rules;
            }
            document.addEventListener("click", this.handleDocumentClick);
            document.addEventListener("keydown", this.handleKeyDown);
        },
        computed: {
            getActiveLayoutObj() {
                //获取当前激活的layout
                let s = false;
                this.layout.forEach(obj => {
                    if (obj.active) {
                        s = obj;
                    }
                });
                return s;
            },
            getActiveLayoutType() {
                //获取当前激活的layout类型
                let v = this.getConfigType(this.getActiveLayoutObj);
                this.activeName = v === 'page' ? 'config' : 'style';
                return v;
            },
            showStyleTab() {
                //判断是否显示样式tab
                return !['page'].includes(this.getActiveLayoutType);
            },
            showConfigTab() {
                //判断是否显示配置tab
                return ['page', 'text', 'barcode', 'qrcode'].includes(this.getActiveLayoutType);
            }
        },
        methods: {
            //处理右键菜单
            handleRightMenu(e){
                this.menuStyle.left = e.pageX + 'px';
                this.menuStyle.top = e.pageY + 'px';
                this.menuStyle.visibility = 'visible';
            },
            handleDocumentClick(){
                this.menuStyle.visibility = 'hidden';
            },
            handleKeyDown(e){
                e = e || window.event;
                let kc = e.keyCode;
                if (kc === 46) { //Delete
                    this.handleContextMenu('D');
                } else if (e.ctrlKey) {
                    if (kc === 67) { //Ctrl+c
                        this.handleContextMenu('c');
                    } else if (kc === 38) { //Ctrl+UP
                        this.handleContextMenu('u');
                    } else if (kc === 40) { //Ctrl+Down
                        this.handleContextMenu('d');
                    }
                }
                if (/^(37|38|39|40)$/.test(kc)) {
                    this.handleContextMenu(kc);
                    e.preventDefault();
                }
                this.menuStyle.visibility = 'hidden';
            },
            handlePreview(type){
                this.dialogVisible = !1;
                let preview = ['pdf','image'].includes(type),frame;
                if(preview){
                    frame = window.open('about:blank','_blank');
                }
                let xml = this.saveXML();
                fetch('http://103.27.4.146:3001/api/saveXML', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `xml=${xml}`
                }).then((res)=>{
                    return res.text()
                }).then((res)=>{
                    let json = JSON.parse(res);
                    new Promise(resolve=>{
                        this.setPrinterConfig(resolve, this.printerConfig);
                    }).then(()=>{
                        new Promise(resolve=>{
                            this.sendPrint(resolve,'1', [{
                                templateURL:json.data.file,
                                data:{}
                            }],preview,type);
                        }).then(url=>{
                            if(preview){
                                frame.location = url;
                            }
                        })
                    });
                })
            },
            saveXML() {
                let str = `<?xml version="1.0" encoding="UTF-8"?><page xmlns="http://cloudprint.cainiao.com/print"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://cloudprint.cainiao.com/print http://cloudprint-docs-resource.oss-cn-shanghai.aliyuncs.com/lpml_schema.xsd"
        xmlns:editor="http://cloudprint.cainiao.com/schema/editor"></page>`;
                let xml = (new DOMParser()).parseFromString(str, 'text/xml');
                let page = xml.getElementsByTagName('page')[0];//nodeValue
                for (let [key, val] of Object.entries(this.config.page)) {
                    if (key !== 'rules' && val !== '') {
                        page.setAttribute(key, val);//设置属性
                    }
                }
                this.layout.forEach(obj => {
                    let type = obj.type.replace(/[vh]-/, '');
                    let c = obj.config;
                    let layout = document.createElement('layout');
                    if (type === 'line') {
                        layout = document.createElement(type);//覆盖
                        ['startX', 'startY', 'endX', 'endY'].forEach(k => {
                            layout.setAttribute(k, c[k]);//设置属性
                        });
                        let str = ``;
                        ['lineColor', 'lineWidth', 'lineType'].forEach(k => {
                            str += `${k}:${c[k]}${k === 'lineWidth' ? 'pt' : ''};`;
                        });
                        layout.setAttribute('style', str);
                    } else {
                        ['id', 'height', 'width', 'left', 'top', 'ref', 'orientation'].forEach(k => {
                            if (c.hasOwnProperty(k)) {
                                let v = c[k];
                                '' !== v && layout.setAttribute(k, v);//设置属性
                            }
                        });
                        type = type === 'qrcode' ? 'barcode' : type;//没有二维码类型
                        let child = document.createElement(type);//子元素
                        //设置子元素属性
                        ['src', 'value', 'type', 'ratioMode', 'alias'].forEach(k => {
                            if (c.hasOwnProperty(k)) {
                                if (k === 'value') {
                                    child.textContent = '<![CDATA[' + c.value + ']]>';
                                } else if (k === 'alias') {
                                    c.alias && child.setAttribute('editor:_printName_', c.alias);//别名
                                } else {
                                    child.setAttribute(k, c[k]);
                                }
                            }
                        });
                        //设置子元素样式
                        let str = ``;
                        for (let [key, val] of Object.entries(c)) {
                            if (!this.styleKeys.includes(key)) {
                                if (key === 'fontStyle') {
                                    ['fontItalic', 'fontUnderline'].forEach(k => {
                                        val.includes(k) && (str += k + ':true;')
                                    })
                                } else if (key === 'hideText' && !val) {
                                    str += `${key}:false;`;
                                } else if (val) {
                                    if (!(key === 'alpha' && val === 1)) {
                                        str += `${key}:${val};`;
                                    }
                                }
                            }
                        }
                        str && child.setAttribute('style', str);
                        layout.setAttribute('style', 'overflow:visible;zIndex:' + c.zIndex);
                        layout.appendChild(child);
                    }
                    page.appendChild(layout);
                });
                let string = (new XMLSerializer()).serializeToString(xml);
                string = string.replace(/(start|end)([xy])=/g, function (a, b, c) {
                    return b + c.toUpperCase() + '=';
                });
                string = string.replace(/&lt;/gm, '<').replace(/&gt;/gm, '>').replace(/ xmlns="http:\/\/www.w3.org\/1999\/xhtml"/gm, '');
                string = string.replace(/editor:_printname_/gm, 'editor:_printName_');
                console.log(string);
                //this.$message('请查看控制台');
                return string;
            },
            handleXML(){
                this.$prompt('请输入XML模板(可选)', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    if(!value){
                        value = '<?xml version="1.0" encoding="UTF-8"?><page xmlns="http://cloudprint.cainiao.com/print" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:editor="http://cloudprint.cainiao.com/schema/editor" xsi:schemaLocation="http://cloudprint.cainiao.com/print http://cloudprint-docs-resource.oss-cn-shanghai.aliyuncs.com/lpml_schema.xsd" size="210X297" width="210" height="297" splitable="false" horizontalOffset="0" verticalOffset="0"><layout height="40.73" width="53.44" left="147.09" top="76.46" style="overflow:visible;zIndex:14"><rect style="fillColor:#F4EEEE;borderWidth:2;borderColor:#FB0909;borderStyle:solid;overflow:visible;"></rect></layout><layout height="41.86" width="68.88" left="66.93" top="23.54" orientation="horizontal" style="overflow:visible;zIndex:15"><text style="orientation:horizontal;fontFamily:宋体;fontSize:12;fontColor:#EE0A0A;fontWeight:normal;align:left;valign:left;overflow:visible;"><![CDATA[支持文本、图片、直线、矩形、二维码、条形码，暂不支持表格可视化编辑。支持右键菜单快捷操作和快捷键操作。]]></text></layout><layout height="19.95" width="39.89" left="13.23" top="78.57" style="overflow:visible;zIndex:4"><barcode type="code128" style="hideText:false;overflow:visible;"><![CDATA[123456789]]></barcode></layout><layout height="23.65" width="44.81" left="147.89" top="23.53" style="overflow:visible;zIndex:5"><barcode type="qrcode" style="hideText:false;overflow:visible;"><![CDATA[http://www.scscms.com/]]></barcode></layout><layout height="21.16" width="69.05" left="69.84" top="78.3" style="overflow:visible;zIndex:7"><image src="http://www.scscms.com/scs_img/logo.png" style="overflow:visible;"></image></layout><layout height="37.41" width="37.41" left="14.01" top="23.55" style="overflow:visible;zIndex:8"><barcode type="qrcode" ratiomode="keepRatio"><![CDATA[http://www.scscms.com/]]></barcode></layout><line startX="9" startY="9" endX="199.85" endY="9" style="lineColor:#000000;lineWidth:2pt;lineType:solid;"></line><line startX="98.62" startY="110.79" endX="98.62" endY="140.79" style="lineColor:#000000;lineWidth:2pt;lineType:solid;"></line></page>'
                    }else if(!/^<\?xml[\s\S]+<\/page>$/im.test(value)){
                        return this.$message({
                            type: 'error',message: 'XML模板不正确'
                        });
                    }
                    this.convertXML(value);
                }).catch(() => {});
            },
            convertXML(xml) {
                const setAttr = (obj, attr) => {
                    for (let i = attr.length; i--;) {
                        let t = attr[i];
                        if (t.name === 'style') {
                            t.value.replace(/(\w+):(#?\w+)/g, function (a, b, c) {
                                if (b === 'hideText') {
                                    c = c === 'true';
                                }
                                return obj[b] = c;
                            })
                        } else {
                            let k = t.name.includes('editor:_print') ? 'alias' : t.name;
                            if (obj.hasOwnProperty(k)) {
                                obj[k] = t.value;
                            }
                        }
                    }
                };
                //处理字符串
                let xmlString = xml.replace(/(["\[])<%=/gm, '$1&lt;%=').replace(/%>(["\]])/gm, '%&gt;$1').replace(/<%[\s\S]*?%>/gm, '');
                const domParser = new DOMParser();
                let xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
                let err = xmlDoc.getElementsByTagName("parsererror");//attributes
                if (err.length) {
                    this.$message({
                        type: 'error',message: 'XML模板格式有误!'
                    });
                    console.error(err[0].textContent);
                } else {
                    let page = xmlDoc.getElementsByTagName("page");
                    page = page.length ? page[0] : xmlDoc.getElementsByTagName("layout")[0];
                    Array.from(page.children).forEach(item => {
                        let tg = item.tagName;
                        if (tg === 'layout' || tg === 'line') {
                            const ch = item.firstElementChild;
                            let type = ch ? ch.tagName : tg;
                            const obj = Object.assign({}, this.CONFIG[type]);
                            const a = item.attributes;
                            if (tg === 'line') {
                                //修复特殊情况的type
                                type = (a.endX - a.startX > a.endY - a.startY) ? 'v-line' : 'h-line';
                            }
                            if(type === 'image'){
                                obj.src = ch.src;
                            }
                            //修改配置
                            setAttr(obj, a);
                            ch && setAttr(obj, ch.attributes);
                            if (type === 'text'||type === 'barcode') {
                                obj.value = ch.textContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                            }
                            this.layout.push({
                                type: type,
                                zoom: this.pageZoom,
                                active: !1,
                                editable: !0,
                                config: obj
                            });
                        }
                    });
                }
            },
            handleDropDown(c) {
                if (this.typeArray.includes(c)) {
                    let _obj = {
                        type: c.includes('text') ? c.replace(/^[vh]-/, '') : c,
                        zoom: this.pageZoom,
                        editable: true,
                        active: true,
                        config: {}
                    };
                    let obj = Object.assign(_obj.config, this.CONFIG[c.replace(/^[vh]-/, '')]);
                    if (c.includes('text')) {
                        obj.orientation = c === 'h-text' ? 'horizontal' : 'vertical';
                    } else if (c.includes('line')) {
                        obj[c === 'h-line' ? 'endY' : 'endX'] = c === 'h-line' ? obj['startX'] : obj['startY'];
                    } else if (c === 'image') {
                        this.$prompt('请输入图片地址', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            inputPattern: /^https?:\/\/.+\.(jpg|gif|png)/i,
                            inputErrorMessage: '图片地址不正确'
                        }).then(({ value }) => {
                            obj.src = value;
                            let img = new Image();
                            img.onload = () => {
                                _obj.config.width = this.getExchange(img.width);
                                _obj.config.height = this.getExchange(img.height);
                                this.layout.push(_obj);
                                this.activateLayout(_obj);
                            };
                            img.src = obj.src;
                        }).catch(() => {});
                    }
                    obj.zIndex = this.layout.length + 1;
                    if (c !== 'image') {
                        this.layout.push(_obj);
                        this.activateLayout(_obj);
                    }
                }
            },
            formatTooltip(val) {
                return '缩放：' + val * 100 + '%';
            },
            getZoom(v) {
                return v * this.rate * this.pageZoom;
            },
            getExchange(v) {
                return (v / this.rate).toFixed(2);
            },
            //修改文档尺寸
            editPageSize() {
                let p = this.pageStyle, c = this.config.page, z = this.getZoom;
                p.width = z(c.width) + 'px';
                p.height = z(c.height) + 'px';
                if (c.backgroundImage) {
                    p.backgroundImage = 'url(' + c.backgroundImage + ')';
                }
                if (this.cainiao) {
                    let obj = Object.assign({}, p);
                    obj.backgroundImage = 'url(' + this.cainiao.backgroundImage + ')';
                    obj.height = z(this.cainiao.height) + 'px';
                    obj.marginBottom = 0;
                    obj.marginTop = '20px';
                    this.caiNiaoPageStyle = obj;
                    p.marginTop = 0;
                }
                //修改页边距
                this.offset_h = {
                    left: z(c.horizontalOffset) + 'px',
                    fontSize: z(8) + 'px',
                    width: z(c.width - 2 * c.horizontalOffset) + 'px'
                };
                this.offset_v = {
                    top: z(c.verticalOffset) + 'px',
                    height: z(c.height - 2 * c.verticalOffset) + 'px'
                }
            },
            //放大缩小
            handlePageZoom(z) {
                let p = this.pageZoom + (z ? 0.25 : -0.25);
                if (p < 0.25) p = 0.25;
                if (p > 6) p = 6;
                this.pageZoom = p;
            },
            //点击右键菜单
            clickContextMenu(e) {
                this.handleContextMenu(e.target.innerText.replace(/(?:.+\+)?(\w).+/, '$1'));
            },
            //处理右键菜单点击
            handleContextMenu(type) {
                if (this.getActiveLayoutObj) {
                    if (this.disMenu.includes(type)) return;//被禁止的功能
                    switch (type) {
                        case 'D':
                            this.layout.forEach((obj, i) => {
                                if (obj.active) {
                                    if (this.store) {
                                        this.print.forEach(o => {
                                            let i = o.value.findIndex(v => v === obj.name);
                                            i >= 0 && o.list.findIndex(k => k.name === obj.name && !k.disabled) >= 0 && o.value.splice(i, 1);
                                        });
                                    } else {
                                        this.layout.splice(i, 1);
                                    }
                                }
                            });
                            break;
                        case 'c':
                            let obj = JSON.parse(JSON.stringify(this.getActiveLayoutObj));
                            let c = obj.config;
                            if (c.hasOwnProperty('startX')) {
                                c.startY += 8;
                                c.endY += 8;
                            } else {
                                c.left += 8;
                                c.top += 8;
                            }
                            c.zIndex += 1;
                            this.getActiveLayoutObj.active = false;
                            this.layout.push(obj);
                            break;
                        case 'u':
                            let max = 0;
                            this.layout.forEach(o => {
                                max = Math.max(o.config.zIndex, max);
                            });
                            this.getActiveLayoutObj.config.zIndex = max + 1;
                            break;
                        case 'd':
                            let min = 100;
                            this.layout.forEach(o => {
                                o.config.zIndex += 1;
                                min = Math.min(o.config.zIndex, min);
                            });
                            this.getActiveLayoutObj.config.zIndex = min - 1;
                            break;
                        case 37://left
                        case 38://up
                        case 39://right
                        case 40://down
                            let con = this.config[this.getConfigType(this.getActiveLayoutObj)];
                            let v = /(37|38)/.test(type) ? -1 : 1;
                            if (con.hasOwnProperty('startX')) {
                                let k = /(37|39)/.test(type) ? 'X' : 'Y';
                                con['start' + k] += v;
                                con['end' + k] += v;
                            } else {
                                con[/(37|39)/.test(type) ? 'left' : 'top'] += v;
                            }
                            break;
                    }
                }
            },
            getConfigType(o) {
                return o ? o.type.replace(/^[vh]-/, '') : 'page';
            },
            activateLayout(o) {
                //激活当前点击的layout,并替换数据
                this.menuStyle.visibility = 'hidden';
                this.layout.forEach(obj => {
                    if (obj === o) {
                        obj.active = true;
                        let config = this.config[this.getConfigType(o)];
                        let _c = obj.config;
                        for (let key in _c) {
                            if (_c.hasOwnProperty(key)) {
                                config[key] = _c[key];
                            }
                        }
                    } else {
                        obj.active = false;
                    }
                });
            },
            dragUpdate(obj) {
                //更新数据
                let type = this.getActiveLayoutType;
                if (type !== 'page') {
                    let config = this.config[type];
                    for (let key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            config[key] = obj[key];
                        }
                    }
                }
            },
        },
        beforeDestroy(){
            document.removeEventListener("click", this.handleDocumentClick);
            document.removeEventListener("keydown", this.handleKeyDown);
        },
        watch: {
            config: {
                handler(obj) {
                    let o = this.getActiveLayoutObj;
                    if (o) {
                        let _o = obj[this.getConfigType(o)];
                        for (let key in _o) {
                            if (_o.hasOwnProperty(key)) {
                                o.config[key] = _o[key];
                            }
                        }
                        if (o.type === 'qrcode') {
                            //二维码保持正方形
                            o.config.width = o.config.height = Math.max(_o.width, _o.height);
                        }
                        //有菜鸟模板不准y小于0
                        if (this.cainiao) {
                            o.config.top = Math.max(o.config.top, 0);
                        }
                    }
                    if (obj.page.size) {
                        let arr = obj.page.size.split('X');
                        let c = this.printerConfig;
                        c.paperSize.width = obj.page.width = arr[0] >> 0;
                        c.paperSize.height = obj.page.height = arr[1] >> 0;
                        c.horizontalOffset = obj.page.horizontalOffset;
                        c.verticalOffset = obj.page.verticalOffset;
                    }
                    this.editPageSize();
                },
                immediate: true,
                deep: true
            },
            pageZoom(v) {
                this.editPageSize();
                this.layout.forEach(obj => {
                    obj.zoom = v;
                })
            }
        }
    },
    //打印组件
    Printer: {
        data() {
            return {
                socket: null,
                UUID: [],
                printer: {
                    version: '1.0',//协议版本
                    errMsg: '等待初始化',
                    printerList: [],//打印机列表
                    printerDate: [],//需要打印的数据
                },
                resolveList:{},//回调函数
                printerConfig: {
                    name:'',//默认打印机
                    needTopLogo: !1,
                    needBottomLogo: !1,
                    horizontalOffset: 0,
                    verticalOffset: 0,
                    forceNoPageMargins:!1,// v0.2.8.3 新增字段
                    paperSize: {
                        width: 1,
                        height: 1
                    }
                }
            }
        },
        created() {
            this.socket = new WebSocket('ws://localhost:13528');
            this.socket.onopen = () => {
                this.socket.onmessage = (event) => {
                    console.log('监听到一条消息, data:', event.data);
                    let response = JSON.parse(event.data);
                    if (response.status === 'success' || response.taskStatus === "printed") {
                        switch (response.cmd) {
                            case 'getAgentInfo':
                                //获取打印机列表
                                return this.socket.send(JSON.stringify(this.getDefaultRequest('getPrinters', response.requestID)));
                            //获取打印机版本
                            case 'getPrinters':
                                //获取打印机列表 并解析打印机列表数据
                                if (response.printers.length) {
                                    //获取默认打印机的配置
                                    let p = this.printer.printerList;
                                    response.printers.forEach(pt => {
                                        pt.status === "enable" && p.push(pt.name);
                                        if(response.defaultPrinter){
                                            this.printerConfig.name = pt.name;
                                        }
                                    });
                                } else {
                                    this.printer.errMsg = '无可用的打印机!';
                                }
                                break;
                            case 'getPrinterConfig':
                                //获取某个打印机的设置参数
                                break;
                            case 'setPrinterConfig':
                                this.resolve_setPrinterConfig && this.resolve_setPrinterConfig('setPrinterConfig');
                                break;
                            case 'notifyPrintResult':
                                //打印结果通知协议
                                if (response.taskStatus === "printed") {
                                    //已经打印完成
                                } else if (response.taskStatus === "rendered") {
                                    //已经渲染完成
                                }
                                break;
                            case 'print':
                                //打印
                                if (response.previewURL||response.previewImage) {
                                    let f = this.resolveList.print;
                                    f && f(response.previewURL?response.previewURL:response.previewImage[0])
                                } else {
                                    console.log("打印成功:", response);
                                }
                                break;
                            default:
                        }
                    } else {
                        if (response.cmd === "notifyPrintResult") {
                        } else {
                            this.printer.errMsg = response.msg;
                            console.error(response);
                        }
                        this.$monitor.push({
                            title: '打印错误信息'+response.msg,
                            info: JSON.stringify(response)
                        });
                    }
                };
                this.socket.onclose = () => {
                    this.printer.errMsg = '菜鸟打印组件连接断开！';
                };
                //先获取版本
                this.socket.send(JSON.stringify(this.getDefaultRequest('getAgentInfo')));
                this.printer.errMsg = '';
            };
            this.socket.onerror = ()=>{
                this.$notify.error({
                    title: '系统错误',
                    duration:0,
                    dangerouslyUseHTMLString: true,
                    message: `<div class="print_info">亲，系统检测到菜鸟打印组件启动失败，解决办法：
                        <h3>1、未安装控件</h3>
                        <p>请先安装控件，<a href="http://cloudprint.cainiao.com/cloudprint/client/CNPrintSetup.exe" target="_blank">请点击此处下载</a>。安装好后重启浏览器即可。</p>
                        <h3>2、已安装控件</h3>
                        <p>请在电脑的开始菜单-->“所有程序”里找到“CAINIAO打印组件”进行启动。</p></div>`
                });
                this.printer.errMsg = '连接打印组件失败！';
            };
        },
        methods: {
            //获取通用请求参数
            getDefaultRequest(cmd, id) {
                return {
                    version: this.printer.version,
                    cmd,
                    requestID: id || this.getUUID()
                };
            },
            //获取通用唯一标识符
            getUUID(len = 8) {
                let id;
                do {
                    id = Math.random().toString(16).slice(len * -1).toUpperCase();
                } while (this.UUID.includes(id));
                this.UUID.push(id);
                return id;
            },
            //获取打印机配置
            getPrinterConfig(name) {
                let request = this.getDefaultRequest('getPrinterConfig');
                request.printer = (this.printerConfig.name = name);//设置默认打印机
                this.socket.send(JSON.stringify(request));
            },
            //设置打印机配置(每次打印前设置)
            setPrinterConfig(resolve, obj) {
                if(resolve){
                    this.resolve_setPrinterConfig = resolve;
                }
                const request = this.getDefaultRequest('setPrinterConfig', this.getUUID());
                request.printer = Object.assign(this.printerConfig, obj);
                request.printer.paperSize.width >>= 0;
                request.printer.paperSize.height >>= 0;
                this.socket.send(JSON.stringify(request));
            },
            //请求打印
            sendPrint(resolve,orderId, contents, preview = true,type = 'pdf') {
                if(resolve){
                    this.resolveList.print = resolve;
                }
                let request = this.getDefaultRequest('print', this.getUUID());
                request.task = {
                    previewType:type,
                    preview: preview,
                    taskID: orderId +'_'+ this.getUUID(),
                    printer: this.printerConfig.name,
                    notifyType: ['print'],//仅出纸响应
                    notifyMode: 'allInOne',
                    documents: [{
                        documentID: orderId +'_'+ this.getUUID(),
                        contents: contents
                    }]
                };
                this.socket.send(JSON.stringify(request));
            }
        }
    }
};
