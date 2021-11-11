var showDialog = false;
var popupDom = document.querySelector(".J_popup");
var popupDefaultClassName = "popup J_popup";
var video = document.querySelector("#my-video");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
let recorder = null;
let startRecord = false;
var rect = video.getBoundingClientRect();
var width = rect.width;
var height = rect.height;
var qualityList = []

canvas.width = rect.width;
canvas.height = rect.height;

var player = videojs(
  "my-video",
  {
    language: "zh-CN",
    controlBar: {
      volumePanel: {
        inline: false,
      },
      pictureInPictureToggle: false,
      fullscreenToggle: false,
      DescriptionsButton: true,
    },
    aspectRatio: '16:9',
    playbackRates: [1, 2, 4, 8, 16],
    sources: [
      // {
      //     src: 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8'
      // },
      {
        src: "https://videos.electroteque.org/hls/bigbuckbunny/playlist.m3u8",
        type: "application/x-mpegurl",
      },
    ],
  },
  function () {
    createBackButton();
    createEnlargeButton();
    var videoTags = document.getElementsByTagName("video");
    for (var i = 0; i < videoTags.length; i++) {
      var videoTag = videoTags[i];
      videoTag.setAttribute("crossOrigin", "anonymous");
    }
  }
);

// const selector = player.hlsQualitySelector({
//   displayCurrentQuality: true
// });

let qualityLevels = player.qualityLevels();

// disable quality levels with less than 720 horizontal lines of resolution when added
// to the list.
qualityLevels.on('addqualitylevel', function(event) {
  let qualityLevel = event.qualityLevel;
 
  if (qualityLevel.height < 720) {
    qualityLevel.enabled = true;
  } else {
    qualityLevel.enabled = false;
  }

  qualityList.push(qualityLevel)
});

videojs.addLanguage("zh-CN", lang);

function createEnlargeButton() {
  var Button = videojs.getComponent("Button");
  var button = new Button(player, {
    clickHandler: function () {
      showDialog = true;
      popupDom.className = popupDefaultClassName;
    },
  });

  button.controlText("放大");
  button.addClass("my-enlarge-button");
  button.addClass("iconfont");

  player.controlBar.addChild(button, {}, 12);
}

function createBackButton() {
  var Button = videojs.getComponent("Button");
  var button = new Button(player, {
    clickHandler: function () {
      videojs.log("Clicked");
      var whereYouAt = player.currentTime();
      player.currentTime(whereYouAt - 10);
    },
  });

  button.controlText("回退10s");
  button.addClass("my-back-button");
  button.addClass("iconfont");

  player.controlBar.addChild(button, {}, 1);
}

function getSnapchat() {
  var videoDom = document.querySelector("#my-video video");
  var rect = video.getBoundingClientRect();
  var url = "";

  canvas.width = rect.width;
  canvas.height = rect.height;

  ctx.drawImage(videoDom, 0, 0);

  url = canvas.toDataURL("image/png");
  canvas.toBlob(function (blob) {
    console.log(blob, 4444444);
  });

  const a = document.createElement("a");
  const event = new MouseEvent("click");
  a.download = "screen_shot.png";
  a.href = url;
  a.dispatchEvent(event);
}

domEvent();
function domEvent() {
  const rateDom = document.querySelector(".J_rate"),
    snapchatBtnDom = document.querySelector(".J_snapchat"),
    startBtnDom = document.querySelector(".J_record"),
    stopBtnDom = document.querySelector(".J_stop"),
    bQDom = document.querySelector('.J_bq'),
    gQDom = document.querySelector('.J_gq');

  rateDom.addEventListener("click", function () {
    player.playbackRate(2);
  });

  bQDom.addEventListener("click", function () {
    qualityList.forEach(item => {
      item.enabled = item.height < 720
    })
  })

  gQDom.addEventListener("click", function () {
    if(qualityList.some(item => item.height >= 720)) {
      qualityList.forEach(item => {
        item.enabled = item.height >= 720
      })
    }
  })

  snapchatBtnDom.addEventListener("click", function () {
    getSnapchat();
  });

  startBtnDom.addEventListener("click", () => {
    startRecord = true;
    recorder = RecordRTC(
      document.querySelector("#my-video video").captureStream(),
      {
        type: "video",
      }
    );
    recorder.startRecording();
  });

  stopBtnDom.addEventListener("click", () => {
    startRecord = false;
    recorder.stopRecording(function () {
      let blob = recorder.getBlob();
      // const video = document.createElement('video')
      // video.src = URL.createObjectURL(blob)
      // video.autoplay = true
      // video.controls = true
      // document.body.appendChild(video);
      invokeSaveAsDialog(blob, "video.mp4");
    });
  });
}
