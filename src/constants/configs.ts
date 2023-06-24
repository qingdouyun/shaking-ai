import Cookies from 'js-cookie';
const sessionId = Cookies.get('SESSIONID');

export enum SubmitKey {
    Enter = "Enter",
    CtrlEnter = "Ctrl + Enter",
    ShiftEnter = "Shift + Enter",
    AltEnter = "Alt + Enter",
    MetaEnter = "Meta + Enter",
}

export enum Theme {
    Auto = "auto",
    Dark = "dark",
    Light = "light",
}

//注：除了这里的配置需要修改外，还需要修改document.ejs文件的相关内容
const configs = {
    SiteName: '科抖AI',
    APPID: 'h520230427142523126',//应用ID
    APPKEY: 'f84c41bfc3124b9f98c68eb63e5b8c65',//轻抖云AI开放平台申请的秘钥

    GetImageCaptcha: '/common/captcha'+'?captchaId=',
    isEnabledWxLogin: true,
    AppBodyId: 'app-body',
    AiPromptContextClear: '_prompt_context_clear_',//这个不能改动
    AiPromptContextSeparator:'_prompt_context_separator_',//这个不能改动
    defaultAiProductKey: '2c623ba494f4ca38',//平台方万能产品KEY
    aiStopPrint: 'ai_stop_print',

    submitKey: SubmitKey.CtrlEnter as SubmitKey,
    avatar: "1f603",
    fontSize: 14,
    theme: Theme.Auto as Theme,
    tightBorder: false,
    sendPreviewBubble: true,
    sidebarWidth: 300,
    disablePromptHint: false,
    dontShowMaskSplashScreen: false, // dont show splash screen when create chat

    aiModelStoreKey: 'ai-model',
    AIModel: {
        'code': 'OPENAI_GPT35',//模型编码：默认GPT3.5
        'temperature': 1.0,//随机性
        'maxTokens': 2000,
        'presencePenalty': 0.0,//话题新鲜度
    },
    AIImageModel: {
        'code': 'OPENAI_DALLE',//模型编码：默认DallE
    }

};

export default configs;
export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 230;
export const NARROW_SIDEBAR_WIDTH = 100;

export type ChatConfig = typeof configs;

export type ChatConfigStore = ChatConfig & {
  reset: () => void;
  update: (updater: (config: ChatConfig) => void) => void;
};
