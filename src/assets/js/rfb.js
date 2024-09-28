function toSigned32bit(toConvert) {
    return 0 | toConvert;
}

let _logLevel = 'warn',
    Debug = () => {},
    Info = () => {},
    Warn = () => {},
    Error$1 = () => {};

function decodeUTF8(utf8string, allowLatin1 = !1) {
    try {
        return decodeURIComponent(escape(utf8string));
    } catch (e2) {
        if (e2 instanceof URIError && allowLatin1) return utf8string;
        throw e2;
    }
}

function encodeUTF8(DOMString) {
    return unescape(encodeURIComponent(DOMString));
}

!(function (level) {
    if ((void 0 === level ? (level = _logLevel) : (_logLevel = level), (Debug = Info = Warn = Error$1 = () => {}), void 0 !== window.console))
        switch (level) {
            case 'debug':
                Debug = console.debug.bind(window.console);

            case 'info':
                Info = console.info.bind(window.console);

            case 'warn':
                Warn = console.warn.bind(window.console);

            case 'error':
                Error$1 = console.error.bind(window.console);

            case 'none':
                break;

            default:
                throw new window.Error("invalid logging type '" + level + "'");
        }
})();

let isTouchDevice = 'ontouchstart' in document.documentElement || void 0 !== document.ontouchstart || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

window.addEventListener(
    'touchstart',
    function onFirstTouch() {
        (isTouchDevice = !0), window.removeEventListener('touchstart', onFirstTouch, !1);
    },
    !1,
);

let dragThreshold = 10 * (window.devicePixelRatio || 1),
    _supportsCursorURIs = !1;

try {
    const target = document.createElement('canvas');
    (target.style.cursor =
        'url("data:image/x-icon;base64,AAACAAEACAgAAAIAAgA4AQAAFgAAACgAAAAIAAAAEAAAAAEAIAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAA==") 2 2, default'),
        0 === target.style.cursor.indexOf('url') ? (Info('Data URI scheme cursor supported'), (_supportsCursorURIs = !0)) : Warn('Data URI scheme cursor not supported');
} catch (exc) {
    Error$1('Data URI scheme cursor test exception: ' + exc);
}

const supportsCursorURIs = _supportsCursorURIs;

let _supportsImageMetadata = !1;

try {
    new ImageData(new Uint8ClampedArray(4), 1, 1), (_supportsImageMetadata = !0);
} catch (ex) {}

const supportsImageMetadata = _supportsImageMetadata;

let _hasScrollbarGutter = !0;

try {
    const container = document.createElement('div');
    (container.style.visibility = 'hidden'), (container.style.overflow = 'scroll'), document.body.appendChild(container);
    const child = document.createElement('div');
    container.appendChild(child);
    const scrollbarWidth = container.offsetWidth - child.offsetWidth;
    container.parentNode.removeChild(container), (_hasScrollbarGutter = 0 != scrollbarWidth);
} catch (exc) {
    Error$1('Scrollbar test exception: ' + exc);
}

function isMac() {
    return navigator && !!/mac/i.exec(navigator.platform);
}

function isWindows() {
    return navigator && !!/win/i.exec(navigator.platform);
}

function isIOS() {
    return navigator && (!!/ipad/i.exec(navigator.platform) || !!/iphone/i.exec(navigator.platform) || !!/ipod/i.exec(navigator.platform));
}

function isIE() {
    return navigator && !!/trident/i.exec(navigator.userAgent);
}

function isEdge() {
    return navigator && !!/edge/i.exec(navigator.userAgent);
}

function isFirefox() {
    return navigator && !!/firefox/i.exec(navigator.userAgent);
}

function clientToElement(x, y, elem) {
    const bounds = elem.getBoundingClientRect();
    let pos = {
        x: 0,
        y: 0,
    };
    return x < bounds.left ? (pos.x = 0) : x >= bounds.right ? (pos.x = bounds.width - 1) : (pos.x = x - bounds.left), y < bounds.top ? (pos.y = 0) : y >= bounds.bottom ? (pos.y = bounds.height - 1) : (pos.y = y - bounds.top), pos;
}

function stopEvent(e2) {
    e2.stopPropagation(), e2.preventDefault();
}

let _captureRecursion = !1,
    _elementForUnflushedEvents = null;

function _captureProxy(e2) {
    if (_captureRecursion) return;
    const newEv = new e2.constructor(e2.type, e2);
    (_captureRecursion = !0), document.captureElement ? document.captureElement.dispatchEvent(newEv) : _elementForUnflushedEvents.dispatchEvent(newEv), (_captureRecursion = !1), e2.stopPropagation(), newEv.defaultPrevented && e2.preventDefault(), 'mouseup' === e2.type && releaseCapture();
}

function _capturedElemChanged() {
    document.getElementById('noVNC_mouse_capture_elem').style.cursor = window.getComputedStyle(document.captureElement).cursor;
}

document.captureElement = null;

const _captureObserver = new MutationObserver(_capturedElemChanged);

function releaseCapture() {
    if (document.releaseCapture) document.releaseCapture(), (document.captureElement = null);
    else {
        if (!document.captureElement) return;
        (_elementForUnflushedEvents = document.captureElement), (document.captureElement = null), _captureObserver.disconnect();
        (document.getElementById('noVNC_mouse_capture_elem').style.display = 'none'), window.removeEventListener('mousemove', _captureProxy), window.removeEventListener('mouseup', _captureProxy);
    }
}

class EventTargetMixin {
    constructor() {
        this._listeners = new Map();
    }
    addEventListener(type, callback) {
        this._listeners.has(type) || this._listeners.set(type, new Set()), this._listeners.get(type).add(callback);
    }
    removeEventListener(type, callback) {
        this._listeners.has(type) && this._listeners.get(type).delete(callback);
    }
    dispatchEvent(event) {
        return !this._listeners.has(event.type) || (this._listeners.get(event.type).forEach(callback => callback.call(this, event)), !event.defaultPrevented);
    }
}

const Base64 = {
    toBase64Table: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split(''),
    base64Pad: '=',
    encode(data) {
        let result = '';
        const length = data.length,
            lengthpad = length % 3;
        for (let i = 0; i < length - 2; i += 3) (result += this.toBase64Table[data[i] >> 2]), (result += this.toBase64Table[((3 & data[i]) << 4) + (data[i + 1] >> 4)]), (result += this.toBase64Table[((15 & data[i + 1]) << 2) + (data[i + 2] >> 6)]), (result += this.toBase64Table[63 & data[i + 2]]);
        const j = length - lengthpad;
        return (
            2 === lengthpad
                ? ((result += this.toBase64Table[data[j] >> 2]), (result += this.toBase64Table[((3 & data[j]) << 4) + (data[j + 1] >> 4)]), (result += this.toBase64Table[(15 & data[j + 1]) << 2]), (result += this.toBase64Table[64]))
                : 1 === lengthpad && ((result += this.toBase64Table[data[j] >> 2]), (result += this.toBase64Table[(3 & data[j]) << 4]), (result += this.toBase64Table[64]), (result += this.toBase64Table[64])),
            result
        );
    },
    toBinaryTable: [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1,
    ],
    decode(data, offset = 0) {
        let dataLength = data.indexOf('=') - offset;
        dataLength < 0 && (dataLength = data.length - offset);
        const resultLength = 3 * (dataLength >> 2) + Math.floor((dataLength % 4) / 1.5),
            result = new Array(resultLength);
        let leftbits = 0,
            leftdata = 0;
        for (let idx = 0, i = offset; i < data.length; i++) {
            const c2 = this.toBinaryTable[127 & data.charCodeAt(i)],
                padding = data.charAt(i) === this.base64Pad;
            -1 !== c2 ? ((leftdata = (leftdata << 6) | c2), (leftbits += 6), leftbits >= 8 && ((leftbits -= 8), padding || (result[idx++] = (leftdata >> leftbits) & 255), (leftdata &= (1 << leftbits) - 1))) : Error$1('Illegal character code ' + data.charCodeAt(i) + ' at position ' + i);
        }
        if (leftbits) {
            const err2 = new Error('Corrupted base64 string');
            throw ((err2.name = 'Base64-Error'), err2);
        }
        return result;
    },
};

class Display {
    constructor(target) {
        if (((this._drawCtx = null), (this._renderQ = []), (this._flushing = !1), (this._fbWidth = 0), (this._fbHeight = 0), (this._prevDrawStyle = ''), (this._tile = null), (this._tile16x16 = null), (this._tileX = 0), (this._tileY = 0), Debug('>> Display.constructor'), (this._target = target), !this._target)) throw new Error('Target must be set');
        if ('string' == typeof this._target) throw new Error('target must be a DOM element');
        if (!this._target.getContext) throw new Error('no getContext method');
        if (
            ((this._targetCtx = this._target.getContext('2d')),
            (this._viewportLoc = {
                x: 0,
                y: 0,
                w: this._target.width,
                h: this._target.height,
            }),
            (this._backbuffer = document.createElement('canvas')),
            (this._drawCtx = this._backbuffer.getContext('2d')),
            (this._damageBounds = {
                left: 0,
                top: 0,
                right: this._backbuffer.width,
                bottom: this._backbuffer.height,
            }),
            Debug('User Agent: ' + navigator.userAgent),
            !('createImageData' in this._drawCtx))
        )
            throw new Error('Canvas does not support createImageData');
        (this._tile16x16 = this._drawCtx.createImageData(16, 16)), Debug('<< Display.constructor'), (this._scale = 1), (this._clipViewport = !1), (this.onflush = () => {});
    }
    get scale() {
        return this._scale;
    }
    set scale(scale) {
        this._rescale(scale);
    }
    get clipViewport() {
        return this._clipViewport;
    }
    set clipViewport(viewport) {
        this._clipViewport = viewport;
        const vp = this._viewportLoc;
        this.viewportChangeSize(vp.w, vp.h), this.viewportChangePos(0, 0);
    }
    get width() {
        return this._fbWidth;
    }
    get height() {
        return this._fbHeight;
    }
    viewportChangePos(deltaX, deltaY) {
        const vp = this._viewportLoc;
        (deltaX = Math.floor(deltaX)), (deltaY = Math.floor(deltaY)), this._clipViewport || ((deltaX = -vp.w), (deltaY = -vp.h));
        const vx2 = vp.x + vp.w - 1,
            vy2 = vp.y + vp.h - 1;
        deltaX < 0 && vp.x + deltaX < 0 && (deltaX = -vp.x),
            vx2 + deltaX >= this._fbWidth && (deltaX -= vx2 + deltaX - this._fbWidth + 1),
            vp.y + deltaY < 0 && (deltaY = -vp.y),
            vy2 + deltaY >= this._fbHeight && (deltaY -= vy2 + deltaY - this._fbHeight + 1),
            (0 === deltaX && 0 === deltaY) || (Debug('viewportChange deltaX: ' + deltaX + ', deltaY: ' + deltaY), (vp.x += deltaX), (vp.y += deltaY), this._damage(vp.x, vp.y, vp.w, vp.h), this.flip());
    }
    viewportChangeSize(width, height) {
        (this._clipViewport && void 0 !== width && void 0 !== height) || (Debug('Setting viewport to full display region'), (width = this._fbWidth), (height = this._fbHeight)), (width = Math.floor(width)), (height = Math.floor(height)), width > this._fbWidth && (width = this._fbWidth), height > this._fbHeight && (height = this._fbHeight);
        const vp = this._viewportLoc;
        if (vp.w !== width || vp.h !== height) {
            (vp.w = width), (vp.h = height);
            const canvas = this._target;
            (canvas.width = width), (canvas.height = height), this.viewportChangePos(0, 0), this._damage(vp.x, vp.y, vp.w, vp.h), this.flip(), this._rescale(this._scale);
        }
    }
    absX(x) {
        return 0 === this._scale ? 0 : toSigned32bit(x / this._scale + this._viewportLoc.x);
    }
    absY(y) {
        return 0 === this._scale ? 0 : toSigned32bit(y / this._scale + this._viewportLoc.y);
    }
    resize(width, height) {
        (this._prevDrawStyle = ''), (this._fbWidth = width), (this._fbHeight = height);
        const canvas = this._backbuffer;
        if (canvas.width !== width || canvas.height !== height) {
            let saveImg = null;
            canvas.width > 0 && canvas.height > 0 && (saveImg = this._drawCtx.getImageData(0, 0, canvas.width, canvas.height)), canvas.width !== width && (canvas.width = width), canvas.height !== height && (canvas.height = height), saveImg && this._drawCtx.putImageData(saveImg, 0, 0);
        }
        const vp = this._viewportLoc;
        this.viewportChangeSize(vp.w, vp.h), this.viewportChangePos(0, 0);
    }
    _damage(x, y, w, h) {
        x < this._damageBounds.left && (this._damageBounds.left = x), y < this._damageBounds.top && (this._damageBounds.top = y), x + w > this._damageBounds.right && (this._damageBounds.right = x + w), y + h > this._damageBounds.bottom && (this._damageBounds.bottom = y + h);
    }
    flip(fromQueue) {
        if (0 === this._renderQ.length || fromQueue) {
            let x = this._damageBounds.left,
                y = this._damageBounds.top,
                w = this._damageBounds.right - x,
                h = this._damageBounds.bottom - y,
                vx = x - this._viewportLoc.x,
                vy = y - this._viewportLoc.y;
            vx < 0 && ((w += vx), (x -= vx), (vx = 0)),
                vy < 0 && ((h += vy), (y -= vy), (vy = 0)),
                vx + w > this._viewportLoc.w && (w = this._viewportLoc.w - vx),
                vy + h > this._viewportLoc.h && (h = this._viewportLoc.h - vy),
                w > 0 && h > 0 && this._targetCtx.drawImage(this._backbuffer, x, y, w, h, vx, vy, w, h),
                (this._damageBounds.left = this._damageBounds.top = 65535),
                (this._damageBounds.right = this._damageBounds.bottom = 0);
        } else
            this._renderQPush({
                type: 'flip',
            });
    }
    pending() {
        return this._renderQ.length > 0;
    }
    flush() {
        0 === this._renderQ.length ? this.onflush() : (this._flushing = !0);
    }
    fillRect(x, y, width, height, color, fromQueue) {
        0 === this._renderQ.length || fromQueue
            ? (this._setFillColor(color), this._drawCtx.fillRect(x, y, width, height), this._damage(x, y, width, height))
            : this._renderQPush({
                  type: 'fill',
                  x: x,
                  y: y,
                  width: width,
                  height: height,
                  color: color,
              });
    }
    copyImage(oldX, oldY, newX, newY, w, h, fromQueue) {
        0 === this._renderQ.length || fromQueue
            ? ((this._drawCtx.mozImageSmoothingEnabled = !1), (this._drawCtx.webkitImageSmoothingEnabled = !1), (this._drawCtx.msImageSmoothingEnabled = !1), (this._drawCtx.imageSmoothingEnabled = !1), this._drawCtx.drawImage(this._backbuffer, oldX, oldY, w, h, newX, newY, w, h), this._damage(newX, newY, w, h))
            : this._renderQPush({
                  type: 'copy',
                  oldX: oldX,
                  oldY: oldY,
                  x: newX,
                  y: newY,
                  width: w,
                  height: h,
              });
    }
    imageRect(x, y, width, height, mime, arr) {
        if (0 === width || 0 === height) return;
        const img = new Image();
        (img.src = 'data: ' + mime + ';base64,' + Base64.encode(arr)),
            this._renderQPush({
                type: 'img',
                img: img,
                x: x,
                y: y,
                width: width,
                height: height,
            });
    }
    startTile(x, y, width, height, color) {
        (this._tileX = x), (this._tileY = y), (this._tile = 16 === width && 16 === height ? this._tile16x16 : this._drawCtx.createImageData(width, height));
        const red = color[2],
            green = color[1],
            blue = color[0],
            data = this._tile.data;
        for (let i = 0; i < width * height * 4; i += 4) (data[i] = red), (data[i + 1] = green), (data[i + 2] = blue), (data[i + 3] = 255);
    }
    subTile(x, y, w, h, color) {
        const red = color[2],
            green = color[1],
            blue = color[0],
            xend = x + w,
            yend = y + h,
            data = this._tile.data,
            width = this._tile.width;
        for (let j = y; j < yend; j++)
            for (let i = x; i < xend; i++) {
                const p = 4 * (i + j * width);
                (data[p] = red), (data[p + 1] = green), (data[p + 2] = blue), (data[p + 3] = 255);
            }
    }
    finishTile() {
        this._drawCtx.putImageData(this._tile, this._tileX, this._tileY), this._damage(this._tileX, this._tileY, this._tile.width, this._tile.height);
    }
    blitImage(x, y, width, height, arr, offset, fromQueue) {
        if (0 === this._renderQ.length || fromQueue) this._bgrxImageData(x, y, width, height, arr, offset);
        else {
            const newArr = new Uint8Array(width * height * 4);
            newArr.set(new Uint8Array(arr.buffer, 0, newArr.length)),
                this._renderQPush({
                    type: 'blit',
                    data: newArr,
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                });
        }
    }
    blitRgbImage(x, y, width, height, arr, offset, fromQueue) {
        if (0 === this._renderQ.length || fromQueue) this._rgbImageData(x, y, width, height, arr, offset);
        else {
            const newArr = new Uint8Array(width * height * 3);
            newArr.set(new Uint8Array(arr.buffer, 0, newArr.length)),
                this._renderQPush({
                    type: 'blitRgb',
                    data: newArr,
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                });
        }
    }
    blitRgbxImage(x, y, width, height, arr, offset, fromQueue) {
        if (0 === this._renderQ.length || fromQueue) this._rgbxImageData(x, y, width, height, arr, offset);
        else {
            const newArr = new Uint8Array(width * height * 4);
            newArr.set(new Uint8Array(arr.buffer, 0, newArr.length)),
                this._renderQPush({
                    type: 'blitRgbx',
                    data: newArr,
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                });
        }
    }
    drawImage(img, x, y) {
        this._drawCtx.drawImage(img, x, y), this._damage(x, y, img.width, img.height);
    }
    autoscale(containerWidth, containerHeight) {
        let scaleRatio;
        if (0 === containerWidth || 0 === containerHeight) scaleRatio = 0;
        else {
            const vp = this._viewportLoc,
                targetAspectRatio = containerWidth / containerHeight;
            scaleRatio = vp.w / vp.h >= targetAspectRatio ? containerWidth / vp.w : containerHeight / vp.h;
        }
        this._rescale(scaleRatio);
    }
    _rescale(factor) {
        this._scale = factor;
        const vp = this._viewportLoc,
            width = factor * vp.w + 'px',
            height = factor * vp.h + 'px';
        (this._target.style.width === width && this._target.style.height === height) || ((this._target.style.width = width), (this._target.style.height = height));
    }
    _setFillColor(color) {
        const newStyle = 'rgb(' + color[2] + ',' + color[1] + ',' + color[0] + ')';
        newStyle !== this._prevDrawStyle && ((this._drawCtx.fillStyle = newStyle), (this._prevDrawStyle = newStyle));
    }
    _rgbImageData(x, y, width, height, arr, offset) {
        const img = this._drawCtx.createImageData(width, height),
            data = img.data;
        for (let i = 0, j = offset; i < width * height * 4; i += 4, j += 3) (data[i] = arr[j]), (data[i + 1] = arr[j + 1]), (data[i + 2] = arr[j + 2]), (data[i + 3] = 255);
        this._drawCtx.putImageData(img, x, y), this._damage(x, y, img.width, img.height);
    }
    _bgrxImageData(x, y, width, height, arr, offset) {
        const img = this._drawCtx.createImageData(width, height),
            data = img.data;
        for (let i = 0, j = offset; i < width * height * 4; i += 4, j += 4) (data[i] = arr[j + 2]), (data[i + 1] = arr[j + 1]), (data[i + 2] = arr[j]), (data[i + 3] = 255);
        this._drawCtx.putImageData(img, x, y), this._damage(x, y, img.width, img.height);
    }
    _rgbxImageData(x, y, width, height, arr, offset) {
        let img;
        supportsImageMetadata ? (img = new ImageData(new Uint8ClampedArray(arr.buffer, arr.byteOffset, width * height * 4), width, height)) : ((img = this._drawCtx.createImageData(width, height)), img.data.set(new Uint8ClampedArray(arr.buffer, arr.byteOffset, width * height * 4))), this._drawCtx.putImageData(img, x, y), this._damage(x, y, img.width, img.height);
    }
    _renderQPush(action) {
        this._renderQ.push(action), 1 === this._renderQ.length && this._scanRenderQ();
    }
    _resumeRenderQ() {
        this.removeEventListener('load', this._noVNCDisplay._resumeRenderQ), this._noVNCDisplay._scanRenderQ();
    }
    _scanRenderQ() {
        let ready = !0;
        for (; ready && this._renderQ.length > 0; ) {
            const a2 = this._renderQ[0];
            switch (a2.type) {
                case 'flip':
                    this.flip(!0);
                    break;

                case 'copy':
                    this.copyImage(a2.oldX, a2.oldY, a2.x, a2.y, a2.width, a2.height, !0);
                    break;

                case 'fill':
                    this.fillRect(a2.x, a2.y, a2.width, a2.height, a2.color, !0);
                    break;

                case 'blit':
                    this.blitImage(a2.x, a2.y, a2.width, a2.height, a2.data, 0, !0);
                    break;

                case 'blitRgb':
                    this.blitRgbImage(a2.x, a2.y, a2.width, a2.height, a2.data, 0, !0);
                    break;

                case 'blitRgbx':
                    this.blitRgbxImage(a2.x, a2.y, a2.width, a2.height, a2.data, 0, !0);
                    break;

                case 'img':
                    if (a2.img.complete && 0 !== a2.img.width && 0 !== a2.img.height) {
                        if (a2.img.width !== a2.width || a2.img.height !== a2.height) return void Error$1('Decoded image has incorrect dimensions. Got ' + a2.img.width + 'x' + a2.img.height + '. Expected ' + a2.width + 'x' + a2.height + '.');
                        this.drawImage(a2.img, a2.x, a2.y);
                    } else (a2.img._noVNCDisplay = this), a2.img.addEventListener('load', this._resumeRenderQ), (ready = !1);
            }
            ready && this._renderQ.shift();
        }
        0 === this._renderQ.length && this._flushing && ((this._flushing = !1), this.onflush());
    }
}

function arraySet(dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
    else for (var i = 0; i < len; i++) dest[dest_offs + i] = src[src_offs + i];
}

var Buf8 = Uint8Array,
    Buf16 = Uint16Array,
    Buf32 = Int32Array;

function adler32(adler, buf, len, pos) {
    for (var s1 = 65535 & adler, s2 = (adler >>> 16) & 65535, n = 0; 0 !== len; ) {
        len -= n = len > 2e3 ? 2e3 : len;
        do {
            s2 = (s2 + (s1 = (s1 + buf[pos++]) | 0)) | 0;
        } while (--n);
        (s1 %= 65521), (s2 %= 65521);
    }
    return s1 | (s2 << 16);
}

function makeTable() {
    for (var c2, table = [], n = 0; n < 256; n++) {
        c2 = n;
        for (var k = 0; k < 8; k++) c2 = 1 & c2 ? 3988292384 ^ (c2 >>> 1) : c2 >>> 1;
        table[n] = c2;
    }
    return table;
}

makeTable();

function inflate_fast(strm, start) {
    var state, _in, last, _out, beg, end, dmax, wsize, whave, wnext, s_window, hold, bits, lcode, dcode, lmask, dmask, here, op, len, dist, from, from_source, input, output;
    (state = strm.state),
        (_in = strm.next_in),
        (input = strm.input),
        (last = _in + (strm.avail_in - 5)),
        (_out = strm.next_out),
        (output = strm.output),
        (beg = _out - (start - strm.avail_out)),
        (end = _out + (strm.avail_out - 257)),
        (dmax = state.dmax),
        (wsize = state.wsize),
        (whave = state.whave),
        (wnext = state.wnext),
        (s_window = state.window),
        (hold = state.hold),
        (bits = state.bits),
        (lcode = state.lencode),
        (dcode = state.distcode),
        (lmask = (1 << state.lenbits) - 1),
        (dmask = (1 << state.distbits) - 1);
    top: do {
        bits < 15 && ((hold += input[_in++] << bits), (bits += 8), (hold += input[_in++] << bits), (bits += 8)), (here = lcode[hold & lmask]);
        dolen: for (;;) {
            if (((hold >>>= op = here >>> 24), (bits -= op), 0 === (op = (here >>> 16) & 255))) output[_out++] = 65535 & here;
            else {
                if (!(16 & op)) {
                    if (64 & op) {
                        if (32 & op) {
                            state.mode = 12;
                            break top;
                        }
                        (strm.msg = 'invalid literal/length code'), (state.mode = 30);
                        break top;
                    }
                    here = lcode[(65535 & here) + (hold & ((1 << op) - 1))];
                    continue dolen;
                }
                for (len = 65535 & here, (op &= 15) && (bits < op && ((hold += input[_in++] << bits), (bits += 8)), (len += hold & ((1 << op) - 1)), (hold >>>= op), (bits -= op)), bits < 15 && ((hold += input[_in++] << bits), (bits += 8), (hold += input[_in++] << bits), (bits += 8)), here = dcode[hold & dmask]; ; ) {
                    if (((hold >>>= op = here >>> 24), (bits -= op), 16 & (op = (here >>> 16) & 255))) {
                        if (((dist = 65535 & here), bits < (op &= 15) && ((hold += input[_in++] << bits), (bits += 8) < op && ((hold += input[_in++] << bits), (bits += 8))), (dist += hold & ((1 << op) - 1)) > dmax)) {
                            (strm.msg = 'invalid distance too far back'), (state.mode = 30);
                            break top;
                        }
                        if (((hold >>>= op), (bits -= op), dist > (op = _out - beg))) {
                            if ((op = dist - op) > whave && state.sane) {
                                (strm.msg = 'invalid distance too far back'), (state.mode = 30);
                                break top;
                            }
                            if (((from = 0), (from_source = s_window), 0 === wnext)) {
                                if (((from += wsize - op), op < len)) {
                                    len -= op;
                                    do {
                                        output[_out++] = s_window[from++];
                                    } while (--op);
                                    (from = _out - dist), (from_source = output);
                                }
                            } else if (wnext < op) {
                                if (((from += wsize + wnext - op), (op -= wnext) < len)) {
                                    len -= op;
                                    do {
                                        output[_out++] = s_window[from++];
                                    } while (--op);
                                    if (((from = 0), wnext < len)) {
                                        len -= op = wnext;
                                        do {
                                            output[_out++] = s_window[from++];
                                        } while (--op);
                                        (from = _out - dist), (from_source = output);
                                    }
                                }
                            } else if (((from += wnext - op), op < len)) {
                                len -= op;
                                do {
                                    output[_out++] = s_window[from++];
                                } while (--op);
                                (from = _out - dist), (from_source = output);
                            }
                            for (; len > 2; ) (output[_out++] = from_source[from++]), (output[_out++] = from_source[from++]), (output[_out++] = from_source[from++]), (len -= 3);
                            len && ((output[_out++] = from_source[from++]), len > 1 && (output[_out++] = from_source[from++]));
                        } else {
                            from = _out - dist;
                            do {
                                (output[_out++] = output[from++]), (output[_out++] = output[from++]), (output[_out++] = output[from++]), (len -= 3);
                            } while (len > 2);
                            len && ((output[_out++] = output[from++]), len > 1 && (output[_out++] = output[from++]));
                        }
                        break;
                    }
                    if (64 & op) {
                        (strm.msg = 'invalid distance code'), (state.mode = 30);
                        break top;
                    }
                    here = dcode[(65535 & here) + (hold & ((1 << op) - 1))];
                }
            }
            break;
        }
    } while (_in < last && _out < end);
    (_in -= len = bits >> 3), (hold &= (1 << (bits -= len << 3)) - 1), (strm.next_in = _in), (strm.next_out = _out), (strm.avail_in = _in < last ? last - _in + 5 : 5 - (_in - last)), (strm.avail_out = _out < end ? end - _out + 257 : 257 - (_out - end)), (state.hold = hold), (state.bits = bits);
}

var lbase = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
    lext = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
    dbase = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
    dext = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];

function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
    var incr,
        fill,
        low,
        mask,
        next,
        end,
        here_bits,
        here_op,
        here_val,
        bits = opts.bits,
        len = 0,
        sym = 0,
        min = 0,
        max = 0,
        root = 0,
        curr = 0,
        drop = 0,
        left = 0,
        used = 0,
        huff = 0,
        base = null,
        base_index = 0,
        count = new Buf16(16),
        offs = new Buf16(16),
        extra = null,
        extra_index = 0;
    for (len = 0; len <= 15; len++) count[len] = 0;
    for (sym = 0; sym < codes; sym++) count[lens[lens_index + sym]]++;
    for (root = bits, max = 15; max >= 1 && 0 === count[max]; max--);
    if ((root > max && (root = max), 0 === max)) return (table[table_index++] = 20971520), (table[table_index++] = 20971520), (opts.bits = 1), 0;
    for (min = 1; min < max && 0 === count[min]; min++);
    for (root < min && (root = min), left = 1, len = 1; len <= 15; len++) if (((left <<= 1), (left -= count[len]) < 0)) return -1;
    if (left > 0 && (0 === type || 1 !== max)) return -1;
    for (offs[1] = 0, len = 1; len < 15; len++) offs[len + 1] = offs[len] + count[len];
    for (sym = 0; sym < codes; sym++) 0 !== lens[lens_index + sym] && (work[offs[lens[lens_index + sym]]++] = sym);
    if ((0 === type ? ((base = extra = work), (end = 19)) : 1 === type ? ((base = lbase), (base_index -= 257), (extra = lext), (extra_index -= 257), (end = 256)) : ((base = dbase), (extra = dext), (end = -1)), (huff = 0), (sym = 0), (len = min), (next = table_index), (curr = root), (drop = 0), (low = -1), (mask = (used = 1 << root) - 1), (1 === type && used > 852) || (2 === type && used > 592)))
        return 1;
    for (;;) {
        (here_bits = len - drop), work[sym] < end ? ((here_op = 0), (here_val = work[sym])) : work[sym] > end ? ((here_op = extra[extra_index + work[sym]]), (here_val = base[base_index + work[sym]])) : ((here_op = 96), (here_val = 0)), (incr = 1 << (len - drop)), (min = fill = 1 << curr);
        do {
            table[next + (huff >> drop) + (fill -= incr)] = (here_bits << 24) | (here_op << 16) | here_val;
        } while (0 !== fill);
        for (incr = 1 << (len - 1); huff & incr; ) incr >>= 1;
        if ((0 !== incr ? ((huff &= incr - 1), (huff += incr)) : (huff = 0), sym++, 0 == --count[len])) {
            if (len === max) break;
            len = lens[lens_index + work[sym]];
        }
        if (len > root && (huff & mask) !== low) {
            for (0 === drop && (drop = root), next += min, left = 1 << (curr = len - drop); curr + drop < max && !((left -= count[curr + drop]) <= 0); ) curr++, (left <<= 1);
            if (((used += 1 << curr), (1 === type && used > 852) || (2 === type && used > 592))) return 1;
            table[(low = huff & mask)] = (root << 24) | (curr << 16) | (next - table_index);
        }
    }
    return 0 !== huff && (table[next + huff] = ((len - drop) << 24) | (64 << 16)), (opts.bits = root), 0;
}

function zswap32(q) {
    return ((q >>> 24) & 255) + ((q >>> 8) & 65280) + ((65280 & q) << 8) + ((255 & q) << 24);
}

function InflateState() {
    (this.mode = 0),
        (this.last = !1),
        (this.wrap = 0),
        (this.havedict = !1),
        (this.flags = 0),
        (this.dmax = 0),
        (this.check = 0),
        (this.total = 0),
        (this.head = null),
        (this.wbits = 0),
        (this.wsize = 0),
        (this.whave = 0),
        (this.wnext = 0),
        (this.window = null),
        (this.hold = 0),
        (this.bits = 0),
        (this.length = 0),
        (this.offset = 0),
        (this.extra = 0),
        (this.lencode = null),
        (this.distcode = null),
        (this.lenbits = 0),
        (this.distbits = 0),
        (this.ncode = 0),
        (this.nlen = 0),
        (this.ndist = 0),
        (this.have = 0),
        (this.next = null),
        (this.lens = new Buf16(320)),
        (this.work = new Buf16(288)),
        (this.lendyn = null),
        (this.distdyn = null),
        (this.sane = 0),
        (this.back = 0),
        (this.was = 0);
}

function inflateReset(strm) {
    var state;
    return strm && strm.state
        ? (((state = strm.state).wsize = 0),
          (state.whave = 0),
          (state.wnext = 0),
          (function (strm) {
              var state;
              return strm && strm.state
                  ? ((state = strm.state),
                    (strm.total_in = strm.total_out = state.total = 0),
                    (strm.msg = ''),
                    state.wrap && (strm.adler = 1 & state.wrap),
                    (state.mode = 1),
                    (state.last = 0),
                    (state.havedict = 0),
                    (state.dmax = 32768),
                    (state.head = null),
                    (state.hold = 0),
                    (state.bits = 0),
                    (state.lencode = state.lendyn = new Buf32(852)),
                    (state.distcode = state.distdyn = new Buf32(592)),
                    (state.sane = 1),
                    (state.back = -1),
                    0)
                  : -2;
          })(strm))
        : -2;
}

function inflateInit2(strm, windowBits) {
    var ret, state;
    return strm
        ? ((state = new InflateState()),
          (strm.state = state),
          (state.window = null),
          (ret = (function (strm, windowBits) {
              var wrap, state;
              return strm && strm.state
                  ? ((state = strm.state), windowBits < 0 ? ((wrap = 0), (windowBits = -windowBits)) : ((wrap = 1 + (windowBits >> 4)), windowBits < 48 && (windowBits &= 15)), windowBits && (windowBits < 8 || windowBits > 15) ? -2 : (null !== state.window && state.wbits !== windowBits && (state.window = null), (state.wrap = wrap), (state.wbits = windowBits), inflateReset(strm)))
                  : -2;
          })(strm, windowBits)),
          0 !== ret && (strm.state = null),
          ret)
        : -2;
}

var lenfix,
    distfix,
    virgin = !0;

function fixedtables(state) {
    if (virgin) {
        var sym;
        for (lenfix = new Buf32(512), distfix = new Buf32(32), sym = 0; sym < 144; ) state.lens[sym++] = 8;
        for (; sym < 256; ) state.lens[sym++] = 9;
        for (; sym < 280; ) state.lens[sym++] = 7;
        for (; sym < 288; ) state.lens[sym++] = 8;
        for (
            inflate_table(1, state.lens, 0, 288, lenfix, 0, state.work, {
                bits: 9,
            }),
                sym = 0;
            sym < 32;

        )
            state.lens[sym++] = 5;
        inflate_table(2, state.lens, 0, 32, distfix, 0, state.work, {
            bits: 5,
        }),
            (virgin = !1);
    }
    (state.lencode = lenfix), (state.lenbits = 9), (state.distcode = distfix), (state.distbits = 5);
}

function inflate(strm, flush) {
    var state,
        input,
        output,
        next,
        put,
        have,
        left,
        hold,
        bits,
        _in,
        _out,
        copy,
        from,
        from_source,
        here_bits,
        here_op,
        here_val,
        last_bits,
        last_op,
        last_val,
        len,
        ret,
        opts,
        n,
        here = 0,
        hbuf = new Buf8(4),
        order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    if (!strm || !strm.state || !strm.output || (!strm.input && 0 !== strm.avail_in)) return -2;
    12 === (state = strm.state).mode && (state.mode = 13), (put = strm.next_out), (output = strm.output), (left = strm.avail_out), (next = strm.next_in), (input = strm.input), (have = strm.avail_in), (hold = state.hold), (bits = state.bits), (_in = have), (_out = left), (ret = 0);
    inf_leave: for (;;)
        switch (state.mode) {
            case 1:
                if (0 === state.wrap) {
                    state.mode = 13;
                    break;
                }
                for (; bits < 16; ) {
                    if (0 === have) break inf_leave;
                    have--, (hold += input[next++] << bits), (bits += 8);
                }
                if (2 & state.wrap && 35615 === hold) {
                    (state.check = 0), (hbuf[0] = 255 & hold), (hbuf[1] = (hold >>> 8) & 255), (state.check = makeTable(state.check)), (hold = 0), (bits = 0), (state.mode = 2);
                    break;
                }
                if (((state.flags = 0), state.head && (state.head.done = !1), !(1 & state.wrap) || (((255 & hold) << 8) + (hold >> 8)) % 31)) {
                    (strm.msg = 'incorrect header check'), (state.mode = 30);
                    break;
                }
                if (8 != (15 & hold)) {
                    (strm.msg = 'unknown compression method'), (state.mode = 30);
                    break;
                }
                if (((bits -= 4), (len = 8 + (15 & (hold >>>= 4))), 0 === state.wbits)) state.wbits = len;
                else if (len > state.wbits) {
                    (strm.msg = 'invalid window size'), (state.mode = 30);
                    break;
                }
                (state.dmax = 1 << len), (strm.adler = state.check = 1), (state.mode = 512 & hold ? 10 : 12), (hold = 0), (bits = 0);
                break;

            case 2:
                for (; bits < 16; ) {
                    if (0 === have) break inf_leave;
                    have--, (hold += input[next++] << bits), (bits += 8);
                }
                if (((state.flags = hold), 8 != (255 & state.flags))) {
                    (strm.msg = 'unknown compression method'), (state.mode = 30);
                    break;
                }
                if (57344 & state.flags) {
                    (strm.msg = 'unknown header flags set'), (state.mode = 30);
                    break;
                }
                state.head && (state.head.text = (hold >> 8) & 1), 512 & state.flags && ((hbuf[0] = 255 & hold), (hbuf[1] = (hold >>> 8) & 255), (state.check = makeTable(state.check))), (hold = 0), (bits = 0), (state.mode = 3);

            case 3:
                for (; bits < 32; ) {
                    if (0 === have) break inf_leave;
                    have--, (hold += input[next++] << bits), (bits += 8);
                }
                state.head && (state.head.time = hold), 512 & state.flags && ((hbuf[0] = 255 & hold), (hbuf[1] = (hold >>> 8) & 255), (hbuf[2] = (hold >>> 16) & 255), (hbuf[3] = (hold >>> 24) & 255), (state.check = makeTable(state.check))), (hold = 0), (bits = 0), (state.mode = 4);

            case 4:
                for (; bits < 16; ) {
                    if (0 === have) break inf_leave;
                    have--, (hold += input[next++] << bits), (bits += 8);
                }
                state.head && ((state.head.xflags = 255 & hold), (state.head.os = hold >> 8)), 512 & state.flags && ((hbuf[0] = 255 & hold), (hbuf[1] = (hold >>> 8) & 255), (state.check = makeTable(state.check))), (hold = 0), (bits = 0), (state.mode = 5);

            case 5:
                if (1024 & state.flags) {
                    for (; bits < 16; ) {
                        if (0 === have) break inf_leave;
                        have--, (hold += input[next++] << bits), (bits += 8);
                    }
                    (state.length = hold), state.head && (state.head.extra_len = hold), 512 & state.flags && ((hbuf[0] = 255 & hold), (hbuf[1] = (hold >>> 8) & 255), (state.check = makeTable(state.check))), (hold = 0), (bits = 0);
                } else state.head && (state.head.extra = null);
                state.mode = 6;

            case 6:
                if (
                    1024 & state.flags &&
                    ((copy = state.length) > have && (copy = have), copy && (state.head && ((len = state.head.extra_len - state.length), state.head.extra || (state.head.extra = new Array(state.head.extra_len)), arraySet(state.head.extra, input, next, copy, len)), 512 & state.flags && (state.check = makeTable(state.check)), (have -= copy), (next += copy), (state.length -= copy)), state.length)
                )
                    break inf_leave;
                (state.length = 0), (state.mode = 7);

            case 7:
                if (2048 & state.flags) {
                    if (0 === have) break inf_leave;
                    copy = 0;
                    do {
                        (len = input[next + copy++]), state.head && len && state.length < 65536 && (state.head.name += String.fromCharCode(len));
                    } while (len && copy < have);
                    if ((512 & state.flags && (state.check = makeTable(state.check)), (have -= copy), (next += copy), len)) break inf_leave;
                } else state.head && (state.head.name = null);
                (state.length = 0), (state.mode = 8);

            case 8:
                if (4096 & state.flags) {
                    if (0 === have) break inf_leave;
                    copy = 0;
                    do {
                        (len = input[next + copy++]), state.head && len && state.length < 65536 && (state.head.comment += String.fromCharCode(len));
                    } while (len && copy < have);
                    if ((512 & state.flags && (state.check = makeTable(state.check)), (have -= copy), (next += copy), len)) break inf_leave;
                } else state.head && (state.head.comment = null);
                state.mode = 9;

            case 9:
                if (512 & state.flags) {
                    for (; bits < 16; ) {
                        if (0 === have) break inf_leave;
                        have--, (hold += input[next++] << bits), (bits += 8);
                    }
                    if (hold !== (65535 & state.check)) {
                        (strm.msg = 'header crc mismatch'), (state.mode = 30);
                        break;
                    }
                    (hold = 0), (bits = 0);
                }
                state.head && ((state.head.hcrc = (state.flags >> 9) & 1), (state.head.done = !0)), (strm.adler = state.check = 0), (state.mode = 12);
                break;

            case 10:
                for (; bits < 32; ) {
                    if (0 === have) break inf_leave;
                    have--, (hold += input[next++] << bits), (bits += 8);
                }
                (strm.adler = state.check = zswap32(hold)), (hold = 0), (bits = 0), (state.mode = 11);

            case 11:
                if (0 === state.havedict) return (strm.next_out = put), (strm.avail_out = left), (strm.next_in = next), (strm.avail_in = have), (state.hold = hold), (state.bits = bits), 2;
                (strm.adler = state.check = 1), (state.mode = 12);

            case 12:
            case 13:
                if (state.last) {
                    (hold >>>= 7 & bits), (bits -= 7 & bits), (state.mode = 27);
                    break;
                }
                for (; bits < 3; ) {
                    if (0 === have) break inf_leave;
                    have--, (hold += input[next++] << bits), (bits += 8);
                }
                switch (((state.last = 1 & hold), (bits -= 1), 3 & (hold >>>= 1))) {
                    case 0:
                        state.mode = 14;
                        break;

                    case 1:
                        fixedtables(state), (state.mode = 20);
                        break;

                    case 2:
                        state.mode = 17;
                        break;

                    case 3:
                        (strm.msg = 'invalid block type'), (state.mode = 30);
                }
                (hold >>>= 2), (bits -= 2);
                break;

            case 14:
                for (hold >>>= 7 & bits, bits -= 7 & bits; bits < 32; ) {
                    if (0 === have) break inf_leave;
                    have--, (hold += input[next++] << bits), (bits += 8);
                }
                if ((65535 & hold) != ((hold >>> 16) ^ 65535)) {
                    (strm.msg = 'invalid stored block lengths'), (state.mode = 30);
                    break;
                }
                (state.length = 65535 & hold), (hold = 0), (bits = 0), (state.mode = 15);

            case 15:
                state.mode = 16;

            case 16:
                if ((copy = state.length)) {
                    if ((copy > have && (copy = have), copy > left && (copy = left), 0 === copy)) break inf_leave;
                    arraySet(output, input, next, copy, put), (have -= copy), (next += copy), (left -= copy), (put += copy), (state.length -= copy);
                    break;
                }
                state.mode = 12;
                break;

            case 17:
                for (; bits < 14; ) {
                    if (0 === have) break inf_leave;
                    have--, (hold += input[next++] << bits), (bits += 8);
                }
                if (((state.nlen = 257 + (31 & hold)), (hold >>>= 5), (bits -= 5), (state.ndist = 1 + (31 & hold)), (hold >>>= 5), (bits -= 5), (state.ncode = 4 + (15 & hold)), (hold >>>= 4), (bits -= 4), state.nlen > 286 || state.ndist > 30)) {
                    (strm.msg = 'too many length or distance symbols'), (state.mode = 30);
                    break;
                }
                (state.have = 0), (state.mode = 18);

            case 18:
                for (; state.have < state.ncode; ) {
                    for (; bits < 3; ) {
                        if (0 === have) break inf_leave;
                        have--, (hold += input[next++] << bits), (bits += 8);
                    }
                    (state.lens[order[state.have++]] = 7 & hold), (hold >>>= 3), (bits -= 3);
                }
                for (; state.have < 19; ) state.lens[order[state.have++]] = 0;
                if (
                    ((state.lencode = state.lendyn),
                    (state.lenbits = 7),
                    (opts = {
                        bits: state.lenbits,
                    }),
                    (ret = inflate_table(0, state.lens, 0, 19, state.lencode, 0, state.work, opts)),
                    (state.lenbits = opts.bits),
                    ret)
                ) {
                    (strm.msg = 'invalid code lengths set'), (state.mode = 30);
                    break;
                }
                (state.have = 0), (state.mode = 19);

            case 19:
                for (; state.have < state.nlen + state.ndist; ) {
                    for (; (here_op = ((here = state.lencode[hold & ((1 << state.lenbits) - 1)]) >>> 16) & 255), (here_val = 65535 & here), !((here_bits = here >>> 24) <= bits); ) {
                        if (0 === have) break inf_leave;
                        have--, (hold += input[next++] << bits), (bits += 8);
                    }
                    if (here_val < 16) (hold >>>= here_bits), (bits -= here_bits), (state.lens[state.have++] = here_val);
                    else {
                        if (16 === here_val) {
                            for (n = here_bits + 2; bits < n; ) {
                                if (0 === have) break inf_leave;
                                have--, (hold += input[next++] << bits), (bits += 8);
                            }
                            if (((hold >>>= here_bits), (bits -= here_bits), 0 === state.have)) {
                                (strm.msg = 'invalid bit length repeat'), (state.mode = 30);
                                break;
                            }
                            (len = state.lens[state.have - 1]), (copy = 3 + (3 & hold)), (hold >>>= 2), (bits -= 2);
                        } else if (17 === here_val) {
                            for (n = here_bits + 3; bits < n; ) {
                                if (0 === have) break inf_leave;
                                have--, (hold += input[next++] << bits), (bits += 8);
                            }
                            (bits -= here_bits), (len = 0), (copy = 3 + (7 & (hold >>>= here_bits))), (hold >>>= 3), (bits -= 3);
                        } else {
                            for (n = here_bits + 7; bits < n; ) {
                                if (0 === have) break inf_leave;
                                have--, (hold += input[next++] << bits), (bits += 8);
                            }
                            (bits -= here_bits), (len = 0), (copy = 11 + (127 & (hold >>>= here_bits))), (hold >>>= 7), (bits -= 7);
                        }
                        if (state.have + copy > state.nlen + state.ndist) {
                            (strm.msg = 'invalid bit length repeat'), (state.mode = 30);
                            break;
                        }
                        for (; copy--; ) state.lens[state.have++] = len;
                    }
                }
                if (30 === state.mode) break;
                if (0 === state.lens[256]) {
                    (strm.msg = 'invalid code -- missing end-of-block'), (state.mode = 30);
                    break;
                }
                if (
                    ((state.lenbits = 9),
                    (opts = {
                        bits: state.lenbits,
                    }),
                    (ret = inflate_table(1, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts)),
                    (state.lenbits = opts.bits),
                    ret)
                ) {
                    (strm.msg = 'invalid literal/lengths set'), (state.mode = 30);
                    break;
                }
                if (
                    ((state.distbits = 6),
                    (state.distcode = state.distdyn),
                    (opts = {
                        bits: state.distbits,
                    }),
                    (ret = inflate_table(2, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts)),
                    (state.distbits = opts.bits),
                    ret)
                ) {
                    (strm.msg = 'invalid distances set'), (state.mode = 30);
                    break;
                }
                state.mode = 20;

            case 20:
                state.mode = 21;

            case 21:
                if (have >= 6 && left >= 258) {
                    (strm.next_out = put),
                        (strm.avail_out = left),
                        (strm.next_in = next),
                        (strm.avail_in = have),
                        (state.hold = hold),
                        (state.bits = bits),
                        inflate_fast(strm, _out),
                        (put = strm.next_out),
                        (output = strm.output),
                        (left = strm.avail_out),
                        (next = strm.next_in),
                        (input = strm.input),
                        (have = strm.avail_in),
                        (hold = state.hold),
                        (bits = state.bits),
                        12 === state.mode && (state.back = -1);
                    break;
                }
                for (state.back = 0; (here_op = ((here = state.lencode[hold & ((1 << state.lenbits) - 1)]) >>> 16) & 255), (here_val = 65535 & here), !((here_bits = here >>> 24) <= bits); ) {
                    if (0 === have) break inf_leave;
                    have--, (hold += input[next++] << bits), (bits += 8);
                }
                if (here_op && !(240 & here_op)) {
                    for (last_bits = here_bits, last_op = here_op, last_val = here_val; (here_op = ((here = state.lencode[last_val + ((hold & ((1 << (last_bits + last_op)) - 1)) >> last_bits)]) >>> 16) & 255), (here_val = 65535 & here), !(last_bits + (here_bits = here >>> 24) <= bits); ) {
                        if (0 === have) break inf_leave;
                        have--, (hold += input[next++] << bits), (bits += 8);
                    }
                    (hold >>>= last_bits), (bits -= last_bits), (state.back += last_bits);
                }
                if (((hold >>>= here_bits), (bits -= here_bits), (state.back += here_bits), (state.length = here_val), 0 === here_op)) {
                    state.mode = 26;
                    break;
                }
                if (32 & here_op) {
                    (state.back = -1), (state.mode = 12);
                    break;
                }
                if (64 & here_op) {
                    (strm.msg = 'invalid literal/length code'), (state.mode = 30);
                    break;
                }
                (state.extra = 15 & here_op), (state.mode = 22);

            case 22:
                if (state.extra) {
                    for (n = state.extra; bits < n; ) {
                        if (0 === have) break inf_leave;
                        have--, (hold += input[next++] << bits), (bits += 8);
                    }
                    (state.length += hold & ((1 << state.extra) - 1)), (hold >>>= state.extra), (bits -= state.extra), (state.back += state.extra);
                }
                (state.was = state.length), (state.mode = 23);

            case 23:
                for (; (here_op = ((here = state.distcode[hold & ((1 << state.distbits) - 1)]) >>> 16) & 255), (here_val = 65535 & here), !((here_bits = here >>> 24) <= bits); ) {
                    if (0 === have) break inf_leave;
                    have--, (hold += input[next++] << bits), (bits += 8);
                }
                if (!(240 & here_op)) {
                    for (last_bits = here_bits, last_op = here_op, last_val = here_val; (here_op = ((here = state.distcode[last_val + ((hold & ((1 << (last_bits + last_op)) - 1)) >> last_bits)]) >>> 16) & 255), (here_val = 65535 & here), !(last_bits + (here_bits = here >>> 24) <= bits); ) {
                        if (0 === have) break inf_leave;
                        have--, (hold += input[next++] << bits), (bits += 8);
                    }
                    (hold >>>= last_bits), (bits -= last_bits), (state.back += last_bits);
                }
                if (((hold >>>= here_bits), (bits -= here_bits), (state.back += here_bits), 64 & here_op)) {
                    (strm.msg = 'invalid distance code'), (state.mode = 30);
                    break;
                }
                (state.offset = here_val), (state.extra = 15 & here_op), (state.mode = 24);

            case 24:
                if (state.extra) {
                    for (n = state.extra; bits < n; ) {
                        if (0 === have) break inf_leave;
                        have--, (hold += input[next++] << bits), (bits += 8);
                    }
                    (state.offset += hold & ((1 << state.extra) - 1)), (hold >>>= state.extra), (bits -= state.extra), (state.back += state.extra);
                }
                if (state.offset > state.dmax) {
                    (strm.msg = 'invalid distance too far back'), (state.mode = 30);
                    break;
                }
                state.mode = 25;

            case 25:
                if (0 === left) break inf_leave;
                if (((copy = _out - left), state.offset > copy)) {
                    if ((copy = state.offset - copy) > state.whave && state.sane) {
                        (strm.msg = 'invalid distance too far back'), (state.mode = 30);
                        break;
                    }
                    copy > state.wnext ? ((copy -= state.wnext), (from = state.wsize - copy)) : (from = state.wnext - copy), copy > state.length && (copy = state.length), (from_source = state.window);
                } else (from_source = output), (from = put - state.offset), (copy = state.length);
                copy > left && (copy = left), (left -= copy), (state.length -= copy);
                do {
                    output[put++] = from_source[from++];
                } while (--copy);
                0 === state.length && (state.mode = 21);
                break;

            case 26:
                if (0 === left) break inf_leave;
                (output[put++] = state.length), left--, (state.mode = 21);
                break;

            case 27:
                if (state.wrap) {
                    for (; bits < 32; ) {
                        if (0 === have) break inf_leave;
                        have--, (hold |= input[next++] << bits), (bits += 8);
                    }
                    if (((_out -= left), (strm.total_out += _out), (state.total += _out), _out && (strm.adler = state.check = state.flags ? makeTable(state.check) : adler32(state.check, output, _out, put - _out)), (_out = left), (state.flags ? hold : zswap32(hold)) !== state.check)) {
                        (strm.msg = 'incorrect data check'), (state.mode = 30);
                        break;
                    }
                    (hold = 0), (bits = 0);
                }
                state.mode = 28;

            case 28:
                if (state.wrap && state.flags) {
                    for (; bits < 32; ) {
                        if (0 === have) break inf_leave;
                        have--, (hold += input[next++] << bits), (bits += 8);
                    }
                    if (hold !== (4294967295 & state.total)) {
                        (strm.msg = 'incorrect length check'), (state.mode = 30);
                        break;
                    }
                    (hold = 0), (bits = 0);
                }
                state.mode = 29;

            case 29:
                ret = 1;
                break inf_leave;

            case 30:
                ret = -3;
                break inf_leave;

            case 31:
                return -4;

            default:
                return -2;
        }
    return (
        (strm.next_out = put),
        (strm.avail_out = left),
        (strm.next_in = next),
        (strm.avail_in = have),
        (state.hold = hold),
        (state.bits = bits),
        (state.wsize || (_out !== strm.avail_out && state.mode < 30 && (state.mode < 27 || 4 !== flush))) &&
            (function (strm, src, end, copy) {
                var dist,
                    state = strm.state;
                null === state.window && ((state.wsize = 1 << state.wbits), (state.wnext = 0), (state.whave = 0), (state.window = new Buf8(state.wsize))),
                    copy >= state.wsize
                        ? (arraySet(state.window, src, end - state.wsize, state.wsize, 0), (state.wnext = 0), (state.whave = state.wsize))
                        : ((dist = state.wsize - state.wnext) > copy && (dist = copy), arraySet(state.window, src, end - copy, dist, state.wnext), (copy -= dist) ? (arraySet(state.window, src, end - copy, copy, 0), (state.wnext = copy), (state.whave = state.wsize)) : ((state.wnext += dist), state.wnext === state.wsize && (state.wnext = 0), state.whave < state.wsize && (state.whave += dist)));
            })(strm, strm.output, strm.next_out, _out - strm.avail_out),
        (_in -= strm.avail_in),
        (_out -= strm.avail_out),
        (strm.total_in += _in),
        (strm.total_out += _out),
        (state.total += _out),
        state.wrap && _out && (strm.adler = state.check = state.flags ? makeTable(state.check, strm.next_out) : adler32(state.check, output, _out, strm.next_out - _out)),
        (strm.data_type = state.bits + (state.last ? 64 : 0) + (12 === state.mode ? 128 : 0) + (20 === state.mode || 15 === state.mode ? 256 : 0)),
        ((0 === _in && 0 === _out) || 4 === flush) && 0 === ret && (ret = -5),
        ret
    );
}

function ZStream() {
    (this.input = null), (this.next_in = 0), (this.avail_in = 0), (this.total_in = 0), (this.output = null), (this.next_out = 0), (this.avail_out = 0), (this.total_out = 0), (this.msg = ''), (this.state = null), (this.data_type = 2), (this.adler = 0);
}

class Inflate {
    constructor() {
        var strm;
        (this.strm = new ZStream()), (this.chunkSize = 102400), (this.strm.output = new Uint8Array(this.chunkSize)), (this.windowBits = 5), (strm = this.strm), this.windowBits, inflateInit2(strm, 15);
    }
    setInput(data) {
        data ? ((this.strm.input = data), (this.strm.avail_in = this.strm.input.length), (this.strm.next_in = 0)) : ((this.strm.input = null), (this.strm.avail_in = 0), (this.strm.next_in = 0));
    }
    inflate(expected) {
        if ((expected > this.chunkSize && ((this.chunkSize = expected), (this.strm.output = new Uint8Array(this.chunkSize))), (this.strm.next_out = 0), (this.strm.avail_out = expected), inflate(this.strm, 0) < 0)) throw new Error('zlib inflate failed');
        if (this.strm.next_out != expected) throw new Error('Incomplete zlib block');
        return new Uint8Array(this.strm.output.buffer, 0, this.strm.next_out);
    }
    reset() {
        inflateReset(this.strm);
    }
}

function zero$1(buf) {
    for (var len = buf.length; --len >= 0; ) buf[len] = 0;
}

var extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
    extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
    extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
    bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
    static_ltree = new Array(576);

zero$1(static_ltree);

var static_dtree = new Array(60);

zero$1(static_dtree);

var _dist_code = new Array(512);

zero$1(_dist_code);

var _length_code = new Array(256);

zero$1(_length_code);

var base_length = new Array(29);

zero$1(base_length);

var static_l_desc,
    static_d_desc,
    static_bl_desc,
    base_dist = new Array(30);

function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    (this.static_tree = static_tree), (this.extra_bits = extra_bits), (this.extra_base = extra_base), (this.elems = elems), (this.max_length = max_length), (this.has_stree = static_tree && static_tree.length);
}

function TreeDesc(dyn_tree, stat_desc) {
    (this.dyn_tree = dyn_tree), (this.max_code = 0), (this.stat_desc = stat_desc);
}

function d_code(dist) {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}

function put_short(s, w) {
    (s.pending_buf[s.pending++] = 255 & w), (s.pending_buf[s.pending++] = (w >>> 8) & 255);
}

function send_bits(s, value, length) {
    s.bi_valid > 16 - length ? ((s.bi_buf |= (value << s.bi_valid) & 65535), put_short(s, s.bi_buf), (s.bi_buf = value >> (16 - s.bi_valid)), (s.bi_valid += length - 16)) : ((s.bi_buf |= (value << s.bi_valid) & 65535), (s.bi_valid += length));
}

function send_code(s, c2, tree) {
    send_bits(s, tree[2 * c2], tree[2 * c2 + 1]);
}

function bi_reverse(code, len) {
    var res = 0;
    do {
        (res |= 1 & code), (code >>>= 1), (res <<= 1);
    } while (--len > 0);
    return res >>> 1;
}

function gen_codes(tree, max_code, bl_count) {
    var bits,
        n,
        next_code = new Array(16),
        code = 0;
    for (bits = 1; bits <= 15; bits++) next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
    for (n = 0; n <= max_code; n++) {
        var len = tree[2 * n + 1];
        0 !== len && (tree[2 * n] = bi_reverse(next_code[len]++, len));
    }
}

function init_block(s) {
    var n;
    for (n = 0; n < 286; n++) s.dyn_ltree[2 * n] = 0;
    for (n = 0; n < 30; n++) s.dyn_dtree[2 * n] = 0;
    for (n = 0; n < 19; n++) s.bl_tree[2 * n] = 0;
    (s.dyn_ltree[512] = 1), (s.opt_len = s.static_len = 0), (s.last_lit = s.matches = 0);
}

function bi_windup(s) {
    s.bi_valid > 8 ? put_short(s, s.bi_buf) : s.bi_valid > 0 && (s.pending_buf[s.pending++] = s.bi_buf), (s.bi_buf = 0), (s.bi_valid = 0);
}

function smaller(tree, n, m, depth) {
    var _n2 = 2 * n,
        _m2 = 2 * m;
    return tree[_n2] < tree[_m2] || (tree[_n2] === tree[_m2] && depth[n] <= depth[m]);
}

function pqdownheap(s, tree, k) {
    for (var v = s.heap[k], j = k << 1; j <= s.heap_len && (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth) && j++, !smaller(tree, v, s.heap[j], s.depth)); ) (s.heap[k] = s.heap[j]), (k = j), (j <<= 1);
    s.heap[k] = v;
}

function compress_block(s, ltree, dtree) {
    var dist,
        lc,
        code,
        extra,
        lx = 0;
    if (0 !== s.last_lit)
        do {
            (dist = (s.pending_buf[s.d_buf + 2 * lx] << 8) | s.pending_buf[s.d_buf + 2 * lx + 1]),
                (lc = s.pending_buf[s.l_buf + lx]),
                lx++,
                0 === dist ? send_code(s, lc, ltree) : (send_code(s, (code = _length_code[lc]) + 256 + 1, ltree), 0 !== (extra = extra_lbits[code]) && send_bits(s, (lc -= base_length[code]), extra), send_code(s, (code = d_code(--dist)), dtree), 0 !== (extra = extra_dbits[code]) && send_bits(s, (dist -= base_dist[code]), extra));
        } while (lx < s.last_lit);
    send_code(s, 256, ltree);
}

function build_tree(s, desc) {
    var n,
        m,
        node,
        tree = desc.dyn_tree,
        stree = desc.stat_desc.static_tree,
        has_stree = desc.stat_desc.has_stree,
        elems = desc.stat_desc.elems,
        max_code = -1;
    for (s.heap_len = 0, s.heap_max = 573, n = 0; n < elems; n++) 0 !== tree[2 * n] ? ((s.heap[++s.heap_len] = max_code = n), (s.depth[n] = 0)) : (tree[2 * n + 1] = 0);
    for (; s.heap_len < 2; ) (tree[2 * (node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0)] = 1), (s.depth[node] = 0), s.opt_len--, has_stree && (s.static_len -= stree[2 * node + 1]);
    for (desc.max_code = max_code, n = s.heap_len >> 1; n >= 1; n--) pqdownheap(s, tree, n);
    node = elems;
    do {
        (n = s.heap[1]), (s.heap[1] = s.heap[s.heap_len--]), pqdownheap(s, tree, 1), (m = s.heap[1]), (s.heap[--s.heap_max] = n), (s.heap[--s.heap_max] = m), (tree[2 * node] = tree[2 * n] + tree[2 * m]), (s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1), (tree[2 * n + 1] = tree[2 * m + 1] = node), (s.heap[1] = node++), pqdownheap(s, tree, 1);
    } while (s.heap_len >= 2);
    (s.heap[--s.heap_max] = s.heap[1]),
        (function (s, desc) {
            var h,
                n,
                m,
                bits,
                xbits,
                f2,
                tree = desc.dyn_tree,
                max_code = desc.max_code,
                stree = desc.stat_desc.static_tree,
                has_stree = desc.stat_desc.has_stree,
                extra = desc.stat_desc.extra_bits,
                base = desc.stat_desc.extra_base,
                max_length = desc.stat_desc.max_length,
                overflow = 0;
            for (bits = 0; bits <= 15; bits++) s.bl_count[bits] = 0;
            for (tree[2 * s.heap[s.heap_max] + 1] = 0, h = s.heap_max + 1; h < 573; h++)
                (bits = tree[2 * tree[2 * (n = s.heap[h]) + 1] + 1] + 1) > max_length && ((bits = max_length), overflow++), (tree[2 * n + 1] = bits), n > max_code || (s.bl_count[bits]++, (xbits = 0), n >= base && (xbits = extra[n - base]), (f2 = tree[2 * n]), (s.opt_len += f2 * (bits + xbits)), has_stree && (s.static_len += f2 * (stree[2 * n + 1] + xbits)));
            if (0 !== overflow) {
                do {
                    for (bits = max_length - 1; 0 === s.bl_count[bits]; ) bits--;
                    s.bl_count[bits]--, (s.bl_count[bits + 1] += 2), s.bl_count[max_length]--, (overflow -= 2);
                } while (overflow > 0);
                for (bits = max_length; 0 !== bits; bits--) for (n = s.bl_count[bits]; 0 !== n; ) (m = s.heap[--h]) > max_code || (tree[2 * m + 1] !== bits && ((s.opt_len += (bits - tree[2 * m + 1]) * tree[2 * m]), (tree[2 * m + 1] = bits)), n--);
            }
        })(s, desc),
        gen_codes(tree, max_code, s.bl_count);
}

function scan_tree(s, tree, max_code) {
    var n,
        curlen,
        prevlen = -1,
        nextlen = tree[1],
        count = 0,
        max_count = 7,
        min_count = 4;
    for (0 === nextlen && ((max_count = 138), (min_count = 3)), tree[2 * (max_code + 1) + 1] = 65535, n = 0; n <= max_code; n++)
        (curlen = nextlen),
            (nextlen = tree[2 * (n + 1) + 1]),
            (++count < max_count && curlen === nextlen) ||
                (count < min_count ? (s.bl_tree[2 * curlen] += count) : 0 !== curlen ? (curlen !== prevlen && s.bl_tree[2 * curlen]++, s.bl_tree[32]++) : count <= 10 ? s.bl_tree[34]++ : s.bl_tree[36]++, (count = 0), (prevlen = curlen), 0 === nextlen ? ((max_count = 138), (min_count = 3)) : curlen === nextlen ? ((max_count = 6), (min_count = 3)) : ((max_count = 7), (min_count = 4)));
}

function send_tree(s, tree, max_code) {
    var n,
        curlen,
        prevlen = -1,
        nextlen = tree[1],
        count = 0,
        max_count = 7,
        min_count = 4;
    for (0 === nextlen && ((max_count = 138), (min_count = 3)), n = 0; n <= max_code; n++)
        if (((curlen = nextlen), (nextlen = tree[2 * (n + 1) + 1]), !(++count < max_count && curlen === nextlen))) {
            if (count < min_count)
                do {
                    send_code(s, curlen, s.bl_tree);
                } while (0 != --count);
            else 0 !== curlen ? (curlen !== prevlen && (send_code(s, curlen, s.bl_tree), count--), send_code(s, 16, s.bl_tree), send_bits(s, count - 3, 2)) : count <= 10 ? (send_code(s, 17, s.bl_tree), send_bits(s, count - 3, 3)) : (send_code(s, 18, s.bl_tree), send_bits(s, count - 11, 7));
            (count = 0), (prevlen = curlen), 0 === nextlen ? ((max_count = 138), (min_count = 3)) : curlen === nextlen ? ((max_count = 6), (min_count = 3)) : ((max_count = 7), (min_count = 4));
        }
}

zero$1(base_dist);

var static_init_done = !1;

function _tr_init(s) {
    static_init_done ||
        (!(function () {
            var n,
                bits,
                length,
                code,
                dist,
                bl_count = new Array(16);
            for (length = 0, code = 0; code < 28; code++) for (base_length[code] = length, n = 0; n < 1 << extra_lbits[code]; n++) _length_code[length++] = code;
            for (_length_code[length - 1] = code, dist = 0, code = 0; code < 16; code++) for (base_dist[code] = dist, n = 0; n < 1 << extra_dbits[code]; n++) _dist_code[dist++] = code;
            for (dist >>= 7; code < 30; code++) for (base_dist[code] = dist << 7, n = 0; n < 1 << (extra_dbits[code] - 7); n++) _dist_code[256 + dist++] = code;
            for (bits = 0; bits <= 15; bits++) bl_count[bits] = 0;
            for (n = 0; n <= 143; ) (static_ltree[2 * n + 1] = 8), n++, bl_count[8]++;
            for (; n <= 255; ) (static_ltree[2 * n + 1] = 9), n++, bl_count[9]++;
            for (; n <= 279; ) (static_ltree[2 * n + 1] = 7), n++, bl_count[7]++;
            for (; n <= 287; ) (static_ltree[2 * n + 1] = 8), n++, bl_count[8]++;
            for (gen_codes(static_ltree, 287, bl_count), n = 0; n < 30; n++) (static_dtree[2 * n + 1] = 5), (static_dtree[2 * n] = bi_reverse(n, 5));
            (static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, 257, 286, 15)), (static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, 30, 15)), (static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, 19, 7));
        })(),
        (static_init_done = !0)),
        (s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc)),
        (s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc)),
        (s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc)),
        (s.bi_buf = 0),
        (s.bi_valid = 0),
        init_block(s);
}

function _tr_stored_block(s, buf, stored_len, last) {
    send_bits(s, 0 + (last ? 1 : 0), 3),
        (function (s, buf, len) {
            bi_windup(s), put_short(s, len), put_short(s, ~len), arraySet(s.pending_buf, s.window, buf, len, s.pending), (s.pending += len);
        })(s, buf, stored_len);
}

function _tr_flush_block(s, buf, stored_len, last) {
    var opt_lenb,
        static_lenb,
        max_blindex = 0;
    s.level > 0
        ? (2 === s.strm.data_type &&
              (s.strm.data_type = (function (s) {
                  var n,
                      black_mask = 4093624447;
                  for (n = 0; n <= 31; n++, black_mask >>>= 1) if (1 & black_mask && 0 !== s.dyn_ltree[2 * n]) return 0;
                  if (0 !== s.dyn_ltree[18] || 0 !== s.dyn_ltree[20] || 0 !== s.dyn_ltree[26]) return 1;
                  for (n = 32; n < 256; n++) if (0 !== s.dyn_ltree[2 * n]) return 1;
                  return 0;
              })(s)),
          build_tree(s, s.l_desc),
          build_tree(s, s.d_desc),
          (max_blindex = (function (s) {
              var max_blindex;
              for (scan_tree(s, s.dyn_ltree, s.l_desc.max_code), scan_tree(s, s.dyn_dtree, s.d_desc.max_code), build_tree(s, s.bl_desc), max_blindex = 18; max_blindex >= 3 && 0 === s.bl_tree[2 * bl_order[max_blindex] + 1]; max_blindex--);
              return (s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4), max_blindex;
          })(s)),
          (opt_lenb = (s.opt_len + 3 + 7) >>> 3),
          (static_lenb = (s.static_len + 3 + 7) >>> 3) <= opt_lenb && (opt_lenb = static_lenb))
        : (opt_lenb = static_lenb = stored_len + 5),
        stored_len + 4 <= opt_lenb && -1 !== buf
            ? _tr_stored_block(s, buf, stored_len, last)
            : 4 === s.strategy || static_lenb === opt_lenb
            ? (send_bits(s, 2 + (last ? 1 : 0), 3), compress_block(s, static_ltree, static_dtree))
            : (send_bits(s, 4 + (last ? 1 : 0), 3),
              (function (s, lcodes, dcodes, blcodes) {
                  var rank2;
                  for (send_bits(s, lcodes - 257, 5), send_bits(s, dcodes - 1, 5), send_bits(s, blcodes - 4, 4), rank2 = 0; rank2 < blcodes; rank2++) send_bits(s, s.bl_tree[2 * bl_order[rank2] + 1], 3);
                  send_tree(s, s.dyn_ltree, lcodes - 1), send_tree(s, s.dyn_dtree, dcodes - 1);
              })(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1),
              compress_block(s, s.dyn_ltree, s.dyn_dtree)),
        init_block(s),
        last && bi_windup(s);
}

function _tr_tally(s, dist, lc) {
    return (s.pending_buf[s.d_buf + 2 * s.last_lit] = (dist >>> 8) & 255), (s.pending_buf[s.d_buf + 2 * s.last_lit + 1] = 255 & dist), (s.pending_buf[s.l_buf + s.last_lit] = 255 & lc), s.last_lit++, 0 === dist ? s.dyn_ltree[2 * lc]++ : (s.matches++, dist--, s.dyn_ltree[2 * (_length_code[lc] + 256 + 1)]++, s.dyn_dtree[2 * d_code(dist)]++), s.last_lit === s.lit_bufsize - 1;
}

const msg = {
    2: 'need dictionary',
    1: 'stream end',
    0: '',
    '-1': 'file error',
    '-2': 'stream error',
    '-3': 'data error',
    '-4': 'insufficient memory',
    '-5': 'buffer error',
    '-6': 'incompatible version',
};

var configuration_table;

function err(strm, errorCode) {
    return (strm.msg = msg[errorCode]), errorCode;
}

function rank(f2) {
    return (f2 << 1) - (f2 > 4 ? 9 : 0);
}

function zero(buf) {
    for (var len = buf.length; --len >= 0; ) buf[len] = 0;
}

function flush_pending(strm) {
    var s = strm.state,
        len = s.pending;
    len > strm.avail_out && (len = strm.avail_out), 0 !== len && (arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out), (strm.next_out += len), (s.pending_out += len), (strm.total_out += len), (strm.avail_out -= len), (s.pending -= len), 0 === s.pending && (s.pending_out = 0));
}

function flush_block_only(s, last) {
    _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last), (s.block_start = s.strstart), flush_pending(s.strm);
}

function put_byte(s, b2) {
    s.pending_buf[s.pending++] = b2;
}

function putShortMSB(s, b2) {
    (s.pending_buf[s.pending++] = (b2 >>> 8) & 255), (s.pending_buf[s.pending++] = 255 & b2);
}

function longest_match(s, cur_match) {
    var match,
        len,
        chain_length = s.max_chain_length,
        scan = s.strstart,
        best_len = s.prev_length,
        nice_match = s.nice_match,
        limit = s.strstart > s.w_size - 262 ? s.strstart - (s.w_size - 262) : 0,
        _win = s.window,
        wmask = s.w_mask,
        prev = s.prev,
        strend = s.strstart + 258,
        scan_end1 = _win[scan + best_len - 1],
        scan_end = _win[scan + best_len];
    s.prev_length >= s.good_match && (chain_length >>= 2), nice_match > s.lookahead && (nice_match = s.lookahead);
    do {
        if (_win[(match = cur_match) + best_len] === scan_end && _win[match + best_len - 1] === scan_end1 && _win[match] === _win[scan] && _win[++match] === _win[scan + 1]) {
            (scan += 2), match++;
            do {} while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
            if (((len = 258 - (strend - scan)), (scan = strend - 258), len > best_len)) {
                if (((s.match_start = cur_match), (best_len = len), len >= nice_match)) break;
                (scan_end1 = _win[scan + best_len - 1]), (scan_end = _win[scan + best_len]);
            }
        }
    } while ((cur_match = prev[cur_match & wmask]) > limit && 0 != --chain_length);
    return best_len <= s.lookahead ? best_len : s.lookahead;
}

function fill_window(s) {
    var p,
        n,
        m,
        more,
        str,
        strm,
        buf,
        start,
        size,
        len,
        _w_size = s.w_size;
    do {
        if (((more = s.window_size - s.lookahead - s.strstart), s.strstart >= _w_size + (_w_size - 262))) {
            arraySet(s.window, s.window, _w_size, _w_size, 0), (s.match_start -= _w_size), (s.strstart -= _w_size), (s.block_start -= _w_size), (p = n = s.hash_size);
            do {
                (m = s.head[--p]), (s.head[p] = m >= _w_size ? m - _w_size : 0);
            } while (--n);
            p = n = _w_size;
            do {
                (m = s.prev[--p]), (s.prev[p] = m >= _w_size ? m - _w_size : 0);
            } while (--n);
            more += _w_size;
        }
        if (0 === s.strm.avail_in) break;
        if (
            ((strm = s.strm),
            (buf = s.window),
            (start = s.strstart + s.lookahead),
            (size = more),
            (len = void 0),
            (len = strm.avail_in) > size && (len = size),
            (n = 0 === len ? 0 : ((strm.avail_in -= len), arraySet(buf, strm.input, strm.next_in, len, start), 1 === strm.state.wrap ? (strm.adler = adler32(strm.adler, buf, len, start)) : 2 === strm.state.wrap && (strm.adler = makeTable(strm.adler)), (strm.next_in += len), (strm.total_in += len), len)),
            (s.lookahead += n),
            s.lookahead + s.insert >= 3)
        )
            for (str = s.strstart - s.insert, s.ins_h = s.window[str], s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask; s.insert && ((s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 3 - 1]) & s.hash_mask), (s.prev[str & s.w_mask] = s.head[s.ins_h]), (s.head[s.ins_h] = str), str++, s.insert--, !(s.lookahead + s.insert < 3)); );
    } while (s.lookahead < 262 && 0 !== s.strm.avail_in);
}

function deflate_fast(s, flush) {
    for (var hash_head, bflush; ; ) {
        if (s.lookahead < 262) {
            if ((fill_window(s), s.lookahead < 262 && 0 === flush)) return 1;
            if (0 === s.lookahead) break;
        }
        if (((hash_head = 0), s.lookahead >= 3 && ((s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 3 - 1]) & s.hash_mask), (hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]), (s.head[s.ins_h] = s.strstart)), 0 !== hash_head && s.strstart - hash_head <= s.w_size - 262 && (s.match_length = longest_match(s, hash_head)), s.match_length >= 3))
            if (((bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - 3)), (s.lookahead -= s.match_length), s.match_length <= s.max_lazy_match && s.lookahead >= 3)) {
                s.match_length--;
                do {
                    s.strstart++, (s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 3 - 1]) & s.hash_mask), (hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]), (s.head[s.ins_h] = s.strstart);
                } while (0 != --s.match_length);
                s.strstart++;
            } else (s.strstart += s.match_length), (s.match_length = 0), (s.ins_h = s.window[s.strstart]), (s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask);
        else (bflush = _tr_tally(s, 0, s.window[s.strstart])), s.lookahead--, s.strstart++;
        if (bflush && (flush_block_only(s, !1), 0 === s.strm.avail_out)) return 1;
    }
    return (s.insert = s.strstart < 2 ? s.strstart : 2), 4 === flush ? (flush_block_only(s, !0), 0 === s.strm.avail_out ? 3 : 4) : s.last_lit && (flush_block_only(s, !1), 0 === s.strm.avail_out) ? 1 : 2;
}

function deflate_slow(s, flush) {
    for (var hash_head, bflush, max_insert; ; ) {
        if (s.lookahead < 262) {
            if ((fill_window(s), s.lookahead < 262 && 0 === flush)) return 1;
            if (0 === s.lookahead) break;
        }
        if (
            ((hash_head = 0),
            s.lookahead >= 3 && ((s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 3 - 1]) & s.hash_mask), (hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]), (s.head[s.ins_h] = s.strstart)),
            (s.prev_length = s.match_length),
            (s.prev_match = s.match_start),
            (s.match_length = 2),
            0 !== hash_head && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - 262 && ((s.match_length = longest_match(s, hash_head)), s.match_length <= 5 && (1 === s.strategy || (3 === s.match_length && s.strstart - s.match_start > 4096)) && (s.match_length = 2)),
            s.prev_length >= 3 && s.match_length <= s.prev_length)
        ) {
            (max_insert = s.strstart + s.lookahead - 3), (bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - 3)), (s.lookahead -= s.prev_length - 1), (s.prev_length -= 2);
            do {
                ++s.strstart <= max_insert && ((s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 3 - 1]) & s.hash_mask), (hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]), (s.head[s.ins_h] = s.strstart));
            } while (0 != --s.prev_length);
            if (((s.match_available = 0), (s.match_length = 2), s.strstart++, bflush && (flush_block_only(s, !1), 0 === s.strm.avail_out))) return 1;
        } else if (s.match_available) {
            if (((bflush = _tr_tally(s, 0, s.window[s.strstart - 1])) && flush_block_only(s, !1), s.strstart++, s.lookahead--, 0 === s.strm.avail_out)) return 1;
        } else (s.match_available = 1), s.strstart++, s.lookahead--;
    }
    return s.match_available && ((bflush = _tr_tally(s, 0, s.window[s.strstart - 1])), (s.match_available = 0)), (s.insert = s.strstart < 2 ? s.strstart : 2), 4 === flush ? (flush_block_only(s, !0), 0 === s.strm.avail_out ? 3 : 4) : s.last_lit && (flush_block_only(s, !1), 0 === s.strm.avail_out) ? 1 : 2;
}

function Config(good_length, max_lazy, nice_length, max_chain, func) {
    (this.good_length = good_length), (this.max_lazy = max_lazy), (this.nice_length = nice_length), (this.max_chain = max_chain), (this.func = func);
}

function DeflateState() {
    (this.strm = null),
        (this.status = 0),
        (this.pending_buf = null),
        (this.pending_buf_size = 0),
        (this.pending_out = 0),
        (this.pending = 0),
        (this.wrap = 0),
        (this.gzhead = null),
        (this.gzindex = 0),
        (this.method = 8),
        (this.last_flush = -1),
        (this.w_size = 0),
        (this.w_bits = 0),
        (this.w_mask = 0),
        (this.window = null),
        (this.window_size = 0),
        (this.prev = null),
        (this.head = null),
        (this.ins_h = 0),
        (this.hash_size = 0),
        (this.hash_bits = 0),
        (this.hash_mask = 0),
        (this.hash_shift = 0),
        (this.block_start = 0),
        (this.match_length = 0),
        (this.prev_match = 0),
        (this.match_available = 0),
        (this.strstart = 0),
        (this.match_start = 0),
        (this.lookahead = 0),
        (this.prev_length = 0),
        (this.max_chain_length = 0),
        (this.max_lazy_match = 0),
        (this.level = 0),
        (this.strategy = 0),
        (this.good_match = 0),
        (this.nice_match = 0),
        (this.dyn_ltree = new Buf16(1146)),
        (this.dyn_dtree = new Buf16(122)),
        (this.bl_tree = new Buf16(78)),
        zero(this.dyn_ltree),
        zero(this.dyn_dtree),
        zero(this.bl_tree),
        (this.l_desc = null),
        (this.d_desc = null),
        (this.bl_desc = null),
        (this.bl_count = new Buf16(16)),
        (this.heap = new Buf16(573)),
        zero(this.heap),
        (this.heap_len = 0),
        (this.heap_max = 0),
        (this.depth = new Buf16(573)),
        zero(this.depth),
        (this.l_buf = 0),
        (this.lit_bufsize = 0),
        (this.last_lit = 0),
        (this.d_buf = 0),
        (this.opt_len = 0),
        (this.static_len = 0),
        (this.matches = 0),
        (this.insert = 0),
        (this.bi_buf = 0),
        (this.bi_valid = 0);
}

function deflateReset(strm) {
    var s,
        ret = (function (strm) {
            var s;
            return strm && strm.state ? ((strm.total_in = strm.total_out = 0), (strm.data_type = 2), ((s = strm.state).pending = 0), (s.pending_out = 0), s.wrap < 0 && (s.wrap = -s.wrap), (s.status = s.wrap ? 42 : 113), (strm.adler = 2 === s.wrap ? 0 : 1), (s.last_flush = 0), _tr_init(s), 0) : err(strm, -2);
        })(strm);
    return (
        0 === ret &&
            (((s = strm.state).window_size = 2 * s.w_size),
            zero(s.head),
            (s.max_lazy_match = configuration_table[s.level].max_lazy),
            (s.good_match = configuration_table[s.level].good_length),
            (s.nice_match = configuration_table[s.level].nice_length),
            (s.max_chain_length = configuration_table[s.level].max_chain),
            (s.strstart = 0),
            (s.block_start = 0),
            (s.lookahead = 0),
            (s.insert = 0),
            (s.match_length = s.prev_length = 2),
            (s.match_available = 0),
            (s.ins_h = 0)),
        ret
    );
}

function deflateInit(strm, level) {
    return (function (strm, level, method, windowBits, memLevel, strategy) {
        if (!strm) return -2;
        if ((-1 === level && (level = 6), level < 0 || level > 9 || strategy < 0 || strategy > 4)) return err(strm, -2);
        var s = new DeflateState();
        return (
            (strm.state = s),
            (s.strm = strm),
            (s.wrap = 1),
            (s.gzhead = null),
            (s.w_bits = windowBits),
            (s.w_size = 1 << s.w_bits),
            (s.w_mask = s.w_size - 1),
            (s.hash_bits = memLevel + 7),
            (s.hash_size = 1 << s.hash_bits),
            (s.hash_mask = s.hash_size - 1),
            (s.hash_shift = ~~((s.hash_bits + 3 - 1) / 3)),
            (s.window = new Buf8(2 * s.w_size)),
            (s.head = new Buf16(s.hash_size)),
            (s.prev = new Buf16(s.w_size)),
            (s.lit_bufsize = 1 << (memLevel + 6)),
            (s.pending_buf_size = 4 * s.lit_bufsize),
            (s.pending_buf = new Buf8(s.pending_buf_size)),
            (s.d_buf = 1 * s.lit_bufsize),
            (s.l_buf = 3 * s.lit_bufsize),
            (s.level = level),
            (s.strategy = strategy),
            (s.method = method),
            deflateReset(strm)
        );
    })(strm, level, 8, 15, 8, 0);
}

function deflate(strm, flush) {
    var old_flush, s, beg, val;
    if (!strm || !strm.state || flush > 5 || flush < 0) return strm ? err(strm, -2) : -2;
    if (((s = strm.state), !strm.output || (!strm.input && 0 !== strm.avail_in) || (666 === s.status && 4 !== flush))) return err(strm, 0 === strm.avail_out ? -5 : -2);
    if (((s.strm = strm), (old_flush = s.last_flush), (s.last_flush = flush), 42 === s.status))
        if (2 === s.wrap)
            (strm.adler = 0),
                put_byte(s, 31),
                put_byte(s, 139),
                put_byte(s, 8),
                s.gzhead
                    ? (put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (s.gzhead.extra ? 4 : 0) + (s.gzhead.name ? 8 : 0) + (s.gzhead.comment ? 16 : 0)),
                      put_byte(s, 255 & s.gzhead.time),
                      put_byte(s, (s.gzhead.time >> 8) & 255),
                      put_byte(s, (s.gzhead.time >> 16) & 255),
                      put_byte(s, (s.gzhead.time >> 24) & 255),
                      put_byte(s, 9 === s.level ? 2 : s.strategy >= 2 || s.level < 2 ? 4 : 0),
                      put_byte(s, 255 & s.gzhead.os),
                      s.gzhead.extra && s.gzhead.extra.length && (put_byte(s, 255 & s.gzhead.extra.length), put_byte(s, (s.gzhead.extra.length >> 8) & 255)),
                      s.gzhead.hcrc && (strm.adler = makeTable(strm.adler, s.pending_buf, s.pending)),
                      (s.gzindex = 0),
                      (s.status = 69))
                    : (put_byte(s, 0), put_byte(s, 0), put_byte(s, 0), put_byte(s, 0), put_byte(s, 0), put_byte(s, 9 === s.level ? 2 : s.strategy >= 2 || s.level < 2 ? 4 : 0), put_byte(s, 3), (s.status = 113));
        else {
            var header = (8 + ((s.w_bits - 8) << 4)) << 8;
            (header |= (s.strategy >= 2 || s.level < 2 ? 0 : s.level < 6 ? 1 : 6 === s.level ? 2 : 3) << 6), 0 !== s.strstart && (header |= 32), (header += 31 - (header % 31)), (s.status = 113), putShortMSB(s, header), 0 !== s.strstart && (putShortMSB(s, strm.adler >>> 16), putShortMSB(s, 65535 & strm.adler)), (strm.adler = 1);
        }
    if (69 === s.status)
        if (s.gzhead.extra) {
            for (beg = s.pending; s.gzindex < (65535 & s.gzhead.extra.length) && (s.pending !== s.pending_buf_size || (s.gzhead.hcrc && s.pending > beg && (strm.adler = makeTable(strm.adler, s.pending_buf, s.pending)), flush_pending(strm), (beg = s.pending), s.pending !== s.pending_buf_size)); ) put_byte(s, 255 & s.gzhead.extra[s.gzindex]), s.gzindex++;
            s.gzhead.hcrc && s.pending > beg && (strm.adler = makeTable(strm.adler, s.pending_buf, s.pending)), s.gzindex === s.gzhead.extra.length && ((s.gzindex = 0), (s.status = 73));
        } else s.status = 73;
    if (73 === s.status)
        if (s.gzhead.name) {
            beg = s.pending;
            do {
                if (s.pending === s.pending_buf_size && (s.gzhead.hcrc && s.pending > beg && (strm.adler = makeTable(strm.adler, s.pending_buf, s.pending)), flush_pending(strm), (beg = s.pending), s.pending === s.pending_buf_size)) {
                    val = 1;
                    break;
                }
                (val = s.gzindex < s.gzhead.name.length ? 255 & s.gzhead.name.charCodeAt(s.gzindex++) : 0), put_byte(s, val);
            } while (0 !== val);
            s.gzhead.hcrc && s.pending > beg && (strm.adler = makeTable(strm.adler, s.pending_buf, s.pending)), 0 === val && ((s.gzindex = 0), (s.status = 91));
        } else s.status = 91;
    if (91 === s.status)
        if (s.gzhead.comment) {
            beg = s.pending;
            do {
                if (s.pending === s.pending_buf_size && (s.gzhead.hcrc && s.pending > beg && (strm.adler = makeTable(strm.adler, s.pending_buf, s.pending)), flush_pending(strm), (beg = s.pending), s.pending === s.pending_buf_size)) {
                    val = 1;
                    break;
                }
                (val = s.gzindex < s.gzhead.comment.length ? 255 & s.gzhead.comment.charCodeAt(s.gzindex++) : 0), put_byte(s, val);
            } while (0 !== val);
            s.gzhead.hcrc && s.pending > beg && (strm.adler = makeTable(strm.adler, s.pending_buf, s.pending)), 0 === val && (s.status = 103);
        } else s.status = 103;
    if ((103 === s.status && (s.gzhead.hcrc ? (s.pending + 2 > s.pending_buf_size && flush_pending(strm), s.pending + 2 <= s.pending_buf_size && (put_byte(s, 255 & strm.adler), put_byte(s, (strm.adler >> 8) & 255), (strm.adler = 0), (s.status = 113))) : (s.status = 113)), 0 !== s.pending)) {
        if ((flush_pending(strm), 0 === strm.avail_out)) return (s.last_flush = -1), 0;
    } else if (0 === strm.avail_in && rank(flush) <= rank(old_flush) && 4 !== flush) return err(strm, -5);
    if (666 === s.status && 0 !== strm.avail_in) return err(strm, -5);
    if (0 !== strm.avail_in || 0 !== s.lookahead || 666 !== s.status) {
        var bstate =
            2 === s.strategy
                ? (function (s) {
                      for (var bflush; 0 !== s.lookahead || (fill_window(s), 0 !== s.lookahead); ) if (((s.match_length = 0), (bflush = _tr_tally(s, 0, s.window[s.strstart])), s.lookahead--, s.strstart++, bflush && (flush_block_only(s, !1), 0 === s.strm.avail_out))) return 1;
                      return (s.insert = 0), s.last_lit && (flush_block_only(s, !1), 0 === s.strm.avail_out) ? 1 : 2;
                  })(s)
                : 3 === s.strategy
                ? (function (s, flush) {
                      for (var bflush, prev, scan, strend, _win = s.window; ; ) {
                          if (s.lookahead <= 258) {
                              if ((fill_window(s), s.lookahead <= 258 && 0 === flush)) return 1;
                              if (0 === s.lookahead) break;
                          }
                          if (((s.match_length = 0), s.lookahead >= 3 && s.strstart > 0 && (prev = _win[(scan = s.strstart - 1)]) === _win[++scan] && prev === _win[++scan] && prev === _win[++scan])) {
                              strend = s.strstart + 258;
                              do {} while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
                              (s.match_length = 258 - (strend - scan)), s.match_length > s.lookahead && (s.match_length = s.lookahead);
                          }
                          if ((s.match_length >= 3 ? ((bflush = _tr_tally(s, 1, s.match_length - 3)), (s.lookahead -= s.match_length), (s.strstart += s.match_length), (s.match_length = 0)) : ((bflush = _tr_tally(s, 0, s.window[s.strstart])), s.lookahead--, s.strstart++), bflush && (flush_block_only(s, !1), 0 === s.strm.avail_out))) return 1;
                      }
                      return (s.insert = 0), s.last_lit && (flush_block_only(s, !1), 0 === s.strm.avail_out) ? 1 : 2;
                  })(s, flush)
                : configuration_table[s.level].func(s, flush);
        if (((3 !== bstate && 4 !== bstate) || (s.status = 666), 1 === bstate || 3 === bstate)) return 0 === strm.avail_out && (s.last_flush = -1), 0;
        if (2 === bstate && (_tr_stored_block(s, 0, 0, !1), zero(s.head), 0 === s.lookahead && ((s.strstart = 0), (s.block_start = 0), (s.insert = 0)), flush_pending(strm), 0 === strm.avail_out)) return (s.last_flush = -1), 0;
    }
    return 0;
}

configuration_table = [
    new Config(0, 0, 0, 0, function (s, flush) {
        var max_block_size = 65535;
        for (max_block_size > s.pending_buf_size - 5 && (max_block_size = s.pending_buf_size - 5); ; ) {
            if (s.lookahead <= 1) {
                if ((fill_window(s), 0 === s.lookahead && 0 === flush)) return 1;
                if (0 === s.lookahead) break;
            }
            (s.strstart += s.lookahead), (s.lookahead = 0);
            var max_start = s.block_start + max_block_size;
            if ((0 === s.strstart || s.strstart >= max_start) && ((s.lookahead = s.strstart - max_start), (s.strstart = max_start), flush_block_only(s, !1), 0 === s.strm.avail_out)) return 1;
            if (s.strstart - s.block_start >= s.w_size - 262 && (flush_block_only(s, !1), 0 === s.strm.avail_out)) return 1;
        }
        return (s.insert = 0), 4 === flush ? (flush_block_only(s, !0), 0 === s.strm.avail_out ? 3 : 4) : (s.strstart > s.block_start && (flush_block_only(s, !1), s.strm.avail_out), 1);
    }),
    new Config(4, 4, 8, 4, deflate_fast),
    new Config(4, 5, 16, 8, deflate_fast),
    new Config(4, 6, 32, 32, deflate_fast),
    new Config(4, 4, 16, 16, deflate_slow),
    new Config(8, 16, 32, 32, deflate_slow),
    new Config(8, 16, 128, 128, deflate_slow),
    new Config(8, 32, 128, 256, deflate_slow),
    new Config(32, 128, 258, 1024, deflate_slow),
    new Config(32, 258, 258, 4096, deflate_slow),
];

class Deflator {
    constructor() {
        (this.strm = new ZStream()), (this.chunkSize = 102400), (this.outputBuffer = new Uint8Array(this.chunkSize)), (this.windowBits = 5), deflateInit(this.strm, this.windowBits);
    }
    deflate(inData) {
        (this.strm.input = inData), (this.strm.avail_in = this.strm.input.length), (this.strm.next_in = 0), (this.strm.output = this.outputBuffer), (this.strm.avail_out = this.chunkSize), (this.strm.next_out = 0);
        let lastRet = deflate(this.strm, 3),
            outData = new Uint8Array(this.strm.output.buffer, 0, this.strm.next_out);
        if (lastRet < 0) throw new Error('zlib deflate failed');
        if (this.strm.avail_in > 0) {
            let chunks = [outData],
                totalLen = outData.length;
            do {
                if (((this.strm.output = new Uint8Array(this.chunkSize)), (this.strm.next_out = 0), (this.strm.avail_out = this.chunkSize), (lastRet = deflate(this.strm, 3)), lastRet < 0)) throw new Error('zlib deflate failed');
                let chunk = new Uint8Array(this.strm.output.buffer, 0, this.strm.next_out);
                (totalLen += chunk.length), chunks.push(chunk);
            } while (this.strm.avail_in > 0);
            let newData = new Uint8Array(totalLen),
                offset = 0;
            for (let i = 0; i < chunks.length; i++) newData.set(chunks[i], offset), (offset += chunks[i].length);
            outData = newData;
        }
        return (this.strm.input = null), (this.strm.avail_in = 0), (this.strm.next_in = 0), outData;
    }
}

const KeyTable_XK_BackSpace = 65288,
    KeyTable_XK_Tab = 65289,
    KeyTable_XK_Clear = 65291,
    KeyTable_XK_Return = 65293,
    KeyTable_XK_Pause = 65299,
    KeyTable_XK_Scroll_Lock = 65300,
    KeyTable_XK_Escape = 65307,
    KeyTable_XK_Delete = 65535,
    KeyTable_XK_Multi_key = 65312,
    KeyTable_XK_Codeinput = 65335,
    KeyTable_XK_SingleCandidate = 65340,
    KeyTable_XK_MultipleCandidate = 65341,
    KeyTable_XK_PreviousCandidate = 65342,
    KeyTable_XK_Kanji = 65313,
    KeyTable_XK_Muhenkan = 65314,
    KeyTable_XK_Henkan = 65315,
    KeyTable_XK_Romaji = 65316,
    KeyTable_XK_Hiragana = 65317,
    KeyTable_XK_Katakana = 65318,
    KeyTable_XK_Hiragana_Katakana = 65319,
    KeyTable_XK_Zenkaku = 65320,
    KeyTable_XK_Hankaku = 65321,
    KeyTable_XK_Zenkaku_Hankaku = 65322,
    KeyTable_XK_Kana_Shift = 65326,
    KeyTable_XK_Eisu_Shift = 65327,
    KeyTable_XK_Eisu_toggle = 65328,
    KeyTable_XK_Home = 65360,
    KeyTable_XK_Left = 65361,
    KeyTable_XK_Up = 65362,
    KeyTable_XK_Right = 65363,
    KeyTable_XK_Down = 65364,
    KeyTable_XK_Prior = 65365,
    KeyTable_XK_Next = 65366,
    KeyTable_XK_End = 65367,
    KeyTable_XK_Select = 65376,
    KeyTable_XK_Print = 65377,
    KeyTable_XK_Execute = 65378,
    KeyTable_XK_Insert = 65379,
    KeyTable_XK_Undo = 65381,
    KeyTable_XK_Redo = 65382,
    KeyTable_XK_Menu = 65383,
    KeyTable_XK_Find = 65384,
    KeyTable_XK_Cancel = 65385,
    KeyTable_XK_Help = 65386,
    KeyTable_XK_Mode_switch = 65406,
    KeyTable_XK_Num_Lock = 65407,
    KeyTable_XK_KP_Space = 65408,
    KeyTable_XK_KP_Enter = 65421,
    KeyTable_XK_KP_Home = 65429,
    KeyTable_XK_KP_Left = 65430,
    KeyTable_XK_KP_Up = 65431,
    KeyTable_XK_KP_Right = 65432,
    KeyTable_XK_KP_Down = 65433,
    KeyTable_XK_KP_Prior = 65434,
    KeyTable_XK_KP_Next = 65435,
    KeyTable_XK_KP_End = 65436,
    KeyTable_XK_KP_Begin = 65437,
    KeyTable_XK_KP_Insert = 65438,
    KeyTable_XK_KP_Delete = 65439,
    KeyTable_XK_KP_Equal = 65469,
    KeyTable_XK_KP_Multiply = 65450,
    KeyTable_XK_KP_Add = 65451,
    KeyTable_XK_KP_Separator = 65452,
    KeyTable_XK_KP_Subtract = 65453,
    KeyTable_XK_KP_Decimal = 65454,
    KeyTable_XK_KP_Divide = 65455,
    KeyTable_XK_KP_0 = 65456,
    KeyTable_XK_KP_1 = 65457,
    KeyTable_XK_KP_2 = 65458,
    KeyTable_XK_KP_3 = 65459,
    KeyTable_XK_KP_4 = 65460,
    KeyTable_XK_KP_5 = 65461,
    KeyTable_XK_KP_6 = 65462,
    KeyTable_XK_KP_7 = 65463,
    KeyTable_XK_KP_8 = 65464,
    KeyTable_XK_KP_9 = 65465,
    KeyTable_XK_F1 = 65470,
    KeyTable_XK_F2 = 65471,
    KeyTable_XK_F3 = 65472,
    KeyTable_XK_F4 = 65473,
    KeyTable_XK_F5 = 65474,
    KeyTable_XK_F6 = 65475,
    KeyTable_XK_F7 = 65476,
    KeyTable_XK_F8 = 65477,
    KeyTable_XK_F9 = 65478,
    KeyTable_XK_F10 = 65479,
    KeyTable_XK_F11 = 65480,
    KeyTable_XK_F12 = 65481,
    KeyTable_XK_F13 = 65482,
    KeyTable_XK_F14 = 65483,
    KeyTable_XK_F15 = 65484,
    KeyTable_XK_F16 = 65485,
    KeyTable_XK_F17 = 65486,
    KeyTable_XK_F18 = 65487,
    KeyTable_XK_F19 = 65488,
    KeyTable_XK_F20 = 65489,
    KeyTable_XK_F21 = 65490,
    KeyTable_XK_F22 = 65491,
    KeyTable_XK_F23 = 65492,
    KeyTable_XK_F24 = 65493,
    KeyTable_XK_F25 = 65494,
    KeyTable_XK_F26 = 65495,
    KeyTable_XK_F27 = 65496,
    KeyTable_XK_F28 = 65497,
    KeyTable_XK_F29 = 65498,
    KeyTable_XK_F30 = 65499,
    KeyTable_XK_F31 = 65500,
    KeyTable_XK_F32 = 65501,
    KeyTable_XK_F33 = 65502,
    KeyTable_XK_F34 = 65503,
    KeyTable_XK_F35 = 65504,
    KeyTable_XK_Shift_L = 65505,
    KeyTable_XK_Shift_R = 65506,
    KeyTable_XK_Control_L = 65507,
    KeyTable_XK_Control_R = 65508,
    KeyTable_XK_Caps_Lock = 65509,
    KeyTable_XK_Meta_L = 65511,
    KeyTable_XK_Meta_R = 65512,
    KeyTable_XK_Alt_L = 65513,
    KeyTable_XK_Alt_R = 65514,
    KeyTable_XK_Super_L = 65515,
    KeyTable_XK_Super_R = 65516,
    KeyTable_XK_ISO_Level3_Shift = 65027,
    KeyTable_XK_ISO_Next_Group = 65032,
    KeyTable_XK_ISO_Prev_Group = 65034,
    KeyTable_XK_ISO_First_Group = 65036,
    KeyTable_XK_ISO_Last_Group = 65038,
    KeyTable_XK_space = 32,
    KeyTable_XK_asterisk = 42,
    KeyTable_XK_plus = 43,
    KeyTable_XK_comma = 44,
    KeyTable_XK_minus = 45,
    KeyTable_XK_period = 46,
    KeyTable_XK_slash = 47,
    KeyTable_XK_0 = 48,
    KeyTable_XK_1 = 49,
    KeyTable_XK_2 = 50,
    KeyTable_XK_3 = 51,
    KeyTable_XK_4 = 52,
    KeyTable_XK_5 = 53,
    KeyTable_XK_6 = 54,
    KeyTable_XK_7 = 55,
    KeyTable_XK_8 = 56,
    KeyTable_XK_9 = 57,
    KeyTable_XK_equal = 61,
    KeyTable_XK_Hangul = 65329,
    KeyTable_XK_Hangul_Hanja = 65332,
    KeyTable_XK_Hangul_Jeonja = 65336,
    KeyTable_XF86XK_MonBrightnessUp = 269025026,
    KeyTable_XF86XK_MonBrightnessDown = 269025027,
    KeyTable_XF86XK_Standby = 269025040,
    KeyTable_XF86XK_AudioLowerVolume = 269025041,
    KeyTable_XF86XK_AudioMute = 269025042,
    KeyTable_XF86XK_AudioRaiseVolume = 269025043,
    KeyTable_XF86XK_AudioPlay = 269025044,
    KeyTable_XF86XK_AudioStop = 269025045,
    KeyTable_XF86XK_AudioPrev = 269025046,
    KeyTable_XF86XK_AudioNext = 269025047,
    KeyTable_XF86XK_HomePage = 269025048,
    KeyTable_XF86XK_Mail = 269025049,
    KeyTable_XF86XK_Search = 269025051,
    KeyTable_XF86XK_AudioRecord = 269025052,
    KeyTable_XF86XK_Calculator = 269025053,
    KeyTable_XF86XK_Calendar = 269025056,
    KeyTable_XF86XK_PowerDown = 269025057,
    KeyTable_XF86XK_Back = 269025062,
    KeyTable_XF86XK_Forward = 269025063,
    KeyTable_XF86XK_Stop = 269025064,
    KeyTable_XF86XK_Refresh = 269025065,
    KeyTable_XF86XK_PowerOff = 269025066,
    KeyTable_XF86XK_WakeUp = 269025067,
    KeyTable_XF86XK_Eject = 269025068,
    KeyTable_XF86XK_ScreenSaver = 269025069,
    KeyTable_XF86XK_WWW = 269025070,
    KeyTable_XF86XK_Favorites = 269025072,
    KeyTable_XF86XK_AudioPause = 269025073,
    KeyTable_XF86XK_AudioMedia = 269025074,
    KeyTable_XF86XK_MyComputer = 269025075,
    KeyTable_XF86XK_BrightnessAdjust = 269025083,
    KeyTable_XF86XK_AudioRewind = 269025086,
    KeyTable_XF86XK_Close = 269025110,
    KeyTable_XF86XK_Copy = 269025111,
    KeyTable_XF86XK_Cut = 269025112,
    KeyTable_XF86XK_Excel = 269025116,
    KeyTable_XF86XK_LogOff = 269025121,
    KeyTable_XF86XK_New = 269025128,
    KeyTable_XF86XK_Open = 269025131,
    KeyTable_XF86XK_Paste = 269025133,
    KeyTable_XF86XK_Phone = 269025134,
    KeyTable_XF86XK_Reply = 269025138,
    KeyTable_XF86XK_Save = 269025143,
    KeyTable_XF86XK_Send = 269025147,
    KeyTable_XF86XK_Spell = 269025148,
    KeyTable_XF86XK_SplitScreen = 269025149,
    KeyTable_XF86XK_Word = 269025161,
    KeyTable_XF86XK_ZoomIn = 269025163,
    KeyTable_XF86XK_ZoomOut = 269025164,
    KeyTable_XF86XK_WebCam = 269025167,
    KeyTable_XF86XK_MailForward = 269025168,
    KeyTable_XF86XK_Music = 269025170,
    KeyTable_XF86XK_AudioForward = 269025175,
    KeyTable_XF86XK_AudioRandomPlay = 269025177,
    KeyTable_XF86XK_Subtitle = 269025178,
    KeyTable_XF86XK_AudioCycleTrack = 269025179,
    KeyTable_XF86XK_Hibernate = 269025192,
    KeyTable_XF86XK_AudioMicMute = 269025202,
    KeyTable_XF86XK_Next_VMode = 269024802,
    codepoints = {
        256: 960,
        257: 992,
        258: 451,
        259: 483,
        260: 417,
        261: 433,
        262: 454,
        263: 486,
        264: 710,
        265: 742,
        266: 709,
        267: 741,
        268: 456,
        269: 488,
        270: 463,
        271: 495,
        272: 464,
        273: 496,
        274: 938,
        275: 954,
        278: 972,
        279: 1004,
        280: 458,
        281: 490,
        282: 460,
        283: 492,
        284: 728,
        285: 760,
        286: 683,
        287: 699,
        288: 725,
        289: 757,
        290: 939,
        291: 955,
        292: 678,
        293: 694,
        294: 673,
        295: 689,
        296: 933,
        297: 949,
        298: 975,
        299: 1007,
        302: 967,
        303: 999,
        304: 681,
        305: 697,
        308: 684,
        309: 700,
        310: 979,
        311: 1011,
        312: 930,
        313: 453,
        314: 485,
        315: 934,
        316: 950,
        317: 421,
        318: 437,
        321: 419,
        322: 435,
        323: 465,
        324: 497,
        325: 977,
        326: 1009,
        327: 466,
        328: 498,
        330: 957,
        331: 959,
        332: 978,
        333: 1010,
        336: 469,
        337: 501,
        338: 5052,
        339: 5053,
        340: 448,
        341: 480,
        342: 931,
        343: 947,
        344: 472,
        345: 504,
        346: 422,
        347: 438,
        348: 734,
        349: 766,
        350: 426,
        351: 442,
        352: 425,
        353: 441,
        354: 478,
        355: 510,
        356: 427,
        357: 443,
        358: 940,
        359: 956,
        360: 989,
        361: 1021,
        362: 990,
        363: 1022,
        364: 733,
        365: 765,
        366: 473,
        367: 505,
        368: 475,
        369: 507,
        370: 985,
        371: 1017,
        376: 5054,
        377: 428,
        378: 444,
        379: 431,
        380: 447,
        381: 430,
        382: 446,
        402: 2294,
        466: 16777681,
        711: 439,
        728: 418,
        729: 511,
        731: 434,
        733: 445,
        901: 1966,
        902: 1953,
        904: 1954,
        905: 1955,
        906: 1956,
        908: 1959,
        910: 1960,
        911: 1963,
        912: 1974,
        913: 1985,
        914: 1986,
        915: 1987,
        916: 1988,
        917: 1989,
        918: 1990,
        919: 1991,
        920: 1992,
        921: 1993,
        922: 1994,
        923: 1995,
        924: 1996,
        925: 1997,
        926: 1998,
        927: 1999,
        928: 2e3,
        929: 2001,
        931: 2002,
        932: 2004,
        933: 2005,
        934: 2006,
        935: 2007,
        936: 2008,
        937: 2009,
        938: 1957,
        939: 1961,
        940: 1969,
        941: 1970,
        942: 1971,
        943: 1972,
        944: 1978,
        945: 2017,
        946: 2018,
        947: 2019,
        948: 2020,
        949: 2021,
        950: 2022,
        951: 2023,
        952: 2024,
        953: 2025,
        954: 2026,
        955: 2027,
        956: 2028,
        957: 2029,
        958: 2030,
        959: 2031,
        960: 2032,
        961: 2033,
        962: 2035,
        963: 2034,
        964: 2036,
        965: 2037,
        966: 2038,
        967: 2039,
        968: 2040,
        969: 2041,
        970: 1973,
        971: 1977,
        972: 1975,
        973: 1976,
        974: 1979,
        1025: 1715,
        1026: 1713,
        1027: 1714,
        1028: 1716,
        1029: 1717,
        1030: 1718,
        1031: 1719,
        1032: 1720,
        1033: 1721,
        1034: 1722,
        1035: 1723,
        1036: 1724,
        1038: 1726,
        1039: 1727,
        1040: 1761,
        1041: 1762,
        1042: 1783,
        1043: 1767,
        1044: 1764,
        1045: 1765,
        1046: 1782,
        1047: 1786,
        1048: 1769,
        1049: 1770,
        1050: 1771,
        1051: 1772,
        1052: 1773,
        1053: 1774,
        1054: 1775,
        1055: 1776,
        1056: 1778,
        1057: 1779,
        1058: 1780,
        1059: 1781,
        1060: 1766,
        1061: 1768,
        1062: 1763,
        1063: 1790,
        1064: 1787,
        1065: 1789,
        1066: 1791,
        1067: 1785,
        1068: 1784,
        1069: 1788,
        1070: 1760,
        1071: 1777,
        1072: 1729,
        1073: 1730,
        1074: 1751,
        1075: 1735,
        1076: 1732,
        1077: 1733,
        1078: 1750,
        1079: 1754,
        1080: 1737,
        1081: 1738,
        1082: 1739,
        1083: 1740,
        1084: 1741,
        1085: 1742,
        1086: 1743,
        1087: 1744,
        1088: 1746,
        1089: 1747,
        1090: 1748,
        1091: 1749,
        1092: 1734,
        1093: 1736,
        1094: 1731,
        1095: 1758,
        1096: 1755,
        1097: 1757,
        1098: 1759,
        1099: 1753,
        1100: 1752,
        1101: 1756,
        1102: 1728,
        1103: 1745,
        1105: 1699,
        1106: 1697,
        1107: 1698,
        1108: 1700,
        1109: 1701,
        1110: 1702,
        1111: 1703,
        1112: 1704,
        1113: 1705,
        1114: 1706,
        1115: 1707,
        1116: 1708,
        1118: 1710,
        1119: 1711,
        1168: 1725,
        1169: 1709,
        1488: 3296,
        1489: 3297,
        1490: 3298,
        1491: 3299,
        1492: 3300,
        1493: 3301,
        1494: 3302,
        1495: 3303,
        1496: 3304,
        1497: 3305,
        1498: 3306,
        1499: 3307,
        1500: 3308,
        1501: 3309,
        1502: 3310,
        1503: 3311,
        1504: 3312,
        1505: 3313,
        1506: 3314,
        1507: 3315,
        1508: 3316,
        1509: 3317,
        1510: 3318,
        1511: 3319,
        1512: 3320,
        1513: 3321,
        1514: 3322,
        1548: 1452,
        1563: 1467,
        1567: 1471,
        1569: 1473,
        1570: 1474,
        1571: 1475,
        1572: 1476,
        1573: 1477,
        1574: 1478,
        1575: 1479,
        1576: 1480,
        1577: 1481,
        1578: 1482,
        1579: 1483,
        1580: 1484,
        1581: 1485,
        1582: 1486,
        1583: 1487,
        1584: 1488,
        1585: 1489,
        1586: 1490,
        1587: 1491,
        1588: 1492,
        1589: 1493,
        1590: 1494,
        1591: 1495,
        1592: 1496,
        1593: 1497,
        1594: 1498,
        1600: 1504,
        1601: 1505,
        1602: 1506,
        1603: 1507,
        1604: 1508,
        1605: 1509,
        1606: 1510,
        1607: 1511,
        1608: 1512,
        1609: 1513,
        1610: 1514,
        1611: 1515,
        1612: 1516,
        1613: 1517,
        1614: 1518,
        1615: 1519,
        1616: 1520,
        1617: 1521,
        1618: 1522,
        3585: 3489,
        3586: 3490,
        3587: 3491,
        3588: 3492,
        3589: 3493,
        3590: 3494,
        3591: 3495,
        3592: 3496,
        3593: 3497,
        3594: 3498,
        3595: 3499,
        3596: 3500,
        3597: 3501,
        3598: 3502,
        3599: 3503,
        3600: 3504,
        3601: 3505,
        3602: 3506,
        3603: 3507,
        3604: 3508,
        3605: 3509,
        3606: 3510,
        3607: 3511,
        3608: 3512,
        3609: 3513,
        3610: 3514,
        3611: 3515,
        3612: 3516,
        3613: 3517,
        3614: 3518,
        3615: 3519,
        3616: 3520,
        3617: 3521,
        3618: 3522,
        3619: 3523,
        3620: 3524,
        3621: 3525,
        3622: 3526,
        3623: 3527,
        3624: 3528,
        3625: 3529,
        3626: 3530,
        3627: 3531,
        3628: 3532,
        3629: 3533,
        3630: 3534,
        3631: 3535,
        3632: 3536,
        3633: 3537,
        3634: 3538,
        3635: 3539,
        3636: 3540,
        3637: 3541,
        3638: 3542,
        3639: 3543,
        3640: 3544,
        3641: 3545,
        3642: 3546,
        3647: 3551,
        3648: 3552,
        3649: 3553,
        3650: 3554,
        3651: 3555,
        3652: 3556,
        3653: 3557,
        3654: 3558,
        3655: 3559,
        3656: 3560,
        3657: 3561,
        3658: 3562,
        3659: 3563,
        3660: 3564,
        3661: 3565,
        3664: 3568,
        3665: 3569,
        3666: 3570,
        3667: 3571,
        3668: 3572,
        3669: 3573,
        3670: 3574,
        3671: 3575,
        3672: 3576,
        3673: 3577,
        8194: 2722,
        8195: 2721,
        8196: 2723,
        8197: 2724,
        8199: 2725,
        8200: 2726,
        8201: 2727,
        8202: 2728,
        8210: 2747,
        8211: 2730,
        8212: 2729,
        8213: 1967,
        8215: 3295,
        8216: 2768,
        8217: 2769,
        8218: 2813,
        8220: 2770,
        8221: 2771,
        8222: 2814,
        8224: 2801,
        8225: 2802,
        8226: 2790,
        8229: 2735,
        8230: 2734,
        8240: 2773,
        8242: 2774,
        8243: 2775,
        8248: 2812,
        8254: 1150,
        8361: 3839,
        8364: 8364,
        8453: 2744,
        8470: 1712,
        8471: 2811,
        8478: 2772,
        8482: 2761,
        8531: 2736,
        8532: 2737,
        8533: 2738,
        8534: 2739,
        8535: 2740,
        8536: 2741,
        8537: 2742,
        8538: 2743,
        8539: 2755,
        8540: 2756,
        8541: 2757,
        8542: 2758,
        8592: 2299,
        8593: 2300,
        8594: 2301,
        8595: 2302,
        8658: 2254,
        8660: 2253,
        8706: 2287,
        8711: 2245,
        8728: 3018,
        8730: 2262,
        8733: 2241,
        8734: 2242,
        8743: 2270,
        8744: 2271,
        8745: 2268,
        8746: 2269,
        8747: 2239,
        8756: 2240,
        8764: 2248,
        8771: 2249,
        8773: 16785992,
        8800: 2237,
        8801: 2255,
        8804: 2236,
        8805: 2238,
        8834: 2266,
        8835: 2267,
        8866: 3068,
        8867: 3036,
        8868: 3010,
        8869: 3022,
        8968: 3027,
        8970: 3012,
        8981: 2810,
        8992: 2212,
        8993: 2213,
        9109: 3020,
        9115: 2219,
        9117: 2220,
        9118: 2221,
        9120: 2222,
        9121: 2215,
        9123: 2216,
        9124: 2217,
        9126: 2218,
        9128: 2223,
        9132: 2224,
        9143: 2209,
        9146: 2543,
        9147: 2544,
        9148: 2546,
        9149: 2547,
        9225: 2530,
        9226: 2533,
        9227: 2537,
        9228: 2531,
        9229: 2532,
        9251: 2732,
        9252: 2536,
        9472: 2211,
        9474: 2214,
        9484: 2210,
        9488: 2539,
        9492: 2541,
        9496: 2538,
        9500: 2548,
        9508: 2549,
        9516: 2551,
        9524: 2550,
        9532: 2542,
        9618: 2529,
        9642: 2791,
        9643: 2785,
        9644: 2779,
        9645: 2786,
        9646: 2783,
        9647: 2767,
        9650: 2792,
        9651: 2787,
        9654: 2781,
        9655: 2765,
        9660: 2793,
        9661: 2788,
        9664: 2780,
        9665: 2764,
        9670: 2528,
        9675: 2766,
        9679: 2782,
        9702: 2784,
        9734: 2789,
        9742: 2809,
        9747: 2762,
        9756: 2794,
        9758: 2795,
        9792: 2808,
        9794: 2807,
        9827: 2796,
        9829: 2798,
        9830: 2797,
        9837: 2806,
        9839: 2805,
        10003: 2803,
        10007: 2804,
        10013: 2777,
        10016: 2800,
        10216: 2748,
        10217: 2750,
        12289: 1188,
        12290: 1185,
        12300: 1186,
        12301: 1187,
        12443: 1246,
        12444: 1247,
        12449: 1191,
        12450: 1201,
        12451: 1192,
        12452: 1202,
        12453: 1193,
        12454: 1203,
        12455: 1194,
        12456: 1204,
        12457: 1195,
        12458: 1205,
        12459: 1206,
        12461: 1207,
        12463: 1208,
        12465: 1209,
        12467: 1210,
        12469: 1211,
        12471: 1212,
        12473: 1213,
        12475: 1214,
        12477: 1215,
        12479: 1216,
        12481: 1217,
        12483: 1199,
        12484: 1218,
        12486: 1219,
        12488: 1220,
        12490: 1221,
        12491: 1222,
        12492: 1223,
        12493: 1224,
        12494: 1225,
        12495: 1226,
        12498: 1227,
        12501: 1228,
        12504: 1229,
        12507: 1230,
        12510: 1231,
        12511: 1232,
        12512: 1233,
        12513: 1234,
        12514: 1235,
        12515: 1196,
        12516: 1236,
        12517: 1197,
        12518: 1237,
        12519: 1198,
        12520: 1238,
        12521: 1239,
        12522: 1240,
        12523: 1241,
        12524: 1242,
        12525: 1243,
        12527: 1244,
        12530: 1190,
        12531: 1245,
        12539: 1189,
        12540: 1200,
    },
    keysyms = {
        lookup(u) {
            if (u >= 32 && u <= 255) return u;
            const keysym = codepoints[u];
            return void 0 !== keysym ? keysym : 16777216 | u;
        },
    },
    vkeys = {
        8: 'Backspace',
        9: 'Tab',
        10: 'NumpadClear',
        12: 'Numpad5',
        13: 'Enter',
        16: 'ShiftLeft',
        17: 'ControlLeft',
        18: 'AltLeft',
        19: 'Pause',
        20: 'CapsLock',
        21: 'Lang1',
        25: 'Lang2',
        27: 'Escape',
        28: 'Convert',
        29: 'NonConvert',
        32: 'Space',
        33: 'PageUp',
        34: 'PageDown',
        35: 'End',
        36: 'Home',
        37: 'ArrowLeft',
        38: 'ArrowUp',
        39: 'ArrowRight',
        40: 'ArrowDown',
        41: 'Select',
        44: 'PrintScreen',
        45: 'Insert',
        46: 'Delete',
        47: 'Help',
        48: 'Digit0',
        49: 'Digit1',
        50: 'Digit2',
        51: 'Digit3',
        52: 'Digit4',
        53: 'Digit5',
        54: 'Digit6',
        55: 'Digit7',
        56: 'Digit8',
        57: 'Digit9',
        91: 'MetaLeft',
        92: 'MetaRight',
        93: 'ContextMenu',
        95: 'Sleep',
        96: 'Numpad0',
        97: 'Numpad1',
        98: 'Numpad2',
        99: 'Numpad3',
        100: 'Numpad4',
        101: 'Numpad5',
        102: 'Numpad6',
        103: 'Numpad7',
        104: 'Numpad8',
        105: 'Numpad9',
        106: 'NumpadMultiply',
        107: 'NumpadAdd',
        108: 'NumpadDecimal',
        109: 'NumpadSubtract',
        110: 'NumpadDecimal',
        111: 'NumpadDivide',
        112: 'F1',
        113: 'F2',
        114: 'F3',
        115: 'F4',
        116: 'F5',
        117: 'F6',
        118: 'F7',
        119: 'F8',
        120: 'F9',
        121: 'F10',
        122: 'F11',
        123: 'F12',
        124: 'F13',
        125: 'F14',
        126: 'F15',
        127: 'F16',
        128: 'F17',
        129: 'F18',
        130: 'F19',
        131: 'F20',
        132: 'F21',
        133: 'F22',
        134: 'F23',
        135: 'F24',
        144: 'NumLock',
        145: 'ScrollLock',
        166: 'BrowserBack',
        167: 'BrowserForward',
        168: 'BrowserRefresh',
        169: 'BrowserStop',
        170: 'BrowserSearch',
        171: 'BrowserFavorites',
        172: 'BrowserHome',
        173: 'AudioVolumeMute',
        174: 'AudioVolumeDown',
        175: 'AudioVolumeUp',
        176: 'MediaTrackNext',
        177: 'MediaTrackPrevious',
        178: 'MediaStop',
        179: 'MediaPlayPause',
        180: 'LaunchMail',
        181: 'MediaSelect',
        182: 'LaunchApp1',
        183: 'LaunchApp2',
        225: 'AltRight',
    },
    fixedkeys = {
        Backspace: 'Backspace',
        AltLeft: 'Alt',
        AltRight: 'Alt',
        CapsLock: 'CapsLock',
        ContextMenu: 'ContextMenu',
        ControlLeft: 'Control',
        ControlRight: 'Control',
        Enter: 'Enter',
        MetaLeft: 'Meta',
        MetaRight: 'Meta',
        ShiftLeft: 'Shift',
        ShiftRight: 'Shift',
        Tab: 'Tab',
        Delete: 'Delete',
        End: 'End',
        Help: 'Help',
        Home: 'Home',
        Insert: 'Insert',
        PageDown: 'PageDown',
        PageUp: 'PageUp',
        ArrowDown: 'ArrowDown',
        ArrowLeft: 'ArrowLeft',
        ArrowRight: 'ArrowRight',
        ArrowUp: 'ArrowUp',
        NumLock: 'NumLock',
        NumpadBackspace: 'Backspace',
        NumpadClear: 'Clear',
        Escape: 'Escape',
        F1: 'F1',
        F2: 'F2',
        F3: 'F3',
        F4: 'F4',
        F5: 'F5',
        F6: 'F6',
        F7: 'F7',
        F8: 'F8',
        F9: 'F9',
        F10: 'F10',
        F11: 'F11',
        F12: 'F12',
        F13: 'F13',
        F14: 'F14',
        F15: 'F15',
        F16: 'F16',
        F17: 'F17',
        F18: 'F18',
        F19: 'F19',
        F20: 'F20',
        F21: 'F21',
        F22: 'F22',
        F23: 'F23',
        F24: 'F24',
        F25: 'F25',
        F26: 'F26',
        F27: 'F27',
        F28: 'F28',
        F29: 'F29',
        F30: 'F30',
        F31: 'F31',
        F32: 'F32',
        F33: 'F33',
        F34: 'F34',
        F35: 'F35',
        PrintScreen: 'PrintScreen',
        ScrollLock: 'ScrollLock',
        Pause: 'Pause',
        BrowserBack: 'BrowserBack',
        BrowserFavorites: 'BrowserFavorites',
        BrowserForward: 'BrowserForward',
        BrowserHome: 'BrowserHome',
        BrowserRefresh: 'BrowserRefresh',
        BrowserSearch: 'BrowserSearch',
        BrowserStop: 'BrowserStop',
        Eject: 'Eject',
        LaunchApp1: 'LaunchMyComputer',
        LaunchApp2: 'LaunchCalendar',
        LaunchMail: 'LaunchMail',
        MediaPlayPause: 'MediaPlay',
        MediaStop: 'MediaStop',
        MediaTrackNext: 'MediaTrackNext',
        MediaTrackPrevious: 'MediaTrackPrevious',
        Power: 'Power',
        Sleep: 'Sleep',
        AudioVolumeDown: 'AudioVolumeDown',
        AudioVolumeMute: 'AudioVolumeMute',
        AudioVolumeUp: 'AudioVolumeUp',
        WakeUp: 'WakeUp',
    },
    DOMKeyTable = {};

function addStandard(key, standard) {
    if (void 0 === standard) throw new Error('Undefined keysym for key "' + key + '"');
    if (key in DOMKeyTable) throw new Error('Duplicate entry for key "' + key + '"');
    DOMKeyTable[key] = [standard, standard, standard, standard];
}

function addLeftRight(key, left, right) {
    if (void 0 === left) throw new Error('Undefined keysym for key "' + key + '"');
    if (void 0 === right) throw new Error('Undefined keysym for key "' + key + '"');
    if (key in DOMKeyTable) throw new Error('Duplicate entry for key "' + key + '"');
    DOMKeyTable[key] = [left, left, right, left];
}

function addNumpad(key, standard, numpad) {
    if (void 0 === standard) throw new Error('Undefined keysym for key "' + key + '"');
    if (void 0 === numpad) throw new Error('Undefined keysym for key "' + key + '"');
    if (key in DOMKeyTable) throw new Error('Duplicate entry for key "' + key + '"');
    DOMKeyTable[key] = [standard, standard, standard, numpad];
}

function getKeycode(evt) {
    if (evt.code) {
        switch (evt.code) {
            case 'OSLeft':
                return 'MetaLeft';

            case 'OSRight':
                return 'MetaRight';
        }
        return evt.code;
    }
    if ('keypress' !== evt.type && evt.keyCode in vkeys) {
        let code = vkeys[evt.keyCode];
        if ((isMac() && 'ContextMenu' === code && (code = 'MetaRight'), 2 === evt.location))
            switch (code) {
                case 'ShiftLeft':
                    return 'ShiftRight';

                case 'ControlLeft':
                    return 'ControlRight';

                case 'AltLeft':
                    return 'AltRight';
            }
        if (3 === evt.location)
            switch (code) {
                case 'Delete':
                    return 'NumpadDecimal';

                case 'Insert':
                    return 'Numpad0';

                case 'End':
                    return 'Numpad1';

                case 'ArrowDown':
                    return 'Numpad2';

                case 'PageDown':
                    return 'Numpad3';

                case 'ArrowLeft':
                    return 'Numpad4';

                case 'ArrowRight':
                    return 'Numpad6';

                case 'Home':
                    return 'Numpad7';

                case 'ArrowUp':
                    return 'Numpad8';

                case 'PageUp':
                    return 'Numpad9';

                case 'Enter':
                    return 'NumpadEnter';
            }
        return code;
    }
    return 'Unidentified';
}

function getKeysym(evt) {
    const key = (function (evt) {
        if (void 0 !== evt.key) {
            switch (evt.key) {
                case 'Spacebar':
                    return ' ';

                case 'Esc':
                    return 'Escape';

                case 'Scroll':
                    return 'ScrollLock';

                case 'Win':
                    return 'Meta';

                case 'Apps':
                    return 'ContextMenu';

                case 'Up':
                    return 'ArrowUp';

                case 'Left':
                    return 'ArrowLeft';

                case 'Right':
                    return 'ArrowRight';

                case 'Down':
                    return 'ArrowDown';

                case 'Del':
                    return 'Delete';

                case 'Divide':
                    return '/';

                case 'Multiply':
                    return '*';

                case 'Subtract':
                    return '-';

                case 'Add':
                    return '+';

                case 'Decimal':
                    return evt.char;
            }
            switch (evt.key) {
                case 'OS':
                    return 'Meta';

                case 'LaunchMyComputer':
                    return 'LaunchApplication1';

                case 'LaunchCalculator':
                    return 'LaunchApplication2';
            }
            switch (evt.key) {
                case 'UIKeyInputUpArrow':
                    return 'ArrowUp';

                case 'UIKeyInputDownArrow':
                    return 'ArrowDown';

                case 'UIKeyInputLeftArrow':
                    return 'ArrowLeft';

                case 'UIKeyInputRightArrow':
                    return 'ArrowRight';

                case 'UIKeyInputEscape':
                    return 'Escape';
            }
            if ('\0' === evt.key && 'NumpadDecimal' === evt.code) return 'Delete';
            if (!isIE() && !isEdge()) return evt.key;
            if (1 !== evt.key.length && 'Unidentified' !== evt.key) return evt.key;
        }
        const code = getKeycode(evt);
        return code in fixedkeys ? fixedkeys[code] : evt.charCode ? String.fromCharCode(evt.charCode) : 'Unidentified';
    })(evt);
    if ('Unidentified' === key) return null;
    if (key in DOMKeyTable) {
        let location = evt.location;
        if (('Meta' === key && 0 === location && (location = 2), 'Clear' === key && 3 === location)) {
            'NumLock' === getKeycode(evt) && (location = 0);
        }
        if (((void 0 === location || location > 3) && (location = 0), 'Meta' === key)) {
            let code = getKeycode(evt);
            if ('AltLeft' === code) return KeyTable_XK_Meta_L;
            if ('AltRight' === code) return KeyTable_XK_Meta_R;
        }
        if ('Clear' === key) {
            if ('NumLock' === getKeycode(evt)) return KeyTable_XK_Num_Lock;
        }
        return DOMKeyTable[key][location];
    }
    if (1 !== key.length) return null;
    const codepoint = key.charCodeAt();
    return codepoint ? keysyms.lookup(codepoint) : null;
}

addLeftRight('Alt', KeyTable_XK_Alt_L, KeyTable_XK_Alt_R),
    addStandard('AltGraph', KeyTable_XK_ISO_Level3_Shift),
    addStandard('CapsLock', KeyTable_XK_Caps_Lock),
    addLeftRight('Control', KeyTable_XK_Control_L, KeyTable_XK_Control_R),
    addLeftRight('Meta', KeyTable_XK_Super_L, KeyTable_XK_Super_R),
    addStandard('NumLock', KeyTable_XK_Num_Lock),
    addStandard('ScrollLock', KeyTable_XK_Scroll_Lock),
    addLeftRight('Shift', KeyTable_XK_Shift_L, KeyTable_XK_Shift_R),
    addNumpad('Enter', KeyTable_XK_Return, KeyTable_XK_KP_Enter),
    addStandard('Tab', KeyTable_XK_Tab),
    addNumpad(' ', KeyTable_XK_space, KeyTable_XK_KP_Space),
    addNumpad('ArrowDown', KeyTable_XK_Down, KeyTable_XK_KP_Down),
    addNumpad('ArrowUp', KeyTable_XK_Up, KeyTable_XK_KP_Up),
    addNumpad('ArrowLeft', KeyTable_XK_Left, KeyTable_XK_KP_Left),
    addNumpad('ArrowRight', KeyTable_XK_Right, KeyTable_XK_KP_Right),
    addNumpad('End', KeyTable_XK_End, KeyTable_XK_KP_End),
    addNumpad('Home', KeyTable_XK_Home, KeyTable_XK_KP_Home),
    addNumpad('PageDown', KeyTable_XK_Next, KeyTable_XK_KP_Next),
    addNumpad('PageUp', KeyTable_XK_Prior, KeyTable_XK_KP_Prior),
    addStandard('Backspace', KeyTable_XK_BackSpace),
    addNumpad('Clear', KeyTable_XK_Clear, KeyTable_XK_KP_Begin),
    addStandard('Copy', KeyTable_XF86XK_Copy),
    addStandard('Cut', KeyTable_XF86XK_Cut),
    addNumpad('Delete', KeyTable_XK_Delete, KeyTable_XK_KP_Delete),
    addNumpad('Insert', KeyTable_XK_Insert, KeyTable_XK_KP_Insert),
    addStandard('Paste', KeyTable_XF86XK_Paste),
    addStandard('Redo', KeyTable_XK_Redo),
    addStandard('Undo', KeyTable_XK_Undo),
    addStandard('Cancel', KeyTable_XK_Cancel),
    addStandard('ContextMenu', KeyTable_XK_Menu),
    addStandard('Escape', KeyTable_XK_Escape),
    addStandard('Execute', KeyTable_XK_Execute),
    addStandard('Find', KeyTable_XK_Find),
    addStandard('Help', KeyTable_XK_Help),
    addStandard('Pause', KeyTable_XK_Pause),
    addStandard('Select', KeyTable_XK_Select),
    addStandard('ZoomIn', KeyTable_XF86XK_ZoomIn),
    addStandard('ZoomOut', KeyTable_XF86XK_ZoomOut),
    addStandard('BrightnessDown', KeyTable_XF86XK_MonBrightnessDown),
    addStandard('BrightnessUp', KeyTable_XF86XK_MonBrightnessUp),
    addStandard('Eject', KeyTable_XF86XK_Eject),
    addStandard('LogOff', KeyTable_XF86XK_LogOff),
    addStandard('Power', KeyTable_XF86XK_PowerOff),
    addStandard('PowerOff', KeyTable_XF86XK_PowerDown),
    addStandard('PrintScreen', KeyTable_XK_Print),
    addStandard('Hibernate', KeyTable_XF86XK_Hibernate),
    addStandard('Standby', KeyTable_XF86XK_Standby),
    addStandard('WakeUp', KeyTable_XF86XK_WakeUp),
    addStandard('AllCandidates', KeyTable_XK_MultipleCandidate),
    addStandard('Alphanumeric', KeyTable_XK_Eisu_Shift),
    addStandard('CodeInput', KeyTable_XK_Codeinput),
    addStandard('Compose', KeyTable_XK_Multi_key),
    addStandard('Convert', KeyTable_XK_Henkan),
    addStandard('GroupFirst', KeyTable_XK_ISO_First_Group),
    addStandard('GroupLast', KeyTable_XK_ISO_Last_Group),
    addStandard('GroupNext', KeyTable_XK_ISO_Next_Group),
    addStandard('GroupPrevious', KeyTable_XK_ISO_Prev_Group),
    addStandard('NonConvert', KeyTable_XK_Muhenkan),
    addStandard('PreviousCandidate', KeyTable_XK_PreviousCandidate),
    addStandard('SingleCandidate', KeyTable_XK_SingleCandidate),
    addStandard('HangulMode', KeyTable_XK_Hangul),
    addStandard('HanjaMode', KeyTable_XK_Hangul_Hanja),
    addStandard('JunjuaMode', KeyTable_XK_Hangul_Jeonja),
    addStandard('Eisu', KeyTable_XK_Eisu_toggle),
    addStandard('Hankaku', KeyTable_XK_Hankaku),
    addStandard('Hiragana', KeyTable_XK_Hiragana),
    addStandard('HiraganaKatakana', KeyTable_XK_Hiragana_Katakana),
    addStandard('KanaMode', KeyTable_XK_Kana_Shift),
    addStandard('KanjiMode', KeyTable_XK_Kanji),
    addStandard('Katakana', KeyTable_XK_Katakana),
    addStandard('Romaji', KeyTable_XK_Romaji),
    addStandard('Zenkaku', KeyTable_XK_Zenkaku),
    addStandard('ZenkakuHanaku', KeyTable_XK_Zenkaku_Hankaku),
    addStandard('F1', KeyTable_XK_F1),
    addStandard('F2', KeyTable_XK_F2),
    addStandard('F3', KeyTable_XK_F3),
    addStandard('F4', KeyTable_XK_F4),
    addStandard('F5', KeyTable_XK_F5),
    addStandard('F6', KeyTable_XK_F6),
    addStandard('F7', KeyTable_XK_F7),
    addStandard('F8', KeyTable_XK_F8),
    addStandard('F9', KeyTable_XK_F9),
    addStandard('F10', KeyTable_XK_F10),
    addStandard('F11', KeyTable_XK_F11),
    addStandard('F12', KeyTable_XK_F12),
    addStandard('F13', KeyTable_XK_F13),
    addStandard('F14', KeyTable_XK_F14),
    addStandard('F15', KeyTable_XK_F15),
    addStandard('F16', KeyTable_XK_F16),
    addStandard('F17', KeyTable_XK_F17),
    addStandard('F18', KeyTable_XK_F18),
    addStandard('F19', KeyTable_XK_F19),
    addStandard('F20', KeyTable_XK_F20),
    addStandard('F21', KeyTable_XK_F21),
    addStandard('F22', KeyTable_XK_F22),
    addStandard('F23', KeyTable_XK_F23),
    addStandard('F24', KeyTable_XK_F24),
    addStandard('F25', KeyTable_XK_F25),
    addStandard('F26', KeyTable_XK_F26),
    addStandard('F27', KeyTable_XK_F27),
    addStandard('F28', KeyTable_XK_F28),
    addStandard('F29', KeyTable_XK_F29),
    addStandard('F30', KeyTable_XK_F30),
    addStandard('F31', KeyTable_XK_F31),
    addStandard('F32', KeyTable_XK_F32),
    addStandard('F33', KeyTable_XK_F33),
    addStandard('F34', KeyTable_XK_F34),
    addStandard('F35', KeyTable_XK_F35),
    addStandard('Close', KeyTable_XF86XK_Close),
    addStandard('MailForward', KeyTable_XF86XK_MailForward),
    addStandard('MailReply', KeyTable_XF86XK_Reply),
    addStandard('MailSend', KeyTable_XF86XK_Send),
    addStandard('MediaFastForward', KeyTable_XF86XK_AudioForward),
    addStandard('MediaPause', KeyTable_XF86XK_AudioPause),
    addStandard('MediaPlay', KeyTable_XF86XK_AudioPlay),
    addStandard('MediaRecord', KeyTable_XF86XK_AudioRecord),
    addStandard('MediaRewind', KeyTable_XF86XK_AudioRewind),
    addStandard('MediaStop', KeyTable_XF86XK_AudioStop),
    addStandard('MediaTrackNext', KeyTable_XF86XK_AudioNext),
    addStandard('MediaTrackPrevious', KeyTable_XF86XK_AudioPrev),
    addStandard('New', KeyTable_XF86XK_New),
    addStandard('Open', KeyTable_XF86XK_Open),
    addStandard('Print', KeyTable_XK_Print),
    addStandard('Save', KeyTable_XF86XK_Save),
    addStandard('SpellCheck', KeyTable_XF86XK_Spell),
    addStandard('AudioVolumeDown', KeyTable_XF86XK_AudioLowerVolume),
    addStandard('AudioVolumeUp', KeyTable_XF86XK_AudioRaiseVolume),
    addStandard('AudioVolumeMute', KeyTable_XF86XK_AudioMute),
    addStandard('MicrophoneVolumeMute', KeyTable_XF86XK_AudioMicMute),
    addStandard('LaunchApplication1', KeyTable_XF86XK_MyComputer),
    addStandard('LaunchApplication2', KeyTable_XF86XK_Calculator),
    addStandard('LaunchCalendar', KeyTable_XF86XK_Calendar),
    addStandard('LaunchMail', KeyTable_XF86XK_Mail),
    addStandard('LaunchMediaPlayer', KeyTable_XF86XK_AudioMedia),
    addStandard('LaunchMusicPlayer', KeyTable_XF86XK_Music),
    addStandard('LaunchPhone', KeyTable_XF86XK_Phone),
    addStandard('LaunchScreenSaver', KeyTable_XF86XK_ScreenSaver),
    addStandard('LaunchSpreadsheet', KeyTable_XF86XK_Excel),
    addStandard('LaunchWebBrowser', KeyTable_XF86XK_WWW),
    addStandard('LaunchWebCam', KeyTable_XF86XK_WebCam),
    addStandard('LaunchWordProcessor', KeyTable_XF86XK_Word),
    addStandard('BrowserBack', KeyTable_XF86XK_Back),
    addStandard('BrowserFavorites', KeyTable_XF86XK_Favorites),
    addStandard('BrowserForward', KeyTable_XF86XK_Forward),
    addStandard('BrowserHome', KeyTable_XF86XK_HomePage),
    addStandard('BrowserRefresh', KeyTable_XF86XK_Refresh),
    addStandard('BrowserSearch', KeyTable_XF86XK_Search),
    addStandard('BrowserStop', KeyTable_XF86XK_Stop),
    addStandard('Dimmer', KeyTable_XF86XK_BrightnessAdjust),
    addStandard('MediaAudioTrack', KeyTable_XF86XK_AudioCycleTrack),
    addStandard('RandomToggle', KeyTable_XF86XK_AudioRandomPlay),
    addStandard('SplitScreenToggle', KeyTable_XF86XK_SplitScreen),
    addStandard('Subtitle', KeyTable_XF86XK_Subtitle),
    addStandard('VideoModeNext', KeyTable_XF86XK_Next_VMode),
    addNumpad('=', KeyTable_XK_equal, KeyTable_XK_KP_Equal),
    addNumpad('+', KeyTable_XK_plus, KeyTable_XK_KP_Add),
    addNumpad('-', KeyTable_XK_minus, KeyTable_XK_KP_Subtract),
    addNumpad('*', KeyTable_XK_asterisk, KeyTable_XK_KP_Multiply),
    addNumpad('/', KeyTable_XK_slash, KeyTable_XK_KP_Divide),
    addNumpad('.', KeyTable_XK_period, KeyTable_XK_KP_Decimal),
    addNumpad(',', KeyTable_XK_comma, KeyTable_XK_KP_Separator),
    addNumpad('0', KeyTable_XK_0, KeyTable_XK_KP_0),
    addNumpad('1', KeyTable_XK_1, KeyTable_XK_KP_1),
    addNumpad('2', KeyTable_XK_2, KeyTable_XK_KP_2),
    addNumpad('3', KeyTable_XK_3, KeyTable_XK_KP_3),
    addNumpad('4', KeyTable_XK_4, KeyTable_XK_KP_4),
    addNumpad('5', KeyTable_XK_5, KeyTable_XK_KP_5),
    addNumpad('6', KeyTable_XK_6, KeyTable_XK_KP_6),
    addNumpad('7', KeyTable_XK_7, KeyTable_XK_KP_7),
    addNumpad('8', KeyTable_XK_8, KeyTable_XK_KP_8),
    addNumpad('9', KeyTable_XK_9, KeyTable_XK_KP_9);

class Keyboard {
    constructor(target) {
        (this._target = target || null),
            (this._keyDownList = {}),
            (this._pendingKey = null),
            (this._altGrArmed = !1),
            (this._eventHandlers = {
                keyup: this._handleKeyUp.bind(this),
                keydown: this._handleKeyDown.bind(this),
                keypress: this._handleKeyPress.bind(this),
                blur: this._allKeysUp.bind(this),
                checkalt: this._checkAlt.bind(this),
            }),
            (this.onkeyevent = () => {});
    }
    _sendKeyEvent(keysym, code, down) {
        if (down) this._keyDownList[code] = keysym;
        else {
            if (!(code in this._keyDownList)) return;
            delete this._keyDownList[code];
        }
        Debug('onkeyevent ' + (down ? 'down' : 'up') + ', keysym: ' + keysym, ', code: ' + code), this.onkeyevent(keysym, code, down);
    }
    _getKeyCode(e2) {
        const code = getKeycode(e2);
        if ('Unidentified' !== code) return code;
        if (e2.keyCode && 'keypress' !== e2.type && 229 !== e2.keyCode) return 'Platform' + e2.keyCode;
        if (e2.keyIdentifier) {
            if ('U+' !== e2.keyIdentifier.substr(0, 2)) return e2.keyIdentifier;
            const codepoint = parseInt(e2.keyIdentifier.substr(2), 16);
            return 'Platform' + String.fromCharCode(codepoint).toUpperCase().charCodeAt();
        }
        return 'Unidentified';
    }
    _handleKeyDown(e2) {
        const code = this._getKeyCode(e2);
        let keysym = getKeysym(e2);
        if ((this._altGrArmed && ((this._altGrArmed = !1), clearTimeout(this._altGrTimeout), 'AltRight' === code && e2.timeStamp - this._altGrCtrlTime < 50 ? (keysym = KeyTable_XK_ISO_Level3_Shift) : this._sendKeyEvent(KeyTable_XK_Control_L, 'ControlLeft', !0)), 'Unidentified' === code))
            return keysym && (this._sendKeyEvent(keysym, code, !0), this._sendKeyEvent(keysym, code, !1)), void stopEvent(e2);
        if (isMac() || isIOS())
            switch (keysym) {
                case KeyTable_XK_Super_L:
                    keysym = KeyTable_XK_Alt_L;
                    break;

                case KeyTable_XK_Super_R:
                    keysym = KeyTable_XK_Super_L;
                    break;

                case KeyTable_XK_Alt_L:
                    keysym = KeyTable_XK_Mode_switch;
                    break;

                case KeyTable_XK_Alt_R:
                    keysym = KeyTable_XK_ISO_Level3_Shift;
            }
        return (
            code in this._keyDownList && (keysym = this._keyDownList[code]),
            (isMac() || isIOS()) && 'CapsLock' === code
                ? (this._sendKeyEvent(KeyTable_XK_Caps_Lock, 'CapsLock', !0), this._sendKeyEvent(KeyTable_XK_Caps_Lock, 'CapsLock', !1), void stopEvent(e2))
                : keysym || (e2.key && !isIE() && !isEdge())
                ? ((this._pendingKey = null), stopEvent(e2), 'ControlLeft' === code && isWindows() && !('ControlLeft' in this._keyDownList) ? ((this._altGrArmed = !0), (this._altGrTimeout = setTimeout(this._handleAltGrTimeout.bind(this), 100)), void (this._altGrCtrlTime = e2.timeStamp)) : void this._sendKeyEvent(keysym, code, !0))
                : ((this._pendingKey = code), void setTimeout(this._handleKeyPressTimeout.bind(this), 10, e2))
        );
    }
    _handleKeyPress(e2) {
        if ((stopEvent(e2), null === this._pendingKey)) return;
        let code = this._getKeyCode(e2);
        const keysym = getKeysym(e2);
        ('Unidentified' !== code && code != this._pendingKey) || ((code = this._pendingKey), (this._pendingKey = null), keysym ? this._sendKeyEvent(keysym, code, !0) : Info('keypress with no keysym:', e2));
    }
    _handleKeyPressTimeout(e2) {
        if (null === this._pendingKey) return;
        let keysym;
        const code = this._pendingKey;
        if (((this._pendingKey = null), e2.keyCode >= 48 && e2.keyCode <= 57)) keysym = e2.keyCode;
        else if (e2.keyCode >= 65 && e2.keyCode <= 90) {
            let char = String.fromCharCode(e2.keyCode);
            (char = e2.shiftKey ? char.toUpperCase() : char.toLowerCase()), (keysym = char.charCodeAt());
        } else keysym = 0;
        this._sendKeyEvent(keysym, code, !0);
    }
    _handleKeyUp(e2) {
        stopEvent(e2);
        const code = this._getKeyCode(e2);
        if ((this._altGrArmed && ((this._altGrArmed = !1), clearTimeout(this._altGrTimeout), this._sendKeyEvent(KeyTable_XK_Control_L, 'ControlLeft', !0)), (isMac() || isIOS()) && 'CapsLock' === code)) return this._sendKeyEvent(KeyTable_XK_Caps_Lock, 'CapsLock', !0), void this._sendKeyEvent(KeyTable_XK_Caps_Lock, 'CapsLock', !1);
        this._sendKeyEvent(this._keyDownList[code], code, !1), !isWindows() || ('ShiftLeft' !== code && 'ShiftRight' !== code) || ('ShiftRight' in this._keyDownList && this._sendKeyEvent(this._keyDownList.ShiftRight, 'ShiftRight', !1), 'ShiftLeft' in this._keyDownList && this._sendKeyEvent(this._keyDownList.ShiftLeft, 'ShiftLeft', !1));
    }
    _handleAltGrTimeout() {
        (this._altGrArmed = !1), clearTimeout(this._altGrTimeout), this._sendKeyEvent(KeyTable_XK_Control_L, 'ControlLeft', !0);
    }
    _allKeysUp() {
        Debug('>> Keyboard.allKeysUp');
        for (let code in this._keyDownList) this._sendKeyEvent(this._keyDownList[code], code, !1);
        Debug('<< Keyboard.allKeysUp');
    }
    _checkAlt(e2) {
        if (e2.skipCheckAlt) return;
        if (e2.altKey) return;
        const target = this._target,
            downList = this._keyDownList;
        ['AltLeft', 'AltRight'].forEach(code => {
            if (!(code in downList)) return;
            const event = new KeyboardEvent('keyup', {
                key: downList[code],
                code: code,
            });
            (event.skipCheckAlt = !0), target.dispatchEvent(event);
        });
    }
    grab() {
        if ((this._target.addEventListener('keydown', this._eventHandlers.keydown), this._target.addEventListener('keyup', this._eventHandlers.keyup), this._target.addEventListener('keypress', this._eventHandlers.keypress), window.addEventListener('blur', this._eventHandlers.blur), isWindows() && isFirefox())) {
            const handler = this._eventHandlers.checkalt;
            ['mousedown', 'mouseup', 'mousemove', 'wheel', 'touchstart', 'touchend', 'touchmove', 'keydown', 'keyup'].forEach(type =>
                document.addEventListener(type, handler, {
                    capture: !0,
                    passive: !0,
                }),
            );
        }
    }
    ungrab() {
        if (isWindows() && isFirefox()) {
            const handler = this._eventHandlers.checkalt;
            ['mousedown', 'mouseup', 'mousemove', 'wheel', 'touchstart', 'touchend', 'touchmove', 'keydown', 'keyup'].forEach(type => document.removeEventListener(type, handler));
        }
        this._target.removeEventListener('keydown', this._eventHandlers.keydown), this._target.removeEventListener('keyup', this._eventHandlers.keyup), this._target.removeEventListener('keypress', this._eventHandlers.keypress), window.removeEventListener('blur', this._eventHandlers.blur), this._allKeysUp();
    }
}

class GestureHandler {
    constructor() {
        (this._target = null), (this._state = 127), (this._tracked = []), (this._ignored = []), (this._waitingRelease = !1), (this._releaseStart = 0), (this._longpressTimeoutId = null), (this._twoTouchTimeoutId = null), (this._boundEventHandler = this._eventHandler.bind(this));
    }
    attach(target) {
        this.detach(), (this._target = target), this._target.addEventListener('touchstart', this._boundEventHandler), this._target.addEventListener('touchmove', this._boundEventHandler), this._target.addEventListener('touchend', this._boundEventHandler), this._target.addEventListener('touchcancel', this._boundEventHandler);
    }
    detach() {
        this._target && (this._stopLongpressTimeout(), this._stopTwoTouchTimeout(), this._target.removeEventListener('touchstart', this._boundEventHandler), this._target.removeEventListener('touchmove', this._boundEventHandler), this._target.removeEventListener('touchend', this._boundEventHandler), this._target.removeEventListener('touchcancel', this._boundEventHandler), (this._target = null));
    }
    _eventHandler(e2) {
        let fn;
        switch ((e2.stopPropagation(), e2.preventDefault(), e2.type)) {
            case 'touchstart':
                fn = this._touchStart;
                break;

            case 'touchmove':
                fn = this._touchMove;
                break;

            case 'touchend':
            case 'touchcancel':
                fn = this._touchEnd;
        }
        for (let i = 0; i < e2.changedTouches.length; i++) {
            let touch = e2.changedTouches[i];
            fn.call(this, touch.identifier, touch.clientX, touch.clientY);
        }
    }
    _touchStart(id, x, y) {
        if (this._hasDetectedGesture() || 0 === this._state) this._ignored.push(id);
        else {
            if (this._tracked.length > 0 && Date.now() - this._tracked[0].started > 250) return (this._state = 0), void this._ignored.push(id);
            if (this._waitingRelease) return (this._state = 0), void this._ignored.push(id);
            switch (
                (this._tracked.push({
                    id: id,
                    started: Date.now(),
                    active: !0,
                    firstX: x,
                    firstY: y,
                    lastX: x,
                    lastY: y,
                    angle: 0,
                }),
                this._tracked.length)
            ) {
                case 1:
                    this._startLongpressTimeout();
                    break;

                case 2:
                    (this._state &= -26), this._stopLongpressTimeout();
                    break;

                case 3:
                    this._state &= -99;
                    break;

                default:
                    this._state = 0;
            }
        }
    }
    _touchMove(id, x, y) {
        let touch = this._tracked.find(t => t.id === id);
        if (void 0 === touch) return;
        (touch.lastX = x), (touch.lastY = y);
        let deltaX = x - touch.firstX,
            deltaY = y - touch.firstY;
        if (((touch.firstX === touch.lastX && touch.firstY === touch.lastY) || (touch.angle = (180 * Math.atan2(deltaY, deltaX)) / Math.PI), !this._hasDetectedGesture())) {
            if (Math.hypot(deltaX, deltaY) < 50) return;
            if (((this._state &= -24), this._stopLongpressTimeout(), 1 !== this._tracked.length && (this._state &= -9), 2 !== this._tracked.length && (this._state &= -97), 2 === this._tracked.length)) {
                let prevTouch = this._tracked.find(t => t.id !== id);
                if (Math.hypot(prevTouch.firstX - prevTouch.lastX, prevTouch.firstY - prevTouch.lastY) > 50) {
                    let deltaAngle = Math.abs(touch.angle - prevTouch.angle);
                    (deltaAngle = Math.abs(((deltaAngle + 180) % 360) - 180)), (this._state &= deltaAngle > 90 ? -33 : -65), this._isTwoTouchTimeoutRunning() && this._stopTwoTouchTimeout();
                } else this._isTwoTouchTimeoutRunning() || this._startTwoTouchTimeout();
            }
            if (!this._hasDetectedGesture()) return;
            this._pushEvent('gesturestart');
        }
        this._pushEvent('gesturemove');
    }
    _touchEnd(id, x, y) {
        if (-1 !== this._ignored.indexOf(id)) return this._ignored.splice(this._ignored.indexOf(id), 1), void (0 === this._ignored.length && 0 === this._tracked.length && ((this._state = 127), (this._waitingRelease = !1)));
        if ((!this._hasDetectedGesture() && this._isTwoTouchTimeoutRunning() && (this._stopTwoTouchTimeout(), (this._state = 0)), !this._hasDetectedGesture() && ((this._state &= -105), (this._state &= -17), this._stopLongpressTimeout(), !this._waitingRelease)))
            switch (((this._releaseStart = Date.now()), (this._waitingRelease = !0), this._tracked.length)) {
                case 1:
                    this._state &= -7;
                    break;

                case 2:
                    this._state &= -6;
            }
        if (this._waitingRelease) {
            if ((Date.now() - this._releaseStart > 250 && (this._state = 0), this._tracked.some(t => Date.now() - t.started > 1e3) && (this._state = 0), (this._tracked.find(t => t.id === id).active = !1), this._hasDetectedGesture())) this._pushEvent('gesturestart');
            else if (0 !== this._state) return;
        }
        this._hasDetectedGesture() && this._pushEvent('gestureend');
        for (let i = 0; i < this._tracked.length; i++) this._tracked[i].active && this._ignored.push(this._tracked[i].id);
        (this._tracked = []), (this._state = 0), -1 !== this._ignored.indexOf(id) && this._ignored.splice(this._ignored.indexOf(id), 1), 0 === this._ignored.length && ((this._state = 127), (this._waitingRelease = !1));
    }
    _hasDetectedGesture() {
        return 0 !== this._state && !(this._state & (this._state - 1)) && !(7 & this._state && this._tracked.some(t => t.active));
    }
    _startLongpressTimeout() {
        this._stopLongpressTimeout(), (this._longpressTimeoutId = setTimeout(() => this._longpressTimeout(), 1e3));
    }
    _stopLongpressTimeout() {
        clearTimeout(this._longpressTimeoutId), (this._longpressTimeoutId = null);
    }
    _longpressTimeout() {
        if (this._hasDetectedGesture()) throw new Error('A longpress gesture failed, conflict with a different gesture');
        (this._state = 16), this._pushEvent('gesturestart');
    }
    _startTwoTouchTimeout() {
        this._stopTwoTouchTimeout(), (this._twoTouchTimeoutId = setTimeout(() => this._twoTouchTimeout(), 50));
    }
    _stopTwoTouchTimeout() {
        clearTimeout(this._twoTouchTimeoutId), (this._twoTouchTimeoutId = null);
    }
    _isTwoTouchTimeoutRunning() {
        return null !== this._twoTouchTimeoutId;
    }
    _twoTouchTimeout() {
        if (0 === this._tracked.length) throw new Error('A pinch or two drag gesture failed, no tracked touches');
        let avgM = this._getAverageMovement(),
            avgMoveH = Math.abs(avgM.x),
            avgMoveV = Math.abs(avgM.y),
            avgD = this._getAverageDistance(),
            deltaTouchDistance = Math.abs(Math.hypot(avgD.first.x, avgD.first.y) - Math.hypot(avgD.last.x, avgD.last.y));
        (this._state = avgMoveV < deltaTouchDistance && avgMoveH < deltaTouchDistance ? 64 : 32), this._pushEvent('gesturestart'), this._pushEvent('gesturemove');
    }
    _pushEvent(type) {
        let detail = {
                type: this._stateToGesture(this._state),
            },
            avg = this._getPosition(),
            pos = avg.last;
        switch (('gesturestart' === type && (pos = avg.first), this._state)) {
            case 32:
            case 64:
                pos = avg.first;
        }
        if (((detail.clientX = pos.x), (detail.clientY = pos.y), 64 === this._state)) {
            let distance = this._getAverageDistance();
            'gesturestart' === type ? ((detail.magnitudeX = distance.first.x), (detail.magnitudeY = distance.first.y)) : ((detail.magnitudeX = distance.last.x), (detail.magnitudeY = distance.last.y));
        } else if (32 === this._state)
            if ('gesturestart' === type) (detail.magnitudeX = 0), (detail.magnitudeY = 0);
            else {
                let movement = this._getAverageMovement();
                (detail.magnitudeX = movement.x), (detail.magnitudeY = movement.y);
            }
        let gev = new CustomEvent(type, {
            detail: detail,
        });
        this._target.dispatchEvent(gev);
    }
    _stateToGesture(state) {
        switch (state) {
            case 1:
                return 'onetap';

            case 2:
                return 'twotap';

            case 4:
                return 'threetap';

            case 8:
                return 'drag';

            case 16:
                return 'longpress';

            case 32:
                return 'twodrag';

            case 64:
                return 'pinch';
        }
        throw new Error('Unknown gesture state: ' + state);
    }
    _getPosition() {
        if (0 === this._tracked.length) throw new Error('Failed to get gesture position, no tracked touches');
        let size = this._tracked.length,
            fx = 0,
            fy = 0,
            lx = 0,
            ly = 0;
        for (let i = 0; i < this._tracked.length; i++) (fx += this._tracked[i].firstX), (fy += this._tracked[i].firstY), (lx += this._tracked[i].lastX), (ly += this._tracked[i].lastY);
        return {
            first: {
                x: fx / size,
                y: fy / size,
            },
            last: {
                x: lx / size,
                y: ly / size,
            },
        };
    }
    _getAverageMovement() {
        if (0 === this._tracked.length) throw new Error('Failed to get gesture movement, no tracked touches');
        let totalH, totalV;
        totalH = totalV = 0;
        let size = this._tracked.length;
        for (let i = 0; i < this._tracked.length; i++) (totalH += this._tracked[i].lastX - this._tracked[i].firstX), (totalV += this._tracked[i].lastY - this._tracked[i].firstY);
        return {
            x: totalH / size,
            y: totalV / size,
        };
    }
    _getAverageDistance() {
        if (0 === this._tracked.length) throw new Error('Failed to get gesture distance, no tracked touches');
        let first = this._tracked[0],
            last = this._tracked[this._tracked.length - 1];
        return {
            first: {
                x: Math.abs(last.firstX - first.firstX),
                y: Math.abs(last.firstY - first.firstY),
            },
            last: {
                x: Math.abs(last.lastX - first.lastX),
                y: Math.abs(last.lastY - first.lastY),
            },
        };
    }
}

const useFallback = !supportsCursorURIs || isTouchDevice;

class Cursor {
    constructor() {
        (this._target = null),
            (this._canvas = document.createElement('canvas')),
            useFallback && ((this._canvas.style.position = 'fixed'), (this._canvas.style.zIndex = '65535'), (this._canvas.style.pointerEvents = 'none'), (this._canvas.style.visibility = 'hidden')),
            (this._position = {
                x: 0,
                y: 0,
            }),
            (this._hotSpot = {
                x: 0,
                y: 0,
            }),
            (this._eventHandlers = {
                mouseover: this._handleMouseOver.bind(this),
                mouseleave: this._handleMouseLeave.bind(this),
                mousemove: this._handleMouseMove.bind(this),
                mouseup: this._handleMouseUp.bind(this),
            });
    }
    attach(target) {
        if ((this._target && this.detach(), (this._target = target), useFallback)) {
            document.body.appendChild(this._canvas);
            const options = {
                capture: !0,
                passive: !0,
            };
            this._target.addEventListener('mouseover', this._eventHandlers.mouseover, options), this._target.addEventListener('mouseleave', this._eventHandlers.mouseleave, options), this._target.addEventListener('mousemove', this._eventHandlers.mousemove, options), this._target.addEventListener('mouseup', this._eventHandlers.mouseup, options);
        }
        this.clear();
    }
    detach() {
        if (this._target) {
            if (useFallback) {
                const options = {
                    capture: !0,
                    passive: !0,
                };
                this._target.removeEventListener('mouseover', this._eventHandlers.mouseover, options),
                    this._target.removeEventListener('mouseleave', this._eventHandlers.mouseleave, options),
                    this._target.removeEventListener('mousemove', this._eventHandlers.mousemove, options),
                    this._target.removeEventListener('mouseup', this._eventHandlers.mouseup, options),
                    document.body.removeChild(this._canvas);
            }
            this._target = null;
        }
    }
    change(rgba, hotx, hoty, w, h) {
        if (0 === w || 0 === h) return void this.clear();
        (this._position.x = this._position.x + this._hotSpot.x - hotx), (this._position.y = this._position.y + this._hotSpot.y - hoty), (this._hotSpot.x = hotx), (this._hotSpot.y = hoty);
        let img,
            ctx = this._canvas.getContext('2d');
        (this._canvas.width = w), (this._canvas.height = h);
        try {
            img = new ImageData(new Uint8ClampedArray(rgba), w, h);
        } catch (ex) {
            (img = ctx.createImageData(w, h)), img.data.set(new Uint8ClampedArray(rgba));
        }
        if ((ctx.clearRect(0, 0, w, h), ctx.putImageData(img, 0, 0), useFallback)) this._updatePosition();
        else {
            let url = this._canvas.toDataURL();
            this._target.style.cursor = 'url(' + url + ')' + hotx + ' ' + hoty + ', default';
        }
    }
    clear() {
        (this._target.style.cursor = 'none'), (this._canvas.width = 0), (this._canvas.height = 0), (this._position.x = this._position.x + this._hotSpot.x), (this._position.y = this._position.y + this._hotSpot.y), (this._hotSpot.x = 0), (this._hotSpot.y = 0);
    }
    move(clientX, clientY) {
        if (!useFallback) return;
        window.visualViewport ? ((this._position.x = clientX + window.visualViewport.offsetLeft), (this._position.y = clientY + window.visualViewport.offsetTop)) : ((this._position.x = clientX), (this._position.y = clientY)), this._updatePosition();
        let target = document.elementFromPoint(clientX, clientY);
        this._updateVisibility(target);
    }
    _handleMouseOver(event) {
        this._handleMouseMove(event);
    }
    _handleMouseLeave(event) {
        this._updateVisibility(event.relatedTarget);
    }
    _handleMouseMove(event) {
        this._updateVisibility(event.target), (this._position.x = event.clientX - this._hotSpot.x), (this._position.y = event.clientY - this._hotSpot.y), this._updatePosition();
    }
    _handleMouseUp(event) {
        let target = document.elementFromPoint(event.clientX, event.clientY);
        this._updateVisibility(target),
            this._captureIsActive() &&
                window.setTimeout(() => {
                    this._target && ((target = document.elementFromPoint(event.clientX, event.clientY)), this._updateVisibility(target));
                }, 0);
    }
    _showCursor() {
        'hidden' === this._canvas.style.visibility && (this._canvas.style.visibility = '');
    }
    _hideCursor() {
        'hidden' !== this._canvas.style.visibility && (this._canvas.style.visibility = 'hidden');
    }
    _shouldShowCursor(target) {
        return !!target && (target === this._target || (!!this._target.contains(target) && 'none' === window.getComputedStyle(target).cursor));
    }
    _updateVisibility(target) {
        this._captureIsActive() && (target = document.captureElement), this._shouldShowCursor(target) ? this._showCursor() : this._hideCursor();
    }
    _updatePosition() {
        (this._canvas.style.left = this._position.x + 'px'), (this._canvas.style.top = this._position.y + 'px');
    }
    _captureIsActive() {
        return document.captureElement && document.documentElement.contains(document.captureElement);
    }
}

class Websock {
    constructor() {
        (this._websocket = null),
            (this._rQi = 0),
            (this._rQlen = 0),
            (this._rQbufferSize = 4194304),
            (this._rQ = null),
            (this._sQbufferSize = 10240),
            (this._sQlen = 0),
            (this._sQ = null),
            (this._eventHandlers = {
                message: () => {},
                open: () => {},
                close: () => {},
                error: () => {},
            });
    }
    get sQ() {
        return this._sQ;
    }
    get rQ() {
        return this._rQ;
    }
    get rQi() {
        return this._rQi;
    }
    set rQi(val) {
        this._rQi = val;
    }
    get rQlen() {
        return this._rQlen - this._rQi;
    }
    rQpeek8() {
        return this._rQ[this._rQi];
    }
    rQskipBytes(bytes) {
        this._rQi += bytes;
    }
    rQshift8() {
        return this._rQshift(1);
    }
    rQshift16() {
        return this._rQshift(2);
    }
    rQshift32() {
        return this._rQshift(4);
    }
    _rQshift(bytes) {
        let res = 0;
        for (let byte = bytes - 1; byte >= 0; byte--) res += this._rQ[this._rQi++] << (8 * byte);
        return res;
    }
    rQshiftStr(len) {
        void 0 === len && (len = this.rQlen);
        let str = '';
        for (let i = 0; i < len; i += 4096) {
            let part = this.rQshiftBytes(Math.min(4096, len - i));
            str += String.fromCharCode.apply(null, part);
        }
        return str;
    }
    rQshiftBytes(len) {
        return void 0 === len && (len = this.rQlen), (this._rQi += len), new Uint8Array(this._rQ.buffer, this._rQi - len, len);
    }
    rQshiftTo(target, len) {
        void 0 === len && (len = this.rQlen), target.set(new Uint8Array(this._rQ.buffer, this._rQi, len)), (this._rQi += len);
    }
    rQslice(start, end = this.rQlen) {
        return new Uint8Array(this._rQ.buffer, this._rQi + start, end - start);
    }
    rQwait(msg2, num, goback) {
        if (this.rQlen < num) {
            if (goback) {
                if (this._rQi < goback) throw new Error('rQwait cannot backup ' + goback + ' bytes');
                this._rQi -= goback;
            }
            return !0;
        }
        return !1;
    }
    flush() {
        this._sQlen > 0 && this._websocket.readyState === WebSocket.OPEN && (this._websocket.send(this._encodeMessage()), (this._sQlen = 0));
    }
    send(arr) {
        this._sQ.set(arr, this._sQlen), (this._sQlen += arr.length), this.flush();
    }
    sendString(str) {
        this.send(str.split('').map(chr => chr.charCodeAt(0)));
    }
    off(evt) {
        this._eventHandlers[evt] = () => {};
    }
    on(evt, handler) {
        this._eventHandlers[evt] = handler;
    }
    _allocateBuffers() {
        (this._rQ = new Uint8Array(this._rQbufferSize)), (this._sQ = new Uint8Array(this._sQbufferSize));
    }
    init() {
        this._allocateBuffers(), (this._rQi = 0), (this._websocket = null);
    }
    open(uri, protocols) {
        this.init(),
            (this._websocket = new WebSocket(uri, protocols)),
            (this._websocket.binaryType = 'arraybuffer'),
            (this._websocket.onmessage = this._recvMessage.bind(this)),
            (this._websocket.onopen = () => {
                Debug('>> WebSock.onopen'), this._websocket.protocol && Info('Server choose sub-protocol: ' + this._websocket.protocol), this._eventHandlers.open(), Debug('<< WebSock.onopen');
            }),
            (this._websocket.onclose = e2 => {
                Debug('>> WebSock.onclose'), this._eventHandlers.close(e2), Debug('<< WebSock.onclose');
            }),
            (this._websocket.onerror = e2 => {
                Debug('>> WebSock.onerror: ' + e2), this._eventHandlers.error(e2), Debug('<< WebSock.onerror: ' + e2);
            });
    }
    close() {
        this._websocket && ((this._websocket.readyState !== WebSocket.OPEN && this._websocket.readyState !== WebSocket.CONNECTING) || (Info('Closing WebSocket connection'), this._websocket.close()), (this._websocket.onmessage = () => {}));
    }
    _encodeMessage() {
        return new Uint8Array(this._sQ.buffer, 0, this._sQlen);
    }
    _expandCompactRQ(minFit) {
        const requiredBufferSize = 8 * (this._rQlen - this._rQi + minFit),
            resizeNeeded = this._rQbufferSize < requiredBufferSize;
        if ((resizeNeeded && (this._rQbufferSize = Math.max(2 * this._rQbufferSize, requiredBufferSize)), this._rQbufferSize > 41943040 && ((this._rQbufferSize = 41943040), this._rQbufferSize - this.rQlen < minFit))) throw new Error('Receive Queue buffer exceeded 41943040 bytes, and the new message could not fit');
        if (resizeNeeded) {
            const oldRQbuffer = this._rQ.buffer;
            (this._rQ = new Uint8Array(this._rQbufferSize)), this._rQ.set(new Uint8Array(oldRQbuffer, this._rQi, this._rQlen - this._rQi));
        } else this._rQ.set(new Uint8Array(this._rQ.buffer, this._rQi, this._rQlen - this._rQi));
        (this._rQlen = this._rQlen - this._rQi), (this._rQi = 0);
    }
    _DecodeMessage(data) {
        const u8 = new Uint8Array(data);
        u8.length > this._rQbufferSize - this._rQlen && this._expandCompactRQ(u8.length), this._rQ.set(u8, this._rQlen), (this._rQlen += u8.length);
    }
    _recvMessage(e2) {
        this._DecodeMessage(e2.data), this.rQlen > 0 ? (this._eventHandlers.message(), this._rQlen == this._rQi && ((this._rQlen = 0), (this._rQi = 0))) : Debug('Ignoring empty message');
    }
}

const PC2 = [13, 16, 10, 23, 0, 4, 2, 27, 14, 5, 20, 9, 22, 18, 11, 3, 25, 7, 15, 6, 26, 19, 12, 1, 40, 51, 30, 36, 46, 54, 29, 39, 50, 44, 32, 47, 43, 48, 38, 55, 33, 52, 45, 41, 49, 35, 28, 31],
    totrot = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

let a, b, c, d, e, f;

(a = 65536), (b = 1 << 24), (c = a | b), (d = 4), (e = 1024), (f = d | e);

const SP1 = [
    c | e,
    0,
    0 | a,
    c | f,
    c | d,
    a | f,
    0 | d,
    0 | a,
    0 | e,
    c | e,
    c | f,
    0 | e,
    b | f,
    c | d,
    0 | b,
    0 | d,
    0 | f,
    b | e,
    b | e,
    a | e,
    a | e,
    0 | c,
    0 | c,
    b | f,
    a | d,
    b | d,
    b | d,
    a | d,
    0,
    0 | f,
    a | f,
    0 | b,
    0 | a,
    c | f,
    0 | d,
    0 | c,
    c | e,
    0 | b,
    0 | b,
    0 | e,
    c | d,
    0 | a,
    a | e,
    b | d,
    0 | e,
    0 | d,
    b | f,
    a | f,
    c | f,
    a | d,
    0 | c,
    b | f,
    b | d,
    0 | f,
    a | f,
    c | e,
    0 | f,
    b | e,
    b | e,
    0,
    a | d,
    a | e,
    0,
    c | d,
];

(a = 1 << 20), (b = 1 << 31), (c = a | b), (d = 32), (e = 32768), (f = d | e);

const SP2 = [
    c | f,
    b | e,
    0 | e,
    a | f,
    0 | a,
    0 | d,
    c | d,
    b | f,
    b | d,
    c | f,
    c | e,
    0 | b,
    b | e,
    0 | a,
    0 | d,
    c | d,
    a | e,
    a | d,
    b | f,
    0,
    0 | b,
    0 | e,
    a | f,
    0 | c,
    a | d,
    b | d,
    0,
    a | e,
    0 | f,
    c | e,
    0 | c,
    0 | f,
    0,
    a | f,
    c | d,
    0 | a,
    b | f,
    0 | c,
    c | e,
    0 | e,
    0 | c,
    b | e,
    0 | d,
    c | f,
    a | f,
    0 | d,
    0 | e,
    0 | b,
    0 | f,
    c | e,
    0 | a,
    b | d,
    a | d,
    b | f,
    b | d,
    a | d,
    a | e,
    0,
    b | e,
    0 | f,
    0 | b,
    c | d,
    c | f,
    a | e,
];

(a = 1 << 17), (b = 1 << 27), (c = a | b), (d = 8), (e = 512), (f = d | e);

const SP3 = [
    0 | f,
    c | e,
    0,
    c | d,
    b | e,
    0,
    a | f,
    b | e,
    a | d,
    b | d,
    b | d,
    0 | a,
    c | f,
    a | d,
    0 | c,
    0 | f,
    0 | b,
    0 | d,
    c | e,
    0 | e,
    a | e,
    0 | c,
    c | d,
    a | f,
    b | f,
    a | e,
    0 | a,
    b | f,
    0 | d,
    c | f,
    0 | e,
    0 | b,
    c | e,
    0 | b,
    a | d,
    0 | f,
    0 | a,
    c | e,
    b | e,
    0,
    0 | e,
    a | d,
    c | f,
    b | e,
    b | d,
    0 | e,
    0,
    c | d,
    b | f,
    0 | a,
    0 | b,
    c | f,
    0 | d,
    a | f,
    a | e,
    b | d,
    0 | c,
    b | f,
    0 | f,
    0 | c,
    a | f,
    0 | d,
    c | d,
    a | e,
];

(a = 8192), (b = 1 << 23), (c = a | b), (d = 1), (e = 128), (f = d | e);

const SP4 = [
    c | d,
    a | f,
    a | f,
    0 | e,
    c | e,
    b | f,
    b | d,
    a | d,
    0,
    0 | c,
    0 | c,
    c | f,
    0 | f,
    0,
    b | e,
    b | d,
    0 | d,
    0 | a,
    0 | b,
    c | d,
    0 | e,
    0 | b,
    a | d,
    a | e,
    b | f,
    0 | d,
    a | e,
    b | e,
    0 | a,
    c | e,
    c | f,
    0 | f,
    b | e,
    b | d,
    0 | c,
    c | f,
    0 | f,
    0,
    0,
    0 | c,
    a | e,
    b | e,
    b | f,
    0 | d,
    c | d,
    a | f,
    a | f,
    0 | e,
    c | f,
    0 | f,
    0 | d,
    0 | a,
    b | d,
    a | d,
    c | e,
    b | f,
    a | d,
    a | e,
    0 | b,
    c | d,
    0 | e,
    0 | b,
    0 | a,
    c | e,
];

(a = 1 << 25), (b = 1 << 30), (c = a | b), (d = 256), (e = 1 << 19), (f = d | e);

const SP5 = [
    0 | d,
    a | f,
    a | e,
    c | d,
    0 | e,
    0 | d,
    0 | b,
    a | e,
    b | f,
    0 | e,
    a | d,
    b | f,
    c | d,
    c | e,
    0 | f,
    0 | b,
    0 | a,
    b | e,
    b | e,
    0,
    b | d,
    c | f,
    c | f,
    a | d,
    c | e,
    b | d,
    0,
    0 | c,
    a | f,
    0 | a,
    0 | c,
    0 | f,
    0 | e,
    c | d,
    0 | d,
    0 | a,
    0 | b,
    a | e,
    c | d,
    b | f,
    a | d,
    0 | b,
    c | e,
    a | f,
    b | f,
    0 | d,
    0 | a,
    c | e,
    c | f,
    0 | f,
    0 | c,
    c | f,
    a | e,
    0,
    b | e,
    0 | c,
    0 | f,
    a | d,
    b | d,
    0 | e,
    0,
    b | e,
    a | f,
    b | d,
];

(a = 1 << 22), (b = 1 << 29), (c = a | b), (d = 16), (e = 16384), (f = d | e);

const SP6 = [
    b | d,
    0 | c,
    0 | e,
    c | f,
    0 | c,
    0 | d,
    c | f,
    0 | a,
    b | e,
    a | f,
    0 | a,
    b | d,
    a | d,
    b | e,
    0 | b,
    0 | f,
    0,
    a | d,
    b | f,
    0 | e,
    a | e,
    b | f,
    0 | d,
    c | d,
    c | d,
    0,
    a | f,
    c | e,
    0 | f,
    a | e,
    c | e,
    0 | b,
    b | e,
    0 | d,
    c | d,
    a | e,
    c | f,
    0 | a,
    0 | f,
    b | d,
    0 | a,
    b | e,
    0 | b,
    0 | f,
    b | d,
    c | f,
    a | e,
    0 | c,
    a | f,
    c | e,
    0,
    c | d,
    0 | d,
    0 | e,
    0 | c,
    a | f,
    0 | e,
    a | d,
    b | f,
    0,
    c | e,
    0 | b,
    a | d,
    b | f,
];

(a = 1 << 21), (b = 1 << 26), (c = a | b), (d = 2), (e = 2048), (f = d | e);

const SP7 = [
    0 | a,
    c | d,
    b | f,
    0,
    0 | e,
    b | f,
    a | f,
    c | e,
    c | f,
    0 | a,
    0,
    b | d,
    0 | d,
    0 | b,
    c | d,
    0 | f,
    b | e,
    a | f,
    a | d,
    b | e,
    b | d,
    0 | c,
    c | e,
    a | d,
    0 | c,
    0 | e,
    0 | f,
    c | f,
    a | e,
    0 | d,
    0 | b,
    a | e,
    0 | b,
    a | e,
    0 | a,
    b | f,
    b | f,
    c | d,
    c | d,
    0 | d,
    a | d,
    0 | b,
    b | e,
    0 | a,
    c | e,
    0 | f,
    a | f,
    c | e,
    0 | f,
    b | d,
    c | f,
    0 | c,
    a | e,
    0,
    0 | d,
    c | f,
    0,
    a | f,
    0 | c,
    0 | e,
    b | d,
    b | e,
    0 | e,
    a | d,
];

(a = 1 << 18), (b = 1 << 28), (c = a | b), (d = 64), (e = 4096), (f = d | e);

const SP8 = [
    b | f,
    0 | e,
    0 | a,
    c | f,
    0 | b,
    b | f,
    0 | d,
    0 | b,
    a | d,
    0 | c,
    c | f,
    a | e,
    c | e,
    a | f,
    0 | e,
    0 | d,
    0 | c,
    b | d,
    b | e,
    0 | f,
    a | e,
    a | d,
    c | d,
    c | e,
    0 | f,
    0,
    0,
    c | d,
    b | d,
    b | e,
    a | f,
    0 | a,
    a | f,
    0 | a,
    c | e,
    0 | e,
    0 | d,
    c | d,
    0 | e,
    a | f,
    b | e,
    0 | d,
    b | d,
    0 | c,
    c | d,
    0 | b,
    0 | a,
    b | f,
    0,
    c | f,
    a | d,
    b | d,
    0 | c,
    b | e,
    b | f,
    0,
    c | f,
    a | e,
    a | e,
    0 | f,
    0 | f,
    a | d,
    0 | b,
    c | e,
];

class DES {
    constructor(password) {
        this.keys = [];
        const pc1m = [],
            pcr = [],
            kn = [];
        for (let j = 0, l = 56; j < 56; ++j, l -= 8) {
            l += l < -5 ? 65 : l < -3 ? 31 : l < -1 ? 63 : 27 === l ? 35 : 0;
            const m = 7 & l;
            pc1m[j] = password[l >>> 3] & (1 << m) ? 1 : 0;
        }
        for (let i = 0; i < 16; ++i) {
            const m = i << 1,
                n = m + 1;
            kn[m] = kn[n] = 0;
            for (let o = 28; o < 59; o += 28)
                for (let j = o - 28; j < o; ++j) {
                    const l = j + totrot[i];
                    pcr[j] = l < o ? pc1m[l] : pc1m[l - 28];
                }
            for (let j = 0; j < 24; ++j) 0 !== pcr[PC2[j]] && (kn[m] |= 1 << (23 - j)), 0 !== pcr[PC2[j + 24]] && (kn[n] |= 1 << (23 - j));
        }
        for (let i = 0, rawi = 0, KnLi = 0; i < 16; ++i) {
            const raw0 = kn[rawi++],
                raw1 = kn[rawi++];
            (this.keys[KnLi] = (16515072 & raw0) << 6), (this.keys[KnLi] |= (4032 & raw0) << 10), (this.keys[KnLi] |= (16515072 & raw1) >>> 10), (this.keys[KnLi] |= (4032 & raw1) >>> 6), ++KnLi, (this.keys[KnLi] = (258048 & raw0) << 12), (this.keys[KnLi] |= (63 & raw0) << 16), (this.keys[KnLi] |= (258048 & raw1) >>> 4), (this.keys[KnLi] |= 63 & raw1), ++KnLi;
        }
    }
    enc8(text) {
        const b2 = text.slice();
        let l,
            r,
            x,
            i = 0;
        (l = (b2[i++] << 24) | (b2[i++] << 16) | (b2[i++] << 8) | b2[i++]),
            (r = (b2[i++] << 24) | (b2[i++] << 16) | (b2[i++] << 8) | b2[i++]),
            (x = 252645135 & ((l >>> 4) ^ r)),
            (r ^= x),
            (l ^= x << 4),
            (x = 65535 & ((l >>> 16) ^ r)),
            (r ^= x),
            (l ^= x << 16),
            (x = 858993459 & ((r >>> 2) ^ l)),
            (l ^= x),
            (r ^= x << 2),
            (x = 16711935 & ((r >>> 8) ^ l)),
            (l ^= x),
            (r ^= x << 8),
            (r = (r << 1) | ((r >>> 31) & 1)),
            (x = 2863311530 & (l ^ r)),
            (l ^= x),
            (r ^= x),
            (l = (l << 1) | ((l >>> 31) & 1));
        for (let i2 = 0, keysi = 0; i2 < 8; ++i2) {
            (x = (r << 28) | (r >>> 4)), (x ^= this.keys[keysi++]);
            let fval = SP7[63 & x];
            (fval |= SP5[(x >>> 8) & 63]),
                (fval |= SP3[(x >>> 16) & 63]),
                (fval |= SP1[(x >>> 24) & 63]),
                (x = r ^ this.keys[keysi++]),
                (fval |= SP8[63 & x]),
                (fval |= SP6[(x >>> 8) & 63]),
                (fval |= SP4[(x >>> 16) & 63]),
                (fval |= SP2[(x >>> 24) & 63]),
                (l ^= fval),
                (x = (l << 28) | (l >>> 4)),
                (x ^= this.keys[keysi++]),
                (fval = SP7[63 & x]),
                (fval |= SP5[(x >>> 8) & 63]),
                (fval |= SP3[(x >>> 16) & 63]),
                (fval |= SP1[(x >>> 24) & 63]),
                (x = l ^ this.keys[keysi++]),
                (fval |= SP8[63 & x]),
                (fval |= SP6[(x >>> 8) & 63]),
                (fval |= SP4[(x >>> 16) & 63]),
                (fval |= SP2[(x >>> 24) & 63]),
                (r ^= fval);
        }
        for (r = (r << 31) | (r >>> 1), x = 2863311530 & (l ^ r), l ^= x, r ^= x, l = (l << 31) | (l >>> 1), x = 16711935 & ((l >>> 8) ^ r), r ^= x, l ^= x << 8, x = 858993459 & ((l >>> 2) ^ r), r ^= x, l ^= x << 2, x = 65535 & ((r >>> 16) ^ l), l ^= x, r ^= x << 16, x = 252645135 & ((r >>> 4) ^ l), l ^= x, r ^= x << 4, x = [r, l], i = 0; i < 8; i++)
            (b2[i] = (x[i >>> 2] >>> (8 * (3 - (i % 4)))) % 256), b2[i] < 0 && (b2[i] += 256);
        return b2;
    }
    encrypt(t) {
        return this.enc8(t.slice(0, 8)).concat(this.enc8(t.slice(8, 16)));
    }
}

const XtScancode = {
        Again: 57349,
        AltLeft: 56,
        AltRight: 57400,
        ArrowDown: 57424,
        ArrowLeft: 57419,
        ArrowRight: 57421,
        ArrowUp: 57416,
        AudioVolumeDown: 57390,
        AudioVolumeMute: 57376,
        AudioVolumeUp: 57392,
        Backquote: 41,
        Backslash: 43,
        Backspace: 14,
        BracketLeft: 26,
        BracketRight: 27,
        BrowserBack: 57450,
        BrowserFavorites: 57446,
        BrowserForward: 57449,
        BrowserHome: 57394,
        BrowserRefresh: 57447,
        BrowserSearch: 57445,
        BrowserStop: 57448,
        CapsLock: 58,
        Comma: 51,
        ContextMenu: 57437,
        ControlLeft: 29,
        ControlRight: 57373,
        Convert: 121,
        Copy: 57464,
        Cut: 57404,
        Delete: 57427,
        Digit0: 11,
        Digit1: 2,
        Digit2: 3,
        Digit3: 4,
        Digit4: 5,
        Digit5: 6,
        Digit6: 7,
        Digit7: 8,
        Digit8: 9,
        Digit9: 10,
        Eject: 57469,
        End: 57423,
        Enter: 28,
        Equal: 13,
        Escape: 1,
        F1: 59,
        F10: 68,
        F11: 87,
        F12: 88,
        F13: 93,
        F14: 94,
        F15: 95,
        F16: 85,
        F17: 57347,
        F18: 57463,
        F19: 57348,
        F2: 60,
        F20: 90,
        F21: 116,
        F22: 57465,
        F23: 109,
        F24: 111,
        F3: 61,
        F4: 62,
        F5: 63,
        F6: 64,
        F7: 65,
        F8: 66,
        F9: 67,
        Find: 57409,
        Help: 57461,
        Hiragana: 119,
        Home: 57415,
        Insert: 57426,
        IntlBackslash: 86,
        IntlRo: 115,
        IntlYen: 125,
        KanaMode: 112,
        Katakana: 120,
        KeyA: 30,
        KeyB: 48,
        KeyC: 46,
        KeyD: 32,
        KeyE: 18,
        KeyF: 33,
        KeyG: 34,
        KeyH: 35,
        KeyI: 23,
        KeyJ: 36,
        KeyK: 37,
        KeyL: 38,
        KeyM: 50,
        KeyN: 49,
        KeyO: 24,
        KeyP: 25,
        KeyQ: 16,
        KeyR: 19,
        KeyS: 31,
        KeyT: 20,
        KeyU: 22,
        KeyV: 47,
        KeyW: 17,
        KeyX: 45,
        KeyY: 21,
        KeyZ: 44,
        Lang3: 120,
        Lang4: 119,
        Lang5: 118,
        LaunchApp1: 57451,
        LaunchApp2: 57377,
        LaunchMail: 57452,
        MediaPlayPause: 57378,
        MediaSelect: 57453,
        MediaStop: 57380,
        MediaTrackNext: 57369,
        MediaTrackPrevious: 57360,
        MetaLeft: 57435,
        MetaRight: 57436,
        Minus: 12,
        NonConvert: 123,
        NumLock: 69,
        Numpad0: 82,
        Numpad1: 79,
        Numpad2: 80,
        Numpad3: 81,
        Numpad4: 75,
        Numpad5: 76,
        Numpad6: 77,
        Numpad7: 71,
        Numpad8: 72,
        Numpad9: 73,
        NumpadAdd: 78,
        NumpadComma: 126,
        NumpadDecimal: 83,
        NumpadDivide: 57397,
        NumpadEnter: 57372,
        NumpadEqual: 89,
        NumpadMultiply: 55,
        NumpadParenLeft: 57462,
        NumpadParenRight: 57467,
        NumpadSubtract: 74,
        Open: 100,
        PageDown: 57425,
        PageUp: 57417,
        Paste: 101,
        Pause: 57414,
        Period: 52,
        Power: 57438,
        PrintScreen: 84,
        Props: 57350,
        Quote: 40,
        ScrollLock: 70,
        Semicolon: 39,
        ShiftLeft: 42,
        ShiftRight: 54,
        Slash: 53,
        Sleep: 57439,
        Space: 57,
        Suspend: 57381,
        Tab: 15,
        Undo: 57351,
        WakeUp: 57443,
    },
    encodings_encodingRaw = 0,
    encodings_encodingCopyRect = 1,
    encodings_encodingRRE = 2,
    encodings_encodingHextile = 5,
    encodings_encodingTight = 7,
    encodings_encodingTightPNG = -260,
    encodings_pseudoEncodingQualityLevel0 = -32,
    encodings_pseudoEncodingDesktopSize = -223,
    encodings_pseudoEncodingLastRect = -224,
    encodings_pseudoEncodingCursor = -239,
    encodings_pseudoEncodingQEMUExtendedKeyEvent = -258,
    encodings_pseudoEncodingDesktopName = -307,
    encodings_pseudoEncodingExtendedDesktopSize = -308,
    encodings_pseudoEncodingXvp = -309,
    encodings_pseudoEncodingFence = -312,
    encodings_pseudoEncodingContinuousUpdates = -313,
    encodings_pseudoEncodingCompressLevel0 = -256,
    encodings_pseudoEncodingVMwareCursor = 1464686180,
    encodings_pseudoEncodingExtendedClipboard = 3231835598;

'function' != typeof Object.assign &&
    Object.defineProperty(Object, 'assign', {
        value: function (target, varArgs) {
            if (null == target) throw new TypeError('Cannot convert undefined or null to object');
            const to = Object(target);
            for (let index = 1; index < arguments.length; index++) {
                const nextSource = arguments[index];
                if (null != nextSource) for (let nextKey in nextSource) Object.prototype.hasOwnProperty.call(nextSource, nextKey) && (to[nextKey] = nextSource[nextKey]);
            }
            return to;
        },
        writable: !0,
        configurable: !0,
    }),
    (() => {
        function CustomEvent2(event, params) {
            params = params || {
                bubbles: !1,
                cancelable: !1,
                detail: void 0,
            };
            const evt = document.createEvent('CustomEvent');
            return evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail), evt;
        }
        (CustomEvent2.prototype = window.Event.prototype), 'function' != typeof window.CustomEvent && (window.CustomEvent = CustomEvent2);
    })(),
    (Number.isInteger =
        Number.isInteger ||
        function (value) {
            return 'number' == typeof value && isFinite(value) && Math.floor(value) === value;
        });

class RawDecoder {
    constructor() {
        this._lines = 0;
    }
    decodeRect(x, y, width, height, sock, display, depth) {
        0 === this._lines && (this._lines = height);
        const bytesPerLine = width * (8 == depth ? 1 : 4);
        if (sock.rQwait('RAW', bytesPerLine)) return !1;
        const curY = y + (height - this._lines),
            currHeight = Math.min(this._lines, Math.floor(sock.rQlen / bytesPerLine));
        let data = sock.rQ,
            index = sock.rQi;
        if (8 == depth) {
            const pixels = width * currHeight,
                newdata = new Uint8Array(4 * pixels);
            for (let i = 0; i < pixels; i++) (newdata[4 * i + 0] = (255 * (3 & data[index + i])) / 3), (newdata[4 * i + 1] = (255 * ((data[index + i] >> 2) & 3)) / 3), (newdata[4 * i + 2] = (255 * ((data[index + i] >> 4) & 3)) / 3), (newdata[4 * i + 4] = 0);
            (data = newdata), (index = 0);
        }
        return display.blitImage(x, curY, width, currHeight, data, index), sock.rQskipBytes(currHeight * bytesPerLine), (this._lines -= currHeight), !(this._lines > 0);
    }
}

class CopyRectDecoder {
    decodeRect(x, y, width, height, sock, display, depth) {
        if (sock.rQwait('COPYRECT', 4)) return !1;
        let deltaX = sock.rQshift16(),
            deltaY = sock.rQshift16();
        return display.copyImage(deltaX, deltaY, x, y, width, height), !0;
    }
}

class RREDecoder {
    constructor() {
        this._subrects = 0;
    }
    decodeRect(x, y, width, height, sock, display, depth) {
        if (0 === this._subrects) {
            if (sock.rQwait('RRE', 8)) return !1;
            this._subrects = sock.rQshift32();
            let color = sock.rQshiftBytes(4);
            display.fillRect(x, y, width, height, color);
        }
        for (; this._subrects > 0; ) {
            if (sock.rQwait('RRE', 12)) return !1;
            let color = sock.rQshiftBytes(4),
                sx = sock.rQshift16(),
                sy = sock.rQshift16(),
                swidth = sock.rQshift16(),
                sheight = sock.rQshift16();
            display.fillRect(x + sx, y + sy, swidth, sheight, color), this._subrects--;
        }
        return !0;
    }
}

class HextileDecoder {
    constructor() {
        (this._tiles = 0), (this._lastsubencoding = 0);
    }
    decodeRect(x, y, width, height, sock, display, depth) {
        for (0 === this._tiles && ((this._tilesX = Math.ceil(width / 16)), (this._tilesY = Math.ceil(height / 16)), (this._totalTiles = this._tilesX * this._tilesY), (this._tiles = this._totalTiles)); this._tiles > 0; ) {
            let bytes = 1;
            if (sock.rQwait('HEXTILE', bytes)) return !1;
            let rQ = sock.rQ,
                rQi = sock.rQi,
                subencoding = rQ[rQi];
            if (subencoding > 30) throw new Error('Illegal hextile subencoding (subencoding: ' + subencoding + ')');
            const currTile = this._totalTiles - this._tiles,
                tx = x + 16 * (currTile % this._tilesX),
                ty = y + 16 * Math.floor(currTile / this._tilesX),
                tw = Math.min(16, x + width - tx),
                th = Math.min(16, y + height - ty);
            if (1 & subencoding) bytes += tw * th * 4;
            else if ((2 & subencoding && (bytes += 4), 4 & subencoding && (bytes += 4), 8 & subencoding)) {
                if ((bytes++, sock.rQwait('HEXTILE', bytes))) return !1;
                let subrects = rQ[rQi + bytes - 1];
                bytes += 16 & subencoding ? 6 * subrects : 2 * subrects;
            }
            if (sock.rQwait('HEXTILE', bytes)) return !1;
            if ((rQi++, 0 === subencoding)) 1 & this._lastsubencoding ? Debug('     Ignoring blank after RAW') : display.fillRect(tx, ty, tw, th, this._background);
            else if (1 & subencoding) display.blitImage(tx, ty, tw, th, rQ, rQi), (rQi += bytes - 1);
            else {
                if ((2 & subencoding && ((this._background = [rQ[rQi], rQ[rQi + 1], rQ[rQi + 2], rQ[rQi + 3]]), (rQi += 4)), 4 & subencoding && ((this._foreground = [rQ[rQi], rQ[rQi + 1], rQ[rQi + 2], rQ[rQi + 3]]), (rQi += 4)), display.startTile(tx, ty, tw, th, this._background), 8 & subencoding)) {
                    let subrects = rQ[rQi];
                    rQi++;
                    for (let s = 0; s < subrects; s++) {
                        let color;
                        16 & subencoding ? ((color = [rQ[rQi], rQ[rQi + 1], rQ[rQi + 2], rQ[rQi + 3]]), (rQi += 4)) : (color = this._foreground);
                        const xy = rQ[rQi];
                        rQi++;
                        const sx = xy >> 4,
                            sy = 15 & xy,
                            wh = rQ[rQi];
                        rQi++;
                        const sw = 1 + (wh >> 4),
                            sh = 1 + (15 & wh);
                        display.subTile(sx, sy, sw, sh, color);
                    }
                }
                display.finishTile();
            }
            (sock.rQi = rQi), (this._lastsubencoding = subencoding), this._tiles--;
        }
        return !0;
    }
}

class TightDecoder {
    constructor() {
        (this._ctl = null), (this._filter = null), (this._numColors = 0), (this._palette = new Uint8Array(1024)), (this._len = 0), (this._zlibs = []);
        for (let i = 0; i < 4; i++) this._zlibs[i] = new Inflate();
    }
    decodeRect(x, y, width, height, sock, display, depth) {
        if (null === this._ctl) {
            if (sock.rQwait('TIGHT compression-control', 1)) return !1;
            this._ctl = sock.rQshift8();
            for (let i = 0; i < 4; i++) (this._ctl >> i) & 1 && (this._zlibs[i].reset(), Info('Reset zlib stream ' + i));
            this._ctl = this._ctl >> 4;
        }
        let ret;
        if (8 === this._ctl) ret = this._fillRect(x, y, width, height, sock, display, depth);
        else if (9 === this._ctl) ret = this._jpegRect(x, y, width, height, sock, display, depth);
        else if (10 === this._ctl) ret = this._pngRect(x, y, width, height, sock, display, depth);
        else {
            if (128 & this._ctl) throw new Error('Illegal tight compression received (ctl: ' + this._ctl + ')');
            ret = this._basicRect(this._ctl, x, y, width, height, sock, display, depth);
        }
        return ret && (this._ctl = null), ret;
    }
    _fillRect(x, y, width, height, sock, display, depth) {
        if (sock.rQwait('TIGHT', 3)) return !1;
        const rQi = sock.rQi,
            rQ = sock.rQ;
        return display.fillRect(x, y, width, height, [rQ[rQi + 2], rQ[rQi + 1], rQ[rQi]], !1), sock.rQskipBytes(3), !0;
    }
    _jpegRect(x, y, width, height, sock, display, depth) {
        let data = this._readData(sock);
        return null !== data && (display.imageRect(x, y, width, height, 'image/jpeg', data), !0);
    }
    _pngRect(x, y, width, height, sock, display, depth) {
        throw new Error('PNG received in standard Tight rect');
    }
    _basicRect(ctl, x, y, width, height, sock, display, depth) {
        if (null === this._filter)
            if (4 & ctl) {
                if (sock.rQwait('TIGHT', 1)) return !1;
                this._filter = sock.rQshift8();
            } else this._filter = 0;
        let ret,
            streamId = 3 & ctl;
        switch (this._filter) {
            case 0:
                ret = this._copyFilter(streamId, x, y, width, height, sock, display, depth);
                break;

            case 1:
                ret = this._paletteFilter(streamId, x, y, width, height, sock, display, depth);
                break;

            case 2:
                ret = this._gradientFilter(streamId, x, y, width, height, sock, display, depth);
                break;

            default:
                throw new Error('Illegal tight filter received (ctl: ' + this._filter + ')');
        }
        return ret && (this._filter = null), ret;
    }
    _copyFilter(streamId, x, y, width, height, sock, display, depth) {
        const uncompressedSize = width * height * 3;
        let data;
        if (uncompressedSize < 12) {
            if (sock.rQwait('TIGHT', uncompressedSize)) return !1;
            data = sock.rQshiftBytes(uncompressedSize);
        } else {
            if (((data = this._readData(sock)), null === data)) return !1;
            this._zlibs[streamId].setInput(data), (data = this._zlibs[streamId].inflate(uncompressedSize)), this._zlibs[streamId].setInput(null);
        }
        return display.blitRgbImage(x, y, width, height, data, 0, !1), !0;
    }
    _paletteFilter(streamId, x, y, width, height, sock, display, depth) {
        if (0 === this._numColors) {
            if (sock.rQwait('TIGHT palette', 1)) return !1;
            const numColors = sock.rQpeek8() + 1,
                paletteSize = 3 * numColors;
            if (sock.rQwait('TIGHT palette', 1 + paletteSize)) return !1;
            (this._numColors = numColors), sock.rQskipBytes(1), sock.rQshiftTo(this._palette, paletteSize);
        }
        const bpp = this._numColors <= 2 ? 1 : 8,
            uncompressedSize = Math.floor((width * bpp + 7) / 8) * height;
        let data;
        if (uncompressedSize < 12) {
            if (sock.rQwait('TIGHT', uncompressedSize)) return !1;
            data = sock.rQshiftBytes(uncompressedSize);
        } else {
            if (((data = this._readData(sock)), null === data)) return !1;
            this._zlibs[streamId].setInput(data), (data = this._zlibs[streamId].inflate(uncompressedSize)), this._zlibs[streamId].setInput(null);
        }
        return 2 == this._numColors ? this._monoRect(x, y, width, height, data, this._palette, display) : this._paletteRect(x, y, width, height, data, this._palette, display), (this._numColors = 0), !0;
    }
    _monoRect(x, y, width, height, data, palette, display) {
        const dest = this._getScratchBuffer(width * height * 4),
            w = Math.floor((width + 7) / 8),
            w1 = Math.floor(width / 8);
        for (let y2 = 0; y2 < height; y2++) {
            let dp, sp, x2;
            for (x2 = 0; x2 < w1; x2++) for (let b2 = 7; b2 >= 0; b2--) (dp = 4 * (y2 * width + 8 * x2 + 7 - b2)), (sp = 3 * ((data[y2 * w + x2] >> b2) & 1)), (dest[dp] = palette[sp]), (dest[dp + 1] = palette[sp + 1]), (dest[dp + 2] = palette[sp + 2]), (dest[dp + 3] = 255);
            for (let b2 = 7; b2 >= 8 - (width % 8); b2--) (dp = 4 * (y2 * width + 8 * x2 + 7 - b2)), (sp = 3 * ((data[y2 * w + x2] >> b2) & 1)), (dest[dp] = palette[sp]), (dest[dp + 1] = palette[sp + 1]), (dest[dp + 2] = palette[sp + 2]), (dest[dp + 3] = 255);
        }
        display.blitRgbxImage(x, y, width, height, dest, 0, !1);
    }
    _paletteRect(x, y, width, height, data, palette, display) {
        const dest = this._getScratchBuffer(width * height * 4),
            total = width * height * 4;
        for (let i = 0, j = 0; i < total; i += 4, j++) {
            const sp = 3 * data[j];
            (dest[i] = palette[sp]), (dest[i + 1] = palette[sp + 1]), (dest[i + 2] = palette[sp + 2]), (dest[i + 3] = 255);
        }
        display.blitRgbxImage(x, y, width, height, dest, 0, !1);
    }
    _gradientFilter(streamId, x, y, width, height, sock, display, depth) {
        throw new Error('Gradient filter not implemented');
    }
    _readData(sock) {
        if (0 === this._len) {
            if (sock.rQwait('TIGHT', 3)) return null;
            let byte;
            (byte = sock.rQshift8()), (this._len = 127 & byte), 128 & byte && ((byte = sock.rQshift8()), (this._len |= (127 & byte) << 7), 128 & byte && ((byte = sock.rQshift8()), (this._len |= byte << 14)));
        }
        if (sock.rQwait('TIGHT', this._len)) return null;
        let data = sock.rQshiftBytes(this._len);
        return (this._len = 0), data;
    }
    _getScratchBuffer(size) {
        return (!this._scratchBuffer || this._scratchBuffer.length < size) && (this._scratchBuffer = new Uint8Array(size)), this._scratchBuffer;
    }
}

class TightPNGDecoder extends TightDecoder {
    _pngRect(x, y, width, height, sock, display, depth) {
        let data = this._readData(sock);
        return null !== data && (display.imageRect(x, y, width, height, 'image/png', data), !0);
    }
    _basicRect(ctl, x, y, width, height, sock, display, depth) {
        throw new Error('BasicCompression received in TightPNG rect');
    }
}

class RFB extends EventTargetMixin {
    constructor(target, url, options) {
        if (!target) throw new Error('Must specify target');
        if (!url) throw new Error('Must specify URL');
        super(),
            (this._target = target),
            (this._url = url),
            (options = options || {}),
            (this._rfbCredentials = options.credentials || {}),
            (this._shared = !('shared' in options) || !!options.shared),
            (this._repeaterID = options.repeaterID || ''),
            (this._wsProtocols = options.wsProtocols || []),
            (this._rfbConnectionState = ''),
            (this._rfbInitState = ''),
            (this._rfbAuthScheme = -1),
            (this._rfbCleanDisconnect = !0),
            (this._rfbVersion = 0),
            (this._rfbMaxVersion = 3.8),
            (this._rfbTightVNC = !1),
            (this._rfbVeNCryptState = 0),
            (this._rfbXvpVer = 0),
            (this._fbWidth = 0),
            (this._fbHeight = 0),
            (this._fbName = ''),
            (this._capabilities = {
                power: !1,
            }),
            (this._supportsFence = !1),
            (this._supportsContinuousUpdates = !1),
            (this._enabledContinuousUpdates = !1),
            (this._supportsSetDesktopSize = !1),
            (this._screenID = 0),
            (this._screenFlags = 0),
            (this._qemuExtKeyEventSupported = !1),
            (this._clipboardText = null),
            (this._clipboardServerCapabilitiesActions = {}),
            (this._clipboardServerCapabilitiesFormats = {}),
            (this._sock = null),
            (this._display = null),
            (this._flushing = !1),
            (this._keyboard = null),
            (this._gestures = null),
            (this._disconnTimer = null),
            (this._resizeTimeout = null),
            (this._mouseMoveTimer = null),
            (this._decoders = {}),
            (this._FBU = {
                rects: 0,
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                encoding: null,
            }),
            (this._mousePos = {}),
            (this._mouseButtonMask = 0),
            (this._mouseLastMoveTime = 0),
            (this._viewportDragging = !1),
            (this._viewportDragPos = {}),
            (this._viewportHasMoved = !1),
            (this._accumulatedWheelDeltaX = 0),
            (this._accumulatedWheelDeltaY = 0),
            (this._gestureLastTapTime = null),
            (this._gestureFirstDoubleTapEv = null),
            (this._gestureLastMagnitudeX = 0),
            (this._gestureLastMagnitudeY = 0),
            (this._eventHandlers = {
                focusCanvas: this._focusCanvas.bind(this),
                windowResize: this._windowResize.bind(this),
                handleMouse: this._handleMouse.bind(this),
                handleWheel: this._handleWheel.bind(this),
                handleGesture: this._handleGesture.bind(this),
            }),
            Debug('>> RFB.constructor'),
            (this._screen = document.createElement('div')),
            (this._screen.style.display = 'flex'),
            (this._screen.style.width = '100%'),
            (this._screen.style.height = '100%'),
            (this._screen.style.overflow = 'auto'),
            (this._screen.style.background = 'rgb(40, 40, 40)'),
            (this._canvas = document.createElement('canvas')),
            (this._canvas.style.margin = 'auto'),
            (this._canvas.style.outline = 'none'),
            (this._canvas.style.flexShrink = '0'),
            (this._canvas.width = 0),
            (this._canvas.height = 0),
            (this._canvas.tabIndex = -1),
            this._screen.appendChild(this._canvas),
            (this._cursor = new Cursor()),
            (this._cursorImage = RFB.cursors.none),
            (this._decoders[encodings_encodingRaw] = new RawDecoder()),
            (this._decoders[encodings_encodingCopyRect] = new CopyRectDecoder()),
            (this._decoders[encodings_encodingRRE] = new RREDecoder()),
            (this._decoders[encodings_encodingHextile] = new HextileDecoder()),
            (this._decoders[encodings_encodingTight] = new TightDecoder()),
            (this._decoders[encodings_encodingTightPNG] = new TightPNGDecoder());
        try {
            this._display = new Display(this._canvas);
        } catch (exc) {
            throw (Error$1('Display exception: ' + exc), exc);
        }
        (this._display.onflush = this._onFlush.bind(this)),
            (this._keyboard = new Keyboard(this._canvas)),
            (this._keyboard.onkeyevent = this._handleKeyEvent.bind(this)),
            (this._gestures = new GestureHandler()),
            (this._sock = new Websock()),
            this._sock.on('message', () => {
                this._handleMessage();
            }),
            this._sock.on('open', () => {
                'connecting' === this._rfbConnectionState && '' === this._rfbInitState ? ((this._rfbInitState = 'ProtocolVersion'), Debug('Starting VNC handshake')) : this._fail('Unexpected server connection while ' + this._rfbConnectionState);
            }),
            this._sock.on('close', e2 => {
                Debug('WebSocket on-close event');
                let msg2 = '';
                switch ((e2.code && ((msg2 = '(code: ' + e2.code), e2.reason && (msg2 += ', reason: ' + e2.reason), (msg2 += ')')), this._rfbConnectionState)) {
                    case 'connecting':
                        this._fail('Connection closed ' + msg2);
                        break;

                    case 'connected':
                        this._updateConnectionState('disconnecting'), this._updateConnectionState('disconnected');
                        break;

                    case 'disconnecting':
                        this._updateConnectionState('disconnected');
                        break;

                    case 'disconnected':
                        this._fail('Unexpected server disconnect when already disconnected ' + msg2);
                        break;

                    default:
                        this._fail('Unexpected server disconnect before connecting ' + msg2);
                }
                this._sock.off('close');
            }),
            this._sock.on('error', e2 => Warn('WebSocket on-error event')),
            setTimeout(this._updateConnectionState.bind(this, 'connecting')),
            Debug('<< RFB.constructor'),
            (this.dragViewport = !1),
            (this.focusOnClick = !0),
            (this._viewOnly = !1),
            (this._clipViewport = !1),
            (this._scaleViewport = !1),
            (this._resizeSession = !1),
            (this._showDotCursor = !1),
            void 0 !== options.showDotCursor && (Warn('Specifying showDotCursor as a RFB constructor argument is deprecated'), (this._showDotCursor = options.showDotCursor)),
            (this._qualityLevel = 6),
            (this._compressionLevel = 2);
    }
    get viewOnly() {
        return this._viewOnly;
    }
    set viewOnly(viewOnly) {
        (this._viewOnly = viewOnly), ('connecting' !== this._rfbConnectionState && 'connected' !== this._rfbConnectionState) || (viewOnly ? this._keyboard.ungrab() : this._keyboard.grab());
    }
    get capabilities() {
        return this._capabilities;
    }
    get touchButton() {
        return 0;
    }
    set touchButton(button) {
        Warn('Using old API!');
    }
    get clipViewport() {
        return this._clipViewport;
    }
    set clipViewport(viewport) {
        (this._clipViewport = viewport), this._updateClip();
    }
    get scaleViewport() {
        return this._scaleViewport;
    }
    set scaleViewport(scale) {
        (this._scaleViewport = scale), scale && this._clipViewport && this._updateClip(), this._updateScale(), !scale && this._clipViewport && this._updateClip();
    }
    get resizeSession() {
        return this._resizeSession;
    }
    set resizeSession(resize) {
        (this._resizeSession = resize), resize && this._requestRemoteResize();
    }
    get showDotCursor() {
        return this._showDotCursor;
    }
    set showDotCursor(show) {
        (this._showDotCursor = show), this._refreshCursor();
    }
    get background() {
        return this._screen.style.background;
    }
    set background(cssValue) {
        this._screen.style.background = cssValue;
    }
    get qualityLevel() {
        return this._qualityLevel;
    }
    set qualityLevel(qualityLevel) {
        !Number.isInteger(qualityLevel) || qualityLevel < 0 || qualityLevel > 9 ? Error$1('qualityLevel must be an integer between 0 and 9') : this._qualityLevel !== qualityLevel && ((this._qualityLevel = qualityLevel), 'connected' === this._rfbConnectionState && this._sendEncodings());
    }
    get compressionLevel() {
        return this._compressionLevel;
    }
    set compressionLevel(compressionLevel) {
        !Number.isInteger(compressionLevel) || compressionLevel < 0 || compressionLevel > 9 ? Error$1('compressionLevel must be an integer between 0 and 9') : this._compressionLevel !== compressionLevel && ((this._compressionLevel = compressionLevel), 'connected' === this._rfbConnectionState && this._sendEncodings());
    }
    disconnect() {
        this._updateConnectionState('disconnecting'), this._sock.off('error'), this._sock.off('message'), this._sock.off('open');
    }
    sendCredentials(creds) {
        (this._rfbCredentials = creds), setTimeout(this._initMsg.bind(this), 0);
    }
    sendCtrlAltDel() {
        'connected' !== this._rfbConnectionState ||
            this._viewOnly ||
            (Info('Sending Ctrl-Alt-Del'), this.sendKey(KeyTable_XK_Control_L, 'ControlLeft', !0), this.sendKey(KeyTable_XK_Alt_L, 'AltLeft', !0), this.sendKey(KeyTable_XK_Delete, 'Delete', !0), this.sendKey(KeyTable_XK_Delete, 'Delete', !1), this.sendKey(KeyTable_XK_Alt_L, 'AltLeft', !1), this.sendKey(KeyTable_XK_Control_L, 'ControlLeft', !1));
    }
    machineShutdown() {
        this._xvpOp(1, 2);
    }
    machineReboot() {
        this._xvpOp(1, 3);
    }
    machineReset() {
        this._xvpOp(1, 4);
    }
    sendKey(keysym, code, down) {
        if ('connected' !== this._rfbConnectionState || this._viewOnly) return;
        if (void 0 === down) return this.sendKey(keysym, code, !0), void this.sendKey(keysym, code, !1);
        const scancode = XtScancode[code];
        if (this._qemuExtKeyEventSupported && scancode) Info('Sending key (' + (down ? 'down' : 'up') + '): keysym ' + (keysym = keysym || 0) + ', scancode ' + scancode), RFB.messages.QEMUExtendedKeyEvent(this._sock, keysym, down, scancode);
        else {
            if (!keysym) return;
            Info('Sending keysym (' + (down ? 'down' : 'up') + '): ' + keysym), RFB.messages.keyEvent(this._sock, keysym, down ? 1 : 0);
        }
    }
    focus() {
        this._canvas.focus();
    }
    blur() {
        this._canvas.blur();
    }
    clipboardPasteFrom(text) {
        if ('connected' === this._rfbConnectionState && !this._viewOnly)
            if (this._clipboardServerCapabilitiesFormats[1] && this._clipboardServerCapabilitiesActions[134217728]) (this._clipboardText = text), RFB.messages.extendedClipboardNotify(this._sock, [1]);
            else {
                let data = new Uint8Array(text.length);
                for (let i = 0; i < text.length; i++) data[i] = text.charCodeAt(i);
                RFB.messages.clientCutText(this._sock, data);
            }
    }
    _connect() {
        Debug('>> RFB.connect'), Info('connecting to ' + this._url);
        try {
            this._sock.open(this._url, this._wsProtocols);
        } catch (e2) {
            'SyntaxError' === e2.name ? this._fail('Invalid host or port (' + e2 + ')') : this._fail('Error when opening socket (' + e2 + ')');
        }
        this._target.appendChild(this._screen),
            this._gestures.attach(this._canvas),
            this._cursor.attach(this._canvas),
            this._refreshCursor(),
            window.addEventListener('resize', this._eventHandlers.windowResize),
            this._canvas.addEventListener('mousedown', this._eventHandlers.focusCanvas),
            this._canvas.addEventListener('touchstart', this._eventHandlers.focusCanvas),
            this._canvas.addEventListener('mousedown', this._eventHandlers.handleMouse),
            this._canvas.addEventListener('mouseup', this._eventHandlers.handleMouse),
            this._canvas.addEventListener('mousemove', this._eventHandlers.handleMouse),
            this._canvas.addEventListener('click', this._eventHandlers.handleMouse),
            this._canvas.addEventListener('contextmenu', this._eventHandlers.handleMouse),
            this._canvas.addEventListener('wheel', this._eventHandlers.handleWheel),
            this._canvas.addEventListener('gesturestart', this._eventHandlers.handleGesture),
            this._canvas.addEventListener('gesturemove', this._eventHandlers.handleGesture),
            this._canvas.addEventListener('gestureend', this._eventHandlers.handleGesture),
            Debug('<< RFB.connect');
    }
    _disconnect() {
        Debug('>> RFB.disconnect'),
            this._cursor.detach(),
            this._canvas.removeEventListener('gesturestart', this._eventHandlers.handleGesture),
            this._canvas.removeEventListener('gesturemove', this._eventHandlers.handleGesture),
            this._canvas.removeEventListener('gestureend', this._eventHandlers.handleGesture),
            this._canvas.removeEventListener('wheel', this._eventHandlers.handleWheel),
            this._canvas.removeEventListener('mousedown', this._eventHandlers.handleMouse),
            this._canvas.removeEventListener('mouseup', this._eventHandlers.handleMouse),
            this._canvas.removeEventListener('mousemove', this._eventHandlers.handleMouse),
            this._canvas.removeEventListener('click', this._eventHandlers.handleMouse),
            this._canvas.removeEventListener('contextmenu', this._eventHandlers.handleMouse),
            this._canvas.removeEventListener('mousedown', this._eventHandlers.focusCanvas),
            this._canvas.removeEventListener('touchstart', this._eventHandlers.focusCanvas),
            window.removeEventListener('resize', this._eventHandlers.windowResize),
            this._keyboard.ungrab(),
            this._gestures.detach(),
            this._sock.close();
        try {
            this._target.removeChild(this._screen);
        } catch (e2) {
            if ('NotFoundError' !== e2.name) throw e2;
        }
        clearTimeout(this._resizeTimeout), clearTimeout(this._mouseMoveTimer), Debug('<< RFB.disconnect');
    }
    _focusCanvas(event) {
        this.focusOnClick && this.focus();
    }
    _setDesktopName(name) {
        (this._fbName = name),
            this.dispatchEvent(
                new CustomEvent('desktopname', {
                    detail: {
                        name: this._fbName,
                    },
                }),
            );
    }
    _windowResize(event) {
        window.requestAnimationFrame(() => {
            this._updateClip(), this._updateScale();
        }),
            this._resizeSession && (clearTimeout(this._resizeTimeout), (this._resizeTimeout = setTimeout(this._requestRemoteResize.bind(this), 500)));
    }
    _updateClip() {
        const curClip = this._display.clipViewport;
        let newClip = this._clipViewport;
        if ((this._scaleViewport && (newClip = !1), curClip !== newClip && (this._display.clipViewport = newClip), newClip)) {
            const size = this._screenSize();
            this._display.viewportChangeSize(size.w, size.h), this._fixScrollbars();
        }
    }
    _updateScale() {
        if (this._scaleViewport) {
            const size = this._screenSize();
            this._display.autoscale(size.w, size.h);
        } else this._display.scale = 1;
        this._fixScrollbars();
    }
    _requestRemoteResize() {
        if ((clearTimeout(this._resizeTimeout), (this._resizeTimeout = null), !this._resizeSession || this._viewOnly || !this._supportsSetDesktopSize)) return;
        const size = this._screenSize();
        RFB.messages.setDesktopSize(this._sock, Math.floor(size.w), Math.floor(size.h), this._screenID, this._screenFlags), Debug('Requested new desktop size: ' + size.w + 'x' + size.h);
    }
    _screenSize() {
        let r = this._screen.getBoundingClientRect();
        return {
            w: r.width,
            h: r.height,
        };
    }
    _fixScrollbars() {
        const orig = this._screen.style.overflow;
        (this._screen.style.overflow = 'hidden'), this._screen.getBoundingClientRect(), (this._screen.style.overflow = orig);
    }
    _updateConnectionState(state) {
        const oldstate = this._rfbConnectionState;
        if (state !== oldstate)
            if ('disconnected' !== oldstate) {
                switch (state) {
                    case 'connected':
                        if ('connecting' !== oldstate) return void Error$1('Bad transition to connected state, previous connection state: ' + oldstate);
                        break;

                    case 'disconnected':
                        if ('disconnecting' !== oldstate) return void Error$1('Bad transition to disconnected state, previous connection state: ' + oldstate);
                        break;

                    case 'connecting':
                        if ('' !== oldstate) return void Error$1('Bad transition to connecting state, previous connection state: ' + oldstate);
                        break;

                    case 'disconnecting':
                        if ('connected' !== oldstate && 'connecting' !== oldstate) return void Error$1('Bad transition to disconnecting state, previous connection state: ' + oldstate);
                        break;

                    default:
                        return void Error$1('Unknown connection state: ' + state);
                }
                switch (((this._rfbConnectionState = state), Debug("New state '" + state + "', was '" + oldstate + "'."), this._disconnTimer && 'disconnecting' !== state && (Debug('Clearing disconnect timer'), clearTimeout(this._disconnTimer), (this._disconnTimer = null), this._sock.off('close')), state)) {
                    case 'connecting':
                        this._connect();
                        break;

                    case 'connected':
                        this.dispatchEvent(
                            new CustomEvent('connect', {
                                detail: {},
                            }),
                        );
                        break;

                    case 'disconnecting':
                        this._disconnect(),
                            (this._disconnTimer = setTimeout(() => {
                                Error$1('Disconnection timed out.'), this._updateConnectionState('disconnected');
                            }, 3e3));
                        break;

                    case 'disconnected':
                        this.dispatchEvent(
                            new CustomEvent('disconnect', {
                                detail: {
                                    clean: this._rfbCleanDisconnect,
                                },
                            }),
                        );
                }
            } else Error$1('Tried changing state of a disconnected RFB object');
        else Debug("Already in state '" + state + "', ignoring");
    }
    _fail(details) {
        switch (this._rfbConnectionState) {
            case 'disconnecting':
                Error$1('Failed when disconnecting: ' + details);
                break;

            case 'connected':
                Error$1('Failed while connected: ' + details);
                break;

            case 'connecting':
                Error$1('Failed when connecting: ' + details);
                break;

            default:
                Error$1('RFB failure: ' + details);
        }
        return (this._rfbCleanDisconnect = !1), this._updateConnectionState('disconnecting'), this._updateConnectionState('disconnected'), !1;
    }
    _setCapability(cap, val) {
        (this._capabilities[cap] = val),
            this.dispatchEvent(
                new CustomEvent('capabilities', {
                    detail: {
                        capabilities: this._capabilities,
                    },
                }),
            );
    }
    _handleMessage() {
        if (0 !== this._sock.rQlen)
            switch (this._rfbConnectionState) {
                case 'disconnected':
                    Error$1('Got data while disconnected');
                    break;

                case 'connected':
                    for (; !this._flushing && this._normalMsg() && 0 !== this._sock.rQlen; );
                    break;

                default:
                    this._initMsg();
            }
        else Warn('handleMessage called on an empty receive queue');
    }
    _handleKeyEvent(keysym, code, down) {
        this.sendKey(keysym, code, down);
    }
    _handleMouse(ev) {
        if ('click' === ev.type && ev.target !== this._canvas) return;
        if ((ev.stopPropagation(), ev.preventDefault(), 'click' === ev.type || 'contextmenu' === ev.type)) return;
        let pos = clientToElement(ev.clientX, ev.clientY, this._canvas);
        switch (ev.type) {
            case 'mousedown':
                !(function (target) {
                    if (target.setCapture) target.setCapture(), (document.captureElement = target), target.addEventListener('mouseup', releaseCapture);
                    else {
                        releaseCapture();
                        let proxyElem = document.getElementById('noVNC_mouse_capture_elem');
                        null === proxyElem &&
                            ((proxyElem = document.createElement('div')),
                            (proxyElem.id = 'noVNC_mouse_capture_elem'),
                            (proxyElem.style.position = 'fixed'),
                            (proxyElem.style.top = '0px'),
                            (proxyElem.style.left = '0px'),
                            (proxyElem.style.width = '100%'),
                            (proxyElem.style.height = '100%'),
                            (proxyElem.style.zIndex = 1e4),
                            (proxyElem.style.display = 'none'),
                            document.body.appendChild(proxyElem),
                            proxyElem.addEventListener('contextmenu', _captureProxy),
                            proxyElem.addEventListener('mousemove', _captureProxy),
                            proxyElem.addEventListener('mouseup', _captureProxy)),
                            (document.captureElement = target),
                            _captureObserver.observe(target, {
                                attributes: !0,
                            }),
                            _capturedElemChanged(),
                            (proxyElem.style.display = ''),
                            window.addEventListener('mousemove', _captureProxy),
                            window.addEventListener('mouseup', _captureProxy);
                    }
                })(this._canvas),
                    this._handleMouseButton(pos.x, pos.y, !0, 1 << ev.button);
                break;

            case 'mouseup':
                this._handleMouseButton(pos.x, pos.y, !1, 1 << ev.button);
                break;

            case 'mousemove':
                this._handleMouseMove(pos.x, pos.y);
        }
    }
    _handleMouseButton(x, y, down, bmask) {
        if (this.dragViewport) {
            if (down && !this._viewportDragging)
                return (
                    (this._viewportDragging = !0),
                    (this._viewportDragPos = {
                        x: x,
                        y: y,
                    }),
                    void (this._viewportHasMoved = !1)
                );
            if (((this._viewportDragging = !1), this._viewportHasMoved)) return;
            this._sendMouse(x, y, bmask);
        }
        null !== this._mouseMoveTimer && (clearTimeout(this._mouseMoveTimer), (this._mouseMoveTimer = null), this._sendMouse(x, y, this._mouseButtonMask)), down ? (this._mouseButtonMask |= bmask) : (this._mouseButtonMask &= ~bmask), this._sendMouse(x, y, this._mouseButtonMask);
    }
    _handleMouseMove(x, y) {
        if (this._viewportDragging) {
            const deltaX = this._viewportDragPos.x - x,
                deltaY = this._viewportDragPos.y - y;
            (this._viewportHasMoved || Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) &&
                ((this._viewportHasMoved = !0),
                (this._viewportDragPos = {
                    x: x,
                    y: y,
                }),
                this._display.viewportChangePos(deltaX, deltaY));
        } else if (
            ((this._mousePos = {
                x: x,
                y: y,
            }),
            null == this._mouseMoveTimer)
        ) {
            const timeSinceLastMove = Date.now() - this._mouseLastMoveTime;
            timeSinceLastMove > 17
                ? (this._sendMouse(x, y, this._mouseButtonMask), (this._mouseLastMoveTime = Date.now()))
                : (this._mouseMoveTimer = setTimeout(() => {
                      this._handleDelayedMouseMove();
                  }, 17 - timeSinceLastMove));
        }
    }
    _handleDelayedMouseMove() {
        (this._mouseMoveTimer = null), this._sendMouse(this._mousePos.x, this._mousePos.y, this._mouseButtonMask), (this._mouseLastMoveTime = Date.now());
    }
    _sendMouse(x, y, mask) {
        'connected' === this._rfbConnectionState && (this._viewOnly || RFB.messages.pointerEvent(this._sock, this._display.absX(x), this._display.absY(y), mask));
    }
    _handleWheel(ev) {
        if ('connected' !== this._rfbConnectionState) return;
        if (this._viewOnly) return;
        ev.stopPropagation(), ev.preventDefault();
        let pos = clientToElement(ev.clientX, ev.clientY, this._canvas),
            dX = ev.deltaX,
            dY = ev.deltaY;
        0 !== ev.deltaMode && ((dX *= 19), (dY *= 19)),
            (this._accumulatedWheelDeltaX += dX),
            (this._accumulatedWheelDeltaY += dY),
            Math.abs(this._accumulatedWheelDeltaX) >= 50 && (this._accumulatedWheelDeltaX < 0 ? (this._handleMouseButton(pos.x, pos.y, !0, 32), this._handleMouseButton(pos.x, pos.y, !1, 32)) : this._accumulatedWheelDeltaX > 0 && (this._handleMouseButton(pos.x, pos.y, !0, 64), this._handleMouseButton(pos.x, pos.y, !1, 64)), (this._accumulatedWheelDeltaX = 0)),
            Math.abs(this._accumulatedWheelDeltaY) >= 50 && (this._accumulatedWheelDeltaY < 0 ? (this._handleMouseButton(pos.x, pos.y, !0, 8), this._handleMouseButton(pos.x, pos.y, !1, 8)) : this._accumulatedWheelDeltaY > 0 && (this._handleMouseButton(pos.x, pos.y, !0, 16), this._handleMouseButton(pos.x, pos.y, !1, 16)), (this._accumulatedWheelDeltaY = 0));
    }
    _fakeMouseMove(ev, elementX, elementY) {
        this._handleMouseMove(elementX, elementY), this._cursor.move(ev.detail.clientX, ev.detail.clientY);
    }
    _handleTapEvent(ev, bmask) {
        let pos = clientToElement(ev.detail.clientX, ev.detail.clientY, this._canvas);
        if (null !== this._gestureLastTapTime && Date.now() - this._gestureLastTapTime < 1e3 && this._gestureFirstDoubleTapEv.detail.type === ev.detail.type) {
            let dx = this._gestureFirstDoubleTapEv.detail.clientX - ev.detail.clientX,
                dy = this._gestureFirstDoubleTapEv.detail.clientY - ev.detail.clientY;
            Math.hypot(dx, dy) < 50 ? (pos = clientToElement(this._gestureFirstDoubleTapEv.detail.clientX, this._gestureFirstDoubleTapEv.detail.clientY, this._canvas)) : (this._gestureFirstDoubleTapEv = ev);
        } else this._gestureFirstDoubleTapEv = ev;
        (this._gestureLastTapTime = Date.now()), this._fakeMouseMove(this._gestureFirstDoubleTapEv, pos.x, pos.y), this._handleMouseButton(pos.x, pos.y, !0, bmask), this._handleMouseButton(pos.x, pos.y, !1, bmask);
    }
    _handleGesture(ev) {
        let magnitude,
            pos = clientToElement(ev.detail.clientX, ev.detail.clientY, this._canvas);
        switch (ev.type) {
            case 'gesturestart':
                switch (ev.detail.type) {
                    case 'onetap':
                        this._handleTapEvent(ev, 1);
                        break;

                    case 'twotap':
                        this._handleTapEvent(ev, 4);
                        break;

                    case 'threetap':
                        this._handleTapEvent(ev, 2);
                        break;

                    case 'drag':
                        this._fakeMouseMove(ev, pos.x, pos.y), this._handleMouseButton(pos.x, pos.y, !0, 1);
                        break;

                    case 'longpress':
                        this._fakeMouseMove(ev, pos.x, pos.y), this._handleMouseButton(pos.x, pos.y, !0, 4);
                        break;

                    case 'twodrag':
                        (this._gestureLastMagnitudeX = ev.detail.magnitudeX), (this._gestureLastMagnitudeY = ev.detail.magnitudeY), this._fakeMouseMove(ev, pos.x, pos.y);
                        break;

                    case 'pinch':
                        (this._gestureLastMagnitudeX = Math.hypot(ev.detail.magnitudeX, ev.detail.magnitudeY)), this._fakeMouseMove(ev, pos.x, pos.y);
                }
                break;

            case 'gesturemove':
                switch (ev.detail.type) {
                    case 'onetap':
                    case 'twotap':
                    case 'threetap':
                        break;

                    case 'drag':
                    case 'longpress':
                        this._fakeMouseMove(ev, pos.x, pos.y);
                        break;

                    case 'twodrag':
                        for (this._fakeMouseMove(ev, pos.x, pos.y); ev.detail.magnitudeY - this._gestureLastMagnitudeY > 50; ) this._handleMouseButton(pos.x, pos.y, !0, 8), this._handleMouseButton(pos.x, pos.y, !1, 8), (this._gestureLastMagnitudeY += 50);
                        for (; ev.detail.magnitudeY - this._gestureLastMagnitudeY < -50; ) this._handleMouseButton(pos.x, pos.y, !0, 16), this._handleMouseButton(pos.x, pos.y, !1, 16), (this._gestureLastMagnitudeY -= 50);
                        for (; ev.detail.magnitudeX - this._gestureLastMagnitudeX > 50; ) this._handleMouseButton(pos.x, pos.y, !0, 32), this._handleMouseButton(pos.x, pos.y, !1, 32), (this._gestureLastMagnitudeX += 50);
                        for (; ev.detail.magnitudeX - this._gestureLastMagnitudeX < -50; ) this._handleMouseButton(pos.x, pos.y, !0, 64), this._handleMouseButton(pos.x, pos.y, !1, 64), (this._gestureLastMagnitudeX -= 50);
                        break;

                    case 'pinch':
                        if ((this._fakeMouseMove(ev, pos.x, pos.y), (magnitude = Math.hypot(ev.detail.magnitudeX, ev.detail.magnitudeY)), Math.abs(magnitude - this._gestureLastMagnitudeX) > 75)) {
                            for (this._handleKeyEvent(KeyTable_XK_Control_L, 'ControlLeft', !0); magnitude - this._gestureLastMagnitudeX > 75; ) this._handleMouseButton(pos.x, pos.y, !0, 8), this._handleMouseButton(pos.x, pos.y, !1, 8), (this._gestureLastMagnitudeX += 75);
                            for (; magnitude - this._gestureLastMagnitudeX < -75; ) this._handleMouseButton(pos.x, pos.y, !0, 16), this._handleMouseButton(pos.x, pos.y, !1, 16), (this._gestureLastMagnitudeX -= 75);
                        }
                        this._handleKeyEvent(KeyTable_XK_Control_L, 'ControlLeft', !1);
                }
                break;

            case 'gestureend':
                switch (ev.detail.type) {
                    case 'onetap':
                    case 'twotap':
                    case 'threetap':
                    case 'pinch':
                    case 'twodrag':
                        break;

                    case 'drag':
                        this._fakeMouseMove(ev, pos.x, pos.y), this._handleMouseButton(pos.x, pos.y, !1, 1);
                        break;

                    case 'longpress':
                        this._fakeMouseMove(ev, pos.x, pos.y), this._handleMouseButton(pos.x, pos.y, !1, 4);
                }
        }
    }
    _negotiateProtocolVersion() {
        if (this._sock.rQwait('version', 12)) return !1;
        const sversion = this._sock.rQshiftStr(12).substr(4, 7);
        Info('Server ProtocolVersion: ' + sversion);
        let isRepeater = 0;
        switch (sversion) {
            case '000.000':
                isRepeater = 1;
                break;

            case '003.003':
            case '003.006':
            case '003.889':
                this._rfbVersion = 3.3;
                break;

            case '003.007':
                this._rfbVersion = 3.7;
                break;

            case '003.008':
            case '004.000':
            case '004.001':
            case '005.000':
                this._rfbVersion = 3.8;
                break;

            default:
                return this._fail('Invalid server version ' + sversion);
        }
        if (isRepeater) {
            let repeaterID = 'ID:' + this._repeaterID;
            for (; repeaterID.length < 250; ) repeaterID += '\0';
            return this._sock.sendString(repeaterID), !0;
        }
        this._rfbVersion > this._rfbMaxVersion && (this._rfbVersion = this._rfbMaxVersion);
        const cversion = '00' + parseInt(this._rfbVersion, 10) + '.00' + ((10 * this._rfbVersion) % 10);
        this._sock.sendString('RFB ' + cversion + '\n'), Debug('Sent ProtocolVersion: ' + cversion), (this._rfbInitState = 'Security');
    }
    _negotiateSecurity() {
        function includes(item, array) {
            for (let i = 0; i < array.length; i++) if (array[i] === item) return !0;
            return !1;
        }
        if (this._rfbVersion >= 3.7) {
            const numTypes = this._sock.rQshift8();
            if (this._sock.rQwait('security type', numTypes, 1)) return !1;
            if (0 === numTypes) return (this._rfbInitState = 'SecurityReason'), (this._securityContext = 'no security types'), (this._securityStatus = 1), this._initMsg();
            const types = this._sock.rQshiftBytes(numTypes);
            if ((Debug('Server security types: ' + types), includes(1, types))) this._rfbAuthScheme = 1;
            else if (includes(22, types)) this._rfbAuthScheme = 22;
            else if (includes(16, types)) this._rfbAuthScheme = 16;
            else if (includes(2, types)) this._rfbAuthScheme = 2;
            else {
                if (!includes(19, types)) return this._fail('Unsupported security types (types: ' + types + ')');
                this._rfbAuthScheme = 19;
            }
            this._sock.send([this._rfbAuthScheme]);
        } else {
            if (this._sock.rQwait('security scheme', 4)) return !1;
            if (((this._rfbAuthScheme = this._sock.rQshift32()), 0 == this._rfbAuthScheme)) return (this._rfbInitState = 'SecurityReason'), (this._securityContext = 'authentication scheme'), (this._securityStatus = 1), this._initMsg();
        }
        return (this._rfbInitState = 'Authentication'), Debug('Authenticating using scheme: ' + this._rfbAuthScheme), this._initMsg();
    }
    _handleSecurityReason() {
        if (this._sock.rQwait('reason length', 4)) return !1;
        const strlen = this._sock.rQshift32();
        let reason = '';
        if (strlen > 0) {
            if (this._sock.rQwait('reason', strlen, 4)) return !1;
            reason = this._sock.rQshiftStr(strlen);
        }
        return '' !== reason
            ? (this.dispatchEvent(
                  new CustomEvent('securityfailure', {
                      detail: {
                          status: this._securityStatus,
                          reason: reason,
                      },
                  }),
              ),
              this._fail('Security negotiation failed on ' + this._securityContext + ' (reason: ' + reason + ')'))
            : (this.dispatchEvent(
                  new CustomEvent('securityfailure', {
                      detail: {
                          status: this._securityStatus,
                      },
                  }),
              ),
              this._fail('Security negotiation failed on ' + this._securityContext));
    }
    _negotiateXvpAuth() {
        if (void 0 === this._rfbCredentials.username || void 0 === this._rfbCredentials.password || void 0 === this._rfbCredentials.target)
            return (
                this.dispatchEvent(
                    new CustomEvent('credentialsrequired', {
                        detail: {
                            types: ['username', 'password', 'target'],
                        },
                    }),
                ),
                !1
            );
        const xvpAuthStr = String.fromCharCode(this._rfbCredentials.username.length) + String.fromCharCode(this._rfbCredentials.target.length) + this._rfbCredentials.username + this._rfbCredentials.target;
        return this._sock.sendString(xvpAuthStr), (this._rfbAuthScheme = 2), this._negotiateAuthentication();
    }
    _negotiateVeNCryptAuth() {
        if (0 == this._rfbVeNCryptState) {
            if (this._sock.rQwait('vencrypt version', 2)) return !1;
            const major = this._sock.rQshift8(),
                minor = this._sock.rQshift8();
            if (0 != major || 2 != minor) return this._fail('Unsupported VeNCrypt version ' + major + '.' + minor);
            this._sock.send([0, 2]), (this._rfbVeNCryptState = 1);
        }
        if (1 == this._rfbVeNCryptState) {
            if (this._sock.rQwait('vencrypt ack', 1)) return !1;
            const res = this._sock.rQshift8();
            if (0 != res) return this._fail('VeNCrypt failure ' + res);
            this._rfbVeNCryptState = 2;
        }
        if (2 == this._rfbVeNCryptState) {
            if (this._sock.rQwait('vencrypt subtypes length', 1)) return !1;
            const subtypesLength = this._sock.rQshift8();
            if (subtypesLength < 1) return this._fail('VeNCrypt subtypes empty');
            (this._rfbVeNCryptSubtypesLength = subtypesLength), (this._rfbVeNCryptState = 3);
        }
        if (3 == this._rfbVeNCryptState) {
            if (this._sock.rQwait('vencrypt subtypes', 4 * this._rfbVeNCryptSubtypesLength)) return !1;
            const subtypes = [];
            for (let i = 0; i < this._rfbVeNCryptSubtypesLength; i++) subtypes.push(this._sock.rQshift32());
            if (-1 == subtypes.indexOf(256)) return this._fail('VeNCrypt Plain subtype not offered by server');
            this._sock.send([0, 0, 1, 0]), (this._rfbVeNCryptState = 4);
        }
        if (4 == this._rfbVeNCryptState) {
            if (!this._rfbCredentials.username || !this._rfbCredentials.password)
                return (
                    this.dispatchEvent(
                        new CustomEvent('credentialsrequired', {
                            detail: {
                                types: ['username', 'password'],
                            },
                        }),
                    ),
                    !1
                );
            const user = encodeUTF8(this._rfbCredentials.username),
                pass = encodeUTF8(this._rfbCredentials.password);
            return this._sock.send([0, 0, 0, user.length]), this._sock.send([0, 0, 0, pass.length]), this._sock.sendString(user), this._sock.sendString(pass), (this._rfbInitState = 'SecurityResult'), !0;
        }
    }
    _negotiateStdVNCAuth() {
        if (this._sock.rQwait('auth challenge', 16)) return !1;
        if (void 0 === this._rfbCredentials.password)
            return (
                this.dispatchEvent(
                    new CustomEvent('credentialsrequired', {
                        detail: {
                            types: ['password'],
                        },
                    }),
                ),
                !1
            );
        const challenge = Array.prototype.slice.call(this._sock.rQshiftBytes(16)),
            response = RFB.genDES(this._rfbCredentials.password, challenge);
        return this._sock.send(response), (this._rfbInitState = 'SecurityResult'), !0;
    }
    _negotiateTightUnixAuth() {
        return void 0 === this._rfbCredentials.username || void 0 === this._rfbCredentials.password
            ? (this.dispatchEvent(
                  new CustomEvent('credentialsrequired', {
                      detail: {
                          types: ['username', 'password'],
                      },
                  }),
              ),
              !1)
            : (this._sock.send([0, 0, 0, this._rfbCredentials.username.length]), this._sock.send([0, 0, 0, this._rfbCredentials.password.length]), this._sock.sendString(this._rfbCredentials.username), this._sock.sendString(this._rfbCredentials.password), (this._rfbInitState = 'SecurityResult'), !0);
    }
    _negotiateTightTunnels(numTunnels) {
        const clientSupportedTunnelTypes_0 = {
                vendor: 'TGHT',
                signature: 'NOTUNNEL',
            },
            serverSupportedTunnelTypes = {};
        for (let i = 0; i < numTunnels; i++) {
            const capCode = this._sock.rQshift32(),
                capVendor = this._sock.rQshiftStr(4),
                capSignature = this._sock.rQshiftStr(8);
            serverSupportedTunnelTypes[capCode] = {
                vendor: capVendor,
                signature: capSignature,
            };
        }
        return (
            Debug('Server Tight tunnel types: ' + serverSupportedTunnelTypes),
            serverSupportedTunnelTypes[1] &&
                'SICR' === serverSupportedTunnelTypes[1].vendor &&
                'SCHANNEL' === serverSupportedTunnelTypes[1].signature &&
                (Debug('Detected Siemens server. Assuming NOTUNNEL support.'),
                (serverSupportedTunnelTypes[0] = {
                    vendor: 'TGHT',
                    signature: 'NOTUNNEL',
                })),
            serverSupportedTunnelTypes[0]
                ? serverSupportedTunnelTypes[0].vendor != clientSupportedTunnelTypes_0.vendor || serverSupportedTunnelTypes[0].signature != clientSupportedTunnelTypes_0.signature
                    ? this._fail("Client's tunnel type had the incorrect vendor or signature")
                    : (Debug('Selected tunnel type: ' + clientSupportedTunnelTypes_0), this._sock.send([0, 0, 0, 0]), !1)
                : this._fail("Server wanted tunnels, but doesn't support the notunnel type")
        );
    }
    _negotiateTightAuth() {
        if (!this._rfbTightVNC) {
            if (this._sock.rQwait('num tunnels', 4)) return !1;
            const numTunnels = this._sock.rQshift32();
            if (numTunnels > 0 && this._sock.rQwait('tunnel capabilities', 16 * numTunnels, 4)) return !1;
            if (((this._rfbTightVNC = !0), numTunnels > 0)) return this._negotiateTightTunnels(numTunnels), !1;
        }
        if (this._sock.rQwait('sub auth count', 4)) return !1;
        const subAuthCount = this._sock.rQshift32();
        if (0 === subAuthCount) return (this._rfbInitState = 'SecurityResult'), !0;
        if (this._sock.rQwait('sub auth capabilities', 16 * subAuthCount, 4)) return !1;
        const clientSupportedTypes = {
                STDVNOAUTH__: 1,
                STDVVNCAUTH_: 2,
                TGHTULGNAUTH: 129,
            },
            serverSupportedTypes = [];
        for (let i = 0; i < subAuthCount; i++) {
            this._sock.rQshift32();
            const capabilities = this._sock.rQshiftStr(12);
            serverSupportedTypes.push(capabilities);
        }
        Debug('Server Tight authentication types: ' + serverSupportedTypes);
        for (let authType in clientSupportedTypes)
            if (-1 != serverSupportedTypes.indexOf(authType))
                switch ((this._sock.send([0, 0, 0, clientSupportedTypes[authType]]), Debug('Selected authentication type: ' + authType), authType)) {
                    case 'STDVNOAUTH__':
                        return (this._rfbInitState = 'SecurityResult'), !0;

                    case 'STDVVNCAUTH_':
                        return (this._rfbAuthScheme = 2), this._initMsg();

                    case 'TGHTULGNAUTH':
                        return (this._rfbAuthScheme = 129), this._initMsg();

                    default:
                        return this._fail('Unsupported tiny auth scheme (scheme: ' + authType + ')');
                }
        return this._fail('No supported sub-auth types!');
    }
    _negotiateAuthentication() {
        switch (this._rfbAuthScheme) {
            case 1:
                return this._rfbVersion >= 3.8 ? ((this._rfbInitState = 'SecurityResult'), !0) : ((this._rfbInitState = 'ClientInitialisation'), this._initMsg());

            case 22:
                return this._negotiateXvpAuth();

            case 2:
                return this._negotiateStdVNCAuth();

            case 16:
                return this._negotiateTightAuth();

            case 19:
                return this._negotiateVeNCryptAuth();

            case 129:
                return this._negotiateTightUnixAuth();

            default:
                return this._fail('Unsupported auth scheme (scheme: ' + this._rfbAuthScheme + ')');
        }
    }
    _handleSecurityResult() {
        if (this._sock.rQwait('VNC auth response ', 4)) return !1;
        const status = this._sock.rQshift32();
        return 0 === status
            ? ((this._rfbInitState = 'ClientInitialisation'), Debug('Authentication OK'), this._initMsg())
            : this._rfbVersion >= 3.8
            ? ((this._rfbInitState = 'SecurityReason'), (this._securityContext = 'security result'), (this._securityStatus = status), this._initMsg())
            : (this.dispatchEvent(
                  new CustomEvent('securityfailure', {
                      detail: {
                          status: status,
                      },
                  }),
              ),
              this._fail('Security handshake failed'));
    }
    _negotiateServerInit() {
        if (this._sock.rQwait('server initialization', 24)) return !1;
        const width = this._sock.rQshift16(),
            height = this._sock.rQshift16(),
            bpp = this._sock.rQshift8(),
            depth = this._sock.rQshift8(),
            bigEndian = this._sock.rQshift8(),
            trueColor = this._sock.rQshift8(),
            redMax = this._sock.rQshift16(),
            greenMax = this._sock.rQshift16(),
            blueMax = this._sock.rQshift16(),
            redShift = this._sock.rQshift8(),
            greenShift = this._sock.rQshift8(),
            blueShift = this._sock.rQshift8();
        this._sock.rQskipBytes(3);
        const nameLength = this._sock.rQshift32();
        if (this._sock.rQwait('server init name', nameLength, 24)) return !1;
        let name = this._sock.rQshiftStr(nameLength);
        if (((name = decodeUTF8(name, !0)), this._rfbTightVNC)) {
            if (this._sock.rQwait('TightVNC extended server init header', 8, 24 + nameLength)) return !1;
            const numServerMessages = this._sock.rQshift16(),
                numClientMessages = this._sock.rQshift16(),
                numEncodings = this._sock.rQshift16();
            this._sock.rQskipBytes(2);
            const totalMessagesLength = 16 * (numServerMessages + numClientMessages + numEncodings);
            if (this._sock.rQwait('TightVNC extended server init header', totalMessagesLength, 32 + nameLength)) return !1;
            this._sock.rQskipBytes(16 * numServerMessages), this._sock.rQskipBytes(16 * numClientMessages), this._sock.rQskipBytes(16 * numEncodings);
        }
        return (
            Info('Screen: ' + width + 'x' + height + ', bpp: ' + bpp + ', depth: ' + depth + ', bigEndian: ' + bigEndian + ', trueColor: ' + trueColor + ', redMax: ' + redMax + ', greenMax: ' + greenMax + ', blueMax: ' + blueMax + ', redShift: ' + redShift + ', greenShift: ' + greenShift + ', blueShift: ' + blueShift),
            this._setDesktopName(name),
            this._resize(width, height),
            this._viewOnly || this._keyboard.grab(),
            (this._fbDepth = 24),
            'Intel(r) AMT KVM' === this._fbName && (Warn('Intel AMT KVM only supports 8/16 bit depths. Using low color mode.'), (this._fbDepth = 8)),
            RFB.messages.pixelFormat(this._sock, this._fbDepth, !0),
            this._sendEncodings(),
            RFB.messages.fbUpdateRequest(this._sock, !1, 0, 0, this._fbWidth, this._fbHeight),
            this._updateConnectionState('connected'),
            !0
        );
    }
    _sendEncodings() {
        const encs = [];
        encs.push(encodings_encodingCopyRect),
            24 == this._fbDepth && (encs.push(encodings_encodingTight), encs.push(encodings_encodingTightPNG), encs.push(encodings_encodingHextile), encs.push(encodings_encodingRRE)),
            encs.push(encodings_encodingRaw),
            encs.push(encodings_pseudoEncodingQualityLevel0 + this._qualityLevel),
            encs.push(encodings_pseudoEncodingCompressLevel0 + this._compressionLevel),
            encs.push(encodings_pseudoEncodingDesktopSize),
            encs.push(encodings_pseudoEncodingLastRect),
            encs.push(encodings_pseudoEncodingQEMUExtendedKeyEvent),
            encs.push(encodings_pseudoEncodingExtendedDesktopSize),
            encs.push(encodings_pseudoEncodingXvp),
            encs.push(encodings_pseudoEncodingFence),
            encs.push(encodings_pseudoEncodingContinuousUpdates),
            encs.push(encodings_pseudoEncodingDesktopName),
            encs.push(encodings_pseudoEncodingExtendedClipboard),
            24 == this._fbDepth && (encs.push(encodings_pseudoEncodingVMwareCursor), encs.push(encodings_pseudoEncodingCursor)),
            RFB.messages.clientEncodings(this._sock, encs);
    }
    _initMsg() {
        switch (this._rfbInitState) {
            case 'ProtocolVersion':
                return this._negotiateProtocolVersion();

            case 'Security':
                return this._negotiateSecurity();

            case 'Authentication':
                return this._negotiateAuthentication();

            case 'SecurityResult':
                return this._handleSecurityResult();

            case 'SecurityReason':
                return this._handleSecurityReason();

            case 'ClientInitialisation':
                return this._sock.send([this._shared ? 1 : 0]), (this._rfbInitState = 'ServerInitialisation'), !0;

            case 'ServerInitialisation':
                return this._negotiateServerInit();

            default:
                return this._fail('Unknown init state (state: ' + this._rfbInitState + ')');
        }
    }
    _handleSetColourMapMsg() {
        return Debug('SetColorMapEntries'), this._fail('Unexpected SetColorMapEntries message');
    }
    _handleServerCutText() {
        if ((Debug('ServerCutText'), this._sock.rQwait('ServerCutText header', 7, 1))) return !1;
        this._sock.rQskipBytes(3);
        let length = this._sock.rQshift32();
        if (((length = toSigned32bit(length)), this._sock.rQwait('ServerCutText content', Math.abs(length), 8))) return !1;
        if (length >= 0) {
            const text = this._sock.rQshiftStr(length);
            if (this._viewOnly) return !0;
            this.dispatchEvent(
                new CustomEvent('clipboard', {
                    detail: {
                        text: text,
                    },
                }),
            );
        } else {
            length = Math.abs(length);
            const flags = this._sock.rQshift32();
            let formats = 65535 & flags,
                actions = 4278190080 & flags;
            if (!!(16777216 & actions)) {
                (this._clipboardServerCapabilitiesFormats = {}), (this._clipboardServerCapabilitiesActions = {});
                for (let i = 0; i <= 15; i++) {
                    let index = 1 << i;
                    formats & index && ((this._clipboardServerCapabilitiesFormats[index] = !0), this._sock.rQshift32());
                }
                for (let i = 24; i <= 31; i++) {
                    let index = 1 << i;
                    this._clipboardServerCapabilitiesActions[index] = !!(actions & index);
                }
                let clientActions = [16777216, 33554432, 67108864, 134217728, 268435456];
                RFB.messages.extendedClipboardCaps(this._sock, clientActions, {
                    extendedClipboardFormatText: 0,
                });
            } else if (33554432 === actions) {
                if (this._viewOnly) return !0;
                null != this._clipboardText && this._clipboardServerCapabilitiesActions[268435456] && 1 & formats && RFB.messages.extendedClipboardProvide(this._sock, [1], [this._clipboardText]);
            } else if (67108864 === actions) {
                if (this._viewOnly) return !0;
                this._clipboardServerCapabilitiesActions[134217728] && (null != this._clipboardText ? RFB.messages.extendedClipboardNotify(this._sock, [1]) : RFB.messages.extendedClipboardNotify(this._sock, []));
            } else if (134217728 === actions) {
                if (this._viewOnly) return !0;
                this._clipboardServerCapabilitiesActions[33554432] && 1 & formats && RFB.messages.extendedClipboardRequest(this._sock, [1]);
            } else {
                if (268435456 !== actions) return this._fail('Unexpected action in extended clipboard message: ' + actions);
                {
                    if (this._viewOnly) return !0;
                    if (!(1 & formats)) return !0;
                    this._clipboardText = null;
                    let zlibStream = this._sock.rQshiftBytes(length - 4),
                        streamInflator = new Inflate(),
                        textData = null;
                    streamInflator.setInput(zlibStream);
                    for (let i = 0; i <= 15; i++) {
                        let format = 1 << i;
                        if (formats & format) {
                            let size = 0,
                                sizeArray = streamInflator.inflate(4);
                            (size |= sizeArray[0] << 24), (size |= sizeArray[1] << 16), (size |= sizeArray[2] << 8), (size |= sizeArray[3]);
                            let chunk = streamInflator.inflate(size);
                            1 === format && (textData = chunk);
                        }
                    }
                    if ((streamInflator.setInput(null), null !== textData)) {
                        let tmpText = '';
                        for (let i = 0; i < textData.length; i++) tmpText += String.fromCharCode(textData[i]);
                        (textData = tmpText),
                            (textData = decodeUTF8(textData)),
                            textData.length > 0 && '\0' === textData.charAt(textData.length - 1) && (textData = textData.slice(0, -1)),
                            (textData = textData.replace('\r\n', '\n')),
                            this.dispatchEvent(
                                new CustomEvent('clipboard', {
                                    detail: {
                                        text: textData,
                                    },
                                }),
                            );
                    }
                }
            }
        }
        return !0;
    }
    _handleServerFenceMsg() {
        if (this._sock.rQwait('ServerFence header', 8, 1)) return !1;
        this._sock.rQskipBytes(3);
        let flags = this._sock.rQshift32(),
            length = this._sock.rQshift8();
        if (this._sock.rQwait('ServerFence payload', length, 9)) return !1;
        length > 64 && (Warn('Bad payload length (' + length + ') in fence response'), (length = 64));
        const payload = this._sock.rQshiftStr(length);
        return (this._supportsFence = !0), flags & (1 << 31) ? ((flags &= 3), RFB.messages.clientFence(this._sock, flags, payload), !0) : this._fail('Unexpected fence response');
    }
    _handleXvpMsg() {
        if (this._sock.rQwait('XVP version and message', 3, 1)) return !1;
        this._sock.rQskipBytes(1);
        const xvpVer = this._sock.rQshift8(),
            xvpMsg = this._sock.rQshift8();
        switch (xvpMsg) {
            case 0:
                Error$1('XVP Operation Failed');
                break;

            case 1:
                (this._rfbXvpVer = xvpVer), Info('XVP extensions enabled (version ' + this._rfbXvpVer + ')'), this._setCapability('power', !0);
                break;

            default:
                this._fail('Illegal server XVP message (msg: ' + xvpMsg + ')');
        }
        return !0;
    }
    _normalMsg() {
        let msgType, first, ret;
        switch (((msgType = this._FBU.rects > 0 ? 0 : this._sock.rQshift8()), msgType)) {
            case 0:
                return (ret = this._framebufferUpdate()), ret && !this._enabledContinuousUpdates && RFB.messages.fbUpdateRequest(this._sock, !0, 0, 0, this._fbWidth, this._fbHeight), ret;

            case 1:
                return this._handleSetColourMapMsg();

            case 2:
                return (
                    Debug('Bell'),
                    this.dispatchEvent(
                        new CustomEvent('bell', {
                            detail: {},
                        }),
                    ),
                    !0
                );

            case 3:
                return this._handleServerCutText();

            case 150:
                return (first = !this._supportsContinuousUpdates), (this._supportsContinuousUpdates = !0), (this._enabledContinuousUpdates = !1), first && ((this._enabledContinuousUpdates = !0), this._updateContinuousUpdates(), Info('Enabling continuous updates.')), !0;

            case 248:
                return this._handleServerFenceMsg();

            case 250:
                return this._handleXvpMsg();

            default:
                return this._fail('Unexpected server message (type ' + msgType + ')'), Debug('sock.rQslice(0, 30): ' + this._sock.rQslice(0, 30)), !0;
        }
    }
    _onFlush() {
        (this._flushing = !1), this._sock.rQlen > 0 && this._handleMessage();
    }
    _framebufferUpdate() {
        if (0 === this._FBU.rects) {
            if (this._sock.rQwait('FBU header', 3, 1)) return !1;
            if ((this._sock.rQskipBytes(1), (this._FBU.rects = this._sock.rQshift16()), this._display.pending())) return (this._flushing = !0), this._display.flush(), !1;
        }
        for (; this._FBU.rects > 0; ) {
            if (null === this._FBU.encoding) {
                if (this._sock.rQwait('rect header', 12)) return !1;
                const hdr = this._sock.rQshiftBytes(12);
                (this._FBU.x = (hdr[0] << 8) + hdr[1]), (this._FBU.y = (hdr[2] << 8) + hdr[3]), (this._FBU.width = (hdr[4] << 8) + hdr[5]), (this._FBU.height = (hdr[6] << 8) + hdr[7]), (this._FBU.encoding = parseInt((hdr[8] << 24) + (hdr[9] << 16) + (hdr[10] << 8) + hdr[11], 10));
            }
            if (!this._handleRect()) return !1;
            this._FBU.rects--, (this._FBU.encoding = null);
        }
        return this._display.flip(), !0;
    }
    _handleRect() {
        switch (this._FBU.encoding) {
            case encodings_pseudoEncodingLastRect:
                return (this._FBU.rects = 1), !0;

            case encodings_pseudoEncodingVMwareCursor:
                return this._handleVMwareCursor();

            case encodings_pseudoEncodingCursor:
                return this._handleCursor();

            case encodings_pseudoEncodingQEMUExtendedKeyEvent:
                try {
                    void 0 !== document.createEvent('keyboardEvent').code && (this._qemuExtKeyEventSupported = !0);
                } catch (err2) {}
                return !0;

            case encodings_pseudoEncodingDesktopName:
                return this._handleDesktopName();

            case encodings_pseudoEncodingDesktopSize:
                return this._resize(this._FBU.width, this._FBU.height), !0;

            case encodings_pseudoEncodingExtendedDesktopSize:
                return this._handleExtendedDesktopSize();

            default:
                return this._handleDataRect();
        }
    }
    _handleVMwareCursor() {
        const hotx = this._FBU.x,
            hoty = this._FBU.y,
            w = this._FBU.width,
            h = this._FBU.height;
        if (this._sock.rQwait('VMware cursor encoding', 1)) return !1;
        const cursorType = this._sock.rQshift8();
        let rgba;
        this._sock.rQshift8();
        if (0 == cursorType) {
            const PIXEL_MASK = -256;
            if (((rgba = new Array(w * h * 4)), this._sock.rQwait('VMware cursor classic encoding', w * h * 4 * 2, 2))) return !1;
            let andMask = new Array(w * h);
            for (let pixel = 0; pixel < w * h; pixel++) andMask[pixel] = this._sock.rQshift32();
            let xorMask = new Array(w * h);
            for (let pixel = 0; pixel < w * h; pixel++) xorMask[pixel] = this._sock.rQshift32();
            for (let pixel = 0; pixel < w * h; pixel++)
                if (0 == andMask[pixel]) {
                    let bgr = xorMask[pixel],
                        r = (bgr >> 8) & 255,
                        g = (bgr >> 16) & 255,
                        b2 = (bgr >> 24) & 255;
                    (rgba[4 * pixel] = r), (rgba[4 * pixel + 1] = g), (rgba[4 * pixel + 2] = b2), (rgba[4 * pixel + 3] = 255);
                } else
                    (andMask[pixel] & PIXEL_MASK) == PIXEL_MASK
                        ? 0 == xorMask[pixel]
                            ? ((rgba[4 * pixel] = 0), (rgba[4 * pixel + 1] = 0), (rgba[4 * pixel + 2] = 0), (rgba[4 * pixel + 3] = 0))
                            : (xorMask[pixel], (rgba[4 * pixel] = 0), (rgba[4 * pixel + 1] = 0), (rgba[4 * pixel + 2] = 0), (rgba[4 * pixel + 3] = 255))
                        : ((rgba[4 * pixel] = 0), (rgba[4 * pixel + 1] = 0), (rgba[4 * pixel + 2] = 0), (rgba[4 * pixel + 3] = 255));
        } else {
            if (1 != cursorType) return Warn('The given cursor type is not supported: ' + cursorType + ' given.'), !1;
            if (this._sock.rQwait('VMware cursor alpha encoding', w * h * 4, 2)) return !1;
            rgba = new Array(w * h * 4);
            for (let pixel = 0; pixel < w * h; pixel++) {
                let data = this._sock.rQshift32();
                (rgba[4 * pixel] = (data >> 24) & 255), (rgba[4 * pixel + 1] = (data >> 16) & 255), (rgba[4 * pixel + 2] = (data >> 8) & 255), (rgba[4 * pixel + 3] = 255 & data);
            }
        }
        return this._updateCursor(rgba, hotx, hoty, w, h), !0;
    }
    _handleCursor() {
        const hotx = this._FBU.x,
            hoty = this._FBU.y,
            w = this._FBU.width,
            h = this._FBU.height,
            pixelslength = w * h * 4,
            masklength = Math.ceil(w / 8) * h;
        let bytes = pixelslength + masklength;
        if (this._sock.rQwait('cursor encoding', bytes)) return !1;
        const pixels = this._sock.rQshiftBytes(pixelslength),
            mask = this._sock.rQshiftBytes(masklength);
        let rgba = new Uint8Array(w * h * 4),
            pixIdx = 0;
        for (let y = 0; y < h; y++)
            for (let x = 0; x < w; x++) {
                let alpha = (mask[y * Math.ceil(w / 8) + Math.floor(x / 8)] << x % 8) & 128 ? 255 : 0;
                (rgba[pixIdx] = pixels[pixIdx + 2]), (rgba[pixIdx + 1] = pixels[pixIdx + 1]), (rgba[pixIdx + 2] = pixels[pixIdx]), (rgba[pixIdx + 3] = alpha), (pixIdx += 4);
            }
        return this._updateCursor(rgba, hotx, hoty, w, h), !0;
    }
    _handleDesktopName() {
        if (this._sock.rQwait('DesktopName', 4)) return !1;
        let length = this._sock.rQshift32();
        if (this._sock.rQwait('DesktopName', length, 4)) return !1;
        let name = this._sock.rQshiftStr(length);
        return (name = decodeUTF8(name, !0)), this._setDesktopName(name), !0;
    }
    _handleExtendedDesktopSize() {
        if (this._sock.rQwait('ExtendedDesktopSize', 4)) return !1;
        const numberOfScreens = this._sock.rQpeek8();
        let bytes = 4 + 16 * numberOfScreens;
        if (this._sock.rQwait('ExtendedDesktopSize', bytes)) return !1;
        const firstUpdate = !this._supportsSetDesktopSize;
        (this._supportsSetDesktopSize = !0), firstUpdate && this._requestRemoteResize(), this._sock.rQskipBytes(1), this._sock.rQskipBytes(3);
        for (let i = 0; i < numberOfScreens; i += 1) 0 === i ? ((this._screenID = this._sock.rQshiftBytes(4)), this._sock.rQskipBytes(2), this._sock.rQskipBytes(2), this._sock.rQskipBytes(2), this._sock.rQskipBytes(2), (this._screenFlags = this._sock.rQshiftBytes(4))) : this._sock.rQskipBytes(16);
        if (1 === this._FBU.x && 0 !== this._FBU.y) {
            let msg2 = '';
            switch (this._FBU.y) {
                case 1:
                    msg2 = 'Resize is administratively prohibited';
                    break;

                case 2:
                    msg2 = 'Out of resources';
                    break;

                case 3:
                    msg2 = 'Invalid screen layout';
                    break;

                default:
                    msg2 = 'Unknown reason';
            }
            Warn('Server did not accept the resize request: ' + msg2);
        } else this._resize(this._FBU.width, this._FBU.height);
        return !0;
    }
    _handleDataRect() {
        let decoder = this._decoders[this._FBU.encoding];
        if (!decoder) return this._fail('Unsupported encoding (encoding: ' + this._FBU.encoding + ')'), !1;
        try {
            return decoder.decodeRect(this._FBU.x, this._FBU.y, this._FBU.width, this._FBU.height, this._sock, this._display, this._fbDepth);
        } catch (err2) {
            return this._fail('Error decoding rect: ' + err2), !1;
        }
    }
    _updateContinuousUpdates() {
        this._enabledContinuousUpdates && RFB.messages.enableContinuousUpdates(this._sock, !0, 0, 0, this._fbWidth, this._fbHeight);
    }
    _resize(width, height) {
        (this._fbWidth = width), (this._fbHeight = height), this._display.resize(this._fbWidth, this._fbHeight), this._updateClip(), this._updateScale(), this._updateContinuousUpdates();
    }
    _xvpOp(ver, op) {
        this._rfbXvpVer < ver || (Info('Sending XVP operation ' + op + ' (version ' + ver + ')'), RFB.messages.xvpOp(this._sock, ver, op));
    }
    _updateCursor(rgba, hotx, hoty, w, h) {
        (this._cursorImage = {
            rgbaPixels: rgba,
            hotx: hotx,
            hoty: hoty,
            w: w,
            h: h,
        }),
            this._refreshCursor();
    }
    _shouldShowDotCursor() {
        if (!this._showDotCursor) return !1;
        for (let i = 3; i < this._cursorImage.rgbaPixels.length; i += 4) if (this._cursorImage.rgbaPixels[i]) return !1;
        return !0;
    }
    _refreshCursor() {
        if ('connecting' !== this._rfbConnectionState && 'connected' !== this._rfbConnectionState) return;
        const image = this._shouldShowDotCursor() ? RFB.cursors.dot : this._cursorImage;
        this._cursor.change(image.rgbaPixels, image.hotx, image.hoty, image.w, image.h);
    }
    static genDES(password, challenge) {
        const passwordChars = password.split('').map(c2 => c2.charCodeAt(0));
        return new DES(passwordChars).encrypt(challenge);
    }
}

(RFB.messages = {
    keyEvent(sock, keysym, down) {
        const buff = sock._sQ,
            offset = sock._sQlen;
        (buff[offset] = 4), (buff[offset + 1] = down), (buff[offset + 2] = 0), (buff[offset + 3] = 0), (buff[offset + 4] = keysym >> 24), (buff[offset + 5] = keysym >> 16), (buff[offset + 6] = keysym >> 8), (buff[offset + 7] = keysym), (sock._sQlen += 8), sock.flush();
    },
    QEMUExtendedKeyEvent(sock, keysym, down, keycode) {
        const buff = sock._sQ,
            offset = sock._sQlen;
        (buff[offset] = 255), (buff[offset + 1] = 0), (buff[offset + 2] = down >> 8), (buff[offset + 3] = down), (buff[offset + 4] = keysym >> 24), (buff[offset + 5] = keysym >> 16), (buff[offset + 6] = keysym >> 8), (buff[offset + 7] = keysym);
        const RFBkeycode = (function (xtScanCode) {
            const lowerByte = 255 & keycode;
            return 224 === keycode >> 8 && lowerByte < 127 ? 128 | lowerByte : xtScanCode;
        })(keycode);
        (buff[offset + 8] = RFBkeycode >> 24), (buff[offset + 9] = RFBkeycode >> 16), (buff[offset + 10] = RFBkeycode >> 8), (buff[offset + 11] = RFBkeycode), (sock._sQlen += 12), sock.flush();
    },
    pointerEvent(sock, x, y, mask) {
        const buff = sock._sQ,
            offset = sock._sQlen;
        (buff[offset] = 5), (buff[offset + 1] = mask), (buff[offset + 2] = x >> 8), (buff[offset + 3] = x), (buff[offset + 4] = y >> 8), (buff[offset + 5] = y), (sock._sQlen += 6), sock.flush();
    },
    _buildExtendedClipboardFlags(actions, formats) {
        let data = new Uint8Array(4),
            formatFlag = 0,
            actionFlag = 0;
        for (let i = 0; i < actions.length; i++) actionFlag |= actions[i];
        for (let i = 0; i < formats.length; i++) formatFlag |= formats[i];
        return (data[0] = actionFlag >> 24), (data[1] = 0), (data[2] = 0), (data[3] = formatFlag), data;
    },
    extendedClipboardProvide(sock, formats, inData) {
        let deflator = new Deflator(),
            dataToDeflate = [];
        for (let i = 0; i < formats.length; i++) {
            if (1 != formats[i]) throw new Error('Unsupported extended clipboard format for Provide message.');
            inData[i] = inData[i].replace(/\r\n|\r|\n/gm, '\r\n');
            let text = encodeUTF8(inData[i] + '\0');
            dataToDeflate.push((text.length >> 24) & 255, (text.length >> 16) & 255, (text.length >> 8) & 255, 255 & text.length);
            for (let j = 0; j < text.length; j++) dataToDeflate.push(text.charCodeAt(j));
        }
        let deflatedData = deflator.deflate(new Uint8Array(dataToDeflate)),
            data = new Uint8Array(4 + deflatedData.length);
        data.set(RFB.messages._buildExtendedClipboardFlags([268435456], formats)), data.set(deflatedData, 4), RFB.messages.clientCutText(sock, data, !0);
    },
    extendedClipboardNotify(sock, formats) {
        let flags = RFB.messages._buildExtendedClipboardFlags([134217728], formats);
        RFB.messages.clientCutText(sock, flags, !0);
    },
    extendedClipboardRequest(sock, formats) {
        let flags = RFB.messages._buildExtendedClipboardFlags([33554432], formats);
        RFB.messages.clientCutText(sock, flags, !0);
    },
    extendedClipboardCaps(sock, actions, formats) {
        let formatKeys = Object.keys(formats),
            data = new Uint8Array(4 + 4 * formatKeys.length);
        formatKeys.map(x => parseInt(x)), formatKeys.sort((a2, b2) => a2 - b2), data.set(RFB.messages._buildExtendedClipboardFlags(actions, []));
        let loopOffset = 4;
        for (let i = 0; i < formatKeys.length; i++) (data[loopOffset] = formats[formatKeys[i]] >> 24), (data[loopOffset + 1] = formats[formatKeys[i]] >> 16), (data[loopOffset + 2] = formats[formatKeys[i]] >> 8), (data[loopOffset + 3] = formats[formatKeys[i]] | 0), (loopOffset += 4), (data[3] |= 1 << formatKeys[i]);
        RFB.messages.clientCutText(sock, data, !0);
    },
    clientCutText(sock, data, extended = !1) {
        const buff = sock._sQ,
            offset = sock._sQlen;
        let length;
        (buff[offset] = 6), (buff[offset + 1] = 0), (buff[offset + 2] = 0), (buff[offset + 3] = 0), (length = extended ? -data.length >>> 0 : data.length), (buff[offset + 4] = length >> 24), (buff[offset + 5] = length >> 16), (buff[offset + 6] = length >> 8), (buff[offset + 7] = length), (sock._sQlen += 8);
        let dataOffset = 0,
            remaining = data.length;
        for (; remaining > 0; ) {
            let flushSize = Math.min(remaining, sock._sQbufferSize - sock._sQlen);
            for (let i = 0; i < flushSize; i++) buff[sock._sQlen + i] = data[dataOffset + i];
            (sock._sQlen += flushSize), sock.flush(), (remaining -= flushSize), (dataOffset += flushSize);
        }
    },
    setDesktopSize(sock, width, height, id, flags) {
        const buff = sock._sQ,
            offset = sock._sQlen;
        (buff[offset] = 251),
            (buff[offset + 1] = 0),
            (buff[offset + 2] = width >> 8),
            (buff[offset + 3] = width),
            (buff[offset + 4] = height >> 8),
            (buff[offset + 5] = height),
            (buff[offset + 6] = 1),
            (buff[offset + 7] = 0),
            (buff[offset + 8] = id >> 24),
            (buff[offset + 9] = id >> 16),
            (buff[offset + 10] = id >> 8),
            (buff[offset + 11] = id),
            (buff[offset + 12] = 0),
            (buff[offset + 13] = 0),
            (buff[offset + 14] = 0),
            (buff[offset + 15] = 0),
            (buff[offset + 16] = width >> 8),
            (buff[offset + 17] = width),
            (buff[offset + 18] = height >> 8),
            (buff[offset + 19] = height),
            (buff[offset + 20] = flags >> 24),
            (buff[offset + 21] = flags >> 16),
            (buff[offset + 22] = flags >> 8),
            (buff[offset + 23] = flags),
            (sock._sQlen += 24),
            sock.flush();
    },
    clientFence(sock, flags, payload) {
        const buff = sock._sQ,
            offset = sock._sQlen;
        (buff[offset] = 248), (buff[offset + 1] = 0), (buff[offset + 2] = 0), (buff[offset + 3] = 0), (buff[offset + 4] = flags >> 24), (buff[offset + 5] = flags >> 16), (buff[offset + 6] = flags >> 8), (buff[offset + 7] = flags);
        const n = payload.length;
        buff[offset + 8] = n;
        for (let i = 0; i < n; i++) buff[offset + 9 + i] = payload.charCodeAt(i);
        (sock._sQlen += 9 + n), sock.flush();
    },
    enableContinuousUpdates(sock, enable, x, y, width, height) {
        const buff = sock._sQ,
            offset = sock._sQlen;
        (buff[offset] = 150), (buff[offset + 1] = enable), (buff[offset + 2] = x >> 8), (buff[offset + 3] = x), (buff[offset + 4] = y >> 8), (buff[offset + 5] = y), (buff[offset + 6] = width >> 8), (buff[offset + 7] = width), (buff[offset + 8] = height >> 8), (buff[offset + 9] = height), (sock._sQlen += 10), sock.flush();
    },
    pixelFormat(sock, depth, trueColor) {
        const buff = sock._sQ,
            offset = sock._sQlen;
        let bpp;
        bpp = depth > 16 ? 32 : depth > 8 ? 16 : 8;
        const bits = Math.floor(depth / 3);
        (buff[offset] = 0),
            (buff[offset + 1] = 0),
            (buff[offset + 2] = 0),
            (buff[offset + 3] = 0),
            (buff[offset + 4] = bpp),
            (buff[offset + 5] = depth),
            (buff[offset + 6] = 0),
            (buff[offset + 7] = trueColor ? 1 : 0),
            (buff[offset + 8] = 0),
            (buff[offset + 9] = (1 << bits) - 1),
            (buff[offset + 10] = 0),
            (buff[offset + 11] = (1 << bits) - 1),
            (buff[offset + 12] = 0),
            (buff[offset + 13] = (1 << bits) - 1),
            (buff[offset + 14] = 2 * bits),
            (buff[offset + 15] = 1 * bits),
            (buff[offset + 16] = 0 * bits),
            (buff[offset + 17] = 0),
            (buff[offset + 18] = 0),
            (buff[offset + 19] = 0),
            (sock._sQlen += 20),
            sock.flush();
    },
    clientEncodings(sock, encodings2) {
        const buff = sock._sQ,
            offset = sock._sQlen;
        (buff[offset] = 2), (buff[offset + 1] = 0), (buff[offset + 2] = encodings2.length >> 8), (buff[offset + 3] = encodings2.length);
        let j = offset + 4;
        for (let i = 0; i < encodings2.length; i++) {
            const enc = encodings2[i];
            (buff[j] = enc >> 24), (buff[j + 1] = enc >> 16), (buff[j + 2] = enc >> 8), (buff[j + 3] = enc), (j += 4);
        }
        (sock._sQlen += j - offset), sock.flush();
    },
    fbUpdateRequest(sock, incremental, x, y, w, h) {
        const buff = sock._sQ,
            offset = sock._sQlen;
        void 0 === x && (x = 0),
            void 0 === y && (y = 0),
            (buff[offset] = 3),
            (buff[offset + 1] = incremental ? 1 : 0),
            (buff[offset + 2] = (x >> 8) & 255),
            (buff[offset + 3] = 255 & x),
            (buff[offset + 4] = (y >> 8) & 255),
            (buff[offset + 5] = 255 & y),
            (buff[offset + 6] = (w >> 8) & 255),
            (buff[offset + 7] = 255 & w),
            (buff[offset + 8] = (h >> 8) & 255),
            (buff[offset + 9] = 255 & h),
            (sock._sQlen += 10),
            sock.flush();
    },
    xvpOp(sock, ver, op) {
        const buff = sock._sQ,
            offset = sock._sQlen;
        (buff[offset] = 250), (buff[offset + 1] = 0), (buff[offset + 2] = ver), (buff[offset + 3] = op), (sock._sQlen += 4), sock.flush();
    },
}),
    (RFB.cursors = {
        none: {
            rgbaPixels: new Uint8Array(),
            w: 0,
            h: 0,
            hotx: 0,
            hoty: 0,
        },
        dot: {
            rgbaPixels: new Uint8Array([255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255]),
            w: 3,
            h: 3,
            hotx: 1,
            hoty: 1,
        },
    });

export default RFB;
