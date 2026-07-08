const statusText = document.getElementById("statusText");
const helperText = document.getElementById("helperText");
const refuseCountText = document.getElementById("refuseCountText");
const rejectBtn = document.getElementById("rejectBtn");
const acceptBtn = document.getElementById("acceptBtn");
const dialogCard = document.getElementById("dialogCard");
const dialogTitle = document.getElementById("dialogTitle");
const dialogBody = document.getElementById("dialogBody");
const overlay = document.getElementById("overlay");
const overlayTag = document.getElementById("overlayTag");
const overlayTitle = document.getElementById("overlayTitle");
const overlayBody = document.getElementById("overlayBody");
const retryBtn = document.getElementById("retryBtn");
const downloadBtn = document.getElementById("downloadBtn");
const closeOverlayBtn = document.getElementById("closeOverlayBtn");

const rejectMessages = [
  {
    title: "真的不来吗？",
    body: "全队都在等你落地，刚好缺一个最稳的队友。",
    status: "队友表示不信，决定再问你一次。",
    button: "手滑了，再点一次"
  },
  {
    title: "再考虑 10 秒？",
    body: "这把海岛资源点已经帮你标好了，落地就能开打。",
    status: "房间还没关，正在继续邀请你。",
    button: "还是不同意"
  },
  {
    title: "你不来谁补位？",
    body: "三个人已经语音集合，战术都定好了，就差你点头。",
    status: "队长开启了第三轮劝说。",
    button: "我再想想"
  },
  {
    title: "最后问一遍？",
    body: "其实不是最后一遍，只要你还没同意，我们就会继续问。",
    status: "拒绝无效，邀请循环继续。",
    button: "继续拒绝"
  }
];

const launchTargets = [
  "tmgppeace://",
  "peacekeeperelite://",
  "gameassistant://startapp?pkgname=com.tencent.tmgp.pubgmhd",
  "intent://#Intent;scheme=tmgppeace;package=com.tencent.tmgp.pubgmhd;end"
];

const userAgent = navigator.userAgent.toLowerCase();
const isWeChat = /micromessenger/.test(userAgent);
const isIOS = /iphone|ipad|ipod/.test(userAgent);
let rejectIndex = 0;
let launchTimer = null;

function updateStatus(message) {
  statusText.textContent = message;
}

function updateRefuseCount() {
  refuseCountText.textContent = `已拒绝 ${rejectIndex} 次`;
}

function showDialog(message) {
  dialogTitle.textContent = message.title;
  dialogBody.textContent = message.body;
  dialogCard.classList.add("show");

  clearTimeout(showDialog.timerId);
  showDialog.timerId = window.setTimeout(() => {
    dialogCard.classList.remove("show");
  }, 2600);
}

function showOverlay(options) {
  overlayTag.textContent = options.tag;
  overlayTitle.textContent = options.title;
  overlayBody.textContent = options.body;
  downloadBtn.href = options.downloadUrl;
  overlay.classList.remove("hidden");
}

function hideOverlay() {
  overlay.classList.add("hidden");
}

function openDeepLink(url) {
  if (url.startsWith("intent://")) {
    window.location.href = url;
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);

  window.setTimeout(() => {
    iframe.remove();
  }, 1200);
}

function tryLaunchGame() {
  updateStatus("正在尝试打开和平精英，请稍候...");
  helperText.textContent = isWeChat
    ? "检测到你正在微信内打开，若未跳转，请按提示改用系统浏览器继续。"
    : "若未自动打开游戏，页面会继续给你下载或重试提示。";

  hideOverlay();
  clearTimeout(launchTimer);

  launchTargets.forEach((target, index) => {
    window.setTimeout(() => {
      openDeepLink(target);
    }, index * 260);
  });

  launchTimer = window.setTimeout(() => {
    showOverlay({
      tag: isWeChat ? "微信内拦截提醒" : "打开失败提示",
      title: isWeChat ? "微信可能拦截了游戏唤起" : "暂时没有成功拉起游戏",
      body: isWeChat
        ? "点击右上角菜单，选择“在浏览器打开”后再点一次“同意，上号”。如果还是不行，可以先前往和平精英官网或应用商店启动游戏。"
        : "你可以再试一次；如果设备仍未跳转，说明当前浏览器不支持该唤起方式，请先手动打开和平精英。",
      downloadUrl: "https://gp.qq.com"
    });
    updateStatus("未检测到成功跳转，已为你准备后续操作提示。");
  }, 2200);

  window.setTimeout(() => {
    if (!document.hidden) {
      return;
    }

    clearTimeout(launchTimer);
    updateStatus("已检测到页面切到后台，应该正在打开和平精英。");
  }, 1200);
}

rejectBtn.addEventListener("click", () => {
  const message = rejectMessages[rejectIndex % rejectMessages.length];
  rejectIndex += 1;

  updateStatus(message.status);
  updateRefuseCount();
  rejectBtn.textContent = message.button;
  showDialog(message);
});

acceptBtn.addEventListener("click", tryLaunchGame);
retryBtn.addEventListener("click", tryLaunchGame);

closeOverlayBtn.addEventListener("click", () => {
  hideOverlay();
  updateStatus("你可以随时再点一次“同意，上号”继续尝试。");
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearTimeout(launchTimer);
    hideOverlay();
    updateStatus("检测到页面已切到后台，正在等待你进入和平精英。");
    return;
  }

  if (isWeChat) {
    helperText.textContent = "如果刚才没有拉起游戏，建议通过微信右上角菜单切到系统浏览器后重试。";
  }
});

window.addEventListener("pagehide", () => {
  clearTimeout(launchTimer);
});

if (isWeChat) {
  helperText.textContent = "当前为微信内浏览器，可能会拦截应用跳转；建议优先使用右上角菜单转到系统浏览器。";
}

if (isIOS) {
  acceptBtn.textContent = "同意，尝试打开";
}

updateRefuseCount();
