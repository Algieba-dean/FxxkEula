import type { ClausePattern } from './types';

// 戏谑风格的条款匹配规则库
export const clausePatterns: ClausePattern[] = [
  // 隐私相关
  {
    id: 'privacy-collect-all',
    patterns: [
      /收集.*?(个人信息|用户信息|数据).*?(包括但不限于|包含|如)/i,
      /我们.*?收集.*?(您的|用户的).*?信息/i,
      /自动收集.*?(设备|位置|浏览)/i,
    ],
    category: 'privacy',
    severity: 'high',
    title: '信息收集大礼包',
    humanTranslation: '翻译：我们会把你的各种信息都收走，至于收多少、怎么用，我们说了算。',
    roastComment: '🎣 恭喜！您已被全方位监控，连您早餐吃了什么都可能被记录',
    scoreImpact: -15,
  },
  {
    id: 'privacy-third-party',
    patterns: [
      /(共享|提供|披露).*?(第三方|合作伙伴|关联公司)/i,
      /第三方.*?(访问|使用|获取).*?数据/i,
      /与.*?(合作方|合作伙伴).*?共享/i,
    ],
    category: 'privacy',
    severity: 'high',
    title: '信息批发商',
    humanTranslation: '翻译：你的信息不只我们用，我们的"朋友们"也想看看。',
    roastComment: '🏪 您的隐私正在被批发，买一送N，童叟无欺',
    scoreImpact: -20,
  },
  {
    id: 'privacy-indefinite',
    patterns: [
      /(保留|保存|存储).*?(权利|数据|信息).*?(直到|除非|永久)/i,
      /注销.*?后.*?(仍然|继续|保留)/i,
      /无限期.*?(保存|保留)/i,
    ],
    category: 'privacy',
    severity: 'critical',
    title: '数据永生术',
    humanTranslation: '翻译：就算你跑了，你的数据还是我的。删号？不存在的。',
    roastComment: '🧟 您的数据将获得永生，比您的账号活得还久',
    scoreImpact: -25,
  },

  // 免责条款
  {
    id: 'liability-no-guarantee',
    patterns: [
      /不(保证|承诺|担保).*?(准确|完整|及时|可靠)/i,
      /(按现状|原样).*?提供/i,
      /不对.*?(损失|损害).*?负责/i,
    ],
    category: 'liability',
    severity: 'medium',
    title: '薛定谔的服务',
    humanTranslation: '翻译：服务好不好用？随缘吧。出了问题别找我。',
    roastComment: '🎲 服务质量全靠运气，今天能用算您赚到',
    scoreImpact: -10,
  },
  {
    id: 'liability-force-majeure',
    patterns: [
      /不可抗力.*?(免责|不承担|不负责)/i,
      /(系统故障|网络问题|技术原因).*?造成.*?损失/i,
      /因.*?(第三方|外部).*?原因/i,
    ],
    category: 'liability',
    severity: 'high',
    title: '万能免责牌',
    humanTranslation: '翻译：出事了？那肯定不是我们的锅，是老天爷/黑客/隔壁老王的问题。',
    roastComment: '🃏 免责理由千千万，反正不是我们的错',
    scoreImpact: -15,
  },

  // 权利剥夺
  {
    id: 'rights-unilateral',
    patterns: [
      /(有权|可以|保留.*?权利).*?(单方面|随时|自行)/i,
      /无需.*?(通知|同意|说明).*?(终止|暂停|删除)/i,
      /自行决定.*?(是否|何时)/i,
    ],
    category: 'rights',
    severity: 'critical',
    title: '霸道总裁条款',
    humanTranslation: '翻译：我想怎样就怎样，不用跟你商量，有意见？憋着。',
    roastComment: '👑 您在这里没有人权，只有被支配的份',
    scoreImpact: -25,
  },
  {
    id: 'rights-waiver',
    patterns: [
      /(放弃|免除).*?(追究|索赔|起诉)/i,
      /不得.*?(要求|主张|追究)/i,
      /同意.*?放弃/i,
    ],
    category: 'rights',
    severity: 'critical',
    title: '签字画押',
    humanTranslation: '翻译：点了同意就等于签了卖身契，以后出事别想告我。',
    roastComment: '📜 恭喜您自愿放弃了宪法赋予的部分权利',
    scoreImpact: -30,
  },

  // 付费相关
  {
    id: 'payment-auto-renew',
    patterns: [
      /自动(续费|续订|扣款)/i,
      /(到期|期满).*?自动.*?(续)/i,
      /默认.*?(开通|续费)/i,
    ],
    category: 'payment',
    severity: 'high',
    title: '无限循环扣款机',
    humanTranslation: '翻译：只要你不主动关，我们就一直扣钱，扣到天荒地老。',
    roastComment: '🔄 您的钱包已设置为自动失血模式',
    scoreImpact: -20,
  },
  {
    id: 'payment-no-refund',
    patterns: [
      /(不予|不支持|不接受).*?退(款|费)/i,
      /一经.*?(购买|支付).*?不退/i,
      /虚拟.*?(商品|服务).*?不退/i,
    ],
    category: 'payment',
    severity: 'high',
    title: '貔貅条款',
    humanTranslation: '翻译：钱进了我口袋就是我的了，别想拿回去。',
    roastComment: '🐉 您的钱已进入黑洞，连光都逃不出来',
    scoreImpact: -20,
  },
  {
    id: 'payment-price-change',
    patterns: [
      /(调整|变更|修改).*?价格/i,
      /价格.*?(可能|随时).*?变化/i,
      /保留.*?定价.*?权/i,
    ],
    category: 'payment',
    severity: 'medium',
    title: '价格过山车',
    humanTranslation: '翻译：今天这个价，明天什么价，看我心情。',
    roastComment: '🎢 价格随心情波动，建议购买前先看黄历',
    scoreImpact: -10,
  },

  // 单方终止
  {
    id: 'termination-anytime',
    patterns: [
      /(终止|暂停|关闭).*?(服务|账号).*?(随时|任何时候)/i,
      /有权.*?(立即|随时).*?(终止|封禁)/i,
      /无需.*?(理由|原因).*?(终止|删除)/i,
    ],
    category: 'termination',
    severity: 'critical',
    title: '随时踢人条款',
    humanTranslation: '翻译：我高兴就让你用，不高兴就把你踢出去，不需要理由。',
    roastComment: '🚪 您随时可能被请出去，连再见都来不及说',
    scoreImpact: -25,
  },

  // 数据使用
  {
    id: 'data-commercial',
    patterns: [
      /(商业|营销|推广).*?(目的|用途)/i,
      /用于.*?(广告|营销|商业)/i,
      /(分析|挖掘).*?用户.*?(行为|偏好)/i,
    ],
    category: 'data',
    severity: 'high',
    title: '韭菜培养皿',
    humanTranslation: '翻译：研究你的喜好，然后精准收割你的钱包。',
    roastComment: '🌱 您的每次点击都在帮助他们更精准地掏空您',
    scoreImpact: -15,
  },
  {
    id: 'data-ai-training',
    patterns: [
      /(训练|优化|改进).*?(模型|算法|AI)/i,
      /机器学习.*?(训练|数据)/i,
      /用于.*?(研发|研究)/i,
    ],
    category: 'data',
    severity: 'medium',
    title: 'AI投喂条款',
    humanTranslation: '翻译：你的数据将成为我们AI的口粮，免费劳动力就是你。',
    roastComment: '🤖 恭喜！您正在免费为人工智能打工',
    scoreImpact: -10,
  },

  // 仲裁条款
  {
    id: 'arbitration-mandatory',
    patterns: [
      /仲裁.*?(解决|处理).*?争议/i,
      /放弃.*?(诉讼|起诉|法院)/i,
      /通过.*?仲裁.*?(而非|不通过)/i,
    ],
    category: 'arbitration',
    severity: 'high',
    title: '私了条款',
    humanTranslation: '翻译：有纠纷？别去法院，来我们指定的地方"调解"。',
    roastComment: '⚖️ 裁判是他们请的，您觉得谁会赢？',
    scoreImpact: -20,
  },
  {
    id: 'arbitration-location',
    patterns: [
      /(管辖|审理).*?(法院|仲裁.*?机构)/i,
      /争议.*?由.*?(所在地|注册地)/i,
      /适用.*?(法律|法规)/i,
    ],
    category: 'arbitration',
    severity: 'medium',
    title: '主场优势',
    humanTranslation: '翻译：要打官司？来我们的地盘，用对我们有利的规则。',
    roastComment: '🏟️ 客场作战，您的胜率约等于国足',
    scoreImpact: -10,
  },

  // 单方修改
  {
    id: 'modification-anytime',
    patterns: [
      /(修改|更新|变更).*?(条款|协议|规则).*?(随时|不时)/i,
      /有权.*?(修改|调整).*?本协议/i,
      /(变更|修改).*?无需.*?(通知|同意)/i,
    ],
    category: 'modification',
    severity: 'critical',
    title: '薛定谔的协议',
    humanTranslation: '翻译：今天签的协议明天可能就变了，变成什么样子你不用知道。',
    roastComment: '📝 协议内容是个谜，每次打开都有惊喜',
    scoreImpact: -25,
  },
  {
    id: 'modification-implied-consent',
    patterns: [
      /继续使用.*?(视为|表示|即为).*?同意/i,
      /(视为|默认).*?(同意|接受)/i,
      /不同意.*?(停止|不再).*?使用/i,
    ],
    category: 'modification',
    severity: 'high',
    title: '沉默即同意',
    humanTranslation: '翻译：你不说话就是同意了，不同意？那你别用。',
    roastComment: '🤐 沉默是金？不，沉默是同意被宰',
    scoreImpact: -15,
  },

  // 内容权利
  {
    id: 'content-ownership',
    patterns: [
      /(授予|许可|让渡).*?(永久|不可撤销|全球)/i,
      /用户.*?(内容|作品).*?(归.*?所有|授权)/i,
      /(免费|无偿).*?使用.*?用户/i,
    ],
    category: 'content',
    severity: 'critical',
    title: '白嫖创作者条款',
    humanTranslation: '翻译：你发的东西都是我的，我想怎么用就怎么用，还不用付钱。',
    roastComment: '🎨 您的才华正在被免费商用，而您连个署名都没有',
    scoreImpact: -30,
  },
  {
    id: 'content-sublicense',
    patterns: [
      /再许可|转授权|二次授权/i,
      /(允许|授权).*?第三方.*?使用/i,
      /可转让.*?(许可|权利)/i,
    ],
    category: 'content',
    severity: 'high',
    title: '内容转卖条款',
    humanTranslation: '翻译：你的内容我不但自己用，还能转手卖给别人。',
    roastComment: '💼 您的创作正在被打包出售，二手贩子都馋哭了',
    scoreImpact: -20,
  },
];

// 通用危险关键词
export const dangerKeywords = [
  { keyword: '不可撤销', weight: -5 },
  { keyword: '永久', weight: -5 },
  { keyword: '无限制', weight: -3 },
  { keyword: '全部权利', weight: -5 },
  { keyword: '独家', weight: -3 },
  { keyword: '任何损失', weight: -3 },
  { keyword: '概不负责', weight: -5 },
  { keyword: '最终解释权', weight: -10 },
  { keyword: '单方面', weight: -5 },
  { keyword: '不另行通知', weight: -5 },
];
