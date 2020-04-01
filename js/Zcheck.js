/*
* Created by 小陌 on 2019/05/06.
* Copyright (c) 2019 小陌<admin@z1006.top> All rights reserved.
*
* This source code is licensed under the Anti MIT found in the
* LICENSE file in the root directory of this source tree.
* */

!(function (window) {
    'use strict';
    let reg = {
        phoneReg: /^1[34578]\d{9}$/,
        mailReg: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
        passwordReg: /^[a-zA-Z]\w{5,17}$/,
        verificationCodeReg: /^\d{4}$/,
        qqReg: /^[1-9]\d{4,9}$/,
        moneyReg: /^([1-9][\d]{0,7}|0)(\.[\d]{2,4})?$/,
        idReg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        isAccountLegalityReg: /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/,
        bankCardReg: /^([1-9]{1})(\d{14}|\d{18})$/,
    };
    let promptContent = {
        phone: '请输入正确手机号',
        mail: '请输入正确的邮箱',
        password: '密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)',
        verificationCode: '请输入4位数字的验证码',
        qq: '请输入正确的QQ号',
        money: '请输入正确的金额(小数点后面最多不超过4位)',
        id: '请输入15位或者18位的身份证号码',
        isAccountLegality: '帐号(字母开头，允许5-16字节，允许字母数字下划线)',
        bankCard: '请输入正确银行卡号'
    };
    let inputNodeList = document.querySelectorAll('input[Reg]');
    let customValidation = document.querySelectorAll('input[_Reg]'); //自定义验证类型

    let getCode = document.getElementById('getCode');
    let isClick = 1; //获取验证码 按钮状态

    let nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ];


    /*
    * @author：By 小陌
    * @date: 2019-05-13
    * @describe：验证失败
    * */
    let failed = (self, msg) => {
        layer.msg(msg, { icon: 2,time: 2000});
        self.value = ""
    };

    /*
    * @author：By 小陌
    * @date: 2019-05-06
    * @describe：监听每一个输入框的值是否合法
    * */
    inputNodeList.forEach(e => {
        e.addEventListener('change', function () {
            try {
                let key = this.getAttribute('reg'); //获取reg规则
                let value = this.value; //获取输入框value
                if (value.length == 0) return;
                //如果输入框的key是reg对象的某一个key,那么regStr等于该key的值,否则等于undefined
                let regStr = eval((key in reg) && reg[key] || '');
                let message = promptContent[key.substr(0, key.lastIndexOf("Reg"))]; //获取对应提示信息
                //这里没有判断regStr是否为undefined,如果regStr变量为undefined,则打印异常方便确认问题
                !regStr.test(value) && failed(this, message);
            } catch (err) {
                console.info(err)
            }
        })
    });

    /*
    * @author：By 小陌
    * @date: 2019-05-13
    * @describe：数字必须为_reg的范围
    * */
    let scope = (self, _reg, message) => {
        let min = _reg.split('-')[0];
        let max = _reg.split('-')[1];
        let val = self.value;
        (val > max || val < min) && failed(self, message)
    };

    /*
    * @author：By 小陌
    * @date: 2019-05-13
    * @describe：值必须为reg的倍数
    * */
    let multiple = (self, _reg, message) => {
        let num = Number(_reg.split('*')[0]);
        let val = Number(self.value);
        (val % num != 0) && failed(self, message)
    };

    /*
    * @author：By 小陌
    * @date: 2019-05-06
    * @describe：自定义类型验证,监听输入框的值是否合法
    * */
    customValidation.length && customValidation.forEach(item => {
        //这个方法太过于局限,有时间需要重构。
        item.addEventListener('change', function () {
            try {
                let key = this.getAttribute('_reg');
                let _reg = key.split('|')[0];
                let message = key.split('|')[1];
                _reg.includes('-') && scope(this, _reg, message); //范围
                _reg.includes('*') && multiple(this, _reg, message); //倍数
            } catch (err) {
                console.info(err)
            }
        })
    });

    /*
    * @author：By 小陌
    * @date: 2019-05-06
    * @describe：修改验证码按钮文字
    * */
    let setGetCodeText = window.setGetCodeText = function () {
        if (!isClick) return;
        let self = this;
        let time = 60;
        isClick = 0;
        let timer = setInterval(function () {
            time--;
            self.innerText = `${time}S`;
            if (time == 0) {
                clearInterval(timer);
                isClick = 1;
                self.innerText = `重新获取`;
            }
        }, 1000)
    };
    getCode && getCode.addEventListener('click', setGetCodeText);

    /*
    * @author：By 小陌
    * @date: 2019-05-06
    * @param: 图片宽度 {number}
    * @param: 图片高度 {number}
    * @param: 图片背景颜色 {string}
    * @describe：生成图形验证码
    * */
    let drawCode = window.drawCode = function (width, height, bg) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext("2d");
        canvas.setAttribute('width', width || 100); //设置视图宽度
        canvas.setAttribute('height', height || 50); //设置视图高度
        context.fillStyle = bg; //画布填充色
        context.fillRect(0, 0, canvas.width, canvas.height); //设置画布大小
        context.fillStyle = "white"; //设置字体颜色
        context.font = "30px Arial"; //设置字体
        let rand = [];
        let x = [];
        let y = [];
        //生成随机数
        for (var i = 0; i < 4; i++) {
            rand.push(rand[i]);
            rand[i] = nums[Math.floor(Math.random() * nums.length)];
            x[i] = i * 20 + 10;
            y[i] = Math.random() * 20 + 20;
            context.fillText(rand[i], x[i], y[i]);
        }
        //生成5条随机线
        for (var i = 0; i < 5; i++) {
            drawline(canvas, context);
        }
        //生成100个随机点
        for (var i = 0; i < 100; i++) {
            drawDot(canvas, context);
        }
        //保存验证码内容用于之后校验
        window.localStorage.setItem('code', rand.join('').toUpperCase());
        return canvas.toDataURL("image/png");
    };

    /*
    * @author：By 小陌
    * @date: 2019-05-06
    * @describe：生成随机线
    * */
    let drawline = (canvas, context) => {
        context.moveTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height));
        context.lineTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height));
        context.lineWidth = 1; //随机线宽
        context.strokeStyle = 'rgba(50,50,50,0.3)';
        context.stroke();
    };

    /*
    * @author：By 小陌
    * @date: 2019-05-06
    * @describe：生成随机点
    * */
    let drawDot = (canvas, context) => {
        let px = Math.floor(Math.random() * canvas.width);
        let py = Math.floor(Math.random() * canvas.height);
        context.moveTo(px, py);
        context.lineTo(px + 1, py + 1);
        context.lineWidth = 0.2;
        context.stroke();
    };

    /*
    * @author：By 小陌
    * @date: 2019-06-09
    * @describe：动态加载css代码
    * */
    let loadCssCode = code =>  {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        try {
            //for Chrome Firefox Opera Safari
            style.appendChild(document.createTextNode(code));
        } catch (ex) {
            //for IE
            style.styleSheet.cssText = code;
        }
        let head = document.getElementsByTagName('head').item(0);
        head.appendChild(style);
        return style
    }

    /*
    * @author：By 小陌
    * @date: 2019-06-09
    * @describe：删除动态创建的css代码
    * */
    let removeCssCode = cssNode => {
        let head = document.getElementsByTagName('head').item(0);
        head.removeChild(cssNode)
    }

    /*
    * @author：By 小陌
    * @date: 2019-06-09
    * @describe：向元素插入htmlStringDom
    * */
    let appendHTML = (self,html) =>  {
        var divTemp = document.createElement("div"), nodes = null
            // 文档片段，一次性append，提高性能
            , fragment = document.createDocumentFragment();
        divTemp.innerHTML = html;
        nodes = divTemp.childNodes;
        for (var i=0, length=nodes.length; i<length; i+=1) {
            fragment.appendChild(nodes[i].cloneNode(true));
        }
        self.appendChild(fragment);
        // 据说下面这样子世界会更清净
        nodes = null;
        fragment = null;
    };

    /*
    * @author：By 小陌
    * @date: 2019-06-09
    * @describe：创建密码输入框
    * */
    window.createPayPassword = (obj) => {
        let cssText = `.passworldBox{
                            display: block;
                            width:310px;
                            height: 220px;
                            border: none;
                            background: white;
                            z-index: 101;
                            position: relative;
                            border-radius: 5px;
                        }
                        .passworldBox input[type="tel"]{
                            width: 100%;
                            height: 42px;
                            color: transparent;
                            position: absolute;
                            bottom: 25px;
                            left: 0;
                            border: none;
                            font-size: 18px;
                            opacity: 0;
                            z-index: 1;
                            letter-spacing: 35px;
                        }
                        .fakeBox{
                            height: 42px;
                            position: absolute;
                            bottom: 25px;
                            left: calc((100% - 45px * 6 + 2px) / 2);
                            border:1px solid #bfb6b6;
                            display: flex;
                            flex-direction: row;
                        }
                        .fakeBox input{
                            width: 45px;
                            height: 40px;
                            border: none;
                            border-right: 1px solid #e5e5e5;
                            text-align: center;
                            font-size: 35px;
                            margin:0 !important;
                        }
                        .fakeBox input:nth-last-child(1){
                            border:none;
                        }
                        .boxTitle{
                            height: 40px;
                            width:100%;
                            border-bottom: 0.2px solid #e5e5e5;
                        }
                        .titleText{
                            height: 30px;
                            width: 200px;
                            text-align: center;
                            line-height: 27px;
                            display: block;
                            margin-left: 55px;
                            margin-top: 10px;
                        }
                        .moneyBox{
                            width: 100%;
                        }
                        .contentText{
                            height: 30px;
                            width: 200px;
                            text-align: center;
                            line-height: 27px;
                            display: block;
                            margin-left: 55px;
                            margin-top: 10px;
                            font-size: 22px;
                        }
                        .maskBox {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0,0,0,.35);
                            z-index: 99;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .maskBox * {
                            box-sizing: border-box;
                            font-family: "microsoft yahei";
                        }
                        .passworldBoxActive {
                            animation: activePassword .35s ease-out;
                        }
                        
                        @keyframes activePassword {
                            0% {
                                transform: scale(1.15);
                                opacity: 0;
                            }
                            100% {
                                transform: scale(1);
                                opacity: 1;
                            }
                        }`
        let cssNode = loadCssCode(cssText);
        let passwordStr = `<div class="maskBox" style="display: none">
                                <div class="passworldBox">
                                    <div class="boxTitle">
                                        <span class="titleText">请输入支付密码：</span>
                                    </div>
                                    <div class="moneyBox">
                                        <div id="moneyTitle">
                                            <span class="titleText">${obj.title}</span>
                                        </div>
                                        <div id="moneyContent">
                                            <span class="contentText">￥${obj.prices}${obj.priceUnit}</span>
                                        </div>
                                    </div>
                                    <input type="tel" maxlength="6" class="pwdInput" id="pwdInput" autofocus>
                                    <div class="fakeBox">
                                        <input type="password" readonly="">
                                        <input type="password" readonly="">
                                        <input type="password" readonly="">
                                        <input type="password" readonly="">
                                        <input type="password" readonly="">
                                        <input type="password" readonly="">
                                    </div>
                                </div>
                            </div>`;
        appendHTML(document.getElementsByTagName('Body').item(0),passwordStr);

        let passworldBox = document.getElementsByClassName('passworldBox').item(0);
        let maskBox = document.getElementsByClassName('maskBox').item(0);
        let pwdInput = document.getElementsByClassName('pwdInput').item(0);
        let inputs = document.querySelectorAll('.fakeBox input');

        let activeDom = document.querySelectorAll(obj.activeDom).item(0);

        /*
        * @author：By 小陌
        * @date: 2019-06-09
        * @describe：点击显示密码输入框
        * */
        activeDom && activeDom.addEventListener('click', function () {
            maskBox.style.display = '';
            passworldBox.classList.add('passworldBoxActive');
        })

        /*
        * @author：By 小陌
        * @date: 2019-05-16
        * @describe：隐藏支付密码输入框
        * */
        maskBox.addEventListener('click', function () {
            maskBox.style.display = 'none';
        });

        /*
        * @author：By 小陌
        * @date: 2019-05-16
        * @describe：密码输入框被点击会触发，遮罩点击事件.阻止事件冒泡;
        * */
        passworldBox.onclick = e => e.stopPropagation();

        /*
        * @author：By 小陌
        * @date: 2019-05-16
        * @describe：添加监听input事件
        * */
        pwdInput.addEventListener('input', function () {
            let pwd = this.value.replace(/\s+/g, "");
            for (var i = 0, len = pwd.length; i < len; i++) {
                inputs[i].value = pwd[i];
            }
            inputs.forEach((itme, index) => {
                if (index >= len) itme.value = ""
            });
            //密码输入完成
            if (len == 6) {
                obj.onInputCompletion && obj.onInputCompletion();
            }
        });

        /*
        * @author：By 小陌
        * @date: 2019-05-28
        * @describe：清除密码
        * */
        let clearAll = () => {
            pwdInput.value = "";
            inputs.forEach(item => item.value = "");
        };

        /*
        * @author：By 小陌
        * @date: 2019-06-09
        * @describe：设置价格
        * */
        let stePrices = prices => {
            let contentText = document.getElementsByClassName('contentText').item(0);
            contentText.innerText = `￥${prices}${obj.priceUnit}`
        }
        return {
            clearAll,
            stePrices,
        }
    }


    /*
    * @author：By 小陌
    * @date: 2019-05-25
    * @describe：仿android Toast
    * */
    window.createToast = (msg, duration, cb) => {
        let windowW = window.innerWidth;
        let m = document.createElement('div');
        let left = ((windowW - 150) / 2);
        duration = isNaN(duration) ? 3000 : duration;
        m.innerHTML = msg;
        m.style.cssText = `width: 150px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: fixed;bottom: 20%;left: ${left}px;z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;padding:0 10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`;
        document.body.appendChild(m);
        setTimeout(function () {
            let d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function () {
                document.body.removeChild(m);
                cb && cb()
            }, d * 1000);
        }, duration);
    };
})(window);
