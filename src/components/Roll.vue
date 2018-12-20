<template>
    <div class="wrapper">
        <div class="centerCard">
            <img id="centerCardImg" src="../assets/centerCard.png" alt="" width="90%">
            <div class="timeTips">
                <div class="tipsText" v-if="availableTimes>0">您还可以抽取{{availableTimes}}次</div>
                <div class="tipsText" v-if="availableTimes==0">您的抽奖次数已用完</div>
                <img src="../assets/timeTips.png" alt="" width="70%;">
            </div>
            <div class="rollArea">
                <div class="wheel">
                    <img id="wheelTable" src="../assets/rollPan.png" alt="" width="60%">
                    <img class="pointer" src="../assets/goBtn.png" width="18%" @click="toRoll()" />
                </div>
            </div>
        </div>
        <div class="bottomImg ignore">
            <img id="bottomPNG" src="../assets/bottom.png" alt="" width="100%">
            <img id="boxPNG" src="../assets/boxBtn.png" alt="" width="40%" @click="showBox=true">
        </div>
        <div class="boxResult" v-if="showBox" @click="showBox=false">
            <div class="rewardGroup">
                <div class="single">
                    <img id="reward" :src="'../static/reward'+ reward +'.png'" alt="" width="80%">
                    <img id="statusIcon" :src="'../static/'+received+'.png'" alt="" width="20%">
                </div>
            </div>
            <img src="../assets/myBox.png" alt="" width="90%" @click="showResult=false">
        </div>
        <div class="gameResult" v-if="showResult">
            <img src="../assets/result.png" alt="" width="90%" @click="showResult=false">
            <img id="PICreward" :src="'../static/p'+ rollResult +'.png'" alt="" width="60%" @click="showResult=false">
        </div>
    </div>
</template>

<script>
    import {
        Toast
    } from "mand-mobile";
    import jQuery from "../utils/jquery-2.1.4";
    import jQueryRotate from "../utils/jQueryRotate";
    import Store from "../utils/store";
    import {
        baseUrl
    } from "../utils/baseUrl";
    export default {
        name: "Roll",
        data() {
            return {
                reward: '',
                rollResult: 0,
                Rotating: false,
                showResult: false,
                showBox: false,
                received: '',
                availableTimes: 0,
                memberNum: "",
                memberName: ""
            };
        },
        methods: {
            toRoll() {
                let self = this;
                if (this.Rotating === false) {
                    this.Rotating = true;
                    let max = 4;
                    this.$ajax({
                        method: "post",
                        url: baseUrl + "/member/roll",
                        data: {
                            memberNum: self.memberNum,
                            memberName: self.memberName
                        }
                    }).then(function(response) {
                        console.log(response.data);
                        if (response.data.code === 200) {
                            let result = response.data.rollNum;
                            self.rollResult = result;
                            self.availableTimes = 0;
                            console.log(result);
                            self.Rolling(result);
                            self.getBoxInfos();
                        } else {
                            Toast.failed(response.data.msg);
                        }
                    });
                } else {
                    return;
                }
            },
            Rolling(item) {
                let self = this;
                let count = 4;
                // 应该旋转的角度，旋转插件角度参数是角度制。
                var baseAngle = 360 / count;
                // 旋转角度 == 270°（当前第一个角度和指针位置的偏移量） - 奖品的位置 * 每块所占的角度 - 每块所占的角度的一半(指针指向区域的中间)
                let angles = 300 * 3 / 4 - item * baseAngle - baseAngle / 2; // 因为第一个奖品是从0°开始的，即水平向右方向
                $("#wheelTable").stopRotate();
                // 注意，jqueryrotate 插件传递的角度不是弧度制。
                // 哪个标签调用方法，旋转哪个控件
                $("#wheelTable").rotate({
                    angle: 0,
                    animateTo: angles + 360 * 16, // 这里多旋转了5圈，圈数越多，转的越快
                    duration: 8000,
                    callback: function() {
                        // 回调方法
                        console.log("Finished");
                        self.showResult = true;
                        self.Rotating = false;
                    }
                });
            },
            getMemberInfos() {
                let self = this;
                this.$ajax({
                    method: "post",
                    url: baseUrl + "/member/login",
                    data: {
                        memberNum: self.memberNum,
                        memberName: self.memberName
                    }
                }).then(function(response) {
                    console.log(response.data);
                    if (response.data.code === 200) {
                        self.availableTimes = response.data.availableTimes;
                    } else {
                        Toast.failed("认证失败，请重新登录!");
                        setTimeout(() => {
                            self.$router.push("/");
                        }, 2000);
                    }
                });
            },
            getBoxInfos() {
                let self = this;
                this.$ajax({
                    method: "post",
                    url: baseUrl + "/member/getreward",
                    data: {
                        memberNum: self.memberNum,
                    }
                }).then(function(response) {
                    console.log(response.data);
                    if (response.data.code === 200) {
                        self.reward = response.data.reward
                        if (response.data.received == 0) {
                            self.received = 'notReceive'
                        } else if (response.data.received == 1) {
                            self.received = 'received'
                        }
                    } else {
                        Toast.failed("认证失败，请重新登录!");
                        setTimeout(() => {
                            self.$router.push("/");
                        }, 2000);
                    }
                });
            }
        },
        beforeMount() {
            this.memberNum = Store.fetch("memberNum");
            this.memberName = Store.fetch("memberName");
            // console.log(this.memberNum);
            // console.log(this.memberName);
            this.getMemberInfos();
            this.getBoxInfos();
            console.log()
        }
    };
</script>

<style scoped>
    .wrapper {
        position: fixed;
        top: 0px;
        height: 100vh;
        width: 100vw;
        background-image: url(../assets/background.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
    }
    
    .centerCard {
        margin-top: 60px;
        width: 100vw;
        position: absolute;
    }
    
    .timeTips {
        position: absolute;
        top: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    
    .rollArea {
        top: 390px;
        position: absolute;
    }
    
    .bottomImg {
        position: fixed;
        width: 100%;
    }
    
    .ignore {
        bottom: -6px;
    }
    
    .wheel {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .tipsText {
        padding-top: 55px;
        padding-left: 70px;
        position: absolute;
    }
    
    #statusIcon {
        position: absolute;
        margin-left: 180px;
    }
    
    .pointer {
        position: absolute;
        padding-bottom: 12px;
    }
    
    #wheelTable {
        position: relative;
    }
    
    #bottomPNG {
        position: absolute;
        bottom: 0px;
        right: 0px;
    }
    
    #boxPNG {
        position: relative;
        margin-bottom: 15px;
    }
    
    .gameResult {
        height: 100vh;
        width: 100vw;
        background-color: rgba(0, 0, 0, 0.3);
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .boxResult {
        height: 100vh;
        width: 100vw;
        background-color: rgba(0, 0, 0, 0.3);
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    #PICreward {
        position: absolute;
        margin-top: 100px;
    }
    
    .rewardGroup {
        position: absolute;
        padding-top: 80px;
    }
    
    .single {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
        .centerCard {
            margin-top: 130px;
        }
        #centerCardImg {
            width: 100%;
        }
        .rollArea {
            top: 430px;
        }
        #wheelTable {
            width: 70%;
        }
        .timeTips {
            top: 230px;
        }
    }
</style>
