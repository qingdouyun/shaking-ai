import { createFromIconfontCN } from "@ant-design/icons"

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_107663_ykxzeojmzkl.js', // 在 iconfont.cn 上生成
})
const Icon = (props:any) => {
    const {icon, style} = props;
    return(
        <IconFont type={icon} style={style}/>
    )
}
export default Icon