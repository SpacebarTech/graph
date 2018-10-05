(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"));
	else if(typeof define === 'function' && define.amd)
		define("Graph", ["d3"], factory);
	else if(typeof exports === 'object')
		exports["Graph"] = factory(require("d3"));
	else
		root["Graph"] = factory(root["d3"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _d = __webpack_require__(8);

var d3 = _interopRequireWildcard(_d);

var _v = __webpack_require__(9);

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } //
//
//
//
//
//
//
//
//
//
//

var Browser = function () {
	// Opera 8.0+
	var isOpera = !!window.opr && !!opr.addons || !!window.opera || window.navigator.userAgent.indexOf(' OPR/') >= 0;

	// Firefox 1.0+
	var isFirefox = typeof InstallTrigger !== 'undefined';

	// Chrome 1+
	var isChrome = !!window.chrome && !!window.chrome.webstore || /(iPhone).+(CriOS).+(Safari)/g.test(window.navigator.userAgent);

	// Safari 3.0+ "[object HTMLElementConstructor]"
	var isSafari = /(iPhone).+(Version).+(Safari)/g.test(window.navigator.userAgent) && !isChrome;
	var isDesktopSafari = /(Macintosh).+(AppleWebKit).+(Safari)/g.test(window.navigator.userAgent) && !isChrome;

	// Internet Explorer 6-11
	var isIE = /*@cc_on!@*/false || !!document.documentMode;

	// Edge 20+
	var isEdge = !isIE && !!window.StyleMedia;

	// Blink engine detection
	var isBlink = (isChrome || isOpera) && !!window.CSS;

	return {
		isOpera: isOpera,
		isFirefox: isFirefox,
		isSafari: isSafari,
		isDesktopSafari: isDesktopSafari,
		isIE: isIE,
		isEdge: isEdge,
		isChrome: isChrome,
		isBlink: isBlink
	};
}();

var CorrectSafariTextOffset = function CorrectSafariTextOffset(y, dominantBaseline) {

	if (Browser && (Browser.isSafari || Browser.isDesktopSafari)) {

		// our dear friend Safari has no idea
		// what to do when someone sets the
		// dominant-baseline of some text to
		// either hanging or text-after-edge
		// so we have to account for this.
		var lineHeight = 16;
		var deltaYOf = {
			'hanging': lineHeight,
			'middle': lineHeight / 10,
			'text-after-edge': 0 - lineHeight / 2
		};

		if (HasProperty(deltaYOf, dominantBaseline)) {
			return y + deltaYOf[dominantBaseline];
		}
	}

	return y;
};

exports.default = {
	name: 'graph',

	props: {
		type: {
			required: true
		},
		data: {
			required: true
		},
		axisLabel: {
			required: true
		},
		usePercentage: {
			default: false
		},
		shouldRedraw: {
			required: true
		},
		height: {
			optional: true,
			default: 250
		},
		width: {
			optional: true,
			default: 440
		}
	},

	data: function data() {
		return {
			id: '-' + (0, _v2.default)(),

			scrollState: 'neither',

			dim: {
				l: 0,
				r: 0,
				b: 5,
				t: 0,
				h: 250,
				w: 440,
				ch: 245,
				cw: 440
			},

			minHorizontalLabelLength: 50,

			colors: {
				grey: '#4a4a4a',
				lightBlue: '#2E5491', // Changed from #28a5e7 for ada compliance
				lightGrey: '#888888',
				lightestGrey: '#f1f1f1'
			}
		};
	},

	mounted: function mounted() {
		var _this = this;

		if (this.shouldRedraw) {
			this.$nextTick(function () {
				return _this.draw();
			});
		}

		this.setScrollState();
	},


	watch: {
		type: function type() {

			this.redraw();
		},
		shouldRedraw: function shouldRedraw(_shouldRedraw) {

			if (_shouldRedraw) {
				this.redraw();
			}
		}
	},

	methods: {
		updateDim: function updateDim(newDim) {
			var _this2 = this;

			var props = Object.keys(newDim);
			var allowedProps = {
				l: true,
				r: true,
				b: true,
				t: true,
				w: true,
				h: true
			};

			props.forEach(function (prop) {

				if (!allowedProps[prop]) {
					throw new Error('Only props: ' + Object.keys(allowedProps).join(', ') + ' allowed.');
				}

				var val = newDim[prop];

				_this2.dim[prop] = val;
			});

			this.dim.ch = this.dim.h - (this.dim.b + this.dim.t);
			this.dim.cw = this.dim.w - (this.dim.l + this.dim.r);
		},
		redraw: function redraw() {

			d3.selectAll('.disposable.' + this.id).remove();

			this.draw();
		},
		draw: function draw() {

			this.updateDim({
				l: 0,
				r: 0,
				b: 5,
				t: 5,
				w: this.width,
				h: this.height
			});

			switch (this.type) {

				case 'line':
					{
						this.drawLineGraph();

						break;
					}

				case 'column':
					{
						this.drawColumnGraph();

						break;
					}

				case 'donut':
					{
						this.drawDonutGraph();

						break;
					}

				default:

			}
		},
		drawColumnGraph: function drawColumnGraph() {
			var _this3 = this;

			this.appendTitle(this.axisLabel, 'left');

			var range = this.createLineIndicators(this.data);
			var labelData = this.appendXAxisLabels(this.data);

			this.readjustLineIndicators();
			this.readjustTitle();

			var keys = Object.keys(this.data);
			var data = keys.map(function (a) {
				return _this3.data[a];
			});

			var $svg = d3.select('#' + this.id);
			var barGroups = $svg.selectAll('.' + this.id + '-bar-groups').data(data).enter().append('g').attr('class', 'disposable ' + this.id + ' ' + this.id + '-bar-groups');

			var _dim = this.dim,
			    t = _dim.t,
			    ch = _dim.ch;

			var heightOf = function heightOf(_ref) {
				var value = _ref.value;

				var spread = range.end - range.start;
				var diff = value - range.start;

				return diff / spread * ch;
			};

			var labelPositions = labelData.positions,
			    labelWidth = labelData.labelWidth;

			var barWidth = Math.max(labelWidth - 10, 5);
			var rectangles = barGroups.append('rect').attr('x', function (d, i) {
				return labelPositions[i] - barWidth / 2;
			}).attr('y', t + ch).attr('width', barWidth).attr('height', 0).style('fill', this.colors.lightBlue);

			rectangles.transition().duration(200).delay(function (d, i) {
				return 500 + i * 50;
			}).attr('y', function (d) {
				return t + ch - heightOf(d);
			}).attr('height', function (d) {
				return heightOf(d);
			});

			rectangles.each(function (d, i, rectangleNodes) {
				var rectangle = rectangleNodes[i];

				rectangle.addEventListener('mouseover', function () {
					_this3.showBarValue(data[i].value, rectangle);
				});

				rectangle.addEventListener('mouseleave', function () {

					d3.selectAll('.' + _this3.id + '-hover-element').remove();
				});
			});
		},
		drawDonutGraph: function drawDonutGraph() {
			var _this4 = this;

			this.appendTitle(this.axisLabel, 'top');

			var data = this.data;

			var keys = Object.keys(data).sort(function (a, b) {
				// eslint-disable-line
				return data[b].value - data[a].value;
			});

			var totalCount = keys.reduce(function (total, key) {
				var value = parseFloat(data[key].value, 10);

				return total + value;
			}, 0);

			var currentAngle = Math.PI * 2;
			var currentPercent = 0;
			var arcSizes = keys.map(function (key, i) {

				var datum = data[key];
				var parsedVal = parseFloat(datum.value, 10);
				var percent = parsedVal / totalCount;
				var angleSize = percent * (Math.PI * 2);
				var startAngle = currentAngle - angleSize;
				var endAngle = currentAngle;

				// keep track of how much of
				// the donut chart is already
				// accounted for
				currentAngle -= angleSize;

				var pastPercent = currentPercent;
				currentPercent += percent;

				var color = _this4.getColor(i, keys.length);
				var label = datum.label,
				    value = datum.value;


				return {
					startAngle: startAngle,
					endAngle: endAngle,
					color: color,
					label: label,
					value: value,
					percent: percent,
					pastPercent: pastPercent
				};
			});

			var R = function () {
				var _dim2 = _this4.dim,
				    ch = _dim2.ch,
				    cw = _dim2.cw;


				var smallestSide = Math.min(ch / 2, cw / 4);

				return Math.floor(smallestSide - 20);
			}();

			var r = R - 30;

			var $svg = d3.select('#' + this.id);

			var translate = function () {
				var _dim3 = _this4.dim,
				    l = _dim3.l,
				    cw = _dim3.cw,
				    t = _dim3.t;


				var horizontalCenter = l + cw / 2;
				var donutWidth = R + 20;

				return {
					x: horizontalCenter - donutWidth,
					y: t + donutWidth // also donut height ;)
				};
			}();

			var $donut = $svg.append('g').attr('transform', 'translate( ' + translate.x + ' ' + translate.y + ' )');

			// create arcs
			var arcs = $donut.selectAll('.arc-' + this.id + '.disposable.' + this.id).data(arcSizes).enter().append('path').attr('class', 'arc-' + this.id + ' disposable ' + this.id).attr('fill', function (d) {
				return d.color;
			}).attr('d', function (d) {

				var arc = d3.arc().innerRadius(r).outerRadius(R).startAngle(d.startAngle).endAngle(d.endAngle);

				return arc();
			}).style('cursor', 'pointer');

			// arcs event listeners
			arcs.each(function (d, i, nodes) {
				var arc = nodes[i];

				arc.addEventListener('mouseenter', function () {

					_this4.addCircleText(translate, d.value, r);

					// animate outside arcs
					_this4.showArc($donut, {
						innerRadius: r - 6,
						outerRadius: r - 3,
						startAngle: d.startAngle,
						endAngle: d.endAngle,
						color: d.color
					});
				});

				arc.addEventListener('mouseleave', function () {

					d3.selectAll('.' + _this4.id + '-hover-element').remove();
				});
			});

			this.updateDim({
				l: this.dim.l + this.dim.cw / 2
			});

			// attach labels
			var $labelWrapper = $svg.append('g').attr('class', 'disposable ' + this.id + ' circle-labels');

			var $labelGroups = $labelWrapper.selectAll('.' + this.id + '.circle-label-groups').data(arcSizes).enter().append('g').attr('class', 'disposable ' + this.id + ' circle-label-groups').attr('transform', 'translate( 0 10 )').style('opacity', 0);

			var rectangleWidth = 10;
			var rectanglePadding = 10;
			var lineHeight = 12;
			var lineSpace = 15;

			var textX = this.dim.l + rectangleWidth + rectanglePadding;
			var $labelText = $labelGroups.append('text').attr('x', textX).attr('y', function (d, i) {
				return translate.y - R + (lineHeight + lineSpace) * i;
			}) //
			.attr('text-anchor', 'start').attr('dominant-baseline', 'hanging').style('font-size', lineHeight + 'px').style('fill', this.colors.grey).text(function (d) {
				return d.label;
			});

			var sumHeightOfPastTexts = 0;
			$labelText.each(function (d, i, $labels) {
				var $el = $labels[i];
				var $label = d3.select($el);
				var maxLineSpace = _this4.dim.cw - (rectangleWidth + rectanglePadding);

				var position = {
					x: textX,
					y: translate.y - R + sumHeightOfPastTexts
				};

				$label.attr('y', position.y);

				var $labelGroup = d3.select($labelGroups._groups[0][i]);

				var $rect = $labelGroup.append('rect').attr('class', _this4.id + ' disposable circle-label-square').attr('height', 10).attr('width', 10).attr('x', position.x - 20).attr('y', position.y).attr('rx', '3').attr('ry', '3').style('fill', d.color);

				var numberOfRows = _this4.wrapText($label, maxLineSpace);

				var bBox = $label.node().getBBox();
				var height = bBox.height;


				sumHeightOfPastTexts += height + lineSpace;

				var $rectEl = $rect._groups[0][0];
				var listeningElements = [$rectEl, $el];

				listeningElements.forEach(function ($elem) {
					$elem.addEventListener('mouseenter', function () {
						_this4.showArc($donut, {
							innerRadius: r - 6,
							outerRadius: r - 3,
							startAngle: d.startAngle,
							endAngle: d.endAngle,
							color: d.color
						});

						_this4.addCircleText(translate, d.value, r);
					});

					$elem.style.cursor = 'pointer'; // eslint-disable-line

					$elem.addEventListener('mouseleave', function () {

						d3.selectAll('.' + _this4.id + '-hover-element').remove();
					});
				});

				$el.addEventListener('mouseleave', function () {});

				if (numberOfRows !== 2) {
					return;
				}

				$el.addEventListener('mouseenter', function () {
					var textDim = $label.node().getBBox();
					var toolTipPosition = {};

					toolTipPosition.x = position.x + textDim.width / 2;
					toolTipPosition.y = position.y + textDim.height / 2;

					_this4.displayToolTip(d.label, toolTipPosition, _this4.colors.lightBlue, _this4.colors.lightestGrey, '12px');
				});
			});

			var labelsHeight = $labelWrapper.node().getBBox().height;
			var donutHeight = $donut.node().getBBox().height;
			var labelsTranslateY = (donutHeight - labelsHeight) / 2;

			$labelWrapper.attr('transform', 'translate( 0 ' + labelsTranslateY + ' )');

			$labelGroups.transition().delay(function (d, i) {
				return 500 + i * 50;
			}).duration(200).attr('transform', 'translate( 0 0 )').style('opacity', 1);
			// animate in the donut chart
			$donut.append('path').attr('class', 'disposable ' + this.id).attr('d', function () {
				var arc = d3.arc().innerRadius(0).outerRadius(R + 5).startAngle(0).endAngle(Math.PI * 2);

				return arc();
			}).style('fill', 'white').transition().delay(500).duration(500).attrTween('d', function () {
				var arc = d3.arc();
				var d = {
					startAngle: 0,
					endAngle: Math.PI * 2,
					innerRadius: 0,
					outerRadius: R + 5
				};

				var interpolate = d3.interpolate(Math.PI * 2, 0);

				return function (a) {
					d.endAngle = interpolate(a);

					return arc(d);
				};
			}).remove();
		},
		drawLineGraph: function drawLineGraph() {
			var _this5 = this;

			this.appendTitle(this.axisLabel, 'left');

			var range = this.createLineIndicators(this.data);
			var labelData = this.appendXAxisLabels(this.data);

			this.readjustLineIndicators();
			this.readjustTitle();

			var _dim4 = this.dim,
			    t = _dim4.t,
			    ch = _dim4.ch;

			var getY = function getY(value) {
				var spread = range.end - range.start;
				var diff = value - range.start;

				return t + (ch - diff / spread * ch);
			};

			var labelPositions = labelData.positions;


			var keys = Object.keys(this.data);
			var data = keys.map(function (a) {
				return _this5.data[a];
			});
			var points = data.map(function (d, i) {
				var value = d.value;


				var y = getY(value);
				var x = labelPositions[i];

				return { x: x, y: y };
			});

			var $svg = d3.select('#' + this.id);

			var pathProperties = function () {

				var length = 0;
				var path = points.reduce(function (str, point, i) {

					if (i !== 0) {
						var lastPoint = points[i - 1];
						var dist = function () {
							var dx = point.x - lastPoint.x;
							var dy = point.y - lastPoint.y;

							return Math.sqrt(dx ** 2 + dy ** 2);
						}();

						length += dist;
					}

					var isLastPoint = i === points.length - 1;
					var lineEnding = isLastPoint ? '' : 'L ';

					var x = point.x,
					    y = point.y;


					return str + ' ' + x + ' ' + y + ' ' + lineEnding;
				}, 'M ');

				return {
					path: path,
					length: length
				};
			}();

			var path = pathProperties.path,
			    pathLength = pathProperties.length;


			var line = $svg.append('path').attr('class', this.id + '-line disposable ' + this.id).attr('d', path).style('stroke', this.colors.lightBlue).style('fill', 'transparent').style('stroke-width', 2).style('stroke-dasharray', pathLength + ', ' + pathLength).style('stroke-dashoffset', pathLength);

			var circles = $svg.selectAll('.' + this.id + '-bar-groups.' + this.id).data(points).enter().append('circle').attr('class', 'disposable ' + this.id + ' ' + this.id + '-line-circle').attr('cx', function (_ref2) {
				var x = _ref2.x;
				return x;
			}).attr('cy', function (_ref3) {
				var y = _ref3.y;
				return y;
			}).attr('r', 0).style('fill', 'white').style('stroke', this.colors.lightBlue).style('stroke-width', 2);

			line.transition().delay(500).duration(50 * points.length).style('stroke-dashoffset', 0);

			circles.transition().duration(200).delay(function (d, i) {
				return 500 + i * 50;
			}).attr('r', 4);

			circles.each(function (d, i, circleNodes) {
				var circle = circleNodes[i];

				circle.addEventListener('mouseover', function () {
					var x = d.x,
					    y = d.y;


					_this5.displayToolTip(data[i].value, { x: x, y: y });
				});

				circle.addEventListener('mouseleave', function () {

					d3.selectAll('.' + _this5.id + '-hover-element').remove();
				});
			});
		},


		/* generalizedActions */

		appendTitle: function appendTitle(title, direction) {
			var _this6 = this;

			var p = 5;

			var lx = this.dim.l + p;
			var ly = this.dim.t + this.dim.ch / 2;

			var options = {
				left: {
					x: CorrectSafariTextOffset(lx, 'hanging'),
					y: ly,
					transform: 'rotate(-90 ' + lx + ' ' + ly + ')'
				},
				top: {
					x: this.dim.l + this.dim.cw / 2,
					y: CorrectSafariTextOffset(this.dim.t + p, 'hanging')
				}
			};

			var attributes = options[direction];

			var $svg = d3.select('#' + this.id);
			var text = $svg.append('text').attr('class', 'disposable ' + this.id + ' ' + this.id + '-main-title').attr('text-anchor', 'middle').attr('dominant-baseline', 'hanging');

			var attrKeys = Object.keys(attributes);
			attrKeys.forEach(function (key) {
				text.attr(key, attributes[key]);
			});

			text.style('font-size', '14px').style('font-weight', 600).style('fill', this.colors.lightBlue).style('font-family', '"Work Sans", opensans').text(title);

			this.wrapText(text, this.dim.ch - 20);

			var newDim = function () {
				var textDim = text.node().getBBox();
				var h = textDim.height;

				var newValue = h + 2 * p;

				if (_this6.type === 'donut') {
					return {
						t: newValue
					};
				}

				return {
					l: newValue
				};
			}();

			this.updateDim(newDim);
		},
		wrapText: function wrapText(text, width) {
			var maxRows = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
			var wrapUp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;


			var row = 0;
			text.each(function () {
				var words = text.text().split(/\s+/).reverse();

				var lineHeight = 1.1; // ems
				var x = text.attr('x');
				var dy = parseFloat(text.attr('dy')) || 0;

				var line = [];
				var tspan = text.text(null).append('tspan').attr('dx', '0em').attr('dy', dy + 'em');

				var word = '';

				while (word = words.pop()) {
					// eslint-disable-line

					// add another word to this line
					line.push(word);
					tspan.text(line.join(' '));

					// check if it's now overflowing
					if (tspan.node().getComputedTextLength() > width) {

						row += 1;

						// if this is the second row, just
						// ellipse it
						if (row === maxRows) {
							var lastRow = line.join(' ');
							tspan.text(lastRow + '...');

							while (tspan.node().getComputedTextLength() > width) {

								if (lastRow.length === 2) {
									break;
								}

								lastRow = lastRow.slice(0, lastRow.length - 2).trim();

								tspan.text(lastRow + '...');
							}

							break;
						}

						// if so, remove the final word
						line.pop();
						tspan.text(line.join(' '));

						// set the contents of the next line
						line = [word];
						tspan = text.append('tspan').attr('x', x).attr('dy', (wrapUp ? lineHeight - dy : lineHeight + dy) + 'em').text(word);

						// loop now continues referencing the just added line
						// as tspan
					}
				}

				text.selectAll('tspan').attr('dy', function (d, i) {
					return (i === 0 ? 0 : lineHeight) + 'em';
				});
			});

			return row;
		},
		getRange: function getRange(dataObject) {

			var dataKeys = Object.keys(dataObject);
			var data = dataKeys.map(function (key) {
				return dataObject[key];
			});

			var values = data.map(function (a) {
				return a.value;
			});

			var biggest = Math.max.apply(Math, _toConsumableArray(values));
			var smallest = Math.min.apply(Math, _toConsumableArray(values));
			var difference = biggest - smallest;

			if (difference === 0) {

				var power = 0;

				while (biggest / 10 ** power > 10) {
					power += 1;
				}

				var increment = 10 ** power;

				return {
					start: 0,
					end: Math.ceil(biggest / increment) * increment
				};
			}

			// factor of ten to multiply
			// for the label's scale
			var scale = function () {

				var power = 0;

				while (difference / 10 ** power > 10) {
					power += 1;
				}

				return power;
			}();
			var relevantIncrement = 10 ** scale;

			// we'll start by trying to do a
			// scale from the closest instance of
			// our relevant increment to a point
			// four more relevantIncrements away
			var scaled = smallest !== relevantIncrement && smallest > 10;
			var bottomIncrement = Math.floor(smallest / relevantIncrement);
			var start = function () {
				if (!scaled) {
					return 0;
				}

				var num = bottomIncrement * relevantIncrement;

				num -= num % 5;

				return num;
			}();
			var dist = difference + (smallest - start);
			var numberOfIncrements = Math.ceil(dist / relevantIncrement);
			var spread = numberOfIncrements * relevantIncrement;
			var end = function () {
				var num = start + spread;

				num += 5 - num % 5;

				return num;
			}();

			return {
				start: start,
				end: end
			};
		},
		createLineIndicators: function createLineIndicators(dataObject) {
			var _this7 = this;

			var range = this.getRange(dataObject);
			var spread = range.end - range.start;

			// draw line indicators
			var numberOfLines = function () {
				var lowest = 5;

				var possibilities = [4, 5, 6];
				var optimalNumber = possibilities.reduce(function (current, a) {
					var variability = spread % (a - 1); // a - 1 because number of spaces is ( a - 1 )

					if (variability < lowest) {
						lowest = variability;

						return a;
					}

					return current;
				}, 5);

				return optimalNumber;
			}();

			var $svg = d3.select('#' + this.id);

			// append labels
			var labels = [];

			var _loop = function _loop(i) {

				// leave this seemingly repetitive declarations
				// in the loop or else the cached values of these
				// properties will throw off calculations made later
				// in the process of drawing
				var _dim6 = _this7.dim,
				    l = _dim6.l,
				    t = _dim6.t,
				    ch = _dim6.ch;

				var numberOfSpaces = numberOfLines - 1;
				var heightOfSpaces = ch / numberOfSpaces;

				var y = t + heightOfSpaces * i;
				var dominantBaseline = function () {
					if (i === 0) {
						return 'hanging';
					}

					if (i === numberOfLines - 1) {
						return 'text-after-edge';
					}

					return 'middle';
				}();

				var highest = range.start + spread;
				var increment = spread / numberOfSpaces;
				var text = highest - increment * i;

				var label = $svg.append('text').attr('class', 'disposable ' + _this7.id + ' ' + _this7.id + '-label').attr('x', l + 5).attr('y', CorrectSafariTextOffset(y, dominantBaseline)).style('font-size', '12px').style('fill', _this7.colors.grey).attr('text-anchor', 'start').attr('dominant-baseline', dominantBaseline).text(text);

				labels.push(label);
			};

			for (var i = 0; i < numberOfLines; i += 1) {
				_loop(i);
			}

			// realign the labels to the right
			var labelWidths = labels.map(function (a) {
				return a.node().getBBox().width;
			});
			var biggestLabelWidth = Math.max.apply(Math, _toConsumableArray(labelWidths));

			labels.forEach(function (label) {

				label.attr('x', _this7.dim.l + biggestLabelWidth + 5).attr('text-anchor', 'end');
			});

			// update char padding
			this.updateDim({
				l: this.dim.l + biggestLabelWidth + 10
			});

			// append lines
			for (var i = 0; i < numberOfLines; i += 1) {

				// leave this seemingly repetitive declarations
				// in the loop or else the cached values of these
				// properties will throw off calculations made later
				// in the process of drawing
				var _dim5 = this.dim,
				    l = _dim5.l,
				    t = _dim5.t,
				    ch = _dim5.ch,
				    cw = _dim5.cw;

				var numberOfSpaces = ch / (numberOfLines - 1);

				var y = t + numberOfSpaces * i;

				$svg.append('path').attr('d', 'M ' + l + ' ' + y + ' L ' + (l + cw) + ' ' + y).attr('class', 'disposable ' + this.id + ' ' + this.id + '-line-indicator').style('stroke', this.colors.lightGrey).style('stroke-width', 1).style('stroke-dasharray', i === numberOfLines - 1 ? '' : '2 2');
			}

			return range;
		},
		appendXAxisLabels: function appendXAxisLabels(data) {
			var _this8 = this;

			// create array of just labels
			var keys = Object.keys(data);
			var labels = keys.map(function (a) {
				return data[a].label;
			});

			// place the labels on the page
			var $svg = d3.select('#' + this.id);
			var labelWidth = (this.dim.cw - 20) / labels.length;

			var labelTexts = $svg.selectAll('.' + this.id + '-axis-label').data(labels).enter().append('text').attr('class', this.id + '-axis-label ' + this.id + ' disposable').attr('x', function (d, i) {
				var l = _this8.dim.l;

				var initialSpace = labelWidth / 2 + 10;
				var additionalSpace = labelWidth * i;

				return l + initialSpace + additionalSpace;
			})
			// .attr( 'y', CorrectSafariTextOffset( this.dim.t + this.dim.ch, 'hanging' ) )
			.attr('text-anchor', 'middle').attr('dominant-baseline', 'hanging').style('font-size', '12px').style('fill', this.colors.grey).style('font-family', '"Work Sans", open-sans').style('cursor', 'pointer').text(function (d) {
				return d;
			});

			// wrap the text of the labels
			labelTexts.each(function (content, i, nodes) {
				var text = d3.select(nodes[i]);
				var _colors = _this8.colors,
				    lightBlue = _colors.lightBlue,
				    lightestGrey = _colors.lightestGrey;


				_this8.wrapText(text, labelWidth - 10);

				var timer = null;
				// add event listeners

				nodes[i].addEventListener('mouseenter', function () {

					timer = window.setTimeout(function () {
						var _text$node$getBBox = text.node().getBBox(),
						    x = _text$node$getBBox.x,
						    y = _text$node$getBBox.y,
						    w = _text$node$getBBox.width;

						var coordinates = {
							x: x + w / 2,
							y: y
						};

						_this8.displayToolTip(content, coordinates, lightBlue, lightestGrey, '12px');
					}, 100);
				});

				nodes[i].addEventListener('mouseleave', function () {

					window.clearTimeout(timer);

					d3.selectAll('.' + _this8.id + '-hover-element').remove();
				});
			});

			// realign all the labels to the top
			// of the tallest label
			var labelNodes = Array.from(labelTexts._groups[0]);
			var heights = labelNodes.map(function (a) {
				return a.getBBox().height;
			});
			var tallest = Math.max.apply(Math, _toConsumableArray(heights));

			labelTexts.attr('y', function () {
				var _dim7 = _this8.dim,
				    t = _dim7.t,
				    ch = _dim7.ch;


				return CorrectSafariTextOffset(t + (ch - tallest), 'hanging');
			});

			this.updateDim({
				b: tallest + 10
			});

			var positions = labelNodes.map(function (a) {
				return d3.select(a).attr('x');
			});

			return {
				positions: positions,
				labelWidth: labelWidth
			};
		},
		readjustLineIndicators: function readjustLineIndicators() {

			var lineLabels = d3.selectAll('.' + this.id + '-label');
			var lines = d3.selectAll('.' + this.id + '-line-indicator');

			var numberOfLines = lines._groups[0].length;
			var _dim8 = this.dim,
			    t = _dim8.t,
			    ch = _dim8.ch,
			    l = _dim8.l,
			    cw = _dim8.cw;

			var spacing = ch / (numberOfLines - 1);

			var getY = function getY(i) {
				return t + spacing * i;
			};

			lines.attr('d', function (d, i) {
				var y = getY(i);

				return 'M ' + l + ' ' + y + ' L ' + (l + cw) + ' ' + y;
			});
			lineLabels.attr('y', function (d, i) {
				return getY(i);
			});
		},
		readjustTitle: function readjustTitle() {

			var label = d3.select('.' + this.id + '-main-title');
			var _dim9 = this.dim,
			    t = _dim9.t,
			    ch = _dim9.ch;


			var x = label.attr('x');
			var y = CorrectSafariTextOffset(t + ch / 2, 'hanging');

			label.attr('y', y).attr('transform', 'rotate( -90 ' + x + ' ' + y + ' )');
		},
		displayToolTip: function displayToolTip(text, coordinates) {
			var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'white';
			var backgroundColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
			var fontSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '16px';


			if (backgroundColor === null) {
				backgroundColor = this.colors.lightBlue; // eslint-disable-line
			}

			var _dim10 = this.dim,
			    l = _dim10.l,
			    cw = _dim10.cw,
			    t = _dim10.t;
			var X = coordinates.x,
			    Y = coordinates.y;

			var x = parseFloat(X, 10);
			var y = parseFloat(Y, 10) + 2;

			var $svg = d3.select('#' + this.id);
			var $hoverText = $svg.append('text').attr('class', this.id + '-hover-element').attr('x', x).attr('y', y).attr('dominant-baseline', 'middle').style('pointer-events', 'none').style('fill', 'rgba(255,255,255,0)') // transparent white
			.style('font-size', fontSize).text(text);

			var textBBox = $hoverText.node().getBBox();
			var displayAbove = y > t + textBBox.height + 31;
			var displayRight = x < l + textBBox.width / 2 + 25;
			var displayLeft = x > l + (cw - (textBBox.width / 2 + 25)) && !displayRight; // eslint-disable-line

			var textAnchor = function () {
				if (displayLeft) {
					return 'end';
				}

				if (displayRight) {
					return 'start';
				}

				return 'middle';
			}();

			if (displayLeft) {
				var maxWidth = x - this.dim.l;

				this.wrapText($hoverText, maxWidth, 10, displayAbove);
			}

			if (displayRight) {
				var _maxWidth = this.dim.l + this.dim.cw - x;

				this.wrapText($hoverText, _maxWidth, 10, displayAbove);
			}

			$hoverText.attr('text-anchor', textAnchor);
			textBBox = $hoverText.node().getBBox();

			var rectangleDims = function () {

				var position = {
					x: textBBox.x - 10,
					y: textBBox.y - 10,
					h: textBBox.height + 16,
					w: textBBox.width + 20
				};

				if (displayAbove) {
					position.y -= (position.h + textBBox.height) / 2 - 2;
				}

				if (!displayAbove) {
					position.y += 30;
				}

				var center = {
					x: position.x + position.w / 2,
					y: position.y + position.h / 2
				};

				return Object.assign(textBBox, { position: position, center: center });
			}();

			var $hoverRectangle = $svg.append('rect').attr('class', this.id + '-background-rect ' + this.id + '-hover-element').attr('x', rectangleDims.position.x).attr('y', rectangleDims.position.y).attr('height', rectangleDims.position.h).attr('width', rectangleDims.position.w).attr('fill', backgroundColor).attr('rx', 5).attr('ry', 5).style('opacity', 0).style('pointer-events', 'none');

			var $triangle = $svg.append('path').attr('class', this.id + '-hover-triangle ' + this.id + '-hover-element').attr('d', function () {
				var p = rectangleDims.position;


				if (displayAbove) {
					return 'M ' + x + ' ' + (y - 5) + ' L ' + (x + 7) + ' ' + (p.y + (p.h - 2)) + ' L ' + (x - 7) + ' ' + (p.y + (p.h - 2)) + ' Z';
				}

				return 'M ' + x + ' ' + y + ' L ' + (x + 7) + ' ' + (p.y + 2) + ' L ' + (x - 7) + ' ' + (p.y + 2) + ' Z';
			}).attr('fill', backgroundColor).style('opacity', 0).style('pointer-events', 'none');

			$triangle.transition().duration(200).style('opacity', 1);

			$hoverRectangle.transition().duration(200).style('opacity', 1);

			var textNode = $hoverText.node();
			textNode.parentNode.append(textNode);

			$hoverText.attr('text-anchor', 'start').attr('dominant-baseline', 'hanging').attr('x', rectangleDims.position.x + 10).attr('y', rectangleDims.position.y + 10).transition().duration(200).style('fill', color);
		},
		showBarValue: function showBarValue(text, rectangle) {

			var dim = d3.select(rectangle).node().getBBox();
			var x = dim.x + dim.width / 2;

			// start out assuming that the label
			// will be displayed horizontally
			// just below the top of the bar
			var $svg = d3.select('#' + this.id);
			var $text = $svg.append('text').attr('class', this.id + '-hover-element').attr('x', x).attr('y', dim.y + 10).attr('text-anchor', 'middle').attr('dominant-baseline', 'hanging').style('fill', 'white').style('font-size', '12px').style('font-family', '"Work Sans", open-sans').text(text);

			var textDim = $text.node().getBBox();

			// text should be above the bar
			var displayAboveBar = textDim.height + 20 > dim.height;
			if (displayAboveBar) {

				$text.attr('y', dim.y - 10).attr('dominant-baseline', 'text-after-edge').style('fill', this.colors.lightBlue);
			}

			// text should be displayed vertically
			var displayVertically = textDim.width + 10 > dim.width;
			if (displayVertically) {

				var y = $text.attr('y');

				$text.attr('transform', 'rotate( -90 ' + x + ' ' + y + ' )').attr('text-anchor', displayAboveBar ? 'start' : 'end').attr('dominant-baseline', 'middle');
			}
		},
		showArc: function showArc($donut, d) {

			$donut.append('path').attr('class', 'hover-element ' + this.id + ' ' + this.id + '-hover-element').attr('d', function () {
				var innerRadius = d.innerRadius,
				    outerRadius = d.outerRadius,
				    startAngle = d.startAngle;

				var start = {
					innerRadius: innerRadius,
					outerRadius: outerRadius,
					startAngle: startAngle,
					endAngle: startAngle
				};

				return d3.arc()(start);
			}).style('fill', d.color).transition().duration(200).attrTween('d', function () {
				var arc = d3.arc();

				var interpolate = d3.interpolate(d.startAngle, d.endAngle);

				return function (a) {
					d.endAngle = interpolate(a); // eslint-disable-line

					return arc(d);
				};
			});
		},
		addCircleText: function addCircleText(translate, text, maxRadius) {
			var $svg = d3.select('#' + this.id);
			var $text = $svg.append('text').attr('class', this.id + '-hover-element').attr('x', translate.x).attr('y', translate.y).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').style('fill', this.colors.lightBlue).style('font-size', '24px').text(text);

			var fontSize = 24;
			while ($text.node().getBBox().width > maxRadius * 2) {

				fontSize -= 1;

				$text.style('font-size', fontSize + 'px');

				if (fontSize === 10) {
					break;
				}
			}
		},


		getColor: function getColor(i, length) {
			return d3.scaleLinear().domain([0, length]).range(['rgb(46,84,145)', 'rgb(183, 198, 218)'])(i);
		},

		// meta

		setScrollState: function setScrollState(e) {
			var _this9 = this;

			var graph = function () {
				if (e) {
					return e.target;
				}

				return _this9.$refs.graph;
			}();

			var scrollLeft = graph.scrollLeft,
			    clientWidth = graph.clientWidth,
			    scrollWidth = graph.scrollWidth;

			var state = function () {
				if (clientWidth === scrollWidth) {
					return 'neither';
				}

				if (scrollLeft + clientWidth === scrollWidth) {
					return 'left';
				}

				if (scrollLeft === 0) {
					return 'right';
				}

				return 'both';
			}();

			this.scrollState = state;
		},
		scrollTo: function scrollTo(direction) {
			var _this10 = this;

			var _$refs$graph = this.$refs.graph,
			    scrollLeft = _$refs$graph.scrollLeft,
			    scrollWidth = _$refs$graph.scrollWidth,
			    clientWidth = _$refs$graph.clientWidth;


			var increment = function increment(num) {
				if (direction === 'right') {
					return Math.min(num + 10, scrollWidth - clientWidth);
				}

				return Math.max(num - 10, 0);
			};

			var newScrollLeft = increment(scrollLeft);

			this.$refs.graph.scrollLeft = newScrollLeft;

			var scrolledCompletelyRight = newScrollLeft === scrollWidth - clientWidth && direction === 'right';
			var scrolledCompletelyLeft = newScrollLeft === 0 && direction === 'left';
			var doneScrolling = scrolledCompletelyLeft || scrolledCompletelyRight;

			if (!doneScrolling) {
				window.requestAnimationFrame(function () {
					return _this10.scrollTo(direction);
				});
			}
		}
	}
};
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c208292_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_main_vue__ = __webpack_require__(12);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(2)
}
var normalizeComponent = __webpack_require__(7)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c208292_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_main_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/main.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3c208292", Component.options)
  } else {
    hotAPI.reload("data-v-3c208292", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("58d5fc73", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3c208292\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/sass-loader/lib/loader.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./main.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3c208292\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/sass-loader/lib/loader.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./main.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(6)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(10);
var bytesToUuid = __webpack_require__(11);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "graph swiper-no-swiping",
      class: { "has-indicators": _vm.scrollState !== "neither" }
    },
    [
      _c("div", { staticClass: "scroll-indicators", class: _vm.scrollState }, [
        _c("div", { staticClass: "indicator left" }, [
          _c("div", {
            staticClass: "scroll",
            on: {
              click: function($event) {
                _vm.scrollTo("left")
              }
            }
          })
        ]),
        _c("div", { staticClass: "indicator right" }, [
          _c("div", {
            staticClass: "scroll",
            on: {
              click: function($event) {
                _vm.scrollTo("right")
              }
            }
          })
        ])
      ]),
      _c(
        "div",
        {
          ref: "graph",
          staticClass: "graph-wrapper",
          on: {
            "&scroll": function($event) {
              return _vm.setScrollState($event)
            }
          }
        },
        [
          _c("svg", {
            ref: "svg",
            attrs: { id: _vm.id, height: _vm.height, width: _vm.width }
          })
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3c208292", esExports)
  }
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map