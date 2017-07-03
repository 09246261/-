var current_active_ueitem = null;
_editor = UE.getEditor('editor');
UE.plugins["baihu"] = function() {
    var me = this,
        editor = this;
    var utils = baidu.editor.utils,
        Popup = baidu.editor.ui.Popup,
        Stateful = baidu.editor.ui.Stateful,
        editorui = baidu.editor.ui,
        uiUtils = baidu.editor.ui.uiUtils,
        UIBase = baidu.editor.ui.UIBase;
    var domUtils = baidu.editor.dom.domUtils;
    var clickPop = new Popup({
        content: "",
        editor: me,
        _remove: function() {
            $(clickPop.anchorEl).remove();
            clickPop.hide();
            layer.msg('已删除', {
                icon: 1
            });
        },
        _copy: function() {
            $(clickPop.anchorEl).prop('outerHTML');
            clickPop.hide();
        },
        _preblank: function() {
            $('<p><br/></p>').insertBefore(clickPop.anchorEl);
        },
        _blank: function() {
            $('<p><br/></p>').insertAfter(clickPop.anchorEl);
        },
        _up: function() {
            $(clickPop.anchorEl).insertBefore($(clickPop.anchorEl).prev());
        },
        _down: function() {
            $(clickPop.anchorEl).insertAfter($(clickPop.anchorEl).next());
        },
        _saveMaterial: function() {
            saveMaterial($(clickPop.anchorEl).html());
        },
        _saveAutograph: function() {
            saveAutograph($(clickPop.anchorEl).html());
        },
        _bg: function() {
            clickPop.hide();
            set_box('#bg-wrap');
        },
        _p: function() {
            clickPop.hide();
            set_box('#p-wrap');
        },
        className: 'edui-bubble'
    });
    //功能组
    me.addListener("click", function(t, evt) {
        evt = evt || window.event;
        el = evt.target || evt.srcElement;
        if (el.tagName == "IMG") {
            return;
        }
        if (el.tagName == "P") {
//          $(elother).removeClass('selected');
            return;
        }
        if ($(el).parents('.editor').size() > 0) {
            el = $(el).parents('.editor:first').get(0);
            //添加区域选中标识,用于替换颜色
            elother = $(el).parents().parent().find('.editor');
            
            $(window).scroll(function(event){
                if ($(elother)) {
                    $(elother).removeClass('selected');
                }
            });
            
            $(elother).removeClass('selected');
            $(el).addClass('selected');
            //图标组变色
            current_active_ueitem = $(el);
            clickPop.render();
            setParagraph();
            setBgStyle(el);
            var html = clickPop.formatHtml('<nobr class="content-operate"><span id="copy" stateful>复制</span>&nbsp;&nbsp;<span id="cut" stateful>剪切</span>&nbsp;&nbsp;<span onclick="$$._saveMaterial()" stateful>保存</span>&nbsp;&nbsp;<span onclick="$$._remove()" stateful>删除</span>&nbsp;&nbsp;<span onclick="$$._preblank()" stateful>前空行</span>&nbsp;&nbsp;<span onclick="$$._blank()" stateful>后空行</span>&nbsp;&nbsp;<span onclick="$$._up()" stateful>上移</span>&nbsp;&nbsp;<span onclick="$$._down()" stateful>下移</span>&nbsp;&nbsp;<span onclick="$$._bg()" stateful>背景</span>&nbsp;&nbsp;<span onclick="$$._p()" stateful>段落</span><div class="baihu_editor slider" style="width:426px;height:20px;background:#ccc;margin:5px;position:relative;" data-param-init-value="50"><input type="text" id="text" style="width:52px;height:20px;font-size:12px;text-align:center;position:absolute;right:0px;top:-1px;border:1px solid #fff;" placeholder="旋转角度"/><div class="complete" title="可拖动滑块调整" style="width: 372px;text-align:center;">0</div><div class="marker"  style="left:180px;position:absolute;top:0px;width:12px;height:20px;background:rgba(61, 183, 27, 0.6);cursor:pointer;""></div></div></nobr>');
            var content = clickPop.getDom('content');
            content.innerHTML = html;
            clickPop.anchorEl = el;
            clickPop.showAnchor(clickPop.anchorEl);
            var client = new ZeroClipboard($('#copy'));
            client.on('ready', function(event) {
                client.on('copy', function(event) {
                    event.clipboardData.setData('text/html', $(clickPop.anchorEl).prop('outerHTML'));
                    clickPop.hide();
                    layer.msg('复制成功,按Ctrl+V可复制', {
                        icon: 1
                    });
                });
            });
            var cut_client = new ZeroClipboard($('#cut'));
            cut_client.on('ready', function(event) {
                cut_client.on('copy', function(event) {
                    event.clipboardData.setData('text/html', $(clickPop.anchorEl).prop('outerHTML'));
                    clickPop.hide();
                    $(clickPop.anchorEl).remove();
                    layer.msg('剪切成功', {
                        icon: 1
                    });
                });
            });
            //获取当前元素角度
            rotateZ();
        } else {
            if (current_active_ueitem) {
                current_active_ueitem = null;
            }
        }
    });

    //编辑器失去焦点
    // me.addListener('blur', function() {
    //     $(document).click(function(e) {
    //       if ( $(e.target).parents('.colors-box').length == 0 ) {
    //             $(elother).removeClass('selected');
    //       }
    //     });
    // });


    //角度
    function rotateZ() {
        //获取当前元素偏转角度的matrix值
        var transForm = $(editor.selection.getStartElementPath()[0]).closest('.editor').css('transform');
        if (transForm != 'none') {
            //转换为数组
            var num = transForm.split('(')[1].split(')')[0].split(',');
            //判断正负
            var scale = Math.sqrt(num[0] * num[0] + num[1] * num[1]);
            //
            var sin = num[1] / scale;
            //转换出角度值
            var deg = Math.round(Math.atan2(num[1], num[0]) * (180 / Math.PI));
            //給输入框、灰色条赋值
            $('#text').val(deg);
            $('.complete').html(deg);
            $('.marker').css('left', deg + 180);
        }

        //拖动动作
        var move = false,
            x = 0,
            y = 0;
        $('.baihu_editor .marker').on('mousedown', function(e) {
            move = true;
            x = e.pageX - parseFloat($('.marker').css('left'));
            $('.baihu_editor').on('mousemove', function(e) {
                if (move) {
                    var newX = e.pageX - x;
                    var deg = newX - 180;
                    if (newX >= 360) {
                        newX = 360;
                        deg = 180;
                    } else if (newX <= 0) {
                        newX = 0;
                        deg = -180;
                    }
                    $('.marker').css('left', newX);
                    $(clickPop.anchorEl).css('transform', 'rotateZ(' + deg + 'deg)');
                    $('.complete').text(deg);
                    $('#text').val(deg);
                } else {
                    $(this).unbind('mousemove');
                }
            });
        });
        $('.baihu_editor').on('mouseup', function(e) {
            move = false;
            $(this).unbind('mousemove');
        });
        $('#text').click(function() {
            $(this).focus();
            this.select();
        });
        $('#text').keyup(function() {
            var val = $.trim($(this).val());
            if (val == "") {
                val = 0;
                $('.marker').css('left', val + 180);
            } else if (val >= 180) {
                val = 180;
                $(this).val('180');
                $('.marker').css('left', val + 180);
            } else if (val <= -180) {
                val = -180;
                $(this).val('-180');
                $('.marker').css('left', 0);
            } else {
                val = $.trim($(this).val());
            }
            $(clickPop.anchorEl).css('transform', 'rotateZ(' + val + 'deg)');
            $('.complete').text(val);
        });
    }


    //编辑器内背景段落设置弹窗
    function set_box(name) {
        //初始化位置
        $(name).show();
        var itop = ($(window).height() - $(name).height()) / 2;
        var ileft = ($(window).width() - $(name).width() * 2.2) / 2;
        if ($(name).attr("style").indexOf('top') == (-1)) {
            $(name).css({
                top: itop,
                left: ileft
            });
        }
        //拖拽
        var _move = false; //移动标记 
        var _x, _y; //鼠标离控件左上角的相对位置 
        $(name).find(".set_box_top").mousedown(function(e) {
            _move = true;
            _x = e.pageX - parseInt($(name).css("left"));
            _y = e.pageY - parseInt($(name).css("top"));
        });
        $(document).mousemove(function(e) {
            if (_move) {
                var maxW = $(window).width() - $(name).width();
                var maxH = $(window).height() - $(name).height();
                var x = e.pageX - _x; //移动时鼠标位置计算控件左上角的绝对位置 
                var y = e.pageY - _y;
                if (x < 0) {
                    x = 0;
                } else
                if (x > maxW) {
                    x = maxW;
                }
                if (y < 0) {
                    y = 0;
                } else
                if (y > maxH) {
                    y = maxH;
                }
                $(name).css({
                    top: y,
                    left: x
                }); //控件新位置 
            }
        }).mouseup(function() {
            _move = false;
        });
        $(name).find(".set_close").click(function() {
            $(name).hide();
        });
    }
    //背景
    function setBgStyle(el) {
        var bgDialog = $('#bg-wrap');

        // 查找需要设置背景图片的对象
        var brush = $(el).find(".96wx-chbg");
        if(brush.length != 1) {
            if(!$(el).find(".96wx-layout").size()) {
                $(el).wrapInner("<section class='96wx-layout'>");
            }
            brush = $(el).find(".96wx-layout:eq(0)");
        }

        // 获取样式
        var src = brush.css("backgroundImage").replace("url(\"","").replace("\")","").replace("none",""),
            repeat = brush.css("backgroundRepeat"),
            position = brush.css("backgroundPosition"),
            size = brush.css("backgroundSize");

        bgDialog.find(".J-bgChangeSrc").attr("value", src);
        bgDialog.find("option").prop("selected",false);
        bgDialog.find(".J-bgChangeRepeat option[value=\"" + repeat + "\"]").prop("selected",true);
        bgDialog.find(".J-bgChangePosition option[value=\"" + position + "\"]").prop("selected",true);
        bgDialog.find(".J-bgChangeSize option[value=\"" + size + "\"]").prop("selected",true);
        
        change();

        // 上传图片、获取图片
        $('.J-uploadTip').on('click', function() {
            _editor.getDialog("insertimage").open();
            _editor.addListener('beforeInsertImage', function (t, arg) {
                bgDialog.find(".J-bgChangeSrc").attr("value", 'http://' + document.domain + arg[0].src);
                change();
                return true;
            });
            //侦听文件上传，取上传文件列表中第一个上传的文件的路径
            _editor.addListener('afterUpfile', function (t, arg) {
                $(".J-bgChangeSrc").attr("value", 'http://' + document.domain  + arg[0].src);
                change();
            });
        });


        // 修改样式
        function change() {
            brush.css("backgroundImage","url(\"" + bgDialog.find(".J-bgChangeSrc").val() + "\")");
            bgDialog.find(".J-bgChangeRepeat").off().on("change", function() {
                brush.css("backgroundRepeat",$(this).val());
            });
            bgDialog.find(".J-bgChangePosition").off().on("change", function() {
                brush.css("backgroundPosition",$(this).val());
            });
            bgDialog.find(".J-bgChangeSize").off().on("change", function() {
                brush.css("backgroundSize",$(this).val());
            });
            }

    }

    //段落设置
    function setParagraph() {
        var pDialog = $('#p-wrap');
        //获取当前元素
        var $startEle = $(editor.selection.getStartElementPath()[0]); // 当前焦点元素
        var brush = $startEle.closest(".96wx-text");
        if (brush.length < 1) {
            brush = $startEle.closest("p");
            if (brush.length > 0 && brush.siblings("p").length > 1) {
                brush = $startEle.closest("section");
            }
        }
        if (brush.length < 1) {
            brush = $startEle.closest("section");
        }
        if (brush.length < 1) {
            brush = $startEle.closest(".wx96Diy");
        }
        // 记存原有样式，点击取消时还原
        editor.brush = brush,
        brushOldStyle = brush.attr("style");
        // 获取brush指定样式
        function getStyle(attr) {
            return brush.css(attr);
        }
        // 初始化当前内容样式至工具框
        var fontFamily = getStyle("font-family"),
            fontSize = getStyle("font-size").replace("px", ""),
            fontWeight = getStyle("font-weight") || "normal",
            color = getStyle("color"),
            letterSpacing = getStyle("letter-spacing"),
            lineHeight = getStyle("line-height").replace("px", ""),
            textIndent = getStyle("text-indent").replace("px", ""),
            paddingTop = getStyle("padding-top"),
            paddingBottom = getStyle("padding-bottom"),
            backgroundColor = getStyle("background-color");
        var style = {
            "font-family": fontFamily.indexOf("MicroSoft") == -1 ? fontFamily.replace(/"/gi, "'") : "微软雅黑",
            "font-size": fontSize,
            "font-weight": fontWeight,
            "color": color,
            "letter-spacing": letterSpacing,
            "line-height": !isNaN(lineHeight) ? lineHeight / fontSize : 1.42571,
            "text-indent": !isNaN(textIndent) ? textIndent / fontSize : 0,
            "padding-top": paddingTop,
            "padding-bottom": paddingBottom,
            "background-color": backgroundColor
        };
        for (k in style) {
            var ele = pDialog.find("*[data-role=" + k + "]");
            var value = style[k].toString().replace("px", "");
            if (ele.is("input")) {
                ele.val(value);
            } else if (ele.is("select") && ele.find("option[value=\"" + value + "\"]").length > 0) {
                ele.find("option[value=\"" + value + "\"]").prop("selected", true);
            }
        }
        // 修改样式
        pDialog.find(".form").off().on("input", function() {
            var ele = $(this);
            var value = ele.val(),
                key = ele.attr("data-role"),
                conversion = ele.attr("data-conversion") || '';
            value = value + conversion;
            brush.css(key, value);
        });
        // 确定取消按钮
        $(".btn").click(function() {
            if ($(this).hasClass('btn-cancel')) {
                editor.brush.attr("style", brushOldStyle);
            }
            var html = editor.getContent();
            window.localStorage['96editor'] = html;
        });
    }
};