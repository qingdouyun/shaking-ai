import React, {memo, useEffect, useState} from 'react';
import Styles from './index.module.less';
import configs from '@/constants/configs';

const index = (props: any) => {

  const content = `<p>为了更好地为您提供服务，请您仔细阅读本“用户服务协议及隐私保护政策”（以下简称 “本协议”）。在您开始使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务之前，请您务必认真阅读并充分理解本协议，特别是涉及免除或者限制责任的条款，权利许可和信息使用的条款，同意开通和使用特殊单项服务的条款，法律适用和争议解决条款等。其中，免除或者限制责任条款等重要内容将以加粗形式提示您注意，您应重点阅读。如您未满18周岁，请您在法定监护人陪同下仔细阅读并充分理解本协议，并征得法定监护人的同意后下载本软件。</p><p> </p><p>除非您完全接受本协议的全部内容，否则您无权下载，安装，注册，登录，使用（以下统称 “使用”）“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件，或者通过任何方式使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”服务，或者获得“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件提供的任何服务（本协议中统称“使用”）。若您使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务，则视为您已充分理解本协议并承诺作为本协议的一方当事人接受协议的约束。</p><p> </p><p>1，适用范围</p><p> </p><p>1.1本协议是您与“ <span style="font-family: 宋体;">${configs.SiteName}</span>”开发者（以下简称“我们”）之间就您下载，安装，注册，登录，使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件，并获得“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件提供的相关服务所订立的协议。我们有权依“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务或运营的需要单方决定，安排或指定其关联我们，控制我们，继承我们或我们认可的第三方我们继续运营“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件。并且，就本协议项下涉及的某些服务，可能会由我们的关联我们，控制我们，继承我们或我们认可的第三方我们向您提供。您知晓并同意接受相关服务内容，即视为接受相关权利义务关系亦受本协议约束。</p><p> </p><p>1.2“用户”指所有直接或间接获取和使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的使用者，包括自然人，法人及其他组织等。在本协议中称为“用户”或称“您”。</p><p> </p><p>1.3“ <span style="font-family: 宋体;">${configs.SiteName}</span>”指由我们合法拥有并运营的，标注名称为“ <span style="font-family: 宋体;">${configs.SiteName}</span>”的客户端应用程序我们有权对应用程序及名称单方变更（包括但不限于更名，新增等）。</p><p> </p><p>1.4本协议内容同时包括我们已经发布及后续可能不断发布的关于“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的相关协议，规则等内容。前述内容一经正式发布，并以适当的方式送达用户（网站公布，系统通知等），即为本协议不可分割的组成部分，您应同样遵守。</p><p> </p><p>2，使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务</p><p> </p><p>2.1您使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务，可以通过预装，我们已授权的第三方下载等方式获取“ <span style="font-family: 宋体;">${configs.SiteName}</span>”客户端应用程序。若您并非从我们或经我们授权的第三方获取本软件的，我们无法保证非官方版本的“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件能够正常使用，您因此遭受的损失与我们无关。</p><p> </p><p>2.2我们可能为不同的终端设备开发了不同的应用程序软件版本，您应当根据实际设备状况获取，下载，安装合适的版本。</p><p> </p><p>2.3您可根据自行需要使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务或更新“ <span style="font-family: 宋体;">${configs.SiteName}</span>”版本，如您不再需要使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务可自行卸载。</p><p> </p><p>2.4为更好的提升用户体验及服务，我们将不定期提供软件更新或改变（包括但不限于软件修改，升级，功能强化，开发新服务，软件替换等）。为保证“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务安全，提升用户服务，本软件及相关服务更新或部分服务内容更新后，在可能的情况下，我们将以包括但不限于系统提示，公告，站内信等方式提示用户，用户有权选择接受更新版本或服务，如用户不接受，部分功能将受到限制或不能继续使用。</p><p> </p><p>2.5除非得到我们明示事先书面授权，您不得以任何形式对“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务进行包括但不限于改编，复制，传播，镜像或交易等未经授权的访问或使用。</p><p> </p><p>2.6您理解，您使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务需自行准备与软件及相关服务有关的终端设备（如电脑，手机等装置），一旦您在其终端设备中打开“ <span style="font-family: 宋体;">${configs.SiteName}</span>“软件，即视为您使用” <span style="font-family: 宋体;">${configs.SiteName}</span>“软件及相关服务。为充分实现” <span style="font-family: 宋体;">${configs.SiteName}</span>“的全部功能，您可能需要将其终端设备联网，您理解由您承担所需要的费用（如流量费，上网费等）。</p><p> </p><p>2.7我们许可您个人的，不可转让的，非独占地和非商业的合法使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的权利。本协议未明示授权的其他一切权利仍由我们保留，您在行使该些权利时须另行获得我们的书面许可，同时我们如未行使前述任何权利，并不构成对该权利的放弃。</p><p> </p><p>2.8您需要注册才可开始使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务。同时，您也理解，为使您更好地使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务，保障您的账号安全，某些功能和/或某些单项服务项目，如充值服务等，要求您按照国家相关法律法规的规定，可能需要提供真实的身份信息实名注册并登陆后方可使用。</p><p> </p><p>2.9如您发现“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及网站内存在任何侵犯您权利的内容，请立即通过<span style="font-family: 宋体;">客服</span>通知我们，提供您有相关权利的初步证据，我们将会根据当地法律规定及时处理您的投诉。</p><p> </p><p>3，关于“账号”</p><p> </p><p>3.1“ <span style="font-family: 宋体;">${configs.SiteName}</span>”为用户提供了注册通道，用户有权选择合法的字符组合作为自己的账号，并自行设置符合安全要求的密码。用户设置的账号，密码是用户用以登录并以注册用户身份使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的凭证。</p><p> </p><p>3.2您理解并承诺，您所设置的账号不得违反国家法律法规及我们的相关规则，您的账号名称，头像和简介等注册信息及其他个人信息中不得出现违法和不良信息，未经他人许可不得用他人名义（包括但不限于冒用他人姓名，名称，字号，头像等足以让人引起混淆的方式）开设账号，不得恶意注册“ <span style="font-family: 宋体;">${configs.SiteName}</span>”账号（包括但不限于频繁注册，批量注册账号等行为）。您在账号注册及使用过程中需遵守相关法律法规，不得实施任何侵害国家利益，损害其他公民合法权益，有害社会道德风尚的行为。我们有权对您提交的注册信息进行审核…</p><p> </p><p>3.3您在“ <span style="font-family: 宋体;">${configs.SiteName}</span>”中的注册账号所有权及有关权益均归我们所有，您完成注册手续后仅享有该账号的使用权。您的账号仅限于您本人使用，未经我们书面同意，禁止以任何形式赠与，借用，出租，转让，售卖或以其他方式许可他人使用该账号。如果我们发现或者有合理理由认为使用者并非账号初始注册人，我们有权在未通知您的情况下，暂停或终止向该注册账号提供服务，并有权注销该账号，而无需向注册该账号的用户承担法律责任。</p><p> </p><p>3.4您有责任维护个人账号，密码的安全性与保密性，并对您以注册账号名义所从事的活动承担全部法律责任，包括但不限于您在“ <span style="font-family: 宋体;">${configs.SiteName}</span>”上进行的任何数据修改，言论发表，款项支付等操作行为。您应高度重视对账号与密码的保密，在任何情况下不向他人透露账号及密码。若发现他人未经许可使用您的账号或发生其他任何安全漏洞问题时，您应当立即通知我们。</p><p> </p><p>3.5您的账号在丢失或遗忘密码后，可遵照我们的申诉途径及时申诉请求找回账号或密码。您理解并认可，我们的密码找回机制仅需要识别申诉单上所填资料与系统记录资料具有一致性，而无法识别申诉人是否系真正账号有权使用者。我们特别提醒您应妥善保管您的账号和密码。当您使用完毕后，应安全退出。因您保管不当可能导致遭受盗号或密码丢失，责任由您自行承担。</p><p> </p><p>3.6在注册，使用和管理账号时，您应保证注册账号时填写的身份信息的真实性，请您在注册，管理账号时使用真实，准确，合法，有效的相关身份证明材料及必要信息（包括您的姓名及电子邮件地址，联系电话，联系地址等）。依照国家法律法规的规定，为使用本软件及服务，您需要填写真实的身份信息，请您按照相关法律规定完成实名认证，并注意及时更新上述相关信息。若您提交的材料或提供的信息不准确，不真实，不合法或者我们有理由怀疑为错误，不实或不合法的资料，则我们有权拒绝为您提供相关服务或您可能无法使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务或在使用过程中部分功能受到限制。</p><p> </p><p>3.7除自行注册“ <span style="font-family: 宋体;">${configs.SiteName}</span>” 账号外，您也可选择通过授权使用您合法拥有的包括但不限于我们和/或其关联我们其他软件用户账号，以及实名注册的第三方软件或平台用户账号注册并登录使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务，但第三方软件或平台对此有限制或禁止的除外。当您以前述已有账号登录使用的，应保证相应账号已进行实名注册登记，并同意适用本协议中的相关约定。</p><p> </p><p>3.8您理解并同意，除您登录，使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务外，您还可以用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”账号登录使用我们及其关联我们或其他合作方提供的其他软件，服务。您以“ <span style="font-family: 宋体;">${configs.SiteName}</span>”账号登陆并使用前述服务的，同样应受其他软件，服务提供方的“用户协议”及其他协议条款约束。</p><p> </p><p>3.9为提高您内容曝光量及发布效率，您同意您在本软件的账号及相应账号说产生的游戏内容全部内容均授权本我们发布至我们及/或关联我们运营的系列客户端软件及网站，微信公众号上。您通过已注册或者已同步的账号登录我们及/或关联我们运营的系列客户端软件产品及网站时（如有），应遵守该软件产品及网站自身的“用户协议”及其他协议条款的规定。</p><p> </p><p>3.10因其他人恶意攻击或您自身原因或其他不可抗因素而导致账号被盗，丢失，均由您本人承担责任，我们不承担任何责任。</p><p> </p><p>3.11您理解，为了充分使用账号资源，如您在注册后未及时进行初次登录使用或连续超过二个月未登录闲置账号的使用等情形，我们有权随时收回您账号。</p><p> </p><p>如图4所示，用户个人信息保护</p><p> </p><p>4.1我们与用户一同致力于用户个人信息（即能够独立或与其他信息结合后识别用户身份的信息）的保护，保护用户个人信息是我们的基本原则之一。未经用户同意，我们不会向我们以外的任何我们，组织和个人披露您的个人信息，但法律法规及本协议另有规定的除外。</p><p> </p><p>4.2我们将运用与“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务相匹配的安全技术及其他安全措施并建立完善的管理制度来保护您的个人信息。</p><p> </p><p>4.3您可随时浏览，修改自己提交的个人身份信息，您理解并同意出于安全性和身份识别（如账号或密码找回申诉服务等）的考虑，您可能无法修改注册时提供的初始注册信息及其他验证信息。</p><p> </p><p>4.4我们不会将您的个人信息转移或披露给第三方，除非：</p><p> </p><p>（ 1）事先获得您的明确授权;</p><p> </p><p>（ 2）您分享的信息;</p><p> </p><p>（ 3）根据有关的法律法规规定或按照司法，行政等国家机关的要求;</p><p> </p><p>（ 4）出于实现我们向您提供服务所必需的目的，向我们的关联方，合作伙伴分享提供服务所必需的个人信息，我们及其关联方，合作伙伴无权将共享的个人信息用于任何其他用途;</p><p> </p><p>（ 5）以维护公共利益或学术研究为目的;</p><p> </p><p>（ 6）为维护“ <span style="font-family: 宋体;">${configs.SiteName}</span>”其他用户，我们及其关联我们，控制我们，继承我们的合法权益，例如查找，预防，处理欺诈或安全方面的问题;</p><p> </p><p>（ 7）我们为维护合法权益而向用户提起诉讼或仲裁;</p><p> </p><p>（ 8）在涉及合并，分立，收购，资产转让或类似的交易时，如涉及到个人信息转让，我们会要求新的持有您的个人信息的我们，组织继续受本隐私政策的约束，否则，我们有权要求该我们，组织重新取得您的授权同意;</p><p> </p><p>（ 9）符合本协议相关条款的规定。</p><p> </p><p>4.5请您注意勿在使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务中透露自己的各类财产账户，银行卡，信用卡，第三方支付账户及对应密码等重要资料，否则由此带来的任何损失由您自行承担。您不应将个人信息通过“ <span style="font-family: 宋体;">${configs.SiteName}</span>”上发表，上传或扩散。</p><p> </p><p>5，用户行为规范</p><p> </p><p>5.1用户行为要求</p><p> </p><p>您应对其使用本产品及相关服务的行为负责，除非法律允许或者经我们事先书面许可，您使用 “ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务不得具有下列行为：</p><p> </p><p>5.1.1使用未经我们授权或许可的任何插件，外挂，系统或第三方工具对“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的正常运行进行干扰，破坏，修改或施加其他影响。</p><p> </p><p>5.1.2利用或针对“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务进行任何危害计算机网络安全的行为，包括但不限于：</p><p> </p><p>（ 1）非法侵入他人网络，干扰他人网络正常功能，窃取网络数据等危害网络安全的活动;</p><p> </p><p>（ 2）提供专门用于从事侵入网络，干扰网络正常功能及防护措施，窃取网络数据等危害网络安全活动的程序，工具;</p><p> </p><p>（ 3）明知他人从事危害网络安全的活动的，为其提供技术支持，广告推广，支付结算等帮助</p><p> </p><p>（ 4）使用未经许可的数据或进入未经许可的服务器/账号;</p><p> </p><p>（ 5）未经允许进入公众计算机网络或者他人计算机系统并删除，修改，增加存储信息;</p><p> </p><p>（ 6）未经许可，企图探查，扫描，测试“ <span style="font-family: 宋体;">${configs.SiteName}</span>”系统或网络的弱点或其它实施破坏网络安全的行为;</p><p> </p><p>（ 7）企图干涉，破坏“ <span style="font-family: 宋体;">${configs.SiteName}</span>”系统或网站的正常运行，故意传播恶意程序或病毒以及其他破坏干扰正常网络信息服务的行为;</p><p> </p><p>（ 8）伪造TCP / IP数据包名称或部分名称。</p><p> </p><p>5.1.3对“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件进行反向工程，反向汇编，编译或者以其他方式尝试发现本软件的源代码。</p><p> </p><p>5.1.4恶意注册“ <span style="font-family: 宋体;">${configs.SiteName}</span>” 账号，包括但不限于频繁，批量注册账号。</p><p> </p><p>5.1.5违反法律法规，本协议，我们的相关规则及侵犯他人合法权益的其他行为。</p><p> </p><p>在任何情况下，如果我们有理由认为您的任何行为违反或可能违反上述约定的，我们可独立进行判断并处理，且在任何时候有权在进行任何事先通知的情况下终止向用户提供服务，并追究相关责任。</p><p> </p><p>5.2信息内容规范</p><p> </p><p>5.2.1用户按规定完成实名认证后，可以以注册账号或“ <span style="font-family: 宋体;">${configs.SiteName}</span>”合作平台账号登录“ <span style="font-family: 宋体;">${configs.SiteName}</span>”发布内容，跟帖评论等。</p><p> </p><p>5.2.2我们致力使跟帖评论成为文明，理性，友善，高质量的意见交流。在推动跟帖评论业务发展的同时，不断加强相应的信息安全管理能力，完善跟帖评论自律，切实履行社会责任，遵守国家法律法规，尊重公民合法权益，尊重社会公序良俗。</p><p> </p><p>5.2.3用户制作，评论，发布，传播的内容（包括但不限于上传至“ <span style="font-family: 宋体;">${configs.SiteName}</span>”平台的未公开的私密视频）应自觉遵守法律法规，社会主义制度，国家利益，公民合法权益，社会公共秩序，道德风尚和信息真实性等“七条底线”要求，否则我们将立即采取相应处理措施用户不得发表下列信息：</p><p> </p><p>（ 1）反对宪法确定的基本原则的;</p><p> </p><p>（ 2）危害国家安全，泄露国家秘密;</p><p> </p><p>（ 3）颠覆国家政权，推翻社会主义制度，煽动分裂国家，破坏国家统一的;</p><p> </p><p>（ 4）损害国家荣誉和利益的;</p><p> </p><p>（ 5）宣传恐怖主义，极端主义的;</p><p> </p><p>（ 6）宣扬民族仇恨，民族歧视，破坏民族团结的;</p><p> </p><p>（ 7）煽动地域歧视，地域仇恨的;</p><p> </p><p>（ 8）破坏国家宗教政策，宣扬邪教和迷信的;</p><p> </p><p>（ 9）编造，散布谣言，虚假信息，扰乱社会秩序，破坏社会稳定的;</p><p> </p><p>（ 10）散布，传播淫秽，色情，赌博，暴力，凶杀，恐怖或者教唆犯罪的;</p><p> </p><p>（ 11）危害网络安全，利用网络从事危害国家安全，荣誉和利益的;</p><p> </p><p>（ 12）侮辱或者诽谤他人，侵害他人合法权益的;</p><p> </p><p>（ 13）对他人进行暴力恐吓，威胁，实施人肉搜索的;</p><p> </p><p>（ 14）涉及他人隐私，个人信息或资料的;</p><p> </p><p>（ 15）散布污言秽语，损害社会公序良俗的;</p><p> </p><p>（ 16）侵犯他人隐私权，名誉权，肖像权，知识产权等合法权益内容的;</p><p> </p><p>（ 17）散布商业广告，或类似的商业招揽信息，过度营销信息及垃圾信息;</p><p> </p><p>（ 18）使用本网站常用语言文字以外的其他语言文字评论的;</p><p> </p><p>（ 19）与所评论的信息毫无关系的;</p><p> </p><p>（ 20）所发表的信息毫无意义的，或刻意使用字符组合以逃避技术审核的;</p><p> </p><p>（ 21）侵害未成年人合法权益或者损害未成年人身心健康的;</p><p> </p><p>（ 22）未获他人允许，偷拍，偷录他人，侵害他人合法权利的;</p><p> </p><p>（ 23）包含恐怖，暴力血腥，高危险性，危害表演者自身或他人身心健康内容的，包括但不限于以下情形：</p><p> </p><p>任何暴力和 /或自残行为内容;</p><p> </p><p>任何威胁生命健康，利用刀具等危险器械表演的危及自身或他人人身及/或财产权利的内容;</p><p> </p><p>怂恿，诱导他人参与可能会造成人身伤害或导致死亡的危险或违法活动的内容。</p><p> </p><p>（ 24）其他违反法律法规，政策及公序良俗，干扰“ <span style="font-family: 宋体;">${configs.SiteName}</span>”正常运营或侵犯其他用户或第三方合法权益内容的其他信息。</p><p> </p><p>6<span style="font-family: 宋体;">、</span>“ <span style="font-family: 宋体;">${configs.SiteName}</span>”数据使用规范</p><p> </p><p>6.1未经我们书面许可，用户不得自行或授权，允许，协助任何第三人对本协议“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务中信息内容进行如下行为：</p><p> </p><p>（ 1）复制，读取，采用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的信息内容，用于包括但不限于宣传，增加阅读量，浏览量等商业用途;</p><p> </p><p>（ 2）擅自编辑，整理，编排“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的信息内容后在<span style="font-family: 宋体;">${configs.SiteName}</span>软件及相关服务的源页面以外的渠道进行展示;</p><p> </p><p>（ 3）采用包括但不限于特殊标识，特殊代码等任何形式的识别方法，自行或协助第三人对“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的信息或内容产生流量，阅读量引导，转移，劫持等不利影响;</p><p> </p><p>（ 4）其他非法获取“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的信息内容的行为。</p><p> </p><p>6.2经我们书面许可后，用户对“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的信息和内容的分享，转发等行为，还应符合以下规范：</p><p> </p><p>（ 1）对抓取，统计，获得的相关留存率，付费，注册量等相关数据，未经我们事先书面同意，不得将上述数据以任何方式公示，提供，泄露给任何第三人;</p><p> </p><p>（ 2）不得对“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务进行任何形式的任何改动，包括但不限于“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的充值入口，也不得对“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的源页面的展示进行任何形式的遮挡，插入，弹窗等妨碍;</p><p> </p><p>（ 3）应当采取安全，有效，严密的措施，防止“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的信息内容被第三方通过包括但不限于“蜘蛛”（spider）程序等任何形式进行非法获取;</p><p> </p><p>（ 4）不得把相关数据内容用于我们书面许可范围之外的目的，进行任何形式的销售和商业使用，或向第三方泄露，提供或允许第三方为任何方式的使用。</p><p> </p><p>（ 5）用户向任何第三人分享，转发，复制“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务信息内容的行为，还应遵守我们为此制定的其他规范和标准。</p><p> </p><p>7，违约处理</p><p> </p><p>7.1针对您违反本协议或其他服务条款的行为，我们有权独立判断并视情况采取预先警示，短期禁止发言，限制账号部分或者全部功能直至永久关闭账号等措施。我们有权公告处理结果有权根据实际情况决定是否恢复使用。对涉嫌违反法律法规，涉嫌违法犯罪的行为将保存有关记录，并依法向有关主管部门报告，配合有关主管部门调查。对已删除内容我们有权不予返还。</p><p> </p><p>7.2因您违反本协议或其他服务条款规定，引起第三方投诉或诉讼索赔的，您应当自行承担全部法律责任。因您的违法或违约行为导致我们及其关联我们，控制我们，继承我们向任何第三方赔偿或遭受国家机关处罚的，您还应足额赔偿我们及其关联我们，控制我们，继承我们因此遭受的全部损失。</p><p> </p><p>7.3我们尊重并保护法人，公民的知识产权，名誉权，姓名权，隐私权等合法权益。您保证，在使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务时上传的文字，视频，音频等不侵犯任何第三方的知识产权，名誉权，姓名权，隐私权等权利及合法权益。否则，我们有权在收到权利方或者相关方通知的情况下移除该涉嫌侵权内容。针对第三方提出的全部权利主张，您应自行承担全部法律责任;如因您的侵权行为导致我们及其关联我们，控制我们，继承我们遭受损失的（包括但不限于经济，商誉等损失），您还应足额赔偿我们及其关联我们，控制我们，继承我们遭受的全部损失。</p><p> </p><p>8，服务的变更，中断和终止</p><p> </p><p>8.1您理解并同意，我们提供的“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务是按照现状技术和条件所能达到的现状提供的。我们会尽最大努力向您提供服务，确保服务的连贯性和安全性。您理解，我们不能随时预见和防范法律，技术以及其他风险，包括但不限于不可抗力，病毒，木马，黑客攻击，系统不稳定，第三方服务瑕疵及其他各种安全问题的侵扰等原因可能导致的服务中断，数据丢失以及其他的损失和风险。</p><p> </p><p>8.2您理解并同意，我们为了服务整体运营的需要，有权在公告通知后修改，中断，中止或终止“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务，而无须向用户负责或承担任何赔偿责任。</p><p> </p><p>9，广告</p><p> </p><p>9.1您使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务过程中，充分理解并同意：本服务中可能包括我们针对个人或企业推出的信息，广告发布或品牌推广服务，您同意我们有权在<span style="font-family: 宋体;">“${configs.SiteName}”</span>软件及相关服务中展示” <span style="font-family: 宋体;">${configs.SiteName}</span>“软件及相关服务相关和/或第三方供应商，合作伙伴的商业广告，推广或信息（包括商业或非商业信息）。</p><p> </p><p>9.2如您不同意该广告，您有权选择关闭该广告信息;“ <span style="font-family: 宋体;">${configs.SiteName}</span>”推送通知服务的，您有权自行关闭该服务或可停止使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务。</p><p> </p><p>9.3我们依照法律规定履行广告及推广相关义务，您应当自行判断该广告或推广信息的真实性和可靠性并为自己的判断行为负责。除法律法规明确规定外，您因该广告或推广信息进行的购买，交易或因前述内容遭受的损害或损失，用户应自行承担，我们不予承担责任。</p><p> </p><p>10，知识产权</p><p> </p><p>10.1我们在“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务中提供的内容（包括但不限于软件，技术，程序，网页，文字，图片，图像，音频，视频，图表，版面设计，电子文档等）的知识产权属于我们所有。我们提供本服务时所依托的软件的著作权，专利权及其他知识产权均归我们所有。未经我们许可，任何人不得擅自使用（包括但不限于通过任何机器人，蜘蛛等程序或设备监视，复制，传播，展示，镜像，上载，下载“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务中的内容）。</p><p> </p><p>10.2您理解并同意，在使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务时发布上传的文字，图片，视频，音频等均由您原创或已获合法授权（含转授权）。您通过<span style="font-family: 宋体;">“${configs.SiteName}”</span>上传，发布的任何内容的知识产权归属您或原始著作权人所有。</p><p> </p><p>10.3您知悉，理解并同意您通过“ <span style="font-family: 宋体;">${configs.SiteName}</span>”发布上传的内容（包括但不限文字，图片，视频，音频，视频及/或音频中包括的音乐作品，声音，对话等），授予我们及其关联我们，控制我们，继承我们一项全球范围内，免费，非独家，可再许可（通过多层次）的权利（包括但不限于复制权，翻译权，汇编权，信息网络传播权，改编权，制作衍生品等），使用范围包括但不限于在当前或其他网站，应用程序，产品或终端设备等。您在此确认并同意，上述权利的授予包括在与内容，“ <span style="font-family: 宋体;">${configs.SiteName}</span>“，我们和/或我们品牌有关的任何推广，广告，营销和/或宣传中使用和以其他方式开发内容（全部或部分）的权利和许可。为避免疑惑，您同意，上述权利的授予包括使用，复制和展示您拥有或被许可使用并植入内容中的个人形象，肖像，姓名，商标，服务标志，名称，标识和我们标记（如有）以及任何其他品牌，营销或推广资产的权利和许可。</p><p> </p><p>10.4您确认并同意授权我们以我们自己的名义或委托专业第三方对侵犯您上传发布的享有知识产权的内容进行代维权，维权形式包括但不限于：监测侵权行为，发送维权函，提起诉讼或仲裁，调解，和解等，我们有权对维权事宜做出决策并独立实施。</p><p> </p><p>10.5我们为“ <span style="font-family: 宋体;">${configs.SiteName}</span>”开发，运营提供技术支持，并对“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务的开发和运营等过程中产生的所有数据和信息等享有全部权利。</p><p> </p><p>10.6请您在任何情况下都不要私自使用我们的包括但不限于“ <span style="font-family: 宋体;">${configs.SiteName}</span>”等在内的任何商标，服务标记，商号，域名，网站名称或其他显着品牌特征等（以下统称为“标识”）。未经我们事先书面同意，您不得将本条款前述标识以单独或结合任何方式展示，使用或申请注册商标，进行域名注册等，也不得实施向他人明示或暗示有权展示，使用，或其他有权处理该些标识的行为。由于您违反本协议使用我们上述商标，标识等给我们或他人造成损失的，由您承担全部法律责任。</p><p> </p><p>11，隐私政策</p><p> </p><p>“ <span style="font-family: 宋体;">${configs.SiteName}</span>”非常重视用户信息的保护，在使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务前，我们可能会收集和使用您的相关信息，请您务必仔细阅读本隐私政策。您一旦选择使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务，即意味着同意我们按照本隐私政策收集，使用（含商业合作使用），储存和分享您的相关信息。</p><p> </p><p>11.1信息可能收集的范围与方式</p><p> </p><p>11.1.1我们提供服务时，可能会收集，储存和使用下列与您有关的信息。如果您不提供相关信息，无法可能注册成为<span style="font-family: 宋体;">${configs.SiteName}</span>的用户或无法享受我们提供的某些服务，或者无法达到相关服务拟达到的效果。</p><p> </p><p>11.1.2您理解并同意当您使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务时填写和/或提供的信息，可能包括姓名，性别，联系方式等单独或者结合识别用户身份的信息。您可以选择不提供某一或某些信息，但是这样可能使您无法使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”的相关特殊服务。</p><p> </p><p>11.2因您使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务获取的信息。</p><p> </p><p>11<span style="font-family: 宋体;">.</span>2<span style="font-family: 宋体;">.</span>1日志信息</p><p> </p><p>（ 1）当您使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”产品或服务时，为使您获得更轻松的访问体验，我们可能会使用各种技术来收集和存储信息，在此过程中可能会向您的设备发送一个或多个的Cookie或匿名标识符。这么做是为了了解您的使用习惯，使您省去重复输入注册信息等步骤，或帮助判断您的账户安全。</p><p> </p><p>（ 2）当您使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”产品或服务时，我们可能会利用Cookie和同类技术收取您的信息用于了解您的偏好，进行咨询或数据分析，改善产品服务即用户体验，提高广告效果，及时发现并防范安全风险，为用户和合作伙伴提供更好的服务。</p><p> </p><p>（ 3）我们不会将Cookie用于本隐私政策所述目的之外的任何用途，您可以根据自己的偏好留存或删除Cookie。您可清除软件或网页中保存的所有Cookie，当您手动清除后，您的相关信息即已删除。</p><p> </p><p>11.2.2设备或应用信息，某些移动设备或应用包含唯一应用程序编号。例如您使用的移动设备，浏览器或您使用的用于接入“ <span style="font-family: 宋体;">${configs.SiteName}</span>”服务的其他程序所提供的配置信息，设备版本号和设备识别码，IP地址等。</p><p> </p><p>为了提供更好的服务与改善用户体验，我们可能会记录硬件型号，操作系统版本号，国际移动设备身份码（ IMEI），网络设备硬件地址（MAC）等信息。</p><p> </p><p>11.2.3位置信息，当您开启设备定位功能并使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”基于位置提供的相关服务时，系统会通过GPS或WLAN等方式自动处理有关设备的位置信息，以使得您不需要手动输入自身地理坐标就可获得相关服务。您可以通过关闭定位功能，停止“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件对您的地理位置信息的收集（大多数移动设备将允许您关闭定位服务，具体建议您联系您的移动设备的服务商或生产商）。</p><p> </p><p>11.3信息使用</p><p> </p><p>11.3.1通过使用收集的信息，我们会得以向您提供个性化的服务并改善现有服务。</p><p> </p><p>11.3.2通过使用收集的信息，向您提供更加相关广告以替代普遍投放的广告。</p><p> </p><p>11.3.3可能我们会与<span style="font-family: 宋体;">${configs.SiteName}</span>关联我们，控制我们及其他合作方共同向您提供您所要求的服务或内容。在服务或内容为该项产品 /服务所必须的情况下，您同意我们可与其分享您的个人信息，并且我们将努力确保该第三方在使用您的个人信息时同时遵守本隐私政策以及其他的保密及安全义务。</p><p> </p><p>11.3.4我们不对外公开或向第三方提供用户的个人信息，但下列情况除外：</p><p> </p><p>（ 1）事先获得您的明确授权;</p><p> </p><p>（ 2）您分享的信息;</p><p> </p><p>（ 3）根据有关的法律法规或按照司法，行政等国家机关的要求;</p><p> </p><p>（ 4）出于实现我们对您个人信息合理使用的目的，或为履行本协议相关条款的规定或本隐私政策中的义务和行使我们的权利，向我们的关联方，合作伙伴或代表我们履行某项职能的第三方（例如代表我们发出推送通知的通讯服务商等）分享您的个人信息;</p><p> </p><p>（ 5）以维护公共利益或学术研究为目的;</p><p> </p><p>（ 6）为维护“ <span style="font-family: 宋体;">${configs.SiteName}</span>”其他用户，我们及其关联我们，控制我们，继承我们的合法权益，例如查找，预防，处理欺诈或安全方面的问题;</p><p> </p><p>（ 7）我们为维护合法权益而向用户提起诉讼或仲裁;</p><p> </p><p>（ 8）在涉及合并，分立，收购，资产转让或类似的交易时，如涉及到个人信息转让，我们会要求新的持有您的个人信息的我们，组织继续受本隐私政策的约束，否则，我们有权要求该我们，组织重新取得您的授权同意;</p><p> </p><p>（ 9）符合本用户协议相关条款的规定。</p><p> </p><p>11.4信息安全</p><p> </p><p>11.4.<span style="font-family: 宋体;">1</span>我们非常重视信息安全，我们努力为您的信息安全提供保障，以防止您的信息被不当使用或被未经授权的访问，使用或泄漏。</p><p> </p><p>11.4.2我们将在合理和安全水平内使用各种安全保护措施，例如我们会使用加密技术（例如SSL），匿名化处理等手段保护您的个人信息。</p><p> </p><p>11.4.3我们建立专门的数据安全部门，安全管理制度，采取流程保障您的个人信息安全。采取严格的数据使用和访问制度，采取专门的数据和技术安全审计。对个人信息泄露等安全事件，我们会启动应急预案，阻止安全事件扩大，并以推送，公告等形式告知您。</p><p> </p><p>11.4.4尽管已经采取了上述合理有效措施，并已经遵守了相关法律规定要求的标准，但请您理解，由于技术的限制以及可能存在的各种恶意手段，在互联网行业，即便竭尽所能加强安全措施，也不可能始终保证信息百分之百的安全。您需要了解，您接入我们的服务所用的系统和通讯网络，有可能因我们可控范围外的因素而出现问题。因此，您应采取积极措施保护个人信息的安全，如：定期修改密码，不将自己的账号密码等个人信息透露给他人您知悉：“ <span style="font-family: 宋体;">${configs.SiteName}</span>”提供的个人信息保护措施仅适用于“ <span style="font-family: 宋体;">${configs.SiteName}</span>”平台，一旦您离开“ <span style="font-family: 宋体;">${configs.SiteName}</span>”，浏览或使用其他网站，服务及内容资源，“ <span style="font-family: 宋体;">${configs.SiteName}</span>”即没有能力及义务保护你在“ <span style="font-family: 宋体;">${configs.SiteName}</span>”之外的网站提交的任何个人信息，无论你登录或浏览上述网站是否基于“ <span style="font-family: 宋体;">${configs.SiteName}</span>”的链接或引导。</p><p> </p><p>11.5本隐私政策条款不适用于以下情况：</p><p> </p><p>11.5.1通过“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务而接入的第三方服务（包括任何第三方应用及网站）收集的信息;</p><p> </p><p>11.5.2通过在“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务中进行广告服务的其他我们或机构，组织所收集的信息。</p><p> </p><p>11.6我们的服务可能包括或链接至第三方提供的信息或其他服务（包括网站）。该等第三方服务可能由相关的第三方运营。您使用该等第三方服务（包括您向该等第三方提供的任何个人信息），须受该第三方的服务条款及隐私政策（而非本隐私政策）约束，您需要仔细阅读其条款。请您妥善保护自己的个人信息，仅在必要的情况下向他人提供。本隐私政策仅适用于我们所收集，保存，使用的信息，并不适用于任何第三方提供的服务或第三方的信息使用规则，我们对任何第三方使用由您提供的信息不承担任何责任。</p><p> </p><p>12，免责声明</p><p> </p><p>12.1您理解并同意，“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务可能会受多种因素的影响或干扰，我们不保证（包括但不限于）：</p><p> </p><p>12.1.1我们完全适合用户的使用要求;</p><p> </p><p>12.1.2我们不受干扰，及时，安全，可靠或不出现错误;用户经由我们取得的任何软件，服务或其他材料符合用户的期望;</p><p> </p><p>12.1.3软件中任何错误都将能得到更正。</p><p> </p><p>12.2对于涉及借款或其他涉财产的网络信息，账户密码，广告或推广等信息的，用户请谨慎对待并自行进行判断，基于前述原因您因此遭受的利润，商业信誉，资料损失或其他有形或无形损失，我们不承担任何直接，间接，附带，特别，衍生性或惩罚性的赔偿责任。</p><p> </p><p>12.3用户理解并同意，在使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务过程中，可能遇到不可抗力等因素（不可抗力是指不能预见，不能克服并不能避免的客观事件），包括但不限于政府行为，自然灾害，网络原因，黑客攻击，战争或任何其它类似事件。出现不可抗力情况时，我们将努力在第一时间及时修复，但因不可抗力给用户造成了损失，用户同意我们不承担责任<span style="font-family: 宋体;">。</span></p><p> </p><p>12.4我们依据本协议约定获得处理违法违规内容的权利，该权利不构成我们的义务或承诺，我们不能保证及时发现违法行为或进行相应处理。</p><p> </p><p>12.5用户明确了解并同意：关于本协议服务，我们不提供任何种类的明示或暗示担保或条件，包括但不限于商业适售性，特定用途适用性等。您对本协议软件及相关服务的使用行为必须自行承担相应风险。</p><p> </p><p>12.6用户明确了解并同并，本协议是在保障遵守国家法律法规，维护公序良俗，保护他人合法权益，我们在能力范围内尽最大的努力按照相关法律法规进行判断，但并不保证我们判断完全与司法机关，行政机关的判断一致，如因此产生的后果用户已经理解并同意自行承担。</p><p> </p><p>13，关于单项服务的特殊约定</p><p> </p><p>13.1“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务中包含我们以各种合法方式获取的信息或信息内容链接，同时也包括我们及其关联我们合法运营的其他单项服务。这些服务在“ <span style="font-family: 宋体;">${configs.SiteName}</span>“可能以单独板块形式存在。我们有权不时地增加，减少或改动这些特别板块的设置及服务。</p><p> </p><p>13.2您可以在“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件中开启和使用上述单项服务功能。某些单项服务可能需要您同时接受就该服务特别制订的协议或者其他约束您与该项服务提供者之间的规则。我们将以醒目的方式提供这些协议，规则供您查阅。一旦您开始使用上述服务，则视为您同时受有关单项服务的相关协议，规则的约束。</p><p> </p><p>13.3如您可能在“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件中使用第三方提供的软件及相关服务时，除遵守本协议及本<span style="font-family: 宋体;">${configs.SiteName}</span>相关规则外，还应遵守第三方的协议，相关规则。因第三方软件及相关服务产生的争议，损失或损害，由用户与第三方解决。</p><p> </p><p>14，未成年人使用条款</p><p> </p><p>14.1若用户是未满18周岁的未成年人，应在监护人监护，指导并获得监护人同意情况下阅读本协议和使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务。</p><p> </p><p>14.2我们重视对未成年人个人信息的保护，未成年用户在填写个人信息时，请加强个人保护意识并谨慎对待，请在监护人指导时正确使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务。</p><p> </p><p>14.3未成年用户理解如因您违反法律法规，本协议内容，则您及您的监护人应依法法律规定承担因此而导致的一切后果。</p><p> </p><p>14.4未成年人用户特别提示</p><p> </p><p>14.4.1青少年及使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务应该在其监护人的监督指导下，在合理范围内正确学习使用网络，避免沉迷虚拟的网络空间，养成良好上网习惯。</p><p> </p><p>14.4.2青少年用户必须遵守“全国青少年网络文明公约”：</p><p> </p><p>要善于网上学习，不浏览不良信息;</p><p> </p><p>要诚实友好交流，不侮辱欺诈他人;</p><p> </p><p>要增强自护意识，不随意约会网友;</p><p> </p><p>要维护网络安全，不破坏网络秩序;</p><p> </p><p>要有益身心健康，不沉溺虚拟时空。</p><p> </p><p>14.4.3为更好的保护未成年人隐私权益，我们提醒用户慎重发布包含未成年人的内容，一经发布，即视为用户同意“ <span style="font-family: 宋体;">${configs.SiteName}</span>”展示未成年人的信息，肖像，声音等，且允许“ <span style="font-family: 宋体;">${configs.SiteName}</span>”依据本协议使用，处理该等与未成年人相关的内容。</p><p> </p><p>15，其他</p><p> </p><p>15.1本协议的成立，生效，履行，解释及争议的解决均应适用中华人民共和国大陆地区法律。倘本协议之任何规定因与中华人民共和国大陆地区的法律抵触而无效，则这些条款将尽可能接近本协议原条文意旨重新解析，且本协议其它规定仍应具有完整的效力及效果。</p><p> </p><p>15.2本协议的签署地点为中华人民共和国深圳市南山区，若您与我们发生争议的，双方应尽量友好协商解决，协商不成，您同意应将争议提交至深圳市南山区法院管辖。</p><p> </p><p>15.3我们有权依据国家政策，技术条件，产品功能等变化需要而进行修改本协议，我们会将修改后的协议予以发布。前述内容一经正式发布，并以适当的方式送达用户（网站公布，系统通知等），即为本协议不可分割的组成部分，您应同样遵守。您对修改后的协议有异议的，请立即停止登录，使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务，若您登录或继续使用“ <span style="font-family: 宋体;">${configs.SiteName}</span>”软件及相关服务，视为认可修改后的协议。</p><p> </p><p>15.4本协议中的标题仅为方便及阅读而设，并不影响本协议中任何规定的含义或解释。</p><p> </p><p>15.5您和我们均是独立的主体，在任何情况下本协议不构成我们对用户的任何形式的明示或暗示担保或条件，双方之间亦不构成代理，合伙，合营或雇佣关系。</p><p> </p><p>15.6本协议的版权为我们所有，我们保留一切解释和修改的权利。</p><p> </p>`

  return (
    <div>
      <div
        style={{background: 'var(--body-panel-background-color)'}}
        className={Styles.content}
        dangerouslySetInnerHTML={{
          __html: content
        }}
       />
    </div>
  );
};

export default memo(index);