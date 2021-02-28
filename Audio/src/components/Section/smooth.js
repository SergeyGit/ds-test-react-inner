export class SmoothyScroll {
    constructor() {
        this.scrolling = false;
        this.scrollTo = (position, duration = 600, callback) => {
            var startScroll = SmoothyScroll.scrollTop, changeValue = position - startScroll, currentTime = 0, treshold = 20;
            if (changeValue == 0)
                return;
            this.direction = changeValue > 0 ? "downward" : "upward";
            var animate = () => {
                var value = SmoothyScroll.easing(currentTime, startScroll, changeValue, duration);
                SmoothyScroll.scrollTop = Math.round(value);
                // console.warn(Math.round(value), SmoothyScroll.scrollTop)
                currentTime += treshold;
                if (currentTime <= duration) {
                    this.requestAnimationFrame(animate);
                }
                else {
                    this.scrolling = false;
                    this.direction = undefined;
                    callback && callback();
                }
            };
            this.scrolling = true;
            animate();
        };
        this.interrupt = () => {
            this.cancelAnimationFrame(this.frame);
            this.scrolling = false;
        };
    }
    get requestAnimationFrame() {
        return (window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || ((callback) => window.setInterval(callback, 1000 / 60))).bind(window);
    }
    get cancelAnimationFrame() {
        return (window.cancelAnimationFrame
            || window.webkitCancelAnimationFrame
            || ((frameId) => clearInterval(frameId))).bind(window);
    }
    static get scrollTop() {
        return document.documentElement.scrollTop
            || document.body.scrollTop
            || document.body.parentElement.scrollTop
            || window.pageYOffset;
    }
    static set scrollTop(offset) {
        document.documentElement.scrollTop = offset;
        document.body.scrollTop = offset;
        document.body.parentElement.scrollTop = offset;
        window.scrollTo({ top: offset });
    }
}
SmoothyScroll.easing = (t, b, c, d) => {
    return c * ((t = t / d - 1) * t * t + 1) + b; // easeOutCubic
};
export default new SmoothyScroll();
