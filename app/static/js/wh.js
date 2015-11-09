(function () {
    if (!PluginDetect)var PluginDetect = {
        getNum: function (b, c) {
            if (!this.num(b))return null;
            var a;
            if (typeof c == "undefined")a = /[\d][\d\.\_,-]*/.exec(b); else a = (new RegExp(c)).exec(b);
            return a ? a[0].replace(/[\.\_-]/g, ",") : null
        }, hasMimeType: function (c) {
            if (PluginDetect.isIE)return null;
            var b, a, d, e = c.constructor == String ? [c] : c;
            for (d = 0; d < e.length; d++) {
                b = navigator.mimeTypes[e[d]];
                if (b && b.enabledPlugin) {
                    a = b.enabledPlugin;
                    if (a.name || a.description)return b
                }
            }
            return null
        }, findNavPlugin: function (g, d) {
            var a =
                g.constructor == String ? g : g.join(".*"), e = d === false ? "" : "\\d", b, c = new RegExp(a + ".*" + e + "|" + e + ".*" + a, "i"), f = navigator.plugins;
            for (b = 0; b < f.length; b++)if (c.test(f[b].description) || c.test(f[b].name))return f[b];
            return null
        }, AXO: window.ActiveXObject, getAXO: function (b, a) {
            var f = null, d, c = false;
            try {
                f = new this.AXO(b);
                c = true
            } catch (d) {
            }
            if (typeof a != "undefined") {
                delete f;
                return c
            }
            return f
        }, num: function (a) {
            return typeof a != "string" ? false : /\d/.test(a)
        }, compareNums: function (g, e) {
            var d = this, c, b, a, f = window.parseInt;
            if (!d.num(g) || !d.num(e))return 0;
            if (d.plugin && d.plugin.compareNums)return d.plugin.compareNums(g, e);
            c = g.split(",");
            b = e.split(",");
            for (a = 0; a < Math.min(c.length, b.length); a++) {
                if (f(c[a], 10) > f(b[a], 10))return 1;
                if (f(c[a], 10) < f(b[a], 10))return -1
            }
            return 0
        }, formatNum: function (b) {
            if (!this.num(b))return null;
            var a, c = b.replace(/\s/g, "").replace(/[\.\_]/g, ",").split(",").concat(["0", "0", "0", "0"]);
            for (a = 0; a < 4; a++)if (/^(0+)(.+)$/.test(c[a]))c[a] = RegExp.$2;
            if (!/\d/.test(c[0]))c[0] = "0";
            return c[0] + "," + c[1] + "," + c[2] + "," + c[3]
        },
        initScript: function () {
            var $ = this, userAgent = navigator.userAgent;
            $.isIE = true;
            $.IEver = $.isIE && /MSIE\s*(\d\.?\d*)/i.exec(userAgent) ? parseFloat(RegExp.$1, 10) : -1;
            $.ActiveXEnabled = false;
            if ($.isIE) {
                var x, progid = ["Msxml2.XMLHTTP", "Msxml2.DOMDocument", "Microsoft.XMLDOM", "ShockwaveFlash.ShockwaveFlash", "TDCCtl.TDCCtl", "Shell.UIHelper", "Scripting.Dictionary", "wmplayer.ocx"];
                for (x = 0; x < progid.length; x++)if ($.getAXO(progid[x], 1)) {
                    $.ActiveXEnabled = true;
                    break
                }
                $.head = typeof document.getElementsByTagName != "undefined" ?
                    document.getElementsByTagName("head")[0] : null
            }
            $.isGecko = !$.isIE && typeof navigator.product == "string" && /Gecko/i.test(navigator.product) && /Gecko\s*\/\s*\d/i.test(userAgent) ? true : false;
            $.GeckoRV = $.isGecko ? $.formatNum(/rv\s*\:\s*([\.\,\d]+)/i.test(userAgent) ? RegExp.$1 : "0.9") : null;
            $.isSafari = !$.isIE && /Safari\s*\/\s*\d/i.test(userAgent) ? true : false;
            $.isChrome = /Chrome\s*\/\s*\d/i.test(userAgent) ? true : false;
            $.onWindowLoaded(0)
        }, init: function (c, a) {
            if (typeof c != "string")return -3;
            c = c.toLowerCase().replace(/\s/g,
                "");
            var b = this, d;
            if (typeof b[c] == "undefined")return -3;
            d = b[c];
            b.plugin = d;
            if (typeof d.installed == "undefined" || a == true) {
                d.installed = null;
                d.version = null;
                d.version0 = null;
                d.getVersionDone = null;
                d.$ = b
            }
            b.garbage = false;
            if (b.isIE && !b.ActiveXEnabled)if (b.plugin != b.java)return -2;
            return 1
        }, isMinVersion: function (g, e, c, b) {
            return -3
        }, getVersion: function (e, b, a) {
            var d = PluginDetect, c = d.init(e), f;
            if (c < 0)return null;
            f = d.plugin;
            if (f.getVersionDone != 1) {
                f.getVersion(b, a);
                if (f.getVersionDone === null)f.getVersionDone = 1
            }
            d.cleanup();
            return f.version || f.version0
        }, getInfo: function (f, c, b) {
            var a = {};
            var e = PluginDetect, d = e.init(f), g;
            if (d < 0)return a;
            g = e.plugin;
            if (typeof g.getInfo != "undefined") {
                if (g.getVersionDone === null)e.getVersion(f, c, b);
                a = g.getInfo()
            }
            return a
        }, cleanup: function () {
            var a = this;
            if (a.garbage && typeof window.CollectGarbage != "undefined")window.CollectGarbage()
        }, isActiveXObject: function (b) {
            var d = this, a, g, f = "/", c = '<object width="1" height="1" style="display:none" ' + d.plugin.getCodeBaseVersion(b) + ">" + d.plugin.HTML + "<" + f + "object>";
            if (d.head.firstChild)d.head.insertBefore(document.createElement("object"), d.head.firstChild); else d.head.appendChild(document.createElement("object"));
            d.head.firstChild.outerHTML = c;
            try {
                d.head.firstChild.classid = d.plugin.classID
            } catch (g) {
            }
            a = false;
            try {
                if (d.head.firstChild.object)a = true
            } catch (g) {
            }
            try {
                if (a && d.head.firstChild.readyState < 4)d.garbage = true
            } catch (g) {
            }
            d.head.removeChild(d.head.firstChild);
            return a
        }, codebaseSearch: function (c) {
            var e = this;
            if (!e.ActiveXEnabled)return null;
            if (typeof c != "undefined")return e.isActiveXObject(c);
            var j = [0, 0, 0, 0], g, f, b = e.plugin.digits, i = function (k, m) {
                var l = (k == 0 ? m : j[0]) + "," + (k == 1 ? m : j[1]) + "," + (k == 2 ? m : j[2]) + "," + (k == 3 ? m : j[3]);
                return e.isActiveXObject(l)
            };
            var h, d, a = false;
            for (g = 0; g < b.length; g++) {
                h = b[g] * 2;
                j[g] = 0;
                for (f = 0; f < 20; f++) {
                    if (h == 1 && g > 0 && a)break;
                    if (h - j[g] > 1) {
                        d = Math.round((h + j[g]) / 2);
                        if (i(g, d)) {
                            j[g] = d;
                            a = true
                        } else h = d
                    } else if (h - j[g] == 1) {
                        h--;
                        if (!a && i(g, h))a = true;
                        break
                    } else {
                        if (!a && i(g, h))a = true;
                        break
                    }
                }
                if (!a)return null
            }
            return j.join(",")
        }, dummy1: 0
    };
    PluginDetect.onDetectionDone = function (g, e, d, a) {
        return -1
    };
    PluginDetect.onWindowLoaded = function (c) {
        var b = PluginDetect, a = window;
        if (b.EventWinLoad === true); else {
            b.winLoaded = false;
            b.EventWinLoad = true;
            if (typeof a.addEventListener != "undefined")a.addEventListener("load", b.runFuncs, false); else if (typeof a.attachEvent != "undefined")a.attachEvent("onload", b.runFuncs); else {
                if (typeof a.onload == "function")b.funcs[b.funcs.length] = a.onload;
                a.onload = b.runFuncs
            }
        }
        if (typeof c == "function")b.funcs[b.funcs.length] = c
    };
    PluginDetect.funcs = [0];
    PluginDetect.runFuncs = function () {
        var b =
            PluginDetect, a;
        b.winLoaded = true;
        for (a = 0; a < b.funcs.length; a++)if (typeof b.funcs[a] == "function") {
            b.funcs[a](b);
            b.funcs[a] = null
        }
    };
    PluginDetect.quicktime = {
        mimeType: ["video/quicktime", "application/x-quicktimeplayer", "image/x-macpaint", "image/x-quicktime"],
        progID: "QuickTimeCheckObject.QuickTimeCheck.1",
        progID0: "QuickTime.QuickTime",
        classID: "clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B",
        minIEver: 7,
        HTML: '<param name="src" value="A14999.mov" /><param name="controller" value="false" />',
        getCodeBaseVersion: function (a) {
            return 'codebase="#version=' +
                a + '"'
        },
        digits: [8, 64, 16, 0],
        clipTo3digits: function (f) {
            if (f === null || typeof f == "undefined")return null;
            var e, d, h, g = this.$;
            e = f.split(",");
            if (g.compareNums(f, "7,60,0,0") < 0 && g.compareNums(f, "7,50,0,0") >= 0)d = e[0] + "," + e[1].charAt(0) + "," + e[1].charAt(1) + "," + e[2]; else d = e[0] + "," + e[1] + "," + e[2] + "," + e[3];
            h = d.split(",");
            return h[0] + "," + h[1] + "," + h[2] + ",0"
        },
        getVersion: function () {
            var a = null, d, b = this.$, e = true;
            if (!b.isIE) {
                if (navigator.platform && /linux/i.test(navigator.platform))e = false;
                if (e) {
                    d = b.findNavPlugin(["QuickTime",
                        "(Plug-in|Plugin)"]);
                    if (d && d.name && b.hasMimeType(this.mimeType))a = b.getNum(d.name)
                }
                this.installed = a ? 1 : -1
            } else {
                var c;
                if (b.IEver >= this.minIEver && b.getAXO(this.progID0, 1))a = b.codebaseSearch(); else {
                    c = b.getAXO(this.progID);
                    if (c && c.QuickTimeVersion) {
                        a = c.QuickTimeVersion.toString(16);
                        a = a.charAt(0) + "." + a.charAt(1) + "." + a.charAt(2)
                    }
                }
                this.installed = a ? 1 : b.getAXO(this.progID0, 1) ? 0 : -1
            }
            this.version = this.clipTo3digits(b.formatNum(a))
        }
    };
    PluginDetect.devalvr = {
        mimeType: "application/x-devalvrx", progID: "DevalVRXCtrl.DevalVRXCtrl.1",
        classID: "clsid:5D2CF9D0-113A-476B-986F-288B54571614", getVersion: function () {
            var a = null, g, c = this.$, f;
            if (!c.isIE) {
                g = c.findNavPlugin("DevalVR");
                if (g && g.name && c.hasMimeType(this.mimeType))a = g.description.split(" ")[3];
                this.installed = a ? 1 : -1
            } else {
                var b, h, d;
                h = c.getAXO(this.progID, 1);
                if (h) {
                    b = c.instantiate("object", ["classid", this.classID], ["src", ""]);
                    d = c.getObject(b);
                    if (d)try {
                        if (d.pluginversion) {
                            a = "00000000" + d.pluginversion.toString(16);
                            a = a.substr(a.length - 8, 8);
                            a = parseInt(a.substr(0, 2), 16) + "," + parseInt(a.substr(2,
                                    2), 16) + "," + parseInt(a.substr(4, 2), 16) + "," + parseInt(a.substr(6, 2), 16)
                        }
                    } catch (f) {
                    }
                    c.uninstantiate(b)
                }
                this.installed = a ? 1 : h ? 0 : -1
            }
            this.version = c.formatNum(a)
        }
    };
    PluginDetect.flash = {
        mimeType: ["application/x-shockwave-flash", "application/futuresplash"],
        progID: "ShockwaveFlash.ShockwaveFlash",
        classID: "clsid:D27CDB6E-AE6D-11CF-96B8-444553540000",
        getVersion: function () {
            var c = function (i) {
                if (!i)return null;
                var e = /[\d][\d\,\.\s]*[rRdD]{0,1}[\d\,]*/.exec(i);
                return e ? e[0].replace(/[rRdD\.]/g, ",").replace(/\s/g, "") :
                    null
            };
            var j, g = this.$, h, f, b = null, a = null, d = null;
            if (!g.isIE) {
                j = g.findNavPlugin("Flash");
                if (j && j.description && g.hasMimeType(this.mimeType))b = c(j.description)
            } else {
                for (f = 15; f > 2; f--) {
                    a = g.getAXO(this.progID + "." + f);
                    if (a) {
                        d = f.toString();
                        break
                    }
                }
                if (d == "6")try {
                    a.AllowScriptAccess = "always"
                } catch (h) {
                    return "6,0,21,0"
                }
                try {
                    b = c(a.GetVariable("$version"))
                } catch (h) {
                }
                if (!b && d)b = d
            }
            this.installed = b ? 1 : -1;
            this.version = g.formatNum(b);
            return true
        }
    };
    PluginDetect.shockwave = {
        mimeType: "application/x-director", progID: "SWCtl.SWCtl",
        classID: "clsid:166B1BCA-3F9C-11CF-8075-444553540000", getVersion: function () {
            var a = null, b = null, f, d, c = this.$;
            if (!c.isIE) {
                d = c.findNavPlugin("Shockwave for Director");
                if (d && d.description && c.hasMimeType(this.mimeType))a = c.getNum(d.description)
            } else {
                try {
                    b = c.getAXO(this.progID).ShockwaveVersion("")
                } catch (f) {
                }
                if (typeof b == "string" && b.length > 0)a = c.getNum(b); else if (c.getAXO(this.progID + ".8", 1))a = "8"; else if (c.getAXO(this.progID + ".7", 1))a = "7"; else if (c.getAXO(this.progID + ".1", 1))a = "6"
            }
            this.installed = a ? 1 : -1;
            this.version = c.formatNum(a)
        }
    };
    PluginDetect.div = null;
    PluginDetect.pluginSize = 1;
    PluginDetect.DOMbody = null;
    PluginDetect.uninstantiate = function (a) {
        var c, b = this;
        if (!a)return;
        try {
            if (a[0] && a[0].firstChild)a[0].removeChild(a[0].firstChild);
            if (a[0] && b.div)b.div.removeChild(a[0]);
            if (b.div && b.div.childNodes.length == 0) {
                b.div.parentNode.removeChild(b.div);
                b.div = null;
                if (b.DOMbody && b.DOMbody.parentNode)b.DOMbody.parentNode.removeChild(b.DOMbody);
                b.DOMbody = null
            }
            a[0] = null
        } catch (c) {
        }
    };
    PluginDetect.getObject = function (b,
                                       a) {
        var f, c = this, d = null;
        try {
            if (b && b[0] && b[0].firstChild)d = b[0].firstChild
        } catch (f) {
        }
        try {
            if (a && d && typeof d.focus != "undefined" && typeof document.hasFocus != "undefined" && !document.hasFocus())d.focus()
        } catch (f) {
        }
        return d
    };
    PluginDetect.getContainer = function (a) {
        var c, b = null;
        if (a && a[0])b = a[0];
        return b
    };
    PluginDetect.hideObject = function (a) {
        var b = this.getObject(a);
        if (b && b.style)b.style.height = "0"
    };
    PluginDetect.instantiate = function (h, b, c, a) {
        var j = function (d) {
            var e = d.style;
            if (!e)return;
            e.border = "0px";
            e.padding =
                "0px";
            e.margin = "0px";
            e.fontSize = g.pluginSize + 3 + "px";
            e.height = g.pluginSize + 3 + "px";
            e.visibility = "visible";
            if (d.tagName && d.tagName.toLowerCase() == "div") {
                e.width = "100%";
                e.display = "block"
            } else if (d.tagName && d.tagName.toLowerCase() == "span") {
                e.width = g.pluginSize + "px";
                e.display = "inline"
            }
        };
        var k, l = document, g = this, p, i = l.getElementsByTagName("body")[0] || l.body, o = l.createElement("span"), n, f, m = "/";
        if (typeof a == "undefined")a = "";
        p = "<" + h + ' width="' + g.pluginSize + '" height="' + g.pluginSize + '" ';
        for (n = 0; n < b.length; n =
            n + 2)p += b[n] + '="' + b[n + 1] + '" ';
        p += ">";
        for (n = 0; n < c.length; n = n + 2)p += '<param name="' + c[n] + '" value="' + c[n + 1] + '" />';
        p += a + "<" + m + h + ">";
        if (!g.div) {
            g.div = l.createElement("div");
            f = l.getElementById("plugindetect");
            if (f) {
                j(f);
                f.appendChild(g.div)
            } else if (i)try {
                if (i.firstChild && typeof i.insertBefore != "undefined")i.insertBefore(g.div, i.firstChild); else i.appendChild(g.div)
            } catch (k) {
            } else try {
                l.write('<div id="pd33993399">o<' + m + "div>");
                i = l.getElementsByTagName("body")[0] || l.body;
                i.appendChild(g.div);
                i.removeChild(l.getElementById("pd33993399"))
            } catch (k) {
                try {
                    g.DOMbody =
                        l.createElement("body");
                    l.getElementsByTagName("html")[0].appendChild(g.DOMbody);
                    g.DOMbody.appendChild(g.div)
                } catch (k) {
                }
            }
            j(g.div)
        }
        if (g.div && g.div.parentNode && g.div.parentNode.parentNode) {
            g.div.appendChild(o);
            try {
                o.innerHTML = p
            } catch (k) {
            }
            j(o);
            return [o]
        }
        return [null]
    };
    PluginDetect.windowsmediaplayer = {
        mimeType: ["application/x-mplayer2", "application/asx"],
        progID: "wmplayer.ocx",
        classID: "clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6",
        getVersion: function () {
            var a = null, e = this.$, b = null;
            this.installed = -1;
            if (!e.isIE) {
                if (e.hasMimeType(this.mimeType)) {
                    if (e.findNavPlugin(["Windows",
                            "Media", "(Plug-in|Plugin)"], false) || e.findNavPlugin(["Flip4Mac", "Windows", "Media"], false))this.installed = 0;
                    var d = e.isGecko && e.compareNums(e.GeckoRV, e.formatNum("1.8")) < 0;
                    if (!d && e.findNavPlugin(["Windows", "Media", "Firefox Plugin"], false)) {
                        var c = e.instantiate("object", ["type", this.mimeType[0]], []), f = e.getObject(c);
                        if (f)a = f.versionInfo;
                        e.uninstantiate(c)
                    }
                }
            } else {
                b = e.getAXO(this.progID);
                if (b)a = b.versionInfo
            }
            if (a)this.installed = 1;
            this.version = e.formatNum(a)
        }
    };
    PluginDetect.silverlight = {
        mimeType: "application/x-silverlight",
        progID: "AgControl.AgControl", digits: [9, 20, 9, 12, 31], getVersion: function () {
            var c = this.$, j = document, g = null, b = null, f = false;
            if (!c.isIE) {
                var a = [null, null], e = c.findNavPlugin("Silverlight Plug-in", false), h = c.isGecko && c.compareNums(c.GeckoRV, c.formatNum("1.6")) <= 0;
                if (e && c.hasMimeType(this.mimeType)) {
                    g = c.formatNum(e.description);
                    if (g) {
                        p = g.split(",");
                        if (parseInt(p[2], 10) >= 30226 && parseInt(p[0], 10) < 2)p[0] = "2";
                        g = p.join(",")
                    }
                    if (c.isGecko && !h)f = true;
                    if (!f && !h && g) {
                        a = c.instantiate("object", ["type", this.mimeType], []);
                        b = c.getObject(a);
                        if (b) {
                            if (typeof b.IsVersionSupported != "undefined")f = true;
                            if (!f) {
                                b.data = "data:" + this.mimeType + ",";
                                if (typeof b.IsVersionSupported != "undefined")f = true
                            }
                        }
                        c.uninstantiate(a)
                    }
                }
            } else {
                b = c.getAXO(this.progID);
                var p = [1, 0, 1, 1, 1], l, k, o, i = function (d) {
                    return (d < 10 ? "0" : "") + d.toString()
                }, m = function (q, d, s, t, r) {
                    return q + "." + d + "." + s + i(t) + i(r) + ".0"
                }, n = function (d, s) {
                    var q, r = m(d == 0 ? s : p[0], d == 1 ? s : p[1], d == 2 ? s : p[2], d == 3 ? s : p[3], d == 4 ? s : p[4]);
                    try {
                        return b.IsVersionSupported(r)
                    } catch (q) {
                    }
                    return false
                };
                if (b && typeof b.IsVersionSupported !=
                    "undefined") {
                    for (l = 0; l < this.digits.length; l++) {
                        o = p[l];
                        for (k = o + (l == 0 ? 0 : 1); k <= this.digits[l]; k++)if (n(l, k)) {
                            f = true;
                            p[l] = k
                        } else break;
                        if (!f)break
                    }
                    if (f)g = m(p[0], p[1], p[2], p[3], p[4])
                }
            }
            this.installed = f ? 1 : -1;
            this.version = c.formatNum(g)
        }
    };
    PluginDetect.vlc = {
        mimeType: "application/x-vlc-plugin", progID: "VideoLAN.VLCPlugin", compareNums: function (d, c) {
            var j = d.split(","), h = c.split(","), g, b, a, f, e, i;
            for (g = 0; g < Math.min(j.length, h.length); g++) {
                i = /([\d]+)([a-z]?)/.test(j[g]);
                b = parseInt(RegExp.$1, 10);
                f = g == 2 && RegExp.$2.length >
                0 ? RegExp.$2.charCodeAt(0) : -1;
                i = /([\d]+)([a-z]?)/.test(h[g]);
                a = parseInt(RegExp.$1, 10);
                e = g == 2 && RegExp.$2.length > 0 ? RegExp.$2.charCodeAt(0) : -1;
                if (b != a)return b > a ? 1 : -1;
                if (g == 2 && f != e)return f > e ? 1 : -1
            }
            return 0
        }, getVersion: function () {
            var b = this.$, d, a = null, c;
            if (!b.isIE) {
                if (b.hasMimeType(this.mimeType)) {
                    d = b.findNavPlugin(["VLC", "(Plug-in|Plugin)"], false);
                    if (d && d.description)a = b.getNum(d.description, "[\\d][\\d\\.]*[a-z]*")
                }
                this.installed = a ? 1 : -1
            } else {
                d = b.getAXO(this.progID);
                if (d)try {
                    a = b.getNum(d.VersionInfo, "[\\d][\\d\\.]*[a-z]*")
                } catch (c) {
                }
                this.installed =
                    d ? 1 : -1
            }
            this.version = b.formatNum(a)
        }
    };
    PluginDetect.initScript();
    function md5(source) {
        function safe_add(x, y) {
            var lsw = (x & 65535) + (y & 65535), msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return msw << 16 | lsw & 65535
        }

        function bit_rol(num, cnt) {
            return num << cnt | num >>> 32 - cnt
        }

        function md5_cmn(q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
        }

        function md5_ff(a, b, c, d, x, s, t) {
            return md5_cmn(b & c | ~b & d, a, b, x, s, t)
        }

        function md5_gg(a, b, c, d, x, s, t) {
            return md5_cmn(b & d | c & ~d, a, b, x, s, t)
        }

        function md5_hh(a, b, c, d, x,
                        s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t)
        }

        function md5_ii(a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | ~d), a, b, x, s, t)
        }

        function binl_md5(x, len) {
            x[len >> 5] |= 128 << len % 32;
            x[(len + 64 >>> 9 << 4) + 14] = len;
            var i, olda, oldb, oldc, oldd, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
            for (i = 0; i < x.length; i += 16) {
                olda = a;
                oldb = b;
                oldc = c;
                oldd = d;
                a = md5_ff(a, b, c, d, x[i], 7, -680876936);
                d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d =
                    md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5_gg(b, c, d, a, x[i], 20, -373897302);
                a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5_hh(d, a, b, c, x[i], 11, -358537222);
                c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = md5_ii(a, b, c, d, x[i], 6, -198630844);
                d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd)
            }
            return [a, b, c, d]
        }

        function binl2rstr(input) {
            var i, output = "";
            for (i = 0; i < input.length * 32; i += 8)output += String.fromCharCode(input[i >> 5] >>> i % 32 & 255);
            return output
        }

        function rstr2binl(input) {
            var i, output = [];
            output[(input.length >> 2) - 1] = undefined;
            for (i = 0; i < output.length; i += 1)output[i] = 0;
            for (i = 0; i < input.length * 8; i += 8)output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << i % 32;
            return output
        }

        function rstr_md5(s) {
            return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
        }

        function rstr_hmac_md5(key, data) {
            var i, bkey = rstr2binl(key), ipad = [], opad = [], hash;
            ipad[15] = opad[15] = undefined;
            if (bkey.length > 16)bkey = binl_md5(bkey, key.length * 8);
            for (i = 0; i < 16; i += 1) {
                ipad[i] = bkey[i] ^ 909522486;
                opad[i] = bkey[i] ^
                    1549556828
            }
            hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
            return binl2rstr(binl_md5(opad.concat(hash), 512 + 128))
        }

        function rstr2hex(input) {
            var hex_tab = "0123456789abcdef", output = "", x, i;
            for (i = 0; i < input.length; i += 1) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt(x >>> 4 & 15) + hex_tab.charAt(x & 15)
            }
            return output
        }

        function str2rstr_utf8(input) {
            return unescape(encodeURIComponent(input))
        }

        function raw_md5(s) {
            return rstr_md5(str2rstr_utf8(s))
        }

        function hex_md5(s) {
            return rstr2hex(raw_md5(s))
        }

        function raw_hmac_md5(k,
                              d) {
            return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))
        }

        function hex_hmac_md5(k, d) {
            return rstr2hex(raw_hmac_md5(k, d))
        }

        return hex_md5(source)
    }

    (function () {
        var BaiduWebAdapter = function () {
            this._pluginList = [];
            this._curPlugin = null
        };
        BaiduWebAdapter.prototype._sendCallback = function (callback, result) {
            if (typeof callback === "function")callback(result, this)
        };
        BaiduWebAdapter.prototype.addPlugin = function (plugin) {
            if (plugin && typeof plugin.initPlugin === "function")this._pluginList.push(plugin)
        };
        BaiduWebAdapter.prototype.initPlugin =
            function (silence, callback) {
                var i, len;
                var me = this;
                if (!this._curPlugin) {
                    for (i = 0, len = this._pluginList.length; i < len; i++)if (this._pluginList[i].isSupported()) {
                        this._curPlugin = this._pluginList[i];
                        break
                    }
                    if (this._curPlugin)this._curPlugin.initPlugin(silence, function (res) {
                        var isReported = me.hasReportedBaiduId();
                        var baiduId = me.getBaiduIdInCookies();
                        if (res === 0)if (!isReported && baiduId) {
                            me.setParam("baiduid", baiduId);
                            me.setBaiduIdReportedFlag()
                        }
                        if (res === 1)me._curPlugin.afterUnblock = function () {
                            if (!isReported && baiduId) {
                                me.setParam("baiduid",
                                    baiduId);
                                me.setBaiduIdReportedFlag()
                            }
                            me._curPlugin.afterUnblock = null
                        };
                        me._sendCallback(callback, res)
                    }); else this._sendCallback(callback, -1)
                } else this._curPlugin.initPlugin(silence, callback)
            };
        BaiduWebAdapter.prototype.uninitPlugin = function (callback) {
            var me = this;
            if (this._curPlugin)this._curPlugin.uninitPlugin(function (res) {
                if (res === 0) {
                    me._curPlugin = null;
                    me._sendCallback(callback, 0)
                }
            })
        };
        BaiduWebAdapter.prototype.getPluginType = function () {
            return this._curPlugin ? this._curPlugin.pluginName : ""
        };
        BaiduWebAdapter.prototype.launchApp =
            function (appName, installAppName, param, requiredAdmin, callback) {
                if (this._curPlugin)this._curPlugin.launchApp(appName, installAppName, param, requiredAdmin, callback); else this._sendCallback(callback, -1)
            };
        BaiduWebAdapter.prototype.queryAppVersion = function (appName, callback) {
            if (this._curPlugin)this._curPlugin.queryAppVersion(appName, callback); else this._sendCallback(callback, "")
        };
        BaiduWebAdapter.prototype.queryAppSupplyID = function (appName, callback) {
            if (this._curPlugin)this._curPlugin.queryAppSupplyID(appName,
                callback); else this._sendCallback(callback, "")
        };
        BaiduWebAdapter.prototype.setParam = function (key, value, callback) {
            if (this._curPlugin)this._curPlugin.setParam(key, value, callback); else this._sendCallback(callback, -1)
        };
        BaiduWebAdapter.prototype.getParam = function (key, callback) {
            if (this._curPlugin)this._curPlugin.getParam(key, callback); else this._sendCallback(callback, "")
        };
        BaiduWebAdapter.prototype.queryGuid = function (callback) {
            if (this._curPlugin)this._curPlugin.queryGuid(callback); else this._sendCallback(callback,
                "")
        };
        BaiduWebAdapter.prototype.getSysInfo = function (callback) {
            if (this._curPlugin)this._curPlugin.getSysInfo(callback); else this._sendCallback(callback, -1)
        };
        BaiduWebAdapter.prototype.getCookie = function (cookieName) {
            var theCookie = " " + document.cookie;
            var lowCookie = theCookie.toLowerCase();
            var lowName = cookieName.toLowerCase();
            var ind = lowCookie.indexOf(" " + lowName + "=");
            if (ind == -1)ind = lowCookie.indexOf(";" + lowName + "=");
            if (ind == -1 || cookieName == "")return null;
            var ind1 = theCookie.indexOf(";", ind + 1);
            if (ind1 == -1)ind1 =
                theCookie.length;
            return unescape(theCookie.substring(ind + cookieName.length + 2, ind1))
        };
        BaiduWebAdapter.prototype.setCookie = function (cookieName, cookieValue, days) {
            var today = new Date;
            var expire = new Date;
            if (!days)days = 365 * 30;
            expire.setDate(today.getDate() + days);
            document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString() + ";path=/"
        };
        BaiduWebAdapter.prototype.getBaiduIdInCookies = function () {
            return this.getCookie("baiduid")
        };
        BaiduWebAdapter.prototype.getGUIDInCookies = function () {
            return this.getCookie("baiduidx")
        };
        BaiduWebAdapter.prototype.setBaiduIdReportedFlag = function () {
            this.setCookie("BDPluginReported", "1")
        };
        BaiduWebAdapter.prototype.hasReportedBaiduId = function () {
            return !!this.getCookie("BDPluginReported")
        };
        if (typeof module === "object" && typeof module.exports === "object")module.exports = new BaiduWebAdapter; else if (typeof define === "function" && define.amd)define("baiduWebAdapter", [], function () {
            return new BaiduWebAdapter
        }); else window.baiduWebAdapter = window.baiduWebAdapter || new BaiduWebAdapter
    })();
    (function (factory) {
        if (typeof define ===
            "function" && define.amd)define(["baiduWebAdapter"], factory); else if (typeof module === "object" && typeof module.exports === "object")module.exports = factory(require("baiduWebAdapter")); else factory(window.baiduWebAdapter)
    })(function (baiduWebAdapter) {
        var BaiduWebAdapter_ActiveX = function () {
            this._object = null;
            this.pluginName = "ActiveX"
        };
        BaiduWebAdapter_ActiveX.prototype._sendCallback = function (callback, result) {
            if (typeof callback === "function")callback(result)
        };
        BaiduWebAdapter_ActiveX.prototype.isSupported = function () {
            if (window.ActiveXObject ||
                "ActiveXObject"in window)try {
                var t = new ActiveXObject("BDEXIE.BDExExtension.1");
                return !!t
            } catch (e) {
                return false
            }
            return false
        };
        BaiduWebAdapter_ActiveX.prototype.initPlugin = function (silence, callback) {
            if (this._object) {
                this._sendCallback(callback, 0);
                return
            }
            if (this.isSupported()) {
                try {
                    this._object = new ActiveXObject("BDEXIE.BDExExtension.1");
                    this._isInited = true
                } catch (e) {
                    this._isInited = false
                }
                if (this._isInited)this._sendCallback(callback, 0); else this._sendCallback(callback, -1)
            } else this._sendCallback(callback,
                -1)
        };
        BaiduWebAdapter_ActiveX.prototype.uninitPlugin = function (callback) {
            if (this._object)delete this._object;
            this._object = null;
            this._sendCallback(callback, 0)
        };
        BaiduWebAdapter_ActiveX.prototype.launchApp = function (appName, installAppName, param, requiredAdmin, callback) {
            if (this._object && "LaunchApp"in this._object)try {
                this._sendCallback(callback, this._object.LaunchApp(appName, installAppName || "", param || "", requiredAdmin))
            } catch (e) {
                this._sendCallback(callback, e.number || -1)
            } else this._sendCallback(callback, -1)
        };
        BaiduWebAdapter_ActiveX.prototype.queryAppVersion = function (appName, callback) {
            if (this._object && "QueryAppVersion"in this._object)try {
                this._sendCallback(callback, this._object.QueryAppVersion(appName))
            } catch (e) {
                this._sendCallback(callback, "")
            } else this._sendCallback(callback, "")
        };
        BaiduWebAdapter_ActiveX.prototype.queryAppSupplyID = function (appName, callback) {
            if (this._object && "QueryAppSupplyID"in this._object)try {
                this._sendCallback(callback, this._object.QueryAppSupplyID(appName))
            } catch (e) {
                this._sendCallback(callback,
                    "")
            } else this._sendCallback(callback, "")
        };
        BaiduWebAdapter_ActiveX.prototype.setParam = function (key, value, callback) {
            if (this._object && "SetParam"in this._object)try {
                var res = this._object.SetParam(key, value);
                if (res === undefined)this._sendCallback(callback, 0)
            } catch (e) {
                this._sendCallback(callback, e.number || -1)
            } else this._sendCallback(callback, -1)
        };
        BaiduWebAdapter_ActiveX.prototype.getParam = function (key, callback) {
            if (this._object && "GetParam"in this._object)try {
                this._sendCallback(callback, this._object.GetParam(key))
            } catch (e) {
                this._sendCallback(callback,
                    "")
            } else this._sendCallback(callback, "")
        };
        BaiduWebAdapter_ActiveX.prototype.queryGuid = function (callback) {
            if (this._object && "QueryGuid"in this._object)try {
                this._sendCallback(callback, this._object.QueryGuid())
            } catch (e) {
                this._sendCallback(callback, "")
            } else this._sendCallback(callback, "")
        };
        BaiduWebAdapter_ActiveX.prototype.getSysInfo = function (callback) {
            if (this._object && "GetSysInfo"in this._object)try {
                this._sendCallback(callback, this._object.GetSysInfo())
            } catch (e) {
                this._sendCallback(callback, -1)
            } else this._sendCallback(callback,
                -1)
        };
        baiduWebAdapter.addPlugin(new BaiduWebAdapter_ActiveX)
    });
    (function (factory) {
        if (typeof define === "function" && define.amd)define(["baiduWebAdapter"], factory); else if (typeof module === "object" && typeof module.exports === "object")module.exports = factory(require("baiduWebAdapter")); else factory(window.baiduWebAdapter)
    })(function (baiduWebAdapter) {
        var BaiduWebAdapter_NpApi = function () {
            this._object = null;
            this.pluginName = "NpApi";
            this.isBlocked = false;
            this.afterUnblock = null
        };
        BaiduWebAdapter_NpApi.prototype._sendCallback =
            function (callback, result) {
                if (typeof callback === "function")callback(result)
            };
        BaiduWebAdapter_NpApi.prototype._ifUnblocked = function (unblockedCallback, elseCallback) {
            if (this._object) {
                if (this.isBlocked && "QueryAppVersion"in this._object) {
                    this.isBlocked = false;
                    if (typeof this.afterUnblock === "function")this.afterUnblock()
                }
                if (!this.isBlocked && !("QueryAppVersion"in this._object))this.isBlocked = true;
                if (!this.isBlocked)unblockedCallback.call(this); else elseCallback.call(this)
            } else elseCallback.call(this)
        };
        BaiduWebAdapter_NpApi.prototype.isSupported =
            function () {
                return navigator.plugins && !!navigator.plugins["\u767e\u5ea6\u7f51\u9875\u542f\u52a8\u7ec4\u4ef6"]
            };
        BaiduWebAdapter_NpApi.prototype._isOriginalChrome = function () {
            var _mime = function (where, value, name, nameReg) {
                var mimeTypes = window.navigator.mimeTypes, i;
                for (i in mimeTypes)if (mimeTypes[i][where] == value)if (name !== undefined && nameReg.test(mimeTypes[i][name]))return !0; else if (name === undefined)return !0;
                return !1
            };
            if (/QQBrowser/.test(navigator.userAgent))return false;
            return !!_mime("type", "application/vnd.chromium.remoting-viewer")
        };
        BaiduWebAdapter_NpApi.prototype.initPlugin = function (silence, callback) {
            if (this._object) {
                if (!("QueryAppVersion"in this._object)) {
                    this._sendCallback(callback, 1);
                    return
                }
                this._sendCallback(callback, 0);
                return
            }
            if (this.isSupported()) {
                if (silence)if (/Chrome.(\d+\.\d+)/.test(navigator.userAgent) && this._isOriginalChrome() || /Firefox.(\d+\.\d+)/.test(navigator.userAgent)) {
                    this._sendCallback(callback, -2);
                    return
                }
                var div = document.createElement("div");
                div.id = "BaiduExpert-npplugin-div";
                div.style.overflow = "hidden";
                div.style.height =
                    0;
                var plugin = document.createElement("embed");
                plugin.type = "application/BaiduExpert-npplugin";
                plugin.id = "application/BaiduExpert-npplugin";
                plugin.width = 0;
                plugin.height = 0;
                plugin.hidden = "true";
                div.appendChild(plugin);
                document.body.appendChild(div);
                this._object = plugin;
                if ("QueryAppVersion"in plugin) {
                    this.isBlocked = false;
                    this._sendCallback(callback, 0);
                    return
                } else {
                    this.isBlocked = true;
                    this._sendCallback(callback, 1);
                    return
                }
            }
            this._sendCallback(callback, -1)
        };
        BaiduWebAdapter_NpApi.prototype.uninitPlugin = function (callback) {
            if (this._object) {
                var div =
                    document.getElementById("BaiduExpert-npplugin-div");
                div.removeChild(this._object);
                div.parentNode.removeChild(div)
            }
            this._object = null;
            this._sendCallback(callback, 0)
        };
        BaiduWebAdapter_NpApi.prototype.launchApp = function (appName, installAppName, param, requiredAdmin, callback) {
            this._ifUnblocked(function () {
                if (this._object.LaunchApp) {
                    var res = this._object.LaunchApp(appName, installAppName || "", param || "", requiredAdmin);
                    this._sendCallback(callback, res === true ? 0 : res)
                }
            }, function () {
                this._sendCallback(callback, -1)
            })
        };
        BaiduWebAdapter_NpApi.prototype.queryAppVersion = function (appName, callback) {
            this._ifUnblocked(function () {
                if (this._object.QueryAppVersion)this._sendCallback(callback, this._object.QueryAppVersion(appName))
            }, function () {
                this._sendCallback(callback, "")
            })
        };
        BaiduWebAdapter_NpApi.prototype.queryAppSupplyID = function (appName, callback) {
            this._ifUnblocked(function () {
                if (this._object.QueryAppSupplyID)this._sendCallback(callback, this._object.QueryAppSupplyID(appName))
            }, function () {
                this._sendCallback(callback, "")
            })
        };
        BaiduWebAdapter_NpApi.prototype.setParam = function (key, value, callback) {
            this._ifUnblocked(function () {
                if (this._object.SetParam) {
                    var res = this._object.SetParam(key, value);
                    this._sendCallback(callback, res === true ? 0 : res)
                }
            }, function () {
                this._sendCallback(callback, -1)
            })
        };
        BaiduWebAdapter_NpApi.prototype.getParam = function (key, callback) {
            this._ifUnblocked(function () {
                if (this._object.GetParam)this._sendCallback(callback, this._object.GetParam(key))
            }, function () {
                this._sendCallback(callback, "")
            })
        };
        BaiduWebAdapter_NpApi.prototype.queryGuid =
            function (callback) {
                this._ifUnblocked(function () {
                    if (this._object.QueryGuid)this._sendCallback(callback, this._object.QueryGuid())
                }, function () {
                    this._sendCallback(callback, "")
                })
            };
        BaiduWebAdapter_NpApi.prototype.getSysInfo = function (callback) {
            this._ifUnblocked(function () {
                if (this._object.GetSysInfo)this._sendCallback(callback, this._object.GetSysInfo())
            }, function () {
                this._sendCallback(callback, -1)
            })
        };
        baiduWebAdapter.addPlugin(new BaiduWebAdapter_NpApi)
    });
    var each = function (arr, callback, context) {
        var results =
            [];
        if (!arr.length)return [];
        for (var i = 0; i < arr.length; i++)results[results.length] = callback.call(context, arr[i]);
        return results
    };
    var dictionary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890.+-!()";
    var dictionaryArray = dictionary.split("");

    function wordEncode(word) {
        if (word === "")return word;
        var wordArray = word.split("");
        return each(wordArray, function (item) {
            return dictionaryArray[dictionary.indexOf(item) + 1] || item
        }).join("")
    }

    function wordDecode(word) {
        if (word === "")return word;
        var wordArray =
            word.split("");
        return each(wordArray, function (item) {
            return dictionaryArray[dictionary.indexOf(item) - 1] || item
        }).join("")
    }

    var getCookieRaw = function (key, win) {
        var result;
        var win = win || window;
        var doc = win.document;
        var reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        var regResult = reg.exec(doc.cookie);
        if (regResult)result = regResult[2];
        return result
    };
    var setCookieRaw = function (key, value, options) {
        options = options || {};
        var expires = options.expires;
        if ("number" == typeof options.expires) {
            expires = new Date;
            expires.setTime(expires.getTime() +
                options.expires)
        }
        document.cookie = key + "=" + value + (options.path ? "; path=" + options.path : "") + (expires ? "; expires=" + expires.toGMTString() : "") + (options.domain ? "; domain=" + options.domain : "") + (options.secure ? "; secure" : "")
    };

    function getBrowser() {
        var result = 5;
        var ua = navigator.userAgent;
        var ie = ua.match(/msie (\d+\.\d)/i);
        if (ie) {
            var IEVersion = parseInt(ie[1]);
            if (IEVersion < 10 && IEVersion > 6)result = 1; else if (IEVersion === 6)result = 6; else if (IEVersion > 9)result = 6
        } else if (nav.appName === "Netscape" && /Trident/.test(nav.userAgent))result =
            7; else if (/firefox\/(\d+\.\d)/i.test(ua))result = 3; else if (/chrome\/(\d+\.\d)/i.test(ua))result = 2; else if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua))result = 4;
        if (/ios|iphone|ipad/i.test(ua))result = 101;
        return result
    }

    function getQueryValue(url, param, decode) {
        var reg = new RegExp("(\\?|&|#)" + param + "=([^&#]*)(&|#)?");
        var match = url.match(reg);
        var value = "";
        if (match)value = match[2];
        if (decode)value = decodeURIComponent(value);
        return value
    }

    function log(url, data) {
        var query = [];
        for (var key in data)if (Object.prototype.hasOwnProperty.call(data,
                key))query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        query.push("_=" + +new Date);
        url += query.join("&");
        if (nav.appName === "Microsoft Internet Explorer") {
            var ua = ua || "";
            var ie = ua.match(/msie (\d+\.\d)/i);
            if (ie && parseInt(ie[1], 10) < 8)url = url.slice(0, 2048)
        }
        var wrapper = document.createElement("div");
        var container = document.body;
        container.insertBefore(wrapper, container.firstChild);
        var iframeHTML = ["<iframe", ' width="1" ', 'height="1" ', 'src="' + url + '" ', 'align="center" ', 'marginwidth="0" ',
            'marginheight="0" ', 'scrolling="no" ', 'frameborder="0" ', 'allowtransparency="true" ', "</iframe>"].join("");
        wrapper.innerHTML = iframeHTML
    }

    var startTime = +new Date;
    var mode = 0;
    var win = window;
    var scr = win.screen;
    var nav = win.navigator;
    var href = win.location.href;
    var ua = nav.userAgent;
    var unionFlow = href.indexOf("cf=u") !== -1 || href.indexOf("cpro.baidu.com") !== -1;
    var store = {};
    var storeArray = [];
    var isSend = false;
    var font = 0;
    var fontsStr = "";
    var br = getBrowser();
    var ECLICK_HOST = "http://eclick.baidu.com/";
    var logUrl =
        ECLICK_HOST + "fp.htm?";
    var unionLogUrl = ECLICK_HOST + "nova_fp.htm?";
    win["isFpJsReady"] = function () {
        return "fontList"
    };
    var fpParams = [{
        key: "sr", value: function () {
            return [scr.width, scr.height, scr.colorDepth, win.devicePixelRatio || 1].join("x")
        }
    }, {
        key: "je", value: function () {
            return +nav.javaEnabled()
        }
    }, {
        key: "ce", value: function () {
            return +nav.cookieEnabled
        }
    }, {
        key: "tz", value: function () {
            return (new Date).getTimezoneOffset()
        }
    }, {
        key: "pl", value: function () {
            function getNewChromePluginsString() {
                return each(nav.plugins, function (p) {
                    var mimeTypes =
                        each(p, function (mt) {
                            return [mt.description, mt.type, mt.suffixes].join("~")
                        }).join(",");
                    var pinfo = [p.name, p.description, p.filename, mimeTypes].join(".");
                    return md5(pinfo)
                }, this).join("-")
            }

            function getIEPluginsString() {
                function ieAcrobatVersion() {
                    var oAcro;
                    var name = md5("Adobe Acrobat version") + " ";
                    if (window.ActiveXObject) {
                        for (var x = 2; x < 10; x++)try {
                            oAcro = eval('new ActiveXObject("PDF.PdfCtrl.' + x + '");');
                            if (oAcro)return name + x + ".?"
                        } catch (ex) {
                        }
                        try {
                            oAcro = new ActiveXObject("PDF.PdfCtrl.1");
                            if (oAcro)return name +
                                "4.?"
                        } catch (ex) {
                        }
                        try {
                            oAcro = new ActiveXObject("AcroPDF.PDF.1");
                            if (oAcro)return name + "7.?"
                        } catch (ex) {
                        }
                        return ""
                    }
                }

                function getPluginsVersion(item) {
                    var name = wordDecode(item.key);
                    var func = wordDecode(item.fun);
                    var version;
                    try {
                        window["obj"] = new ActiveXObject(name + ".1");
                        if (obj) {
                            version = func === "" ? 1 : eval("obj" + func);
                            return version
                        }
                    } catch (ex) {
                    }
                    for (var x = 2; x < 10; x++)try {
                        obj = eval('new ActiveXObject("' + name + "." + x + '");');
                        if (obj) {
                            version = func === "" ? 1 : eval("obj" + func);
                            return version
                        }
                    } catch (ex) {
                    }
                    return ""
                }

                function activeXFeature() {
                    if (!window.ActiveXObject)return false;
                    try {
                        if (window.external && external["msActiveXFilteringEnabled"] && external["msActiveXFilteringEnabled"]())return false
                    } catch (ex) {
                    }
                    return true
                }

                if (activeXFeature()) {
                    var names = ["RvjdlUjnf", "EfwbmWS", "Tipdlxbwf", "Gmbti", "XjoepxtNfejbqmbzfs", "Tjmwfsmjhiu", "WMD", {
                        key: "CbjevCbs+Uppm",
                        fun: "+vtfsJE"
                    }, {key: "Hpphmf+PofDmjdlDusm", fun: ""}, {key: "RwpeJotfsu+RwpeDusm", fun: "+Wfstjpo"}];
                    var plugins = each(names, function (item) {
                        var version = "";
                        var name;
                        if (typeof item === "string") {
                            name = wordDecode(item);
                            try {
                                version = PluginDetect["getVersion"](name)
                            } catch (e) {
                            }
                        } else {
                            name =
                                wordDecode(item.key);
                            version = getPluginsVersion(item)
                        }
                        if (version) {
                            var plName = md5(name);
                            return plName + ":" + version
                        }
                        return ""
                    });
                    var ieAcrobat = ieAcrobatVersion();
                    plugins.push(ieAcrobat);
                    var exists = [];
                    each(plugins, function (plugin) {
                        if (plugin !== "")exists.push(plugin)
                    });
                    return md5(exists.join("-"))
                }
                return ""
            }

            if (br === 1)return getIEPluginsString(); else return getNewChromePluginsString()
        }
    }, {
        key: "sc", value: function () {
            var sc = "";

            function test_local_storage() {
                var result = "0";
                var name = "BAIDU_POS_wh";
                try {
                    win.localStorage[name] =
                        "@";
                    if (win.localStorage[name] === "@") {
                        result = "1";
                        win.localStorage.removeItem(name)
                    }
                } catch (ex) {
                }
                return result
            }

            function test_ie_userdata() {
                var result = "0";
                try {
                    var oPersistDiv = document.getElementById("oPersistDiv");
                    oPersistDiv.setAttribute("remember", "@");
                    oPersistDiv.save("oXMLStore");
                    oPersistDiv.setAttribute("remember", "!");
                    oPersistDiv.load("oXMLStore");
                    if ("@" == oPersistDiv.getAttribute("remember"))result = "1"
                } catch (ex) {
                }
                return result
            }

            sc += test_local_storage() + test_ie_userdata();
            return sc
        }
    }, {
        key: "im", value: function () {
            return +(window["orientation"] !==
            undefined)
        }
    }, {
        key: "wf", value: function () {
            return 0
        }
    }];
    var chromeParams = [{key: "ah", value: scr["availHeight"]}, {key: "aw", value: scr["availWidth"]}, {
        key: "cav", value: function () {
            try {
                var canvas = document.createElement("canvas");
                if (!canvas || !canvas.getContext || !canvas.toDataURL)return 0;
                var ctx = canvas.getContext("2d");
                if (!ctx.fillText)return 1;
                var txt = "valve.github.io";
                ctx.textBaseline = "top";
                ctx.font = "14px 'Arial'";
                ctx.textBaseline = "alphabetic";
                ctx.fillStyle = "#f60";
                ctx.fillRect(125, 1, 62, 20);
                ctx.fillStyle = "#069";
                ctx.fillText(txt, 2, 15);
                ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
                ctx.fillText(txt, 4, 17);
                var url = canvas.toDataURL();
                return md5(url)
            } catch (ex) {
                return 2
            }
        }
    }, {key: "com", value: 0}, {
        key: "lan",
        value: (nav["language"] || 0) + "|" + (nav["systemLanguage"] || 0) + "|" + (nav["userLanguage"] || 0)
    }, {key: "pla", value: nav["cpuClass"] || 0}];
    var IEParams = [{key: "ah", value: scr["availHeight"]}, {key: "aw", value: scr["availWidth"]}, {
        key: undefined,
        value: 0
    }, {
        key: "com", value: function () {
            var cid = ["{000E70CF-7679-3722-CA69-D4118553778C}", "{00569105-5578-90FD-836F-4A10B69C230C}",
                "{01D5F230-C393-4C0F-C8C7-3AE91695487D}", "{025CA7D4-5055-F754-93F4-C90B2AF6B0DB}", "{02DB4F18-4E28-E993-3C9F-D1FC393FA513}", "{036DD58B-41FD-599D-04A9-EC02AAFE97C5}", "{03A2DFCD-6B0F-9B22-66EF-4045D882C216}", "{04A33D51-5213-62FE-46D8-48F4CE675829}", "{04BA5D4E-A378-F7B8-A159-AE8485680081}", "{067A1BE2-8B96-C3F4-254D-5FD77D1D4EF7}", "{06F79772-8AA2-D37B-92E5-02DBC16D52AC}", "{070C098C-5549-921E-7F39-1ED1EA4AE448}", "{077745DD-31D0-E352-EC34-F9BE4557AA21}", "{07CA4663-55D5-ACEC-8655-6877D48A2AD5}", "{08B0E5C0-4FCB-11CF-AAA5-00401C608500}",
                "{08B0E5C0-4FCB-11CF-AAA5-00401C608555}", "{08C79252-67DB-CA16-C9B2-334981191E07}", "{0977A0BC-0AC1-4FC6-F3AF-755B288A6B61}", "{0A019768-379A-3EB3-8379-61CC0BFD1F66}", "{0AC0F273-E7A9-F2FE-E4D7-A5BA9114C33E}", "{0B6224F5-24CA-67A8-C19F-A5D53B48B055}", "{0BB6F6DB-8702-0FB8-0337-90B3A5D2C14A}", "{0BF18F9A-59B2-C941-0227-E363C57931C3}", "{0C5EA5DD-1E38-442C-B957-564857FA5F2F}", "{0C6E3311-98BF-E0D4-56F2-FF651E9AACA4}", "{0CDFCB6F-12EF-4774-83B7-48B0A79D2776}", "{0CF89B4A-6C1A-4DE1-68A4-78E547A9BA76}", "{0D42403C-C385-88B5-5596-F570041E7597}",
                "{0E47D211-F406-5213-4FB7-C4F101209263}", "{0E7A75C5-B3F9-680B-F7A1-7555B887707E}", "{0E86EA87-7161-DEC8-0B6E-F123D9765211}", "{0EC08A50-2C99-C7A4-DF6C-9E450AA6D4B9}", "{0EEB34F6-991D-4A1B-8EEB-772DA0EADB22}", "{0F32B4E7-7D38-C46B-D2D9-B0B437D0C1D1}", "{0FC72956-417E-CA85-FF44-BA05009D4F6D}", "{0FDE1F56-0D59-4FD7-9624-E3DF6B419D0E}", "{0FDE1F56-0D59-4FD7-9624-E3DF6B419D0F}", "{0FDF4E27-8EEF-36E2-D95C-4D6475FBD028}", "{10017173-A707-22D2-9CBD-0000F87A469H}", "{10072CEC-8CC1-11D1-986E-00A0C955B42F}", "{10880D85-AAD9-4558-ABDC-2AB1552D831F}",
                "{1281DF4F-EF77-054C-90E1-34F21CDD215B}", "{12D0ED0D-0EE0-4F90-8827-78CEFB8F4988}", "{12D0ED0D-0EE0-4F90-8827-78DEFB8F4988}", "{1325DB73-D9F1-48F8-8895-6D814EC58889}", "{13DC7C19-37EC-7370-D515-A8C3197A838D}", "{14429F1F-B8AB-FE11-D24B-5FB6F28188E0}", "{14C9AB18-3EC9-B39F-7515-B99C1C951505}", "{14DE86C6-B527-B827-A672-FAD4904B2DE1}", "{15187241-8805-7D0A-00BF-0AB1310EBFDB}", "{160C474B-C6EE-979D-E9A9-5D221ED798AB}", "{1666C493-2765-E5DE-6162-5234A809EDB7}", "{166B1BCA-3F9C-11CF-8075-444553540000}", "{16BAB0E6-0FB1-158B-F63B-A2986F1F73C6}",
                "{17411933-F6F8-3E67-EA3C-7F2937187248}", "{1951E00C-15A3-7022-AC45-6FE8D24C344B}", "{1A88340D-24F3-C2A6-45FE-18880A5C5086}", "{1ACB6433-A94C-3952-8EAA-985E9B35B6DF}", "{1AD147D0-BE0E-3D6C-AC11-64F6DC4163F1}", "{1BDFFF4E-5DEA-F340-8B31-0B670299B82B}", "{1D8D32C1-7CF8-4BCC-BDD6-560BDAA5E97E}", "{1D989E3F-1318-3BA2-AE1C-C8D10B885A84}", "{1DF0791D-2030-7D68-2DD1-48829543532A}", "{1ED1C125-9112-244B-12DA-82FD3F91D487}", "{1F5EE339-7B5F-451A-A664-55E90A321B29}", "{1F973868-B604-61E6-27F4-3A2666532202}", "{20C51A56-59EE-2278-487C-26FE41FF4345}",
                "{210445E5-37B5-E021-9C23-87BF1B478B8E}", "{21406269-E356-1CA6-84F1-3F6B17789066}", "{214D1654-DB88-C788-BC65-974094212A82}", "{2179C5D3-EBFF-11CF-B6FD-00AA00B4E220}", "{21843404-6998-7A57-D4DB-9462193B3882}", "{21D337F6-7548-4C7C-A931-2EEAF254B69A}", "{22BEEC55-EEE0-0A78-C802-3B9E8BA5BD1E}", "{22D6D312-B0F6-11D0-94AB-0080C74C7E95}", "{22D6F312-B0F3-11D0-94AB-0080C74C7E95}", "{22D6F312-B0F4-11D0-94AB-0080C74C7E95}", "{22D6F312-B0F6-11D0-94AB-0080C74C7E95}", "{22EA2E6E-96C7-4F7E-8B73-DFA81D8D4299}", "{23082D70-FEB5-2346-E645-D8B523D85918}",
                "{233C1507-6A77-46A4-9443-F871F945D258}", "{23F8AD0B-F8B3-7DC5-D589-05ADF5A8B4FB}", "{248955D7-F191-3B1D-A8DC-C04EC2954ACF}", "{24B2A0DA-76BA-3C1D-B0B8-9083BEACDD9A}", "{25D6F312-B0F6-11D0-94AB-0080C74C7V95}", "{26650862-5B2D-2438-8B1E-346AE6CD4982}", "{26923B43-4D38-484F-9B9E-DE460746276C}", "{26923C43-4D38-484F-9B9E-DE460746276C}", "{26A24AE4-039D-4CA4-87B4-2F83216041FF}", "{26B8F213-A41C-A25A-0CD8-E964480B7A53}", "{27493983-278A-09BF-B5DE-AF02FB747659}", "{2793EF10-5A29-C293-ABAA-DC6F6ABB8C69}", "{27B6A3B4-3558-089F-4E51-F8447A72DCE7}",
                "{283807B5-2C60-11D0-A31D-00AA00B92C03}", "{288E578F-9893-D7EC-F3BA-9061ABF6FACE}", "{2899A470-794E-E19E-3681-6F5B2CFD1542}", "{289B494B-5B81-8698-E4A3-B5F7A48898A9}", "{2991BB1A-ECF5-3B12-8A5E-1D50379236ED}", "{29FFA778-B6A4-E4D0-FE6F-9383A989F373}", "{2A202491-F00D-11CF-87CC-0020AFEECF20}", "{2AFF315E-B766-4FBC-B3E0-526236EE2EAB}", "{2B1C76CA-D227-6707-D35F-270049E357DC}", "{2B27607C-4F75-5677-3696-BE951096F28B}", "{2B339C45-F93A-852A-405E-1220882AB066}", "{2B88B781-0794-3547-9B06-3C4C5DB2A5CD}", "{2BB9EC1A-2A8E-A85C-8F76-A377EA92F511}",
                "{2C440540-BC82-B00F-F1DB-C55477AEC95E}", "{2C7339CF-2B03-4501-B3F3-F3508C9228ED}", "{2C7339CF-2B09-4501-B3F3-F3508C9228ED}", "{2C77460E-4626-BD3E-8A05-E0260A31873E}", "{2D3FAD85-0CB2-4F15-9336-2ABA327EB36B}", "{2D46B6DC-2207-486B-B523-A557E6D54B47}", "{2D854340-AFDC-F865-901A-FCA0BB42FB2D}", "{2DB6A559-78BB-1EDA-37D3-887C2555FFB5}", "{2E2BDDA8-A086-BBF5-8A59-06AE5E848682}", "{2E6C12F7-DAF0-E830-70DC-16B3BD9BD996}", "{2EC5ACDA-9157-E313-EBC4-69C8ABAFE5A9}", "{2F2E7FF3-7CF2-ACF6-C53F-BB27D510DD7C}", "{2FACAC43-BF86-9267-F7EE-5958587FC0A7}",
                "{2FDAA797-3F35-2DCC-9005-1EE268F39423}", "{2FE7C4D9-3724-9CEB-5739-CF6A6AF4500C}", "{30E60662-94D8-BB62-31FE-26CC095F1CBD}", "{310D6BB5-9509-AB0A-5CEF-F310DCEAD654}", "{31B7166D-E0CE-7333-CC38-EABB4CE2C5D9}", "{32369C0D-1081-97E7-27CA-0498B81648C9}", "{331239FC-560A-1EB6-4EAD-420442915F73}", "{34E23F0A-1F7A-423B-826A-BB780154357D}", "{35932D18-EF74-9E04-5ACA-B39AC6B4B377}", "{3639ECA6-CB65-7928-111F-22335FB1651F}", "{3651F7F8-93AC-F94F-41E6-031AECB3E6D1}", "{36BBA8D2-CA5C-4847-81CC-4F807DD86C91}", "{36F8EC70-C29A-11D1-B5C7-0000F8051515}",
                "{37EF6C1C-D56E-4AFE-B0CA-718BF4AD5EFF}", "{380F0067-D69D-1492-EEA8-234E930AA812}", "{3865C519-05A3-3A87-6D15-D8CACE7A8A76}", "{38689238-428E-ACF8-F745-5EDAF9356EF5}", "{3975A2AE-BF5E-41FC-0EA2-C9EEC4A6D88D}", "{39823D92-3C03-3863-837B-8D092B6844F3}", "{39D39EBC-3179-7FDE-9052-3311BFBB3AF8}", "{3A8403F3-90B5-35DC-8926-EB9B907209F9}", "{3A9EE80A-66BD-0488-B345-44DF6B403831}", "{3AF36230-A262-11D1-B5BF-0000F8051515}", "{3AF36230-A269-11D1-B5BF-0000F8051515}", "{3BE10C81-0620-A6A6-21A3-807F585B2D52}", "{3BF42070-B3B1-11D1-B5C5-0000F8051515}",
                "{3C3901C5-3455-3E0A-A214-0B093A5070A6}", "{3C483978-7688-2A38-1809-8C49FD828771}", "{3C768387-07FF-675C-5AD9-14830F928484}", "{3CE02F38-C912-44CF-B02E-60F7964E61FF}", "{3D487512-EF7B-4101-8CFA-E3F8A9769069}", "{3E3910BB-8151-F720-49DF-398A047B798E}", "{3E8E081F-C847-397C-D7C9-AD2C1BDDA94E}", "{3EBAC9C0-1750-6977-168A-645D37D0DDC3}", "{3EDB2451-83F5-EF89-2E72-483077385EDE}", "{3F1A6811-2A18-F120-81E7-587A19014F46}", "{3FAA94BC-C5C5-CDB9-CD03-ACACF18198E2}", "{402D05AE-7794-7E05-D0F2-7CDC0542CDB9}", "{405BB8B2-26CC-0A4F-19C4-52CE236C9F39}",
                "{4087E3ED-A39D-E06D-0B08-74131AFDD2E4}", "{40D4CFE9-AE18-3A04-E80D-5AF002EF3285}", "{411052BD-E05A-3AEF-3F5D-530C65266F1F}", "{411EDCF7-755D-414E-A74B-3DCD6583F589}", "{41A15C2E-A88F-E9E7-ABD4-4AC18A3D98E5}", "{41E58EA3-CDF1-7C97-EC15-4F087A9B48F3}", "{4278C270-A269-11D1-B5BF-0000F8051515}", "{42EE3387-0C3B-AA1B-E9CF-E25AE3DEE891}", "{431C9C90-B92D-A1EF-0B66-9B23BA1F442F}", "{4387A611-5BC4-68CD-21FD-FCAD57AF10E6}", "{44454A92-BB05-36E7-6BA4-26113215BD40}", "{44BBA840-CC51-11CF-AAFA-00AA00B6015C}", "{44BBA840-CC54-11CF-AAFA-00AA00B6015C}",
                "{44BBA842-CC51-11CF-AAFA-00AA00B6015B}", "{44BBA842-CC51-11CF-AAFA-00AA00B6015C}", "{44BBA848-CC51-11CF-AAFA-00AA00B6015C}", "{44BBA855-CC51-11CF-AAFA-00AA00B6015C}", "{44BBA855-CC51-11CF-AAFA-00AA00B6015D}", "{44BBA855-CC51-11CF-AAFA-00AA00B6015F}", "{44BBA855-CC52-11CF-AAFA-00AA00B6015F}", "{44BBB855-CC51-11CF-AAFA-00AA00B6015F}", "{45EA75A0-A263-11D1-B5BF-0000F8051515}", "{45EA75A0-A269-11D1-B5BF-0000F8051515}", "{461AE280-B5F8-CA80-16B9-D52162FD275C}", "{46C627DC-CED2-4A26-16A3-2138394D6655}", "{472E5276-AB9A-34A1-1110-C793C003F137}",
                "{477F9E17-C88F-9EEC-7B98-F8589C65E01E}", "{47B725F8-6C44-B06E-0BDE-39C557C1BBF9}", "{47F67D00-9E55-11D1-BAEF-00C04FC2D130}", "{48349778-ADCC-0063-D2F8-41DB5C7F46EE}", "{484323F6-AAEC-EDE1-A661-7460DBC43878}", "{48C249C7-7730-7D2D-59B8-954348F5D818}", "{4903D172-DCCB-392F-93A3-34CA9D47FE3D}", "{496972D0-6B98-70BD-62C9-6BA8CC708080}", "{4981E457-CFFF-3B36-F51B-E5593FD9444C}", "{49CB23A9-8BEC-4646-B93A-682DBA19478F}", "{4B218E3E-BC98-4770-93D3-2731B9329278}", "{4C3C13ED-FD09-E5EC-A54D-F99EC55DB360}", "{4C574292-5BC3-574C-B361-D13F1BE99909}",
                "{4C645220-306D-11D2-995D-00C04F98BBC9}", "{4C8A1192-2F69-37F8-528A-3F4377D7ED4E}", "{4CE46026-08EC-5FF4-1D06-F675FF061597}", "{4D033DFA-67A1-906C-3EE7-2E44A47A47B1}", "{4D2531CE-33A0-7EA8-5706-10B9A858796F}", "{4D44E7F9-6164-AFC5-54DD-F1368293AF73}", "{4D930876-6DDE-97C9-A344-C87E7EA4858D}", "{4DD80E5A-F33E-0FB6-00F3-89A83BB69C5E}", "{4DF597DE-5108-5474-9C16-BFEDDC52CCB6}", "{4E3C5312-84CF-CBD3-52A3-FF837B4326B3}", "{4E68684E-B7FC-37A9-CBDB-844ECEFD9C64}", "{4E9213E5-0ACA-E99F-1825-8DB4DA30862B}", "{4EB1886D-C895-48A2-EABB-581E83B316BE}",
                "{4EECE1D3-FBFE-40F6-B6CC-79834A4B06BF}", "{4F12C31A-0B6E-4D60-ACB9-6ACE9214951B}", "{4F216970-C90C-11D1-B5C7-0000F8051515}", "{4F216970-C90C-11D1-B5C7-0000F8151515}", "{4F4BB251-EC07-6E9C-652F-3C742B59D8EE}", "{4F645220-303D-11D2-995D-00C04F98BBC9}", "{4F645220-306D-11D2-995D-00C04F98BBC9}", "{4F7A88FD-85CD-99BD-51CC-EFC4B1941E60}", "{4F866038-68E4-907D-CE46-2BFF167F3184}", "{4FA56737-2179-D9FC-C3A5-49F02DF0DA0D}", "{4FF55B79-8363-2023-B7B7-4C5B70C21B80}", "{4FFD7372-4475-5737-FF2B-9A461520032B}", "{500F1940-9FE4-E734-052D-671A4B071574}",
                "{503519C9-878A-CA24-9BB2-285B24088416}", "{5056B317-8D4C-43EE-8543-B9D1E234B8F4}", "{5084F01D-458E-45EB-A6FD-692D4C9D2789}", "{51FA3C94-20B0-E535-B0BE-134CBC53C147}", "{527E64E0-9AE4-F070-4D3A-0A1FF9E2D34D}", "{52A69CD2-7424-46C9-FC8D-EFA206FE4406}", "{5504981F-539D-F9A6-6BB8-0B5AA6AC48A8}", "{561A01CF-A66E-F122-E387-A4F0FC77421A}", "{567AE324-0B4C-63FD-AA5C-55DD07D454CD}", "{56BE2708-1A19-500E-5372-453CE9448226}", "{574F75B5-2C3B-4236-5DD2-8BC9B6E3A459}", "{57FC94F8-7B27-4CB1-81AE-DF4C84B95419}", "{5945C046-1E7D-11D1-BC44-00C04FD912BE}",
                "{5945C046-LE7D-LLDL-BC44-00C04FD912BE}", "{59559CFE-5144-F1D6-3F06-7EBD966EF899}", "{59B276B8-D0AC-4D8E-8CFC-B5BA6E8E757E}", "{59C5485F-143B-A8E5-88D5-F459E6666937}", "{5A799495-3918-5824-071F-489FFAFDD4B7}", "{5A8D6EE0-3E18-11D0-821E-444553540000}", "{5B35FCB8-E5FA-6770-005D-E9BA267FFC5F}", "{5B5B4C0B-71D4-3F85-F168-58EA393CD25C}", "{5CA109D3-A084-47E8-A9CB-D497322E3F50}", "{5E4B56AA-E66B-5C4B-F3D0-B3A59AB337F9}", "{5E9A2256-8D2E-FD77-E699-886E562F8892}", "{5EEB3813-E0C6-DDFD-B0E5-3E381B367895}", "{5F1E9ADE-9A89-3CE2-5499-35C348B41E9F}",
                "{5FC9C6B1-A582-15CE-F1AC-CE355ED476A2}", "{5FD399C0-A30A-11D1-9948-00C04F98BBC9}", "{5FD399C0-A70A-11D1-9948-00C04F98BBC9}", "{60B49E34-C7CC-11D0-8953-00A0C90347FF}", "{60B49F34-C7CC-11D0-8953-00A0C90347FF}", "{60B9ACF4-BBAC-FD35-A8AC-736665FD3B0A}", "{60E74863-AF8D-B123-33AE-FA9B7484C176}", "{611BA10E-5260-173A-6AA0-9FA10AADFBAB}", "{630B1DA0-B365-11D1-9948-00C04F98BBC9}", "{630B1DA0-B465-11D1-9948-00C04F98BBC9}", "{6319516C-24FB-A26E-3557-A6CB813A1A2C}", "{6362CB2F-7AD8-A05D-5743-EE889376085E}", "{63982FC4-D6DF-44A0-B6A3-08E0C704C177}",
                "{63D0163A-4656-EE06-650B-0015D56BFFE5}", "{64621582-F663-4FA3-0734-56D65DECB44D}", "{64989934-F2D7-79A2-595B-F0C09ED9F58C}", "{64F2C331-D64E-F590-9AAE-EB3131FB126E}", "{652E9670-CF4D-D623-7175-5D8CCC353CCA}", "{6577EE8D-DF95-A620-34D1-7DA8DA048EE7}", "{6598D9E1-88F2-EA70-419D-B06FFC9F148C}", "{65DC1879-A566-4EBC-A82F-5B760692F88B}", "{65E1716A-AB22-2CE0-AC2A-B8804A88C5F7}", "{66438D7D-56FB-0DCD-D968-BA934E3AE7FF}", "{67049335-3AE1-DA28-047D-A7055F9A8E67}", "{67C5EC16-0DC1-4045-A7FF-D7D0FFA4B54D}", "{680A15A2-8500-8EF0-1869-2ECCDF2C3483}",
                "{682522AA-D524-2BE1-9D8E-D45F1EA1B92C}", "{68A6D5CA-7EAA-9614-D770-667E2048B7BF}", "{68E61F41-2B03-C379-86CB-AA62B7F9649F}", "{6911D9F5-E1D6-48DC-7E30-279A9BC942F1}", "{697D5196-8870-9843-2D3B-BEE6C982B0BE}", "{6A01EC41-8801-635A-1EB6-87C321552E63}", "{6A6AF714-E335-9573-2946-87732FE23BDC}", "{6A6B2E96-0E96-4770-EA2B-44F12AF68E45}", "{6AA77CB4-0DC7-52E7-E474-23F203BBDCE1}", "{6B0853DB-02DA-A6F2-DD34-42BC3696B39D}", "{6BF52A52-334A-11D3-B153-00C04F79FAA6}", "{6BF52A52-394A-11D3-B153-00C04F79FAA6}", "{6D3D7E8D-D311-157D-43CA-86B6DA76EC35}",
                "{6D69F546-C1AF-4049-AE9E-28627B91D3F5}", "{6E8808C0-EDD8-808D-7415-DC26B3BDDEC4}", "{6EB47927-FD69-7621-D9DF-6E8CCAD325A2}", "{6ED62467-2949-DDF8-77E7-2BC32BFDB669}", "{6EF52C23-74D1-7A06-4494-5E0920CA6D66}", "{6F39D0F4-53BE-FE2E-38B4-2D9E14EDCC4E}", "{6F7746FF-DD98-4892-87AE-5BE4932890A6}", "{6F9A4492-09DA-4EE6-9103-654202A9579B}", "{6FAB99D0-BAB3-11D1-994A-00C04F98BBC9}", "{6FAB99D0-BAB8-11D1-994A-00C04F98BBC9}", "{6FABC528-DAF0-3BDE-6DE4-CC41D3D7CA6E}", "{6FC3994D-CEA1-7E34-7858-D1A86B94C685}", "{6FCB99D0-BAB8-11D1-994A-00C04F98BBC9}",
                "{702EE346-9312-4FA6-A057-70956000E83D}", "{708A1F11-7F82-B226-6044-BA30EB0C74A3}", "{7131646D-CD3C-40F4-97B9-CD9E4E6262EF}", "{714EF631-36B8-1E36-25F7-5E87192CCE38}", "{717D038F-F860-FB97-DF4E-CA2F108D761B}", "{726B39E2-8988-8454-9171-AD7956436DCF}", "{728B0B2B-2548-C5D4-6AB1-8A3502B30976}", "{72D76F9E-0F54-C57B-D3B7-5E3CED1174BB}", "{7376B131-FEB1-70B6-F7EB-F28E2926A1CC}", "{73926001-7573-1133-4F1A-6CC40AE3B406}", "{73DBE6D8-3447-43A6-AACA-E1F5CDA2C036}", "{73FA19D0-2D75-11D2-995D-00C04F98BBC9}", "{74166507-F39E-305E-A972-2C3478E47350}",
                "{7549A4D5-963E-4BFE-BCD6-3EC1233D717A}", "{754D0182-4466-981C-1BFB-CD3F3F2B224D}", "{75904D8E-6F06-8D42-2F3D-E28DB414979D}", "{75AE0D04-F6A4-A9C7-A0D4-5CB3101000E1}", "{7607A62F-940B-3085-D1DE-EBC78D307A74}", "{762F7625-9E81-B061-35C9-4A675560FC8A}", "{76308B1B-1F45-7AB3-C348-C0F7078E9250}", "{766D926A-EF62-C7BC-7B1B-1F52511D1757}", "{76AD518A-48AE-F255-BC9A-979BB7CE3D9B}", "{76C19B30-F0C8-11CF-87CC-0020AFEECF20}", "{76C19B31-F0C8-11CF-87CC-0020AFEECF20}", "{76C19B32-F0C8-11CF-87CC-0020AFEECF20}", "{76C19B33-F0C8-11CF-87CC-0020AFEECF20}",
                "{76C19B34-F0C8-11CF-87CC-0020AFEECF20}", "{76C19B35-F0C8-11CF-87CC-0020AFEECF20}", "{76C19B36-F0C8-11CF-87CC-0020AFEECF20}", "{76C19B37-F0C8-11CF-87CC-0020AFEECF20}", "{76C19B38-F0C8-11CF-87CC-0020AFEECF20}", "{76C19B50-F0C8-11CF-87CC-0020AFEECF20}", "{777CA562-C5D5-0B25-BD36-5CFC06F25994}", "{7790769C-0471-11D2-AF11-00C04FA35D02}", "{7790769C-0473-11D2-AF11-00C04FA35D02}", "{78081350-4D0C-417B-D23B-AD75DCE73055}", "{78E345F7-E973-3595-9C30-2458D6A8EC32}", "{78E345F7-E976-3595-9C30-2458D6A8EC32}", "{7931B6E6-30C5-95EE-A7EE-F24412022E80}",
                "{797EB3EC-83AA-AC6E-B2C8-D42FD606D9A0}", "{7AAFE31E-3727-7554-4881-90DC37E3144B}", "{7B54B31C-0C4D-13E1-878F-FAF2EE3BDE47}", "{7B6D6B64-199C-AB13-C01A-32D14ECEA3CF}", "{7BAD4355-D3D5-4F66-9546-8BF1C8E3DFCF}", "{7BFD3F2A-4450-51AA-B6FC-E96C2B285E6F}", "{7C028AF8-F614-47B3-82DA-BA94E41B1089}", "{7C22A2DA-3108-5D04-FDF3-C1E8F7D4D891}", "{7C50C031-02E6-2DA3-4AE9-5330EB4287A0}", "{7C86A7C0-5681-18DD-E6E4-8538C0A77621}", "{7DEBE4EB-6B40-3766-BB35-5CBBC385DA37}", "{7E453DEC-CBD0-45F9-B8BD-F0AA2F306DD1}", "{7E59919F-564E-3FB5-B1FC-884251B18B06}",
                "{7E682125-0665-0595-1615-10FEBF5498C6}", "{7E71D556-4D87-36D5-A905-E6D98E115F45}", "{7E99C98B-0616-1092-1961-7B95DC7881F8}", "{7EE7F3B3-8F38-7D21-7140-A84FA93BE304}", "{7F66508F-100B-380E-A7BB-379CDC3FE30A}", "{7FE9318F-0122-4EEA-80BA-38FF040B8C65}", "{8056AC9E-49C5-4375-9ADE-B2F862C9DF51}", "{80C939B2-CB71-92A6-A794-C870625FF43C}", "{813C1FF4-4861-DC8B-9457-200DE766A751}", "{8152B5BE-3A9A-5744-6506-1F6E3C1357A2}", "{81DCEDC9-DC5C-48AF-946A-45C09E8A33F0}", "{823E88FA-54E6-4C34-0178-AE51A7C19B5E}", "{82811E6B-5F33-21C2-6F06-BF6F15AE0FD4}",
                "{82A12185-1853-58F3-9E17-F6967594E416}", "{82DC5384-1FC2-F528-76D7-E0ACFB6E3708}", "{830B547D-87AA-03FF-D706-BF10CA93BD81}", "{8386BA04-1DFD-16AE-DFE5-42E28369EA32}", "{83BEAB59-22AC-D903-8E24-E3DFEA56CC73}", "{8488C5C2-9CA3-4ED6-9A81-44479B148C88}", "{84B5C7B4-6B82-44AE-808A-A2CB70B29B3B}", "{85AC663D-CB05-F6D1-04BC-E7F8FB4E122F}", "{86D69191-4913-6F40-697E-79B67D503A30}", "{86DE29D0-E8A4-663A-6191-413CFD8B509B}", "{87816C77-94F6-4318-A516-86E423906CEF}", "{881DD1C5-3DCF-431B-B061-F3F88E8BE88A}", "{8944C1CD-B018-4511-B0A1-5476DBF70820}",
                "{89620200-ECBD-11CF-8B85-00AA005B4340}", "{89820200-ECBD-11CF-8B85-00AA005B4340}", "{89820200-ECBD-11CF-8B85-00AA005B4383}", "{89A62C6E-9F34-480E-953E-C2CCCE113C86}", "{89B4C1CD-B018-4511-B0A1-5476DBF70820}", "{8A69D345-D564-463C-AFF1-A69D9E530F96}", "{8AA2F93D-1CF8-D98D-6AC9-8FBB75FABA14}", "{8BD317F5-9BA4-9E8F-8B06-9C91E6352444}", "{8BD3997A-4502-856C-530F-0C6940F04E78}", "{8C39994B-50A4-EE53-9D49-21B90A3B5DFD}", "{8C3C6F85-3807-60AB-D6D2-C370CBA3B713}", "{8C41F65A-19B7-8FC0-C69D-C72A2052904E}", "{8CCF5FAF-4DE3-E96A-4EA7-0C5FC003EE92}",
                "{8CF4BACD-CDDE-D8CA-ED0E-CB210B0A7A14}", "{8D302CDE-9A73-2022-6541-B6C5120442DB}", "{8D978C9F-E891-FB77-C6B4-B6A1055F12DE}", "{8DD1E798-508D-BB7F-D21D-217D7D8E0827}", "{8DFADC03-25E0-33AB-AB69-EF69B876BF3C}", "{8E66AE97-DECD-558F-AF0B-22089FDB420F}", "{8F736E10-8E5C-4399-A532-D0C00A406227}", "{8F77277C-8B46-3E0B-6048-E282FACC3113}", "{8FA99328-0D9D-FE32-3C24-C04F4098C7B6}", "{90EF4A5E-85DB-4825-96F5-1AB93C2A8EEB}", "{91F6B60A-D403-6DDE-7B2C-C48B3246EA72}", "{9206383D-0997-AB8D-0C05-A0BDDAF235E4}", "{92187DB6-1891-D6E0-A0DD-E9E19EFC6B99}",
                "{9264A99F-3BD8-0E6E-55C8-5FDC24546366}", "{92C58283-028E-6B2B-E91B-847B926C0EA6}", "{93365A98-E1D8-E170-4D03-D8B7FF488AA2}", "{9381D8F2-0288-11D0-9501-00AA00B911A5}", "{941E2B18-11EA-2C2A-DB2F-2D348E864B73}", "{95BD8298-0C34-9B50-4EA2-F624B154E480}", "{95C5CA3B-9CD8-5F0E-017E-B065EEF00C3A}", "{965ECEAE-C6B9-ED15-F6C6-38B13CEAA9F8}", "{967B098A-042D-4367-BAC9-8BC11684174F}", "{987BFD20-7B57-BBDA-43B6-FADFBFC41437}", "{9937EB9A-32EC-B079-F543-CD017724F35D}", "{99820200-ECBD-11CF-8B85-00AA005B4340}", "{99AAD385-1E53-4D3C-9D4C-4CABB042767A}",
                "{9A21033C-BAD4-46D4-9A3D-45B62DBC66A3}", "{9C1705B2-AFFC-E86F-D824-65CABE476389}", "{9CE848E2-B9D1-47A5-A74E-15B1AFD915D6}", "{9D57ED00-792C-D609-0A92-A4A1F987E879}", "{9D6711F1-F035-2776-D16E-078CAFA13B24}", "{9E475DB2-61E3-0E5F-D259-EA397913AEFE}", "{9F0DFDE8-C3F5-95B2-B108-E06C67817A74}", "{9F612429-4A00-3D44-88CF-146DA2EE1F92}", "{A0C1432E-1CEC-8A1B-CC95-49D8EDBF8A57}", "{A0E9C0D3-CB47-E348-9E95-58D9ED87FF50}", "{A1228067-AD94-DE0F-6994-09CD07E39BF9}", "{A19FD139-D4DE-17AA-69D7-4D9C7FDE404F}", "{A2AD756B-A8BA-BE26-C7B6-92A96BCEB7FD}",
                "{A2F9538A-BFA4-E81A-C916-20556D6DCEC8}", "{A32CD3C9-207C-F785-7F38-B9CFC225E6A8}", "{A331ABDC-344B-E73F-3752-B05C1D41292C}", "{A335A2FF-E765-8552-066F-9C9E082BF86B}", "{A3C71568-7782-3345-8E85-5A26CAFC2DA2}", "{A3DEA4A8-56D9-22A8-DF3D-B47ABA43790C}", "{A40AD658-C0A4-6D39-A26F-DBE0A2967D53}", "{A44116DD-AB98-C6B9-B30C-1AF7A78E92FE}", "{A448D120-1619-44FD-8ACD-6BD6588DF95C}", "{A45FD4E2-C162-C647-C165-EFD4A3631392}", "{A509B1A7-37EF-4B3F-8CFC-4F3A74704073}", "{A509B1A8-37EF-4B3F-8CFC-4F3A74704073}", "{A54C9D49-23CF-E8EB-D445-3D9C9C873150}",
                "{A5552F3B-0CE5-2040-EFA1-D5F11DA1A2EF}", "{A59B76D1-5E3B-4893-BB7F-AF69B2570A73}", "{A5B5A354-0D2F-EE77-DF95-74B81AD6CD21}", "{A64AE5BB-262A-0D72-11B2-52E63BD1B950}", "{A6D7306A-BB32-3550-8AE0-11D85B4DC44C}", "{A79691E2-DD6C-10F2-DB87-A80D1172B11E}", "{A8E3B4A4-8E35-B1DF-8636-7E2A0732DA80}", "{A95BA111-9EBD-8689-C45D-A9F1849F1C16}", "{AA89946F-24FD-8BCA-AB08-C476583A9B83}", "{AA967497-C547-DD84-5B21-F346FB2C9D9A}", "{AB13937A-74ED-2917-27AC-4438CB211D34}", "{AB326F2B-4E1D-1703-E378-CED1E0718579}", "{ABCDF74F-9A64-4E6E-B8EB-6E5A41DE6550}",
                "{ABE4C461-3661-73B8-59A9-606FC66E81EB}", "{ABF39F2E-F680-67D3-E8E5-5DEBC52C7C9C}", "{AC2A6D33-DF9F-F58A-4A8D-069094E84F7D}", "{ACC563BC-4266-43F0-B6ED-9D38C4202C7E}", "{AD04AAA8-9A0B-30AE-D8FE-2B1B0F22481A}", "{AD9A6A3F-3D9F-A73E-D75C-5BE68BC37941}", "{AE24774F-A795-FC47-6575-8FDCFD721383}", "{AENGFU3AA-Z568-11D2-9CBD-0000F87A369E}", "{AF5DC199-4052-2A19-3AE0-9CE4635113CA}", "{AF90D10A-47A7-F236-3F3E-6755405B16F1}", "{B08E5556-9B30-2D06-A8BB-E9CEC9FA7A03}", "{B0E2CA7F-ABAD-F1DF-3B6E-B3224C5D337A}", "{B0F59284-72FE-3309-0DDE-D286CB2026FE}",
                "{B10D2E8F-D38B-78E9-442E-2D402184CEEF}", "{B1598337-C560-257B-3F27-B11475A20CD3}", "{B1DFB1F7-C055-81D0-1E5E-717453433FDF}", "{B2F71317-3F41-B831-9181-0ACB0C7F497D}", "{B34EC6EC-4BD5-D5FB-ED26-65EB60B6A1DE}", "{B34FECEF-8940-64BE-C65E-F426B9320FDE}", "{B3D2A3F5-B206-BE20-B50E-31A569EB8C9E}", "{B44BD26C-3E67-4AAD-967A-6B0E07E88057}", "{B475BC7F-9A52-3208-6616-9FFC5827FDA9}", "{B50495A0-DD2A-4EB1-F573-4FBB62A9D718}", "{B508B3F1-A24A-32C0-B310-85786919EF28}", "{B523A0B2-964E-E412-595F-52FCA392150A}", "{B67D03D5-F050-E087-5F8D-BED96A3125AA}",
                "{B6F4E195-7B51-9608-A1FB-58F0B9D402A2}", "{B78E2C42-FA0C-F6E0-5AD5-B163463537A0}", "{B7EBC168-AB6B-D2D3-D5FB-F322E818F9B6}", "{B86A8C37-937B-6956-F495-AB6E46712860}", "{B8742BE5-6238-3EC0-A9B9-CD562E054A54}", "{B99A8E75-E407-0F4E-791D-1323C8A5F4D1}", "{B9AEF32F-1480-F163-E27E-A489BACF9496}", "{BA79CB89-5894-0368-9DB4-E9D1DA8D6E2A}", "{BADABCDB-6780-0820-07BC-8FB866609AEA}", "{BB71C699-2F91-B588-7539-9D5C90178461}", "{BB71EC33-D646-4E2B-A399-192E4A64266D}", "{BBDF21C6-2575-5755-8940-2DFA827C7978}", "{BBEEAAF6-8378-EA32-14E2-53797FC26775}",
                "{BC47AB7E-DEFA-2B2A-E9DC-9A147E65716D}", "{BC5D1C2C-69CF-E932-4058-05B72CB1C706}", "{BC629400-4ED7-5ED8-E5CD-72B952C8CD0E}", "{BC917AB5-FE52-1467-A946-2C665CF08BDE}", "{BCD6D5FF-33A9-4B8A-BF95-285F75E2D1D6}", "{BD6ABD43-82BF-7BC5-58EB-10F26BF90C4D}", "{BD72CC8E-C31B-250F-3043-CCB9E3D3CFC3}", "{BD922265-E2DD-89D9-CD41-89D5708B0240}", "{BDA766B5-DDA0-9D44-AA07-EA85F7E5275B}", "{BDEF9E4A-60CF-410D-814C-A09D20156E27}", "{BDFE9429-69C8-6FCC-9D60-3BD35E5094EC}", "{BE71439D-5F21-6BEC-95CA-64AE6205F90A}", "{BFA2E378-31D9-4595-AFA9-CA19E610DC0F}",
                "{C0454047-2770-CB44-914B-85E8E8273C45}", "{C0741CF3-0DFA-696E-ABCB-9F858A3B2B70}", "{C09FB3CD-3D0C-3F2D-899A-6A1D67F2073F}", "{C0CC1C16-8FFF-891A-5200-49D7E64A9F32}", "{C0E7ECC7-40C9-8AC0-5102-A582BC601B5A}", "{C0F0DCDC-99EA-4405-BDAE-CACABD3D2DF0}", "{C16B6B26-2B63-8A48-2F83-11D67B3F9058}", "{C1A52E39-0D14-194E-F043-87EEB2C0F0B8}", "{C236BD00-7D9F-3DCD-C9EC-A1922343651A}", "{C2770C25-1E83-C7A2-BE59-F3627DE29B34}", "{C2B7AB09-4EBD-5962-A23A-3D69FB40C9D8}", "{C3143EE8-F914-182C-5174-189525D7A611}", "{C3A681FC-A157-33CB-94E5-8B01F42F178C}",
                "{C3C986D6-06B1-43BF-90DD-BE30756C00DE}", "{C4D8FCA9-945F-11D5-A54F-0090278A1BB8}", "{C64E8C44-F868-2D7F-3AD6-27CA24DEDB29}", "{C64F09D2-AE14-4C01-00A1-C5EA07A69515}", "{C65E6E93-BBBC-BE26-46E5-011F4E483DA9}", "{C6BB238A-0952-7386-83B2-954E87142D6D}", "{C746998E-5BEA-AC7A-0BF2-DB07C2E6FF1E}", "{C7B51BF4-416F-50B7-FE35-B2F8C0242961}", "{C7C5C9C0-3AB1-82B6-9CED-1B07E9E3B4EA}", "{C7DA8A22-D921-B8BC-F5D1-D5EBEC2E60ED}", "{C900BFF7-107F-9BA4-1412-6452E494562F}", "{C99F1009-1C8A-83A1-D90B-78CBF8CFFECD}", "{C9CB8F4C-D425-4D5B-E945-E394FB8B508D}",
                "{C9E93340-D1F1-11D0-821E-444553540600}", "{C9E9A340-D1F1-11D0-821E-444553540600}", "{CA01A54D-1A5E-82F6-411E-25BB533DE385}", "{CAA43406-933F-2D0E-F682-21863490D919}", "{CACADBDA-9663-A8DC-7D51-507DD4C2DC94}", "{CAD7C555-80D4-A795-1758-12DD0A1DDAFC}", "{CAE99B79-E0D6-DC74-1050-B77AF4BAB3AE}", "{CB2F7EDD-9D1F-43C1-90FC-4F52EAE172A1}", "{CB4CC22B-A58F-C85C-9B2E-B97E2F013CEE}", "{CBC861EF-51AD-4B8D-3E63-AF3BA1FECA27}", "{CBFFCBC9-CF93-260D-8E1A-520CAD1F63E5}", "{CC2A9BA0-3BDD-11D0-821E-444553540000}", "{CC8287AB-E967-FB82-0E09-54593030F3B6}",
                "{CD4C36E1-FF2C-951A-4919-95E7AECCEE95}", "{CD84924C-1199-27F4-5722-1BE1806D7943}", "{CDD7975E-60F8-41D5-8149-19E51D6F71D0}", "{CE476D32-0ECC-7213-612B-A3649E9895E7}", "{CE60B2D0-547B-63A8-F77F-0B573B464180}", "{CE8ABF10-8B9E-4B7F-80E4-FB9CD4E4A85D}", "{CECED6B9-BE58-979E-847C-7AF299CD987F}", "{CF8766FD-BAF2-46FC-4F45-79C6C95CB5A0}", "{D028A274-CABC-417A-B97E-91213CA8A77B}", "{D0B25D76-7248-C0F1-DE5B-368702FC24DE}", "{D0BC5CE6-F98E-11C2-3BC0-A40B56FE9CC6}", "{D0EFD7F0-25CE-C2FE-E8DB-51F22C6A3AFF}", "{D11117F5-9251-4913-9781-49DF5484B0F1}",
                "{D16E0D1A-4966-447C-BB92-6E874FDD6E9F}", "{D27CDB6E-AE6D-11CF-96B8-444553540000}", "{D29D5994-9EAA-F85F-D37C-ECEA34D9B7D4}", "{D2CE2169-296E-04EE-5ABA-A84B487B3CFC}", "{D2E8454B-F188-034B-3B8B-B2486CE6BA03}", "{D50CE188-38A8-BF5F-D733-CBE9FA7100AB}", "{D573D013-98B8-4DA4-B4B7-F75039B3BE19}", "{D5833F8D-515D-5096-9762-2E312034729F}", "{D7B02B2E-5AD7-3547-A7F3-13C0A84BBFC0}", "{D8B9F97B-DDB5-6D95-7D35-5769D748B3DB}", "{D8C0150A-8C9F-29DF-CAA3-76E028968DE4}", "{D94E73C1-0F4E-5788-3D9D-E085A277CBEB}", "{D9BC6E09-9D00-B78F-0791-AF1C6E3B7D6B}",
                "{D9F89A0B-82EB-D744-7453-A86B694E08EC}", "{DB3210DE-6242-29FB-9553-9809B47DC91B}", "{DB7E056D-4996-0EBF-A612-5B80859C9D0E}", "{DB923CB9-7671-D165-9079-FAF3B0DA8157}", "{DE5AED00-A4BF-11D1-9948-00C04F98BBC9}", "{DE781054-A2D9-3681-C752-2B2E5E27CB90}", "{DEC3EA41-3E9F-4092-B14D-8973C562D665}", "{DF214B0F-BB95-CCDE-15A5-ACC3C05526EB}", "{DF48ED94-3836-B4C0-4F82-BF0E8DB7A7FA}", "{DFD2729F-A436-4EAC-B116-2FE589F6D9F6}", "{E0D5F03F-BCC3-E6BB-C8E8-874FE0E3C882}", "{E1ADB2F2-4753-44DE-803E-91CFF42346F6}", "{E2F493A8-12D1-BA7D-CD70-C57AC1C49D74}",
                "{E3562C82-2A8C-3DF0-78D9-1D55529966AF}", "{E364E2BB-48F6-2E4B-5322-D732E3F2494B}", "{E3DD8121-F53E-03D1-1C60-5FD6F0DFFE8C}", "{E458365E-A8CD-4C33-B956-A6669305679C}", "{E45C7DBC-54B5-8130-FFF2-28BEFF1774BC}", "{E48D6D68-32BB-186B-0A5F-7ACE7759DDE3}", "{E67CAEC8-FFDB-4775-A865-1EAEAC94014E}", "{E69157A2-953F-4ABE-ACCC-75A85CB5C493}", "{E754B181-1632-3067-DD24-4646BE1AA4DC}", "{E812BE10-B393-4315-BB85-9D9C0939A650}", "{E8A6D528-19F0-081A-CF20-E32E2370DFD3}", "{E8AD9576-26FE-60E9-BE14-73665F1560B2}", "{E8BA286B-F1EC-1F75-6C30-92B2EC6BFD2D}",
                "{E8DFDB5D-5677-8D1D-9CA5-91ABC7810591}", "{E92B03AB-B707-11D2-9CBD-0000F87A369E}", "{E92C03AB-B707-11D2-9CBD-0000F87A369E}", "{E9EDF542-644B-3DD6-4E9A-FC4BDA4B15EC}", "{EA0191C5-B3C1-80D0-79EF-65029BB5A0E2}", "{EA4191BE-56F0-4DFD-8C41-30590DF8C30F}", "{EB460294-C2D8-9B79-2FD4-8BB784AD71A4}", "{EC43E638-09F0-38CC-A585-72FCCDDF035C}", "{ED3B46B0-7D15-3666-A731-740BBD799BC7}", "{ED7575A5-5DFC-D9AA-418D-09DD0DC91BD6}", "{EDC67108-2B07-1374-CBEB-DAF7149986D9}", "{EDE4471F-A1FB-5639-FC8E-5A69B3423091}", "{EE116DF1-8FDF-409B-8DD8-4E1D195C85C4}",
                "{EE5C5F6B-F3EE-665B-50FF-5F011E879F19}", "{EF26C435-0416-EB3C-FB09-E5F89A0D748F}", "{EF289A85-8E57-408D-BE47-73B55609861A}", "{EF489873-07F8-373D-A9CB-9AC688ADA964}", "{EF5781F0-3226-AE8B-F762-F55DECA62207}", "{EFCE7BE0-510E-4932-9475-F44CD90DE16A}", "{F043E276-F70E-BF1B-CCBE-FE0FB31E3C33}", "{F04A7C8B-09CE-AB5F-4F18-59F1C7E11B4D}", "{F092A698-1E0D-FE99-C33D-E40EF08CCAE6}", "{F0CF18FB-6795-503E-E471-701EB0E6E341}", "{F11167B7-74F8-F270-66AE-5FEADEC858A0}", "{F1C71FAC-1BAF-A0A1-2C03-CD6B1C2F5B36}", "{F2E877A8-5224-CFEA-F4C2-AB132DB78A23}",
                "{F323FAAF-1875-6CD3-91E7-E8C61340F2A9}", "{F34BB6D3-1D54-BA5F-88DA-BD5515E9BA53}", "{F394D008-0B23-5B19-2EA5-52164323D971}", "{F5B09CFD-F0B2-36AF-8DF4-1DF6B63FC7B4}", "{F5F3CD80-306C-3CEF-5BFE-6F3669DCC268}", "{F6FD10E6-A880-08BA-9210-DCC87EED024B}", "{F7292C01-8726-257D-5B47-2A9F0A86E907}", "{F7C5E47A-A126-4A02-9812-5C26FF75AE8F}", "{F7D6DF1C-C967-B51B-88DA-2E750BCF5A8B}", "{F86B1057-BEA0-727F-6832-6D6789080236}", "{F8FC4174-4CB0-B4A7-7974-F6EEB07E4518}", "{F9492628-DB7E-C6C6-D0DE-494EED2E59E6}", "{F94C2DA4-708E-11D3-AFB2-00C04F6814C4}",
                "{F97D38CD-A14E-44FC-2285-EF284C756AEA}", "{FA69F9B0-A1CE-DB22-B448-DC990666E4E0}", "{FAA35857-E48A-9F37-01C6-A6033BFFCB5C}", "{FB0AA6AB-EA5E-0937-3602-DBBBBB8C0013}", "{FB962091-582B-7385-C314-DF08B2E85C85}", "{FCB62EB0-0472-EEA8-8457-041B84F99E17}", "{FCFEFEB9-AFD2-16B8-9565-16B0628F9903}", "{FE198E46-C5BE-B15E-D040-BD1B07283C91}", "{FE600E50-2C69-46D5-ACAA-2B617006245C}", "{FEA56C74-B3DB-417B-3815-216B404EE28E}", "{FEB3F00C-046D-438D-8A88-BF94A6C9E703}", "{FEBA0174-59B3-B118-E491-AD2F85C5AFC4}", "{FEBEF00C-046D-438D-8A88-BF94A6C9E703}",
                "{FF9443B0-1920-28FF-CA0B-A694689EFFAE}", "{FFD6C0E1-3BD2-1460-3B76-52451C274A52}", "{FFEB53C3-60B5-9811-F987-EE07E84871A6}"];
            try {
                var clientDom = document.getElementById("clientDiv");
                if (!clientDom && !clientDom["isComponentInstalled"] && !clientDom["getComponentVersion"])return "";
                var result = "";
                for (var i = 0; i < cid.length; i++) {
                    var id = cid[i].toUpperCase();
                    var versions = "";
                    var isInstalled = clientDom["isComponentInstalled"](id, "componentid");
                    if (isInstalled) {
                        versions = clientDom["getComponentVersion"](id, "ComponentID");
                        result += id + ":" + versions
                    }
                }
                return md5(result)
            } catch (e) {
                return ""
            }
        }
    }, {
        key: "lan",
        value: (nav["language"] || 0) + "|" + (nav["systemLanguage"] || 0) + "|" + (nav["userLanguage"] || 0)
    }, {key: "pla", value: nav["cpuClass"] || 0}];
    var logParams = {ci: getCookieRaw("CPROID") || "", bi: getCookieRaw("BAIDUID") || ""};

    function createFp(arr) {
        var fp = arr.join("");
        return md5(fp)
    }

    function generateStoreArray(params) {
        var store = {};
        var storeArray = [];
        each(params, function (param) {
            var key = param.key;
            var value = param.value;
            value = typeof value === "function" ?
                value() : value;
            store[key] = key === "wf" ? font : value;
            storeArray.push(key);
            storeArray.push(":");
            storeArray.push(store[key]);
            storeArray.push(";")
        });
        return {store: store, storeArray: storeArray}
    }

    function createFontsFlash(lastClock) {
        function checkFlash() {
            if (nav.plugins && nav.mimeTypes.length) {
                var plugin = nav.plugins["Shockwave Flash"];
                return !!plugin
            } else if (win.ActiveXObject && !win.opera)for (var i = 12; i >= 2; i--)try {
                var c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                if (c)return true
            } catch (ex) {
            }
            return false
        }

        var fname = "BAIDU_CLB_wh_o_flash";
        if (checkFlash()) {
            var flashDom = document.getElementById("oFlashDiv");
            flashDom.innerHTML = '<embed wmode="transparent" name="' + fname + '" id="' + fname + '" src="o.swf?v=1" swliveconnect="true" ' + 'quality="high" width="1" height="1" align="middle" allowScriptAccess="samedomain" ' + 'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer">';
            netStatusCheck()
        }
        win["fontList"] = function (fonts) {
            font = md5(fonts);
            var r = Math.random() * 1E5;
            if (r < 20) {
                var fontsList =
                    fonts.split(",");
                for (var i = 0; i < 10; i++) {
                    var random = Math.floor(Math.random() * fontsList.length);
                    fontsStr += "," + fontsList[random];
                    fontsList.splice(random, 1)
                }
                fontsStr = encodeURIComponent(fontsStr)
            }
            send();
            clearTimeout(lastClock)
        };
        function detectFlash(target) {
            try {
                var obj = document.getElementById(target);
                if (obj && typeof obj.GetVariable != "undefined") {
                    var result = obj.GetVariable("/:user_fonts");
                    if (result)win["fontList"](result);
                    return true
                }
            } catch (ex) {
            }
            return false
        }

        setTimeout(function F() {
            if (!detectFlash(fname) && !isSend)return setTimeout(F, 250)
        }, 250)
    }

    function netStatusCheck() {
        var random = Math.random() * 1E6;
        if (random >= 1E3)return;
        var flashDom = document.getElementById("oFlashDiv");
        var dom = document.createElement("div");
        dom.innerHTML = '<embed wmode="transparent" name="nsc" id="nsc"' + ' src="http://cpro.baidustatic.com/cpro/ui/nsc.swf" swliveconnect="true" ' + 'quality="high" width="1" height="1" align="middle" allowScriptAccess="samedomain" ' + 'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer">';
        flashDom.insertBefore(dom, flashDom.firstChild)
    }

    function setFp(fp1, fp2) {
        fp1 = fp1 ? fp1 + ":FG=1" : "";
        fp2 = fp2 ? fp2 + ":FG=1" : "";
        if (getCookieRaw("FP") !== fp1 || getCookieRaw("FP2") !== fp2) {
            var expireDate = new Date;
            expireDate.setTime(expireDate.getTime() + 864E8);
            setCookieRaw("FP", fp1, {path: "/", expires: expireDate});
            setCookieRaw("FP2", fp2, {path: "/", expires: expireDate})
        }
    }

    function init() {
        if (unionFlow)if (br === 1 || br === 6 || br === 7)mode = 1; else {
            if (br === 2)mode = 2
        } else if (br === 1 || br === 6 || br === 7)mode = 3; else if (br === 2)mode = 4;
        if (mode !==
            0) {
            var sendLast = setTimeout(function () {
                if (!isSend)send()
            }, 2E3);
            createFontsFlash(sendLast)
        } else if (br === 101)send(); else if (!unionFlow)log(logUrl, {"br": br}, true)
    }

    function getChromeChildVersion() {
        var chromeSubVer = 0;
        if (/chrome\/(\d+\.\d)/i.test(ua)) {
            if (/SE 2.X MetaSr/i.test(ua))chromeSubVer = 201; else if (/BIDUBrowser/i.test(ua))chromeSubVer = 202; else if (/QQBrowser/i.test(ua))chromeSubVer = 203; else if (/360EE/i.test(ua))chromeSubVer = 205; else if (/QIHU/i.test(ua))chromeSubVer = 205; else if (/2345chrome/i.test(ua))chromeSubVer =
                206; else if (/TaoBrowser/i.test(ua))chromeSubVer = 208; else if (/TheWorld/i.test(ua))chromeSubVer = 209; else if (/Maxthon/i.test(ua))chromeSubVer = 210; else if (/YYE/i.test(ua))chromeSubVer = 211;
            if (chromeSubVer === 0) {
                var plugin = nav.plugins["Shockwave Flash"];
                if (plugin && plugin["filename"] === "NPSWF32_11_6_602_180.dll")chromeSubVer = 212
            }
        }
        return chromeSubVer
    }

    function updateGuid(guid) {
        var guid = guid + ":FG=1";
        if (getCookieRaw("GUID") !== guid) {
            var expireDate = new Date;
            expireDate.setTime(expireDate.getTime() + 864E8);
            setCookieRaw("GUID",
                guid, {path: "/", expires: expireDate})
        }
    }

    var guidData = {guid: "", type: 0};
    chromeChildVersion = getChromeChildVersion();
    try {
        baiduWebAdapter.initPlugin(true, function (errorCode) {
            if (errorCode === 0)baiduWebAdapter.queryGuid(function (guid) {
                chromeChildVersion = getChromeChildVersion();
                guidData.guid = guid;
                guidData.type = chromeChildVersion
            })
        })
    } catch (e) {
    }
    if (guidData.guid)updateGuid(guidData.guid);
    function send() {
        if (isSend === true)return false;
        isSend = true;
        if (mode === 2 || mode === 4) {
            var storeFp = generateStoreArray(fpParams.concat(chromeParams));
            var fp1 = createFp(storeFp.storeArray).toUpperCase();
            for (var i = 0, len = chromeParams.length; i < len; i++) {
                var param = chromeParams[i];
                if (param["key"] === "cav") {
                    param["key"] = undefined;
                    break
                }
            }
            var storeChrome = generateStoreArray(fpParams.concat(chromeParams));
            var fp2 = createFp(storeChrome.storeArray).toUpperCase();
            if (!storeChrome.store["im"] && storeChrome.store["wf"])setFp(fp1, fp2);
            var url = logUrl;
            if (unionFlow)url = unionLogUrl;
            log(url, {
                "br": br,
                "fp": fp1,
                "fp2": fp2,
                "ci": logParams.ci,
                "bi": logParams.bi,
                "im": storeChrome.store["im"],
                "wf": storeChrome.store["wf"] ? 1 : 0,
                "ct": +new Date - startTime,
                "bp": getCookieRaw("BDUSS") || "",
                "m": guidData.guid,
                "t": guidData.type,
                "ft": fontsStr
            }, true)
        } else if (br === 101) {
            var storeFp = generateStoreArray(fpParams.concat(chromeParams));
            var paramList = [];
            for (var key in storeFp.store)paramList.push(key + "=" + storeFp.store[key]);
            paramList.push("bp=" + (getCookieRaw("BDUSS") || ""));
            paramList.push("ci=" + (logParams.ci || ""));
            paramList.push("bi=" + (logParams.bi || ""));
            log("http://eclick.baidu.com/fp.htm?" + paramList.join("&") +
                "&de=ios&", {}, true)
        } else {
            var storeIE = generateStoreArray(fpParams.concat(IEParams));
            var fp1 = createFp(storeIE.storeArray).toUpperCase();
            var fp2 = fp1;
            if (!storeIE.store["im"] && storeIE.store["wf"])setFp(fp1, fp2);
            if (mode === 3 || mode === 1) {
                var url = logUrl;
                if (unionFlow)url = unionLogUrl;
                log(url, {
                        "br": br,
                        "fp": fp1,
                        "fp2": fp2,
                        "ci": logParams.ci,
                        "bi": logParams.bi,
                        "im": storeIE.store["im"],
                        "wf": storeIE.store["wf"] ? 1 : 0,
                        "ct": +new Date - startTime,
                        "bp": getCookieRaw("BDUSS") || "",
                        "m": guidData.guid,
                        "t": guidData.type,
                        "ft": fontsStr
                    },
                    true)
            }
        }
    }

    init()
})();
