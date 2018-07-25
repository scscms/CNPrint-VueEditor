<template>
    <div id="app">
        <div class="editor">
            <div class="editor_top">
                <div class="editor_logo"></div>
                <el-button round style="float: right;margin:14px" @click="dialogVisible=!0">打印</el-button>
                <el-button round style="float: right;margin:14px" @click="handleXML">转换模板</el-button>
                <el-dropdown @command="handleDropDown">
                    <div class="editor_button"><i class="fa fa-font"></i>文本</div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="h-text"><i class="fa fa-align-left"></i>横排</el-dropdown-item>
                        <el-dropdown-item command="v-text"><i class="fa fa-align-left fa-rotate-90"></i>竖排</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div class="editor_button" @click="handleDropDown('image')"><i class="fa fa-image"></i>图片</div>
                <el-dropdown @command="handleDropDown">
                    <div class="editor_button"><i class="fa fa-star"></i>形状</div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="h-line"><i class="fa fa-arrows-alt-h "></i>横线</el-dropdown-item>
                        <el-dropdown-item command="v-line"><i class="fa fa-arrows-alt-v"></i> &nbsp;竖线</el-dropdown-item>
                        <el-dropdown-item command="rect"><i class="fa fa-square"></i>矩形</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div class="editor_button" @click="handleDropDown('qrcode')"><i class="fa fa-qrcode"></i>二维码</div>
                <div class="editor_button" @click="handleDropDown('barcode')"><i class="fa fa-barcode"></i>条形码</div>
            </div>
            <div class="editor_content">
                <div class="editor_area" @click="activateLayout" @contextmenu.prevent="handleRightMenu">
                    <div class="editor_bg" :style="pageStyle">
                        <div class="page_offset_h" :style="offset_h"></div>
                        <div class="page_offset_v" :style="offset_v"></div>
                        <drag v-for="(obj,index) in layout" :key="obj.type+index" :config="obj" @update="dragUpdate" @activate="activateLayout"></drag>
                    </div>
                    <div class="context_menu" :style="menuStyle" @click="clickContextMenu">
                        <ul>
                            <li v-for="(v,k) in menuList" :class="{can:getActiveLayoutObj}"><span>{{k}}</span>{{v}}</li>
                        </ul>
                    </div>
                    <el-slider vertical :min="0.25" :max="3" :step="0.25" v-model="pageZoom" :format-tooltip="formatTooltip"></el-slider>
                </div>
                <div class="editor_config" @keydown.stop="">
                    <el-tabs type="border-card" v-model="activeName">
                        <el-tab-pane label="样式" name="style" v-if="showStyleTab">
                            <div class="config_config" v-show="getActiveLayoutType === 'text'">
                                <el-form :inline="true" ref="style_text" label-width="53px" size="mini" :model="config.text"
                                         :rules="config.text.rules">
                                    <div class="el-collapse-item__header">位置排列</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="x 轴" prop="left">
                                            <el-input-number v-model="config.text.left" controls-position="right"
                                                             :min="-1000" :max="2000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="y 轴" prop="top">
                                            <el-input-number v-model="config.text.top" controls-position="right"
                                                             :min="-1000" :max="2000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="宽度" prop="width">
                                            <el-input-number v-model="config.text.width" controls-position="right" :min="1"
                                                             :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="高度" prop="height">
                                            <el-input-number v-model="config.text.height" controls-position="right" :min="1"
                                                             :max="1000"></el-input-number>
                                        </el-form-item>
                                    </div>
                                    <div class="el-collapse-item__header">文本</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="旋转" prop="rotation">
                                            <el-input-number v-model="config.text.rotation" controls-position="right" :min="-360" :max="360"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="透明" prop="alpha">
                                            <el-input-number v-model="config.text.alpha" controls-position="right" :min="0.1" :max="1" :step="0.1"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="字体" prop="fontFamily" class="full-line">
                                            <el-select v-model="config.text.fontFamily">
                                                <el-option v-for="item in config.fontFamilyList"
                                                           :key="item" :label="item" :value="item">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="字号" prop="fontSize">
                                            <el-input-number v-model="config.text.fontSize" controls-position="right" :min="8" :max="100"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="颜色" prop="fontColor">
                                            <el-color-picker v-model="config.text.fontColor"></el-color-picker>
                                        </el-form-item>
                                        <el-form-item label="字间距" label-width="65px" prop="letterSpacing">
                                            <el-input-number v-model="config.text.letterSpacing" controls-position="right" :min="0" :max="360"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="行高" prop="lineHeight" class="full-line">
                                            <el-input v-model="config.text.lineHeight" placeholder="毫米或百分比"></el-input>
                                        </el-form-item>
                                        <el-form-item label="字体粗细" label-width="80px" prop="fontWeight">
                                            <el-select v-model="config.text.fontWeight">
                                                <el-option v-for="(item,key) in config.fontWeightList" :key="key"
                                                           :label="key+item" :value="key">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="样式" prop="fontStyle">
                                            <el-checkbox-group v-model="config.text.fontStyle">
                                                <el-checkbox-button label="fontItalic"><i class="fa fa-italic"></i>
                                                </el-checkbox-button>
                                                <el-checkbox-button label="fontUnderline"><i class="fa fa-underline"></i>
                                                </el-checkbox-button>
                                            </el-checkbox-group>
                                        </el-form-item>
                                        <el-form-item label="单行" prop="wrap">
                                            <el-switch v-model="config.text.wrap"></el-switch>
                                        </el-form-item>
                                    </div>
                                    <div class="el-collapse-item__header">排列</div>
                                    <div class="el-collapse-item__content">
                                        <el-radio-group v-model="config.text.orientation" style="margin-bottom:10px">
                                            <el-radio-button label="horizontal">水平文本</el-radio-button>
                                            <el-radio-button label="vertical">垂直文本</el-radio-button>
                                        </el-radio-group>

                                        <el-radio-group v-model="config.text.align">
                                            <el-radio-button v-for="item in config.fontAlign" :label="item" :key="item"><i :class="['fa','fa-align-'+item]"></i></el-radio-button>
                                        </el-radio-group>
                                        <el-radio-group v-model="config.text.valign">
                                            <el-radio-button v-for="(item,key) in config.valignList" :label="key" :key="item"><i :class="['fa','fa-rotate-90','fa-align-'+item]"></i></el-radio-button>
                                        </el-radio-group>
                                    </div>
                                </el-form>
                            </div>
                            <div class="config_config" v-show="getActiveLayoutType === 'line'">
                                <el-form v-model="config.line" :rules="config.line.rules" :inline="true" label-width="53px"
                                         size="mini">
                                    <div class="el-collapse-item__header">线条设置</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="起x1">
                                            <el-input-number v-model="config.line.startX" controls-position="right"
                                                             :min="-1000" :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="起y1">
                                            <el-input-number v-model="config.line.startY" controls-position="right"
                                                             :min="-1000" :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="终x2">
                                            <el-input-number v-model="config.line.endX" controls-position="right"
                                                             :min="-1000" :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="终y2">
                                            <el-input-number v-model="config.line.endY" controls-position="right"
                                                             :min="-1000" :max="1000"></el-input-number>
                                        </el-form-item>
                                    </div>
                                    <div class="el-collapse-item__header">线段样式</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="类型">
                                            <el-select v-model="config.line.lineType">
                                                <el-option v-for="(item,key) in config.lineType" :key="item" :label="item"
                                                           :value="key">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="大小">
                                            <el-input-number v-model="config.line.lineWidth" controls-position="right"
                                                             :min="1" :max="50"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="颜色">
                                            <el-color-picker v-model="config.line.lineColor"></el-color-picker>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </div>
                            <div class="config_config" v-show="getActiveLayoutType === 'rect'">
                                <el-form v-model="config.rect" :rules="config.rect.rules" :inline="true" label-width="53px"
                                         size="mini">
                                    <div class="el-collapse-item__header">矩形设置</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="x 轴" prop="left">
                                            <el-input-number v-model="config.rect.left" controls-position="right"
                                                             :min="-1000" :max="2000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="y 轴" prop="top">
                                            <el-input-number v-model="config.rect.top" controls-position="right"
                                                             :min="-1000" :max="2000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="宽度" prop="width">
                                            <el-input-number v-model="config.rect.width" controls-position="right" :min="0"
                                                             :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="高度" prop="height">
                                            <el-input-number v-model="config.rect.height" controls-position="right" :min="0"
                                                             :max="1000"></el-input-number>
                                        </el-form-item>
                                    </div>
                                    <div class="el-collapse-item__header">边框</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="类型">
                                            <el-select v-model="config.rect.borderStyle">
                                                <el-option v-for="(item,key) in config.lineType" :key="item" :label="item"
                                                           :value="key">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="大小">
                                            <el-input-number v-model="config.rect.borderWidth" controls-position="right"
                                                             :min="0" :max="50"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="颜色">
                                            <el-color-picker v-model="config.rect.borderColor"></el-color-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="el-collapse-item__header">背景</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="背景颜色" label-width="80px">
                                            <el-color-picker v-model="config.rect.fillColor"></el-color-picker>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </div>
                            <div class="config_config" v-show="getActiveLayoutType === 'barcode'">
                                <el-form :inline="true" ref="style_barcode" label-width="53px" size="mini" :model="config.barcode">
                                    <div class="el-collapse-item__header">位置排列</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="x 轴" prop="left">
                                            <el-input-number v-model="config.barcode.left" controls-position="right" :min="-1000" :max="2000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="y 轴" prop="top">
                                            <el-input-number v-model="config.barcode.top" controls-position="right" :min="-1000" :max="2000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="宽度" prop="width">
                                            <el-input-number v-model="config.barcode.width" controls-position="right" :min="1" :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="高度" prop="height">
                                            <el-input-number v-model="config.barcode.height" controls-position="right" :min="1" :max="1000"></el-input-number>
                                        </el-form-item>
                                    </div>
                                    <div class="el-collapse-item__header">其他</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="透明" prop="alpha">
                                            <el-input-number v-model="config.barcode.alpha" controls-position="right" :min="0.1" :max="1" :step="0.1"></el-input-number>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </div>
                            <div class="config_config" v-show="getActiveLayoutType === 'qrcode'">
                                <el-form :inline="true" ref="style_qrcode" label-width="53px" size="mini" :model="config.qrcode">
                                    <div class="el-collapse-item__header">位置排列</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="x 轴" prop="left">
                                            <el-input-number v-model="config.qrcode.left" controls-position="right" :min="-1000" :max="2000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="y 轴" prop="top">
                                            <el-input-number v-model="config.qrcode.top" controls-position="right" :min="-1000" :max="2000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="宽度" prop="width">
                                            <el-input-number v-model="config.qrcode.width" controls-position="right" :min="1" :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="高度" prop="height">
                                            <el-input-number v-model="config.qrcode.height" controls-position="right" :min="1" :max="1000"></el-input-number>
                                        </el-form-item>
                                    </div>
                                    <div class="el-collapse-item__header">其他</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="透明" prop="alpha">
                                            <el-input-number v-model="config.qrcode.alpha" controls-position="right" :min="0.1" :max="1" :step="0.1"></el-input-number>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </div>
                            <div class="config_config" v-show="getActiveLayoutType === 'image'">
                                <el-form :inline="true" ref="style_qrcode" label-width="53px" size="mini" :model="config.image" :rules="config.image.rules">
                                    <div class="el-collapse-item__header">位置排列</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="x 轴" prop="left">
                                            <el-input-number v-model="config.image.left" controls-position="right" :min="-1000" :max="2000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="y 轴" prop="top">
                                            <el-input-number v-model="config.image.top" controls-position="right" :min="-1000" :max="2000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="宽度" prop="width">
                                            <el-input-number v-model="config.image.width" controls-position="right" :min="1" :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="高度" prop="height">
                                            <el-input-number v-model="config.image.height" controls-position="right" :min="1" :max="1000"></el-input-number>
                                        </el-form-item>
                                    </div>
                                    <div class="el-collapse-item__header">其他</div>
                                    <div class="el-collapse-item__content">
                                        <el-form-item label="透明" prop="alpha">
                                            <el-input-number v-model="config.image.alpha" controls-position="right" :min="0.1" :max="1" :step="0.1"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="旋转" prop="rotation">
                                            <el-input-number v-model="config.image.rotation" controls-position="right" :min="-360" :max="360"></el-input-number>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="配置" name="config" v-if="showConfigTab">
                            <div class="config_config" v-show="getActiveLayoutType === 'page'">
                                <div class="el-collapse-item__header">模板设置</div>
                                <div class="el-collapse-item__content">
                                    <el-form :inline="true" ref="config_config" label-width="53px" :model="config.page" :rules="config.page.rules">
                                        <el-form-item label="尺寸" prop="size" class="full-line">
                                            <el-select v-model="config.page.size">
                                                <el-option v-for="(item,key) in config.pageSize" :key="key" :label="key" :value="item">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="宽度" prop="width">
                                            <el-input-number :disabled="config.page.size!=''" v-model="config.page.width" controls-position="right" :min="100" :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="高度" prop="height">
                                            <el-input-number :disabled="config.page.size!=''" v-model="config.page.height" controls-position="right" :min="100" :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="水平偏移" prop="horizontalOffset" class="extrusion_line">
                                            <el-input-number v-model="config.page.horizontalOffset" controls-position="right" :min="0" :max="config.page.width/2"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="垂直偏移" prop="verticalOffset" class="extrusion_line">
                                            <el-input-number v-model="config.page.verticalOffset" controls-position="right" :min="0" :max="config.page.height/2"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="名称" prop="name" class="full-line">
                                            <el-input v-model="config.page.name" placeholder="模板名称"></el-input>
                                        </el-form-item>
                                        <el-form-item label="分页" prop="splitable">
                                            <el-radio-group disabled v-model="config.page.splitable">
                                                <el-radio :label="true">分页</el-radio>
                                                <el-radio :label="false">不分页</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item label="描述" prop="describe" class="full-line">
                                            <el-input type="textarea" :rows="2" v-model="config.page.describe" placeholder="模板描述"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                            <div class="config_config" v-show="getActiveLayoutType === 'text'">

                                <div class="el-collapse-item__header">文本配置</div>
                                <div class="el-collapse-item__content">
                                    <el-form :inline="true" ref="config_text" label-width="53px" size="mini" :model="config.text" :rules="config.text.rules">
                                        <el-form-item label="内容" prop="value" class="full-line">
                                            <el-input type="textarea" :rows="2" v-model="config.text.value" placeholder="请输入文本内容"></el-input>
                                        </el-form-item>
                                        <el-form-item label="别名" class="full-line">
                                            <el-input v-model="config.text.alias" placeholder="请输入别名"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                            <div class="config_config" v-show="getActiveLayoutType === 'barcode'">
                                <div class="el-collapse-item__header">条形码配置</div>
                                <div class="el-collapse-item__content">
                                    <el-form :inline="true" ref="config_barcode" label-width="53px" size="mini" :model="config.barcode" :rules="config.barcode.rules">
                                        <el-form-item label="内容" prop="value" class="full-line">
                                            <el-input type="textarea" :rows="2" v-model="config.barcode.value" placeholder="请输入条形码内容"></el-input>
                                        </el-form-item>
                                        <el-form-item label="码式" class="full-line">
                                            <el-select v-model="config.barcode.type">
                                                <el-option v-for="item in config.barcodeType" :key="item" :label="item" :value="item">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="文字" class="full-line">
                                            <el-radio-group v-model="config.barcode.hideText">
                                                <el-radio :label="false">显示</el-radio>
                                                <el-radio :label="true">隐藏</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                            <div class="config_config" v-show="getActiveLayoutType === 'qrcode'">
                                <div class="el-collapse-item__header">二维码配置</div>
                                <div class="el-collapse-item__content">
                                    <el-form :inline="true" ref="config_qrcode" label-width="53px" size="mini" :model="config.qrcode" :rules="config.qrcode.rules">
                                        <el-form-item label="内容" prop="value" class="full-line">
                                            <el-input type="textarea" :rows="2" v-model="config.qrcode.value" placeholder="请输入文本内容"></el-input>
                                        </el-form-item>
                                        <el-form-item label="码式" class="full-line">
                                            <el-select v-model="config.qrcode.type">
                                                <el-option v-for="item in config.qrcodeType"
                                                           :key="item" :label="item" :value="item">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
        <el-dialog title="菜鸟打印\预览" :visible.sync="dialogVisible" width="550px">
            <el-form :model="printerConfig" inline label-width="80px">
                <el-form-item label="打印机" class="full-line">
                    <el-select v-model="printerConfig.name" placeholder="请选择打印机">
                        <el-option v-for="item in printer.printerList" :label="item" :value="item" :key="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="宽度" class="extrusion_line">
                    <el-input-number disabled v-model="printerConfig.paperSize.width" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item label="高度" class="extrusion_line">
                    <el-input-number disabled v-model="printerConfig.paperSize.height" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item label="水平偏移" class="extrusion_line">
                    <el-input-number disabled v-model="printerConfig.horizontalOffset" controls-position="right" :min="0" :max="10"></el-input-number>
                </el-form-item>
                <el-form-item label="垂直偏移" class="extrusion_line">
                    <el-input-number disabled v-model="printerConfig.verticalOffset" controls-position="right" :min="0" :max="10"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="handlePreview('pdf')">PDF预览</el-button>
                <el-button size="medium" @click="handlePreview('image')">图片预览</el-button>
                <el-button size="medium" type="primary" @click="handlePreview">打印</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    //功能：菜鸟打印模板编辑器
    import Drag from 'components/Drag.vue';
    import common from 'utils/mixin';
    export default {
        name: 'Editor',
        mixins: [common.Editor,common.Printer],
        data(){
            return {
                dialogVisible:false,
            }
        },
        components:{
            Drag
        }
    }
</script>

<style lang="less">
    /*溢出文本自动显示省略号*/
    .ellipsis(@w : auto) {
        width: @w;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .editor {
        height: 100%;
        background-color: #f7f7f7;
        .el-input-number{
            width: 80px;
        }
        .el-slider.is-vertical {
            position: absolute;
            z-index: 100;
            top: 80px;
            left: 0;
            height: 60vh;
        }
        .editor_top {
            background-color: #054572;
            height: 60px;
            overflow: hidden;
            padding-left: 20px;
            .editor_logo{
                display: inline-block;
                width:240px;
                height:40px;
                background: url('../static/scs_logo.png') no-repeat left center;
            }
            & + button {
                float: right;
                margin: 14px
            }
            .zoom {
                line-height: 60px;
                color: #fff;
                font-size: 12px;
            }
            .editor_button {
                opacity: .7;
                display: inline-block;
                width: 50px;
                margin: 10px 5px;
                text-align: center;
                color: #fff;
                cursor: pointer;
                font-size: 14px;
                &:hover {
                    opacity: 1;
                }
                .fa {
                    display: block;
                    font-size: 24px;
                }
            }
        }
        .editor_content {
            display: flex;
            .context_menu {
                visibility: hidden;
                position: absolute;
                z-index: 999;
                background: #fff;
                box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
                border: 1px solid #ccc;
                border-radius: 2px;
                user-select: none;
                li {
                    font-size: 12px;
                    text-align: left;
                    padding: 5px;
                    width: 170px;
                    color: #ccc;
                    &.can {
                        color: #333;
                        &:hover {
                            background-color: #efefef;
                        }
                    }
                    span {
                        float: right
                    }
                }
            }
            .editor_area {
                flex: 1;
                display: flex;
                /*align-items: center;*/
                overflow: scroll;
                text-align: center;
                height: ~'calc(100vh - 60px)';
                .editor_bg {
                    position: relative;
                    text-align: left;
                    background-color: #fff;
                    width: 300px;
                    height: 400px;
                    margin: 20px auto;
                    background-size: cover;
                    .page_offset_h, .page_offset_v {
                        position: absolute;
                        border: 1px dashed #ececec;
                        user-select: none;
                        height: 100%;
                        text-align: center;
                        font-size: 24px;
                        color: #d6d6d5;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .page_offset_h {
                        border-width: 0 1px;
                        height: 100%
                    }
                    .page_offset_v {
                        border-width: 1px 0;
                        width: 100%
                    }
                }
            }
            .editor_config {
                width: 314px;
                background-color: #fff;
                border-left: 1px solid #d8dce5;
                height: ~'calc(100vh - 60px)';
                overflow-y: auto;
                .el-tabs--border-card {
                    box-shadow: none;
                    border: none;
                }
                .el-collapse-item__content p {
                    margin-top: 5px;
                }
                .el-collapse-item__header {
                    font-weight: 700;
                }
                .el-input-number .el-input__inner {
                    padding: 0 35px 0 10px;
                }
                .el-collapse-item__header {
                    cursor: default;
                    .el-checkbox {
                        float: right;
                    }
                }
                .el-collapse-item__content {
                    padding: 20px 0 0;
                    .el-checkbox {
                        .ellipsis(132px);
                    }
                    .is-bordered {
                        margin-bottom: 4px;
                    }
                    .el-checkbox-group .el-checkbox:nth-child(odd) {
                        margin-left: 0;
                    }
                }
                .el-form-item {
                    margin-right: 0;
                }
                .el-checkbox-group {
                    display: inline-block;
                    vertical-align: middle;
                }
                .extrusion_line label {
                    line-height: 16px;
                }
            }
        }
    }
    .full-line, .el-select {
        width: 100%;
        .el-form-item__content {
            width: ~'calc(80% - 4px)';
        }
    }
    .editor_print{
        /*打印界面*/
        .sidebar_foot{
            background-color: #fff;
        }
        .page_custom{
            user-select: none;
            height:100%;
            text-align: center;
            font-size:24px;
            color: #d6d6d5;
            line-height:3;
        }
        .print_add{
            .el-icon-plus{
                display: none;
                font-weight: bold;
            }
            &:hover{
                border-color:#409eff;
                color:#409eff;
                .el-icon-plus{
                    display: inline;
                }
            }
        }
        .is-checked{
            color:#409eff;
        }
        .drag_div .drag_div_in{
            background-color: yellow;
        }
        .editor_bg:nth-child(1):before{
            content: '';
            display: block;
            width:100%;
            height:100%;
            background-color: rgba(0,0,0,.6);
        }
    }
</style>
