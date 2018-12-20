<template>
  <div class="Welcome">
    <div class="bannerImg">
      <img id="yellowC" src="../assets/yellowC.png" alt="" width="97%">
    </div>
    <div class="inputArea">
      <input class="putInfo" type="text" placeholder="会员服务编号(可在创行微服务中查找)" v-model="memberNum" />
      <input class="putInfo" type="text" placeholder="会员姓名1" v-model="memberName" />
    </div>
    <div class="btnArea">
      <img class="loginBtn" src="../assets/loginBtn.png" width="100%" @click="login">
    </div>
    <div class="bottomImg ignore">
      <img src="../assets/bottom.png" alt="" width="100%">
    </div>
    <div class="gameRules" v-if="!rulesReaded">
      <img id="rulesImg" src="../assets/gameRules.png" alt="" width="90%">
      <img id="readBtn" src="../assets/readBtn.png" alt="" width="80%" @click="readed">
    </div>
  </div>
</template>

<script>
  import {
    Toast
  } from 'mand-mobile'
  import Store from '../utils/store'
  import {baseUrl} from '../utils/baseUrl'
  export default {
    name: 'HelloWorld',
    data() {
      return {
        rulesReaded: false,
        memberNum: 'Enactus',
        memberName: ''
      }
    },
    methods: {
      login() {
        let self = this
        this.$ajax({
          method: 'post',
          url: baseUrl+'/member/login',
          data: {
            memberNum: this.memberNum,
            memberName: this.memberName
          }
        }).then(function(response) {
          console.log(response.data)
          if (response.data.code === 200) {
            Store.save('memberNum',self.memberNum)
            Store.save('memberName',self.memberName)
            Toast.succeed(response.data.msg)
            setTimeout(() => {self.$router.push('/roll')}, 1000)
          } else {
            Toast.failed(response.data.msg)
          }
        });
      },
      readed() {
        this.rulesReaded = true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    display: inline-block;
    margin: 0 10px;
  }
  
  a {
    color: #42b983;
  }
  
  #yellowC {
    margin-left: 3%;
  }
  
  .bannerImg {
    margin-top: 50px;
  }
  
  input {
    outline: none;
    -webkit-appearance: none;
    border-radius: 0;
    border: 0px;
    background: transparent;
  }
  
  .inputArea {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 90vw;
  }
  
  .putInfo {
    padding-left: 30px;
    margin-top: 40px;
    width: 80%;
    border: 6px solid #000;
    color: #2b2a2a;
    border-radius: 3vh;
    height: 5vh;
    font-size: 1.0rem;
  }
  
  .btnArea {
    width: 83vw;
    margin-top: 5vh;
    /* height: 10vh; */
  }
  
  .loginBtn {
    width: 100%;
    height: 100%;
  }
  
  .Welcome {
    height: 100vh;
    width: 100vw;
    background-image: url(../assets/background.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: fixed;
    top: 0px;
  }
  
  .bottomImg {
    position: fixed;
    width: 100%;
  }
  
  .ignore {
    bottom: -6px;
  }
  
  .gameRules {
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  #rulesImg {
    margin-top: -100px;
  }
  
  #readBtn {
    position: absolute;
    margin-top: 290px;
  }
  
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    #rulesImg {
      margin-top: -200px;
    }
    #readBtn {
      margin-top: 240px;
    }
  }
</style>
