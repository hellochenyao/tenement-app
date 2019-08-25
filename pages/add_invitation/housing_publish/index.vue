<template>
	<view class="has-hourse-container">
		<view class="roll-wrap">
			<file-upload-component imgUrl1="../../../static/images/add/相机.png" imgUrl2="../../../static/images/add/视频.png" v-if="publishState===0"
			 v-on:setResourceUrl="setResourceUrl"></file-upload-component>
			<view class="detail-publish" v-if="publishState===0">
				<input v-if="!hideTitle" class="detail-title-input" placeholder="加个标题哟" placeholder-class="place-title" v-model="title" />
				<textarea class="detail-content-input detail-text" maxlength="500" placeholder="对房子室友 有什么要求" v-model="content" />
				</view>
            <view class="check-content">
                <view class="invitation-check">
                    <view class="invitation_check_group" @tap="checkedHandler" data-type="1">
                        <image class="list-icon" src="../../../static/images/publish/hourse/定位.png"></image>
                        <check-down :btnValue="currentLoc.name"></check-down>
                    </view>
                    <view class="invitation_check_group" @tap="checkedHandler" data-type="2">
                        <image class="list-icon" src="../../../static/images/publish/hourse/预算.png"></image>
                        <check-down :btnValue="rent > 0?rent+'元':'预算'" :selected="popData.visible"></check-down>
                    </view>
                    <picker class="invitation_check_group" @change="bindLayoutChange" mode="multiSelector"
                            :range="layoutRange">
                        <view class="invitation_check_item" @tap="checkedHandler" data-type="3">
                            <image class="list-icon" src="../../../static/images/publish/hourse/户型.png"></image>
                            <check-down btnValue="户型"></check-down>
                        </view>
                    </picker>
                </view>
                <view class="invitation-check">
                    <picker class="invitation_check_group" @change="bindRentTypeChange" :value="rentTypeIndex"
                            :range="rentType">
                        <view class="invitation_check_item" @tap="checkedHandler" data-type="4">
                            <image class="list-icon" src="../../../static/images/publish/hourse/门禁.png"></image>
                            <check-down btnValue="出租房间"></check-down>
                        </view>
                    </picker>
                    <picker class="invitation_check_group" @change="bindEnterChange" :value="enterIndex"
                            :range="enterNums">
                        <view class="invitation_check_item" @tap="checkedHandler" data-type="5">
                            <image class="list-icon" src="../../../static/images/publish/hourse/行李.png"></image>
                            <check-down btnValue="入住情况"></check-down>
                        </view>
                    </picker>
                    <!-- 	<view class="invitation_check_group" @tap="checkedHandler" data-type="1">
                            <text class="icon-font">&#xe624;</text>
                            <check-down btnValue="入住时间" ></check-down>
                        </view>  -->
                </view>
            </view>
            <pop-up-component v-on:choseVal="popChoose" :popData="popData"></pop-up-component>
        </view>
        <view class="bottom-option-tab">
            <view class="option-button option-title" @tap="updateTitleState">
                <text>{{hideTitle ? '添加标题' : '隐藏标题'}}</text>
            </view>
            <view class="option-button option-publish">
                <button class="publish-btn" :disabled="publishBtnDisabled" :class="publishBtnDisabled?'forbid':'allow'"
                        hover-class="none" plain>发布
                </button>
            </view>
        </view>
    </view>
</template>

<script>
    import fileUploadComponent from "@/components/FileUploadComponent";
    import configUrl from "../../../utils/config_utils.js";
    import publishButton from '../../../components/publish-button/index.vue';
    import CheckDown from "../../../components/CheckDown.vue";
    import getStorage from "../../../utils/getStorage.js";
    import popUpComponent from "../../../components/popUpComponent.vue"
    import {layout, rentType, enterNums} from "../../../utils/config_utils.js";

    export default {
        data() {
            return {
                src: '',
                publishState: 0,
                btnName: "下一步",
                videoSrc: [],
                imgSrc: [],
                title: "",
                content: "",
                popData: {
                    visible: false
                },
                currentLoc: {
                    name: "期望地点",
                    detail: "",
                    latitude: "",
                    longitude: ""
                },
                rent: 0,
                layoutRange: layout,
                rentType: rentType,
                enterNums: enterNums,//入住人数
                rentTypeIndex: 0,
                enterIndex: 0,
                selectedLayOut: "",
                hideTitle: true
            }
        },
        computed: {
            publishBtnDisabled() {
                if (this.publishState === 0 && (this.imgSrc.length > 0 || this.videoSrc.length > 0) && this.title && this.content) {
                    return false;
                }
                if (this.publishState === 1) {

                }
                return true;
            }
        },
        components: {
            fileUploadComponent,
            publishButton,
            popUpComponent,
            CheckDown
        },
        methods: {
            uploadFile() {
                var self = this;
                uni.chooseVideo({
                    count: 1,
                    sourceType: ['camera', 'album'],
                    success: function (res) {
                        console.log(res)
                        self.src = res.tempFilePath;
                        uni.uploadFile({
                            url: configUrl.requestUrl + '/app/invitation-manage/rent/housing-resource/1/upload',
                            filePath: res.tempFilePath,
                            name: 'fileResource',
                            success: (uploadFileRes) => {
                                console.log(uploadFileRes);
                            }
                        });
                    }
                });
            },
            checkedHandler(e) {
                var self = this;
                console.log(e.currentTarget.dataset.type)
                if (e.currentTarget.dataset.type == 1) {
                    uni.chooseLocation({
                        success: function (res) {
                            console.log(self.currentLoc)
                            self.currentLoc.name = res.name;
                            self.currentLoc.detail = res.address;
                            self.currentLoc.latitude = res.latitude;
                            self.currentLoc.longitude = res.longitude;
                        },
                    });
                } else if (e.currentTarget.dataset.type == 2) {
                    this.popOpen();
                }
            },
            clickHandle() {
                if (this.publishState === 0) {
                    this.publishState = 1;
                    this.btnName = "发布";
                } else {
                    this.publishState = 0;
                    this.btnName = "下一步";
                }
            },
            getUserInfo() {
                let userId = getStorage('userId');
                if (!userId) {
                    this.$store.dispatch("loginAction");
                }
            },
            setResourceUrl({type, src}) {
                if (type) {
                    this.videoSrc = src;
                } else {
                    this.imgSrc = src;
                }
            },
            popChoose(res) {
                this.rent = parseInt(res.budget);
                this.popData.visible = res.visible;
            },
            popOpen() {
                this.popData.visible = true
            },
            bindLayoutChange(e) {
                let layoutIndex = e.target.value
                this.selectedLayOut = layout[0][layoutIndex[0]] + layout[1][layoutIndex[1]] + layout[2][layoutIndex[2]];
            },
            bindRentTypeChange(e) {
                console.log(e)
                this.rentTypeIndex = e.target.value;
            },
            bindEnterChange(e) {
                console.log(e)
                this.enterIndex = e.target.value;
            },
            updateTitleState() {
                this.hideTitle = !this.hideTitle;
            }
        }
    }
</script>

<style lang="scss">
    @font-face {
        font-family: 'iconfont';  /* project id 1202574 */
        src: url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.eot');
        src: url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.woff') format('woff'),
        url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1202574_28nyd4y7p8y.svg#iconfont') format('svg');
    }

    .has-hourse-container {
        position: absolute;
        display: flex;
		justify-content: space-between;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .roll-wrap {
        width: 100%;
        height: calc(100% - 80upx);
        display: flex;
        flex-direction: column;
        align-items: center;
        color: $uni-text-color;
    }

    .upload-container {
        width: 90%;
        border-radius: 10upx;
    }

    .detail-choose {
        width: 90%;
        height: 600upx;
        background-color: #FFF;
        border-radius: 10upx;
        margin: 0 auto;
        box-shadow: 1px 1px 5px #d6d6d6;
    }

    .detail-publish {
        width: 90%;
        height: calc(100% - 790upx);
        background-color: #FFF;
        border-radius: 10upx;
        padding-top: 10upx;
        box-shadow: 1px 1px 5px #d6d6d6;
        .detail-title-input {
            width: calc(100% - 30upx);
            font-size: 28upx;
            padding: 15upx 0 20upx 0;
            margin: 0 15upx;
            height: 60upx;
            border: none;
            border-bottom: 1px solid #eaeaea;
        }
        .detail-content-input {
            width: calc(100% - 30upx);
            padding: 15upx 0 20upx 0;
            margin: 0 15upx;
            height: 400upx;
            font-size: 28upx;
            border: none;
        }

    }

    .list-icon {
        width: 50upx;
        height: 50upx;
        text-align: center;
        font-family: iconfont;
        margin-left: 20upx;
        margin-right: 20upx;
    }

    .place-title {
        font-size: 28upx;
        font-weight: 600;
    }

    .check-content {
        width: 90%;
        height: 400upx;
        background-color: #FFF;
        margin: 30upx auto;
        padding: 15upx 6upx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-radius: 10upx;
        box-shadow: 1px 1px 5px #d6d6d6;
        .invitation-check {
            display: flex;
            flex-direction: row;
            .invitation_check_group {
                width: 33%;
                text-align: center;
                .invitation_check_item {
                    width: 100%;
                }
            }
        }
    }

    .bottom-option-tab {
        width: 100%;
        height: 80upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        border: 1px solid #eaeaea;
        background: #FFF;
        .option-button {
            width: 200upx;
            display: flex;
            height: 50upx;
            padding: 3upx 10upx;
            justify-content: center;
            align-items: center;
            border: 1px solid #eaeaea;
            background: #eaeaea;
            font-size: 26upx;
            border-radius: 20px;
            margin: 0 10upx;
            color: #000;
            .allow {
                color: $uni-app-basic-color;
                &:active {
                    opacity: 0.7;
                }
            }
            .forbid {
                color: #CCC;
            }
            .publish-btn {
                background: transparent;
                border: none !important;
                &after {
                    border: none;
                    border-radius: 0
                }
            }
            .publish-btn[disabled] {
                background: transparent !important;
                border-color: none !important;
            }
        }
        .option-publish {
            border: transparent !important;
            background: transparent !important;
        }
    }

    .icon-font {
        width: 50upx;
        font-size: 50 rpx;
        color: $uni-app-basic-color;
        text-align: center;
        font-family: iconfont;
        margin-left: 20upx;
        margin-right: 20upx;
    }
</style>
