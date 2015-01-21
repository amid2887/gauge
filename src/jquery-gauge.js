;(function ($) {

    var defaults = {
        width: 440,
        height: 440,
        value: -180,
        arc: {
            angles: [-180, -150, -120, -90, -60, -30, 0],
            lineWidth: 3,
            radius: 180,
            strokeStyles: ['#fa01fe', '#2900ff', '#00fef6', '#00ff0e', '#fbfe03', '#fe8400', '#fd0400']
        },
        needle: {
            width: 4,
            radius: 190,
            fillStyle: '#8459db'
        },
        pointer: {
            radius: 9,
            fillStyle: '#1e98e4'
        },
        hashes: {
            values: [1, 2, 3, 4, 5, 6, 7],
            marks: 5,
            marksSize: 1,
            radius: 180,
            radiusOffset: 10,
            height: 6,
            fillStyle: '#8c8c8c',
            strokeStyle: '#8c8c8c',
            lineWidth: 1,
            lineCap: 'square',
            position: 'outset'
        },
        font: '14px Arial, sans-serif',
        textAlign: 'center',
        textBaseline: 'middle'
    };

    function extend() {
        if (arguments.length < 1 || typeof arguments[0] !== 'object') {
            return false;
        }

        if (arguments.length < 2) return arguments[0];

        var target = arguments[0];

        var args = Array.prototype.slice.call(arguments, 1);

        var key, val, src, clone;

        args.forEach(function (obj) {
            if (typeof obj !== 'object') return;

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (!(key in obj)) continue;

                    src = target[key];
                    val = obj[key];

                    if (val === target) continue;

                    if (typeof val !== 'object' || val === null) {
                        target[key] = val;
                        continue;
                    } else if (val instanceof Date) {
                        target[key] = new Date(val.getTime());
                        continue;
                    } else if (val instanceof RegExp) {
                        target[key] = new RegExp(val);
                        continue;
                    }

                    if (typeof src !== 'object' || src === null) {
                        clone = (Array.isArray(val)) ? [] : {};
                        target[key] = extend(clone, val);
                        continue;
                    }

                    if (Array.isArray(val)) {
                        clone = (Array.isArray(src)) ? val : [];
                    } else {
                        clone = (!Array.isArray(src)) ? src : {};
                    }
                    target[key] = extend(clone, val);
                }
            }
        });

        return target;
    }

    function redraw(canvas, context, options) {
        canvas.width = options.width;
        canvas.height = options.height;

        options.centerX = canvas.width / 2;
        options.centerY = canvas.height / 2;

        context.clearRect(0, 0, canvas.width, canvas.height);

        drawBar(context, options);
        drawHashes(context, options);
        drawNeedle(context, options);
        drawPointer(context, options);
    }

    function drawBar(context, options) {
        var arc = options.arc,
            angles = arc.angles;

        for (var i = 0, l = angles.length; i < l; i++) {
            var startAngle = getRadians(angles[i]),
                endAngle = getRadians(angles[i + 1]),
                stroke = arc.strokeStyles[i];

            if (typeof startAngle !== 'undefined' && typeof endAngle !== 'undefined') {
                context.save();
                context.beginPath();
                context.arc(options.centerX, options.centerY, arc.radius, startAngle, endAngle, false);
                if (typeof stroke !== 'undefined') {
                    context.lineWidth = arc.lineWidth;
                    context.strokeStyle = stroke;
                }
                context.stroke();
                context.closePath();
                context.restore();
            }
        }
    }

    function drawHashes(context, options) {
        var hashes = options.hashes,
            values = hashes.values,
            angles = options.arc.angles,
            startAngle = angles[0],
            endAngle = angles[angles.length - 1],
            steps = hashes.marks * (values.length - 1),
            angleStep = (startAngle - endAngle) / steps;

        context.save();
        context.fillStyle = hashes.fillStyle;
        context.strokeStyle = hashes.fillStyle;
        context.lineWidth = hashes.lineCap;
        context.lineCap = hashes.lineCap;
        context.font = options.font;
        context.textAlign = options.textAlign;
        context.textBaseline = options.textBaseline;
        for (var i = 0, j = 0; i <= steps; i++) {
            var angle = getRadians(startAngle - i * angleStep),
                position = (hashes.position === 'inset' ? -1 : 1),
                dx = Math.cos(angle),
                dy = Math.sin(angle),
                radius = hashes.radius + position * hashes.radiusOffset,
                x = options.centerX + dx * radius,
                y = options.centerY + dy * radius,
                lx = x + position * dx * hashes.height,
                ly = y + position * dy * hashes.height;

            if (i === 0 || i % hashes.marks === 0) {
                context.moveTo(x, y);
                context.lineTo(lx, ly);
                context.stroke();

                context.fillText(hashes.values[j++], 3 * lx - 2 * x, 3 * ly - 2 * y);
            }
            else {
                context.fillRect(x, y, hashes.marksSize, hashes.marksSize);
            }
        }
        context.restore();
    }

    function drawNeedle(context, options) {
        var needle = options.needle,
            value = Math.min(Math.max(options.value, options.arc.angles[0]), options.arc.angles[options.arc.angles.length - 1]);

        context.save();
        context.translate(options.centerX, options.centerY);
        context.rotate(getRadians(value));
        context.beginPath();
        context.moveTo(0, -1 * needle.width);
        context.lineTo(needle.radius, 0);
        context.lineTo(0, needle.width);
        context.fillStyle = needle.fillStyle;
        context.fill();
        context.closePath();
        context.restore();
    }

    function drawPointer(context, options) {
        var pointer = options.pointer;

        context.save();
        context.beginPath();
        context.arc(options.centerX, options.centerY, pointer.radius, 0, 2 * Math.PI, false);
        context.fillStyle = pointer.fillStyle;
        context.fill();
        context.closePath();
        context.restore();
    }

    function getRadians(rad) {
        return Math.PI * rad / 180;
    }

    function Gauge(containerId, options) {
        var container;
        if (typeof containerId === 'string') {
            container = document.getElementById(containerId);
        }
        else if ('nodeName' in containerId) {
            container = containerId;
        }
        if (container) {
            this.init(container, extend({}, defaults, options));
        }
    }

    Gauge.prototype.init = function (container, options) {
        this.container = container;
        this.options = options;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.redraw();
        this.container.appendChild(this.canvas);
    };

    Gauge.prototype.redraw = function (options) {
        redraw(this.canvas, this.context, !!options ? extend(this.options, options) : this.options);
    };

    Gauge.prototype.destroy = function () {
        this.canvas.parentNode.removeChild(this.canvas);
    };

    $.fn.gauge = function (options) {
        this.each(function () {
            if (!$.data(this, 'gauge')) {
                $.data(this, 'gauge', new Gauge(this, options));
            }
        });

        return this;
    };

})(jQuery);