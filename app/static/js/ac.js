(function () {
    function v(a, c) {
        var b = [], f;
        for (f in c)Object.prototype.hasOwnProperty.call(c, f) && b.push(encodeURIComponent(f) + "=" + encodeURIComponent(c[f] || ""));
        b.push("_=" + +new Date);
        a += b.join("&");
        "Microsoft Internet Explorer" === window.navigator.appName && (b = (window.navigator.userAgent || "").match(/msie (\d+\.\d)/i)) && 8 > parseInt(b[1], 10) && (a = a.slice(0, 2048));
        b = e.createElement("div");
        b.id = "any_log";
        f = e.body;
        f.insertBefore(b, f.firstChild);
        f = ['<iframe width="1" height="1" ', 'src="' + a + '" ', 'align="center" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" allowtransparency="true" </iframe>'].join("");
        b.innerHTML = f
    }

    function l(a) {
        var c = e.createElement("script");
        c.src = a;
        a = e.body;
        a.insertBefore(c, a.firstChild)
    }

    var i = !1, w = !1, x = !1, e = window.document, m = -1 !== window.location.href.indexOf("cf=u");
    try {
        var n = window.localStorage
    } catch (E) {
    }
    window.isJsReady = function () {
        return "anyFlashReady"
    };
    var y = function (a, c) {
        var b = RegExp("(^| )" + a + "=([^;]*)(;|$)").exec(e.cookie);
        return b ? c ? decodeURIComponent(b[2]) : b[2] : ""
    }, z = function (a, c, b, f) {
        var d = b.expires;
        "number" === typeof d && (d = new Date, d.setTime(+d + b.expires));
        e.cookie =
            a + "=" + (f ? encodeURIComponent(c) : c) + (b.path ? "; path=" + b.path : "") + (d ? "; expires=" + d.toGMTString() : "") + (b.domain ? "; domain=" + b.domain : "")
    }, j = function (a, c) {
        c && 0 > c.indexOf(":FG=1") && (c += ":FG=1");
        if (y(a) !== c) {
            var b = new Date;
            b.setTime(b.getTime() + 864E8);
            z(a, c, {path: "/", expires: b})
        }
    }, o = function (a, c) {
        if (void 0 !== c)z(a, c, {}); else return y(a)
    }, A = function (a, c) {
        var b = -1 !== navigator.appName.indexOf("Microsoft") ? e.getElementById("BAIDU_CLB_ac_o_flash") : e.getElementById("BAIDU_CLB_ac_o_flash_embed");
        if (!b)return "";
        if (void 0 !== c)b.anySetSO(a, c); else return b.anyGetSO(a)
    }, B = function (a, c) {
        try {
            var b;
            b = e.getElementById("cPersistDiv") ? e.getElementById("cPersistDiv") : e.createElement("div");
            b.style.visibility = "hidden";
            b.style.position = "absolute";
            b.setAttribute("id", "cPersistDiv");
            e.body.appendChild(b);
            b.style.behavior = "url(#default#userData)";
            if (void 0 !== c)b.setAttribute(a, c), b.save(a); else return b.load(a), b.getAttribute(a)
        } catch (d) {
        }
    }, C = function (a, c) {
        try {
            if (n)if (void 0 !== c)n.setItem(a, c); else return n.getItem(a) || void 0
        } catch (b) {
        }
    }, p = "", q = o("CPROID") || o("BAIDUID") || "", d = B("CPROID") || "", g = C("CPROID") || "", k = "", h = q || d || g;
    d && j("UDID", d);
    g && j("LDID", g);
    window.anyFlashReady = function () {
        x = !0;
        var a = k = A("CPROID");
        a || (A("CPROID", h), k = a = h);
        j("FCID", a);
        !i && x && w && (v("http://eclick.baidu.com/fp.htm?", {
            ci: h,
            cn: q,
            cu: d,
            cl: g,
            cf: k,
            ce: p,
            ff: r,
            cuid: s,
            cuid2: t,
            de: u,
            bp: D,
            nip: ""
        }), i = !0)
    };
    d || B("CPROID", h);
    g || C("CPROID", h);
    var r = "c";
    !0 === m && (r = "u");
    window.setEtag = window.getEtag = function (a) {
        w = !0;
        a && (p = a, j("ETID", a))
    };
    var s = "", u = "", t = "",
        D = o("BDUSS") || "";
    window.getCuid = function (a) {
        0 === a.error && a.cuid && (s = a.cuid)
    };
    window.getCuid2 = function (a) {
        0 === a.error && a.cuid && (t = a.cuid)
    };
    m = "http://127.0.0.1:40310/getcuid?callback=getCuid&mcmdf=inapp_test";
    0 <= navigator.userAgent.toLowerCase().indexOf("android") && (u = "an", l(m), l("http://127.0.0.1:6259/getcuid?callback=getCuid2&mcmdf=inapp_test"));
    l("http://ec.pos.baidu.com/b.php");
    setTimeout(function () {
        i || (v("http://eclick.baidu.com/fp.htm?", {
            ci: h, cn: q, cu: d, cl: g, cf: k, ce: p, ff: r, cuid: s, cuid2: t, de: u,
            bp: D, nip: ""
        }), i = !0)
    }, 800)
})();
