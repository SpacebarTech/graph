<template lang="pug">
.graph.swiper-no-swiping(:class='{ "has-indicators" : scrollState !== "neither" }')
  .scroll-indicators(:class='scrollState')
    .indicator.left
      .scroll(@click='scrollTo( "left" )')
    .indicator.right
      .scroll(@click='scrollTo( "right" )')
  .graph-wrapper(ref='graph' @scroll.passive='setScrollState')
    svg(ref='svg' :id='id' :height='height' :width='width')
</template>

<script>
import * as d3 from "d3";
import uuid from 'uuid/v5';

const CorrectSafariTextOffset = ( y, dominantBaseline ) => {

	if ( Browser && ( Browser.isSafari || Browser.isDesktopSafari ) ) {

		// our dear friend Safari has no idea
		// what to do when someone sets the
		// dominant-baseline of some text to
		// either hanging or text-after-edge
		// so we have to account for this.
		const lineHeight = 16;
		const deltaYOf   = {
			'hanging'         : lineHeight,
			'middle'          : ( lineHeight / 10 ),
			'text-after-edge' : ( 0 - ( lineHeight / 2 ) ),
		};

		if ( HasProperty( deltaYOf, dominantBaseline ) ) {
			return y + deltaYOf[dominantBaseline];
		}

	}

	return y;
};

export default {
	name : 'graph',

	props : {
		type : {
			required : true,
		},
		data : {
			required : true,
		},
		axisLabel : {
			required : true
		},
		usePercentage : {
			default : false
		},
		shouldRedraw : {
			required : true
		},
		height : {
			optional : true,
			default  : 250
		},
		width : {
			optional : true,
			default  : 440,
		}
	},

	data : () => ( {
		id : uuid(),

		scrollState : 'neither',

		dim : {
			l  : 0,
			r  : 0,
			b  : 5,
			t  : 0,
			h  : 250,
			w  : 440,
			ch : 245,
			cw : 440,
		},

		minHorizontalLabelLength : 50,

		colors : {
			grey         : '#4a4a4a',
			lightBlue    : '#2E5491', // Changed from #28a5e7 for ada compliance
			lightGrey    : '#888888',
			lightestGrey : '#f1f1f1',
		}
	} ),

	mounted() {

		if ( this.shouldRedraw ) {
			this.$nextTick( () => this.draw() );
		}

		this.setScrollState();

	},

	watch : {

		type() {

			this.redraw();

		},

		shouldRedraw( shouldRedraw ) {

			if ( shouldRedraw ) {
				this.redraw();
			}

		}

	},

	methods : {

		updateDim( newDim ) {

			const props = Object.keys( newDim );
			const allowedProps = {
				l : true,
				r : true,
				b : true,
				t : true,
				w : true,
				h : true
			};

			props.forEach( ( prop ) => {

				if ( !allowedProps[prop] ) {
					throw new Error( `Only props: ${Object.keys( allowedProps ).join( ', ' )} allowed.` );
				}

				const val = newDim[prop];

				this.dim[prop] = val;
			} );

			this.dim.ch = ( this.dim.h - ( this.dim.b + this.dim.t ) );
			this.dim.cw = ( this.dim.w - ( this.dim.l + this.dim.r ) );

		},

		redraw() {

			d3.selectAll( `.disposable.${this.id}` )
				.remove();

			this.draw();

		},

		draw() {

			this.updateDim( {
				l : 0,
				r : 0,
				b : 5,
				t : 5,
				w : this.width,
				h : this.height
			} );

			switch ( this.type ) {

				case 'line' : {
					this.drawLineGraph();

					break;
				}

				case 'column' : {
					this.drawColumnGraph();

					break;
				}

				case 'donut' : {
					this.drawDonutGraph();

					break;
				}

				default :

			}

		},

		drawColumnGraph() {

			this.appendTitle( this.axisLabel, 'left' );

			const range     = this.createLineIndicators( this.data );
			const labelData = this.appendXAxisLabels( this.data );

			this.readjustLineIndicators();
			this.readjustTitle();

			const keys = Object.keys( this.data );
			const data = keys.map( a => this.data[a] );

			const $svg      = d3.select( `#${this.id}` );
			const barGroups = $svg.selectAll( `.${this.id}-bar-groups` )
				.data( data )
				.enter()
				.append( 'g' )
				.attr( 'class', `disposable ${this.id} ${this.id}-bar-groups` );

			const { t, ch } = this.dim;
			const heightOf  = ( { value } ) => {
				const spread = ( range.end - range.start );
				const diff   = ( value - range.start );

				return ( ( diff / spread ) * ch );
			};

			const { positions : labelPositions, labelWidth } = labelData;
			const barWidth = Math.max( labelWidth - 10, 5 );
			const rectangles = barGroups.append( 'rect' )
				.attr( 'x', ( d, i ) => labelPositions[i] - ( barWidth / 2 ) )
				.attr( 'y', t + ch )
				.attr( 'width', barWidth )
				.attr( 'height', 0 )
				.style( 'fill', this.colors.lightBlue );

			rectangles.transition()
				.duration( 200 )
				.delay( ( d, i ) => 500 + ( i * 50 ) )
				.attr( 'y', d => ( t + ch ) - heightOf( d ) )
				.attr( 'height', d => heightOf( d ) );

			rectangles.each( ( d, i, rectangleNodes ) => {
				const rectangle = rectangleNodes[i];

				rectangle.addEventListener( 'mouseover', () => {
					this.showBarValue( data[i].value, rectangle );
				} );

				rectangle.addEventListener( 'mouseleave', () => {

					d3.selectAll( `.${this.id}-hover-element` )
						.remove();

				} );
			} );

		},

		drawDonutGraph() {

			this.appendTitle( this.axisLabel, 'top' );

			const { data } = this;
			const keys     = Object.keys( data ).sort( ( a, b ) => { // eslint-disable-line
				return data[b].value - data[a].value;
			} );

			const totalCount = keys.reduce( ( total, key ) => {
				const value = parseFloat( data[key].value, 10 );

				return total + value;
			}, 0 );

			let currentAngle   = ( Math.PI * 2 );
			let currentPercent = 0;
			const arcSizes   = keys.map( ( key, i ) => {

				const datum      = data[key];
				const parsedVal  = parseFloat( datum.value, 10 );
				const percent    = parsedVal / totalCount;
				const angleSize  = percent * ( Math.PI * 2 );
				const startAngle = currentAngle - angleSize;
				const endAngle   = currentAngle;

				// keep track of how much of
				// the donut chart is already
				// accounted for
				currentAngle -= angleSize;

				const pastPercent = currentPercent;
				currentPercent += percent;

				const color            = this.getColor( i, keys.length );
				const { label, value } = datum;

				return {
					startAngle,
					endAngle,
					color,
					label,
					value,
					percent,
					pastPercent
				};

			} );

			const R = ( () => {

				const { ch, cw }  = this.dim;

				const smallestSide = Math.min( ( ch / 2 ), ( cw / 4 ) );

				return Math.floor( smallestSide - 20 );

			} )();

			const r = R - 30;

			const $svg = d3.select( `#${this.id}` );

			const translate = ( () => {
				const { l, cw, t } = this.dim;

				const horizontalCenter = l + ( cw / 2 );
				const donutWidth       = R + 20;

				return {
					x : horizontalCenter - donutWidth,
					y : t + donutWidth, // also donut height ;)
				};
			} )();

			const $donut = $svg.append( 'g' )
				.attr( 'transform', `translate( ${translate.x} ${translate.y} )` );

			// create arcs
			const arcs = $donut.selectAll( `.arc-${this.id}.disposable.${this.id}` )
				.data( arcSizes )
				.enter()
				.append( 'path' )
				.attr( 'class', `arc-${this.id} disposable ${this.id}` )
				.attr( 'fill', d => d.color )
				.attr( 'd', ( d ) => {

					const arc = d3.arc()
						.innerRadius( r )
						.outerRadius( R )
						.startAngle( d.startAngle )
						.endAngle( d.endAngle );

					return arc();

				} )
				.style( 'cursor', 'pointer' );

			// arcs event listeners
			arcs.each( ( d, i, nodes ) => {
				const arc = nodes[i];

				arc.addEventListener( 'mouseenter', () => {

					this.addCircleText( translate, d.value, r );

					// animate outside arcs
					this.showArc( $donut, {
						innerRadius : r - 6,
						outerRadius : r - 3,
						startAngle  : d.startAngle,
						endAngle    : d.endAngle,
						color       : d.color
					} );

				} );

				arc.addEventListener( 'mouseleave', () => {

					d3.selectAll( `.${this.id}-hover-element` )
						.remove();

				} );

			} );

			this.updateDim( {
				l : this.dim.l + ( this.dim.cw / 2 )
			} );

			// attach labels
			const $labelWrapper = $svg.append( 'g' )
				.attr( 'class', `disposable ${this.id} circle-labels` );

			const $labelGroups = $labelWrapper.selectAll( `.${this.id}.circle-label-groups` )
				.data( arcSizes )
				.enter()
				.append( 'g' )
				.attr( 'class', `disposable ${this.id} circle-label-groups` )
				.attr( 'transform', 'translate( 0 10 )' )
				.style( 'opacity', 0 );

			const rectangleWidth   = 10;
			const rectanglePadding = 10;
			const lineHeight       = 12;
			const lineSpace        = 15;

			const textX      = this.dim.l + rectangleWidth + rectanglePadding;
			const $labelText = $labelGroups.append( 'text' )
				.attr( 'x', textX )
				.attr( 'y', ( d, i ) => ( translate.y - R ) + ( ( lineHeight + lineSpace ) * i ) ) //
				.attr( 'text-anchor', 'start' )
				.attr( 'dominant-baseline', 'hanging' )
				.style( 'font-size', `${lineHeight}px` )
				.style( 'fill', this.colors.grey )
				.text( d => d.label );

			let sumHeightOfPastTexts = 0;
			$labelText.each( ( d, i, $labels ) => {
				const $el           = $labels[i];
				const $label        = d3.select( $el );
				const maxLineSpace  = this.dim.cw - ( rectangleWidth + rectanglePadding );

				const position = {
					x : textX,
					y : ( translate.y - R ) + sumHeightOfPastTexts,
				};

				$label.attr( 'y', position.y );

				const $labelGroup = d3.select( $labelGroups._groups[0][i] );

				const $rect = $labelGroup.append( 'rect' )
					.attr( 'class', `${this.id} disposable circle-label-square` )
					.attr( 'height', 10 )
					.attr( 'width', 10 )
					.attr( 'x', position.x - 20 )
					.attr( 'y', position.y )
					.attr( 'rx', '3' )
					.attr( 'ry', '3' )
					.style( 'fill', d.color );

				const numberOfRows = this.wrapText( $label, maxLineSpace );

				const bBox       = $label.node().getBBox();
				const { height } = bBox;

				sumHeightOfPastTexts += ( height + lineSpace );

				const $rectEl           = $rect._groups[0][0];
				const listeningElements = [$rectEl, $el];

				listeningElements.forEach( ( $elem ) => {
					$elem.addEventListener( 'mouseenter', () => {
						this.showArc( $donut, {
							innerRadius : r - 6,
							outerRadius : r - 3,
							startAngle  : d.startAngle,
							endAngle    : d.endAngle,
							color       : d.color
						} );

						this.addCircleText( translate, d.value, r );
					} );

					$elem.style.cursor = 'pointer'; // eslint-disable-line

					$elem.addEventListener( 'mouseleave', () => {

						d3.selectAll( `.${this.id}-hover-element` )
							.remove();

					} );
				} );

				$el.addEventListener( 'mouseleave', () => {
				} );

				if ( numberOfRows !== 2 ) {
					return;
				}

				$el.addEventListener( 'mouseenter', () => {
					const textDim         = $label.node().getBBox();
					const toolTipPosition = {};

					toolTipPosition.x = position.x + ( textDim.width / 2 );
					toolTipPosition.y = position.y + ( textDim.height / 2 );

					this.displayToolTip( d.label, toolTipPosition, this.colors.lightBlue, this.colors.lightestGrey, '12px' );
				} );

			} );

			const labelsHeight     = $labelWrapper.node().getBBox().height;
			const donutHeight      = $donut.node().getBBox().height;
			const labelsTranslateY = ( donutHeight - labelsHeight ) / 2;

			$labelWrapper.attr( 'transform', `translate( 0 ${labelsTranslateY} )` );

			$labelGroups.transition()
				.delay( ( d, i ) => 500 + ( i * 50 ) )
				.duration( 200 )
				.attr( 'transform', 'translate( 0 0 )' )
				.style( 'opacity', 1 );
			// animate in the donut chart
			$donut.append( 'path' )
				.attr( 'class', `disposable ${this.id}` )
				.attr( 'd', () => {
					const arc = d3.arc()
						.innerRadius( 0 )
						.outerRadius( R + 5 )
						.startAngle( 0 )
						.endAngle( Math.PI * 2 );

					return arc();
				} )
				.style( 'fill', 'white' )
				.transition()
				.delay( 500 )
				.duration( 500 )
				.attrTween( 'd', () => {
					const arc = d3.arc();
					const d   = {
						startAngle  : 0,
						endAngle    : Math.PI * 2,
						innerRadius : 0,
						outerRadius : R + 5
					};

					const interpolate = d3.interpolate( Math.PI * 2, 0 );

					return ( a ) => {
						d.endAngle = interpolate( a );

						return arc( d );
					};
				} )
				.remove();

		},

		drawLineGraph() {

			this.appendTitle( this.axisLabel, 'left' );

			const range     = this.createLineIndicators( this.data );
			const labelData = this.appendXAxisLabels( this.data );

			this.readjustLineIndicators();
			this.readjustTitle();

			const { t, ch } = this.dim;
			const getY      = ( value ) => {
				const spread = ( range.end - range.start );
				const diff   = ( value - range.start );

				return t + ( ch - ( ( diff / spread ) * ch ) );
			};

			const { positions : labelPositions } = labelData;

			const keys   = Object.keys( this.data );
			const data   = keys.map( a => this.data[a] );
			const points = data.map( ( d, i ) => {
				const { value } = d;

				const y = getY( value );
				const x = labelPositions[i];

				return { x, y };
			} );

			const $svg = d3.select( `#${this.id}` );

			const pathProperties = ( () => {

				let length = 0;
				const path     = points.reduce( ( str, point, i ) => {

					if ( i !== 0 ) {
						const lastPoint = points[i - 1];
						const dist      = ( () => {
							const dx = ( point.x ) - ( lastPoint.x );
							const dy = ( point.y ) - ( lastPoint.y );

							return Math.sqrt( ( dx ** 2 ) + ( dy ** 2 ) );
						} )();

						length += dist;
					}

					const isLastPoint = ( i === ( points.length - 1 ) );
					const lineEnding  = isLastPoint ? '' : 'L ';

					const { x, y } = point;

					return `${str} ${x} ${y} ${lineEnding}`;

				}, 'M ' );

				return {
					path,
					length
				};

			} )();

			const { path, length : pathLength } = pathProperties;

			const line = $svg.append( 'path' )
				.attr( 'class', `${this.id}-line disposable ${this.id}` )
				.attr( 'd', path )
				.style( 'stroke', this.colors.lightBlue )
				.style( 'fill', 'transparent' )
				.style( 'stroke-width', 2 )
				.style( 'stroke-dasharray', `${pathLength}, ${pathLength}` )
				.style( 'stroke-dashoffset', pathLength );

			const circles = $svg.selectAll( `.${this.id}-bar-groups.${this.id}` )
				.data( points )
				.enter()
				.append( 'circle' )
				.attr( 'class', `disposable ${this.id} ${this.id}-line-circle` )
				.attr( 'cx', ( { x } ) => x )
				.attr( 'cy', ( { y } ) => y )
				.attr( 'r', 0 )
				.style( 'fill', 'white' )
				.style( 'stroke', this.colors.lightBlue )
				.style( 'stroke-width', 2 );

			line.transition()
				.delay( 500 )
				.duration( 50 * points.length )
				.style( 'stroke-dashoffset', 0 );

			circles.transition()
				.duration( 200 )
				.delay( ( d, i ) => 500 + ( i * 50 ) )
				.attr( 'r', 4 );

			circles.each( ( d, i, circleNodes ) => {
				const circle = circleNodes[i];

				circle.addEventListener( 'mouseover', () => {
					const { x, y } = d;

					this.displayToolTip( data[i].value, { x, y } );
				} );

				circle.addEventListener( 'mouseleave', () => {

					d3.selectAll( `.${this.id}-hover-element` )
						.remove();

				} );
			} );

		},

		/* generalizedActions */

		appendTitle( title, direction ) {

			const p = 5;

			const lx = this.dim.l + p;
			const ly = ( this.dim.t + ( this.dim.ch / 2 ) );

			const options = {
				left : {
					x         : CorrectSafariTextOffset( lx, 'hanging' ),
					y         : ly,
					transform : `rotate(-90 ${lx} ${ly})`,
				},
				top : {
					x : ( this.dim.l + ( this.dim.cw / 2 ) ),
					y : CorrectSafariTextOffset( this.dim.t + p, 'hanging' ),
				}
			};

			const attributes = options[direction];

			const $svg = d3.select( `#${this.id}` );
			const text = $svg.append( 'text' )
				.attr( 'class', `disposable ${this.id} ${this.id}-main-title` )
				.attr( 'text-anchor', 'middle' )
				.attr( 'dominant-baseline', 'hanging' );

			const attrKeys = Object.keys( attributes );
			attrKeys.forEach( ( key ) => {
				text.attr( key, attributes[key] );
			} );

			text.style( 'font-size', '14px' )
				.style( 'font-weight', 600 )
				.style( 'fill', this.colors.lightBlue )
				.style( 'font-family', '"Work Sans", opensans' )
				.text( title );

			this.wrapText( text, this.dim.ch - 20 );

			const newDim = ( () => {
				const textDim       = text.node().getBBox();
				const { height: h } = textDim;
				const newValue      = h + ( 2 * p );

				if ( this.type === 'donut' ) {
					return {
						t : newValue
					};
				}

				return {
					l : newValue
				};

			} )();

			this.updateDim( newDim );
		},

		wrapText( text, width, maxRows = 2, wrapUp = false ) {

			let row = 0;
			text.each( () => {
				const words = text.text().split( /\s+/ ).reverse();

				const lineHeight = 1.1; // ems
				const x          = text.attr( 'x' );
				const dy         = parseFloat( text.attr( 'dy' ) ) || 0;

				let line  = [];
				let tspan = text.text( null )
					.append( 'tspan' )
					.attr( 'dx', '0em' )
					.attr( 'dy', `${dy}em` );

				let word = '';

				while ( word = words.pop() ) { // eslint-disable-line

					// add another word to this line
					line.push( word );
					tspan.text( line.join( ' ' ) );

					// check if it's now overflowing
					if ( tspan.node().getComputedTextLength() > width ) {

						row += 1;

						// if this is the second row, just
						// ellipse it
						if ( row === maxRows ) {
							let lastRow = line.join( ' ' );
							tspan.text( `${lastRow}...` );

							while ( tspan.node().getComputedTextLength() > width ) {

								if ( lastRow.length === 2 ) {
									break;
								}

								lastRow = lastRow.slice( 0, lastRow.length - 2 ).trim();

								tspan.text( `${lastRow}...` );
							}

							break;
						}

						// if so, remove the final word
						line.pop();
						tspan.text( line.join( ' ' ) );

						// set the contents of the next line
						line  = [word];
						tspan = text.append( 'tspan' )
							.attr( 'x', x )
							.attr( 'dy', `${wrapUp ? lineHeight - dy : lineHeight + dy}em` )
							.text( word );

						// loop now continues referencing the just added line
						// as tspan
					}
				}

				text.selectAll( 'tspan' )
					.attr( 'dy', ( d, i ) => `${i === 0 ? 0 : lineHeight}em` );

			} );

			return row;

		},

		getRange( dataObject ) {

			const dataKeys = Object.keys( dataObject );
			const data     = dataKeys.map( key => dataObject[key] );

			const values = data.map( a => a.value );

			const biggest    = Math.max( ...values );
			const smallest   = Math.min( ...values );
			const difference = ( biggest - smallest );

			if ( difference === 0 ) {

				let power = 0;

				while ( biggest / ( 10 ** power ) > 10 ) {
					power += 1;
				}

				const increment = 10 ** power;

				return {
					start : 0,
					end   : Math.ceil( biggest / increment ) * increment,
				};

			}

			// factor of ten to multiply
			// for the label's scale
			const scale = ( () => {

				let power = 0;

				while ( difference / ( 10 ** power ) > 10 ) {
					power += 1;
				}

				return power;

			} )();
			const relevantIncrement =  10 ** scale;

			// we'll start by trying to do a
			// scale from the closest instance of
			// our relevant increment to a point
			// four more relevantIncrements away
			const scaled             = ( smallest !== relevantIncrement ) && ( smallest > 10 );
			const bottomIncrement    = Math.floor( smallest / relevantIncrement );
			const start              = ( () => {
				if ( !scaled ) {
					return 0;
				}

				let num = ( bottomIncrement * relevantIncrement );

				num -= ( num % 5 );

				return num;
			} )();
			const dist               = ( difference + ( smallest - start ) );
			const numberOfIncrements = Math.ceil( dist / relevantIncrement );
			const spread             = ( numberOfIncrements * relevantIncrement );
			const end                = ( () => {
				let num = start + spread;

				num += ( 5 - ( num % 5 ) );

				return num;
			} )();

			return {
				start,
				end,
			};

		},

		createLineIndicators( dataObject ) {

			const range  = this.getRange( dataObject );
			const spread = ( range.end - range.start );

			// draw line indicators
			const numberOfLines = ( () => {
				let lowest = 5;

				const possibilities = [4, 5, 6];
				const optimalNumber = possibilities.reduce( ( current, a ) => {
					const variability = spread % ( a - 1 ); // a - 1 because number of spaces is ( a - 1 )

					if ( variability < lowest ) {
						lowest = variability;

						return a;
					}

					return current;
				}, 5 );

				return optimalNumber;
			} )();

			const $svg = d3.select( `#${this.id}` );

			// append labels
			const labels = [];
			for ( let i = 0; i < numberOfLines; i += 1 ) {

				// leave this seemingly repetitive declarations
				// in the loop or else the cached values of these
				// properties will throw off calculations made later
				// in the process of drawing
				const { l, t, ch }   = this.dim;
				const numberOfSpaces = ( numberOfLines - 1 );
				const heightOfSpaces = ( ch / numberOfSpaces );

				const y = t + ( heightOfSpaces * i );
				const dominantBaseline = ( () => {
					if ( i === 0 ) {
						return 'hanging';
					}

					if ( i === ( numberOfLines - 1 ) ) {
						return 'text-after-edge';
					}

					return 'middle';
				} )();

				const highest        = ( range.start + spread );
				const increment      = ( spread / numberOfSpaces );
				const text           = ( highest - ( increment * i ) );

				const label = $svg.append( 'text' )
					.attr( 'class', `disposable ${this.id} ${this.id}-label` )
					.attr( 'x', l + 5 )
					.attr( 'y', CorrectSafariTextOffset( y, dominantBaseline ) )
					.style( 'font-size', '12px' )
					.style( 'fill', this.colors.grey )
					.attr( 'text-anchor', 'start' )
					.attr( 'dominant-baseline', dominantBaseline )
					.text( text );

				labels.push( label );
			}

			// realign the labels to the right
			const labelWidths       = labels.map( a => a.node().getBBox().width );
			const biggestLabelWidth = Math.max( ...labelWidths );

			labels.forEach( ( label ) => {

				label.attr( 'x', this.dim.l + biggestLabelWidth + 5 )
					.attr( 'text-anchor', 'end' );

			} );

			// update char padding
			this.updateDim( {
				l : ( this.dim.l + biggestLabelWidth + 10 )
			} );

			// append lines
			for ( let i = 0; i < numberOfLines; i += 1 ) {

				// leave this seemingly repetitive declarations
				// in the loop or else the cached values of these
				// properties will throw off calculations made later
				// in the process of drawing
				const { l, t, ch, cw } = this.dim;
				const numberOfSpaces = ( ch / ( numberOfLines - 1 ) );

				const y = t + ( numberOfSpaces * i );

				$svg.append( 'path' )
					.attr( 'd', `M ${l} ${y} L ${l + cw} ${y}` )
					.attr( 'class', `disposable ${this.id} ${this.id}-line-indicator` )
					.style( 'stroke', this.colors.lightGrey )
					.style( 'stroke-width', 1 )
					.style( 'stroke-dasharray', i === numberOfLines - 1 ? '' : '2 2' );

			}

			return range;

		},

		appendXAxisLabels( data ) {

			// create array of just labels
			const keys   = Object.keys( data );
			const labels = keys.map( a => data[a].label );

			// place the labels on the page
			const $svg       = d3.select( `#${this.id}` );
			const labelWidth = ( ( this.dim.cw - 20 ) / labels.length );

			const labelTexts = $svg.selectAll( `.${this.id}-axis-label` )
				.data( labels )
				.enter()
				.append( 'text' )
				.attr( 'class', `${this.id}-axis-label ${this.id} disposable` )
				.attr( 'x', ( d, i ) => {

					const { l }           = this.dim;
					const initialSpace    = ( labelWidth / 2 ) + 10;
					const additionalSpace = ( labelWidth * i );

					return ( l + initialSpace + additionalSpace );

				} )
				// .attr( 'y', CorrectSafariTextOffset( this.dim.t + this.dim.ch, 'hanging' ) )
				.attr( 'text-anchor', 'middle' )
				.attr( 'dominant-baseline', 'hanging' )
				.style( 'font-size', '12px' )
				.style( 'fill', this.colors.grey )
				.style( 'font-family', '"Work Sans", open-sans' )
				.style( 'cursor', 'pointer' )
				.text( d => d );

			// wrap the text of the labels
			labelTexts.each( ( content, i, nodes ) => {
				const text = d3.select( nodes[i] );
				const { lightBlue, lightestGrey } = this.colors;

				this.wrapText( text, labelWidth - 10 );

				let timer = null;
				// add event listeners

				nodes[i].addEventListener( 'mouseenter', () => {

					timer = window.setTimeout( () => {
						const { x, y, width : w } = text.node().getBBox();
						const coordinates         = {
							x : x + ( w / 2 ),
							y
						};

						this.displayToolTip( content, coordinates, lightBlue, lightestGrey, '12px' );
					}, 100 );

				} );

				nodes[i].addEventListener( 'mouseleave', () => {

					window.clearTimeout( timer );

					d3.selectAll( `.${this.id}-hover-element` )
						.remove();

				} );
			} );

			// realign all the labels to the top
			// of the tallest label
			const labelNodes = Array.from( labelTexts._groups[0] );
			const heights    = labelNodes.map( a => a.getBBox().height );
			const tallest    = Math.max( ...heights );

			labelTexts.attr( 'y', () => {
				const { t, ch } = this.dim;

				return CorrectSafariTextOffset( t + ( ch - tallest ), 'hanging' );
			} );

			this.updateDim( {
				b : tallest + 10
			} );

			const positions = labelNodes.map( a => d3.select( a ).attr( 'x' ) );

			return {
				positions,
				labelWidth,
			};
		},

		readjustLineIndicators() {

			const lineLabels = d3.selectAll( `.${this.id}-label` );
			const lines      = d3.selectAll( `.${this.id}-line-indicator` );

			const numberOfLines    = lines._groups[0].length;
			const { t, ch, l, cw } = this.dim;
			const spacing          = ( ch / ( numberOfLines - 1 ) );

			const getY = i => t + ( spacing * i );

			lines.attr( 'd', ( d, i ) => {
				const y = getY( i );

				return `M ${l} ${y} L ${l + cw} ${y}`;
			} );
			lineLabels.attr( 'y', ( d, i ) => getY( i ) );

		},

		readjustTitle() {

			const label     = d3.select( `.${this.id}-main-title` );
			const { t, ch } = this.dim;

			const x = label.attr( 'x' );
			const y = CorrectSafariTextOffset( t + ( ch / 2 ), 'hanging' );

			label
				.attr( 'y', y )
				.attr( 'transform', `rotate( -90 ${x} ${y} )` );

		},

		displayToolTip( text, coordinates, color = 'white', backgroundColor = null, fontSize = '16px' ) {

			if ( backgroundColor === null ) {
				backgroundColor = this.colors.lightBlue; // eslint-disable-line
			}

			const { l, cw, t }     = this.dim;
			const { x : X, y : Y } = coordinates;
			const x = parseFloat( X, 10 );
			const y = parseFloat( Y, 10 ) + 2;

			const $svg       = d3.select( `#${this.id}` );
			const $hoverText = $svg.append( 'text' )
				.attr( 'class', `${this.id}-hover-element` )
				.attr( 'x', x )
				.attr( 'y', y )
				.attr( 'dominant-baseline', 'middle' )
				.style( 'pointer-events', 'none' )
				.style( 'fill', 'rgba(255,255,255,0)' ) // transparent white
				.style( 'font-size', fontSize )
				.text( text );

			let textBBox      = $hoverText.node().getBBox();
			const displayAbove  = ( y > ( t + textBBox.height + 31 ) );
			const displayRight  = ( x < ( l + ( textBBox.width / 2 ) + 25 ) );
			const displayLeft   = ( x > ( l + ( cw - ( ( textBBox.width / 2 ) + 25 ) ) ) ) && !displayRight; // eslint-disable-line

			const textAnchor = ( () => {
				if ( displayLeft ) {
					return 'end';
				}

				if ( displayRight ) {
					return 'start';
				}

				return 'middle';
			} )();

			if ( displayLeft ) {
				const maxWidth = ( x - this.dim.l );

				this.wrapText( $hoverText, maxWidth, 10, displayAbove );
			}

			if ( displayRight ) {
				const maxWidth = ( ( this.dim.l + this.dim.cw ) - x );

				this.wrapText( $hoverText, maxWidth, 10, displayAbove );
			}

			$hoverText.attr( 'text-anchor', textAnchor );
			textBBox = $hoverText.node().getBBox();

			const rectangleDims = ( () => {

				const position = {
					x : textBBox.x - 10,
					y : textBBox.y - 10,
					h : textBBox.height + 16,
					w : textBBox.width + 20,
				};

				if ( displayAbove ) {
					position.y -= ( ( position.h + textBBox.height ) / 2 ) - 2;
				}

				if ( !displayAbove ) {
					position.y += 30;
				}

				const center = {
					x : position.x + ( position.w / 2 ),
					y : position.y + ( position.h / 2 ),
				};

				return Object.assign( textBBox, { position, center } );
			} )();

			const $hoverRectangle = $svg.append( 'rect' )
				.attr( 'class', `${this.id}-background-rect ${this.id}-hover-element` )
				.attr( 'x', rectangleDims.position.x )
				.attr( 'y', rectangleDims.position.y )
				.attr( 'height', rectangleDims.position.h )
				.attr( 'width', rectangleDims.position.w )
				.attr( 'fill', backgroundColor )
				.attr( 'rx', 5 )
				.attr( 'ry', 5 )
				.style( 'opacity', 0 )
				.style( 'pointer-events', 'none' );

			const $triangle = $svg.append( 'path' )
				.attr( 'class', `${this.id}-hover-triangle ${this.id}-hover-element` )
				.attr( 'd', () => {

					const { position : p } = rectangleDims;

					if ( displayAbove ) {
						return `M ${x} ${y - 5} L ${x + 7} ${p.y + ( p.h - 2 )} L ${x - 7} ${p.y + ( p.h - 2 )} Z`;
					}

					return `M ${x} ${y} L ${x + 7} ${p.y + 2} L ${x - 7} ${p.y + 2} Z`;

				} )
				.attr( 'fill', backgroundColor )
				.style( 'opacity', 0 )
				.style( 'pointer-events', 'none' );

			$triangle.transition()
				.duration( 200 )
				.style( 'opacity', 1 );

			$hoverRectangle.transition()
				.duration( 200 )
				.style( 'opacity', 1 );

			const textNode = $hoverText.node();
			textNode.parentNode.append( textNode );

			$hoverText.attr( 'text-anchor', 'start' )
				.attr( 'dominant-baseline', 'hanging' )
				.attr( 'x', rectangleDims.position.x + 10 )
				.attr( 'y', rectangleDims.position.y + 10 )
				.transition()
				.duration( 200 )
				.style( 'fill', color );

		},

		showBarValue( text, rectangle ) {

			const dim = d3.select( rectangle ).node().getBBox();
			const x   = dim.x + ( dim.width / 2 );

			// start out assuming that the label
			// will be displayed horizontally
			// just below the top of the bar
			const $svg  = d3.select( `#${this.id}` );
			const $text = $svg.append( 'text' )
				.attr( 'class', `${this.id}-hover-element` )
				.attr( 'x', x )
				.attr( 'y', dim.y + 10 )
				.attr( 'text-anchor', 'middle' )
				.attr( 'dominant-baseline', 'hanging' )
				.style( 'fill', 'white' )
				.style( 'font-size', '12px' )
				.style( 'font-family', '"Work Sans", open-sans' )
				.text( text );

			const textDim = $text.node().getBBox();

			// text should be above the bar
			const displayAboveBar = ( textDim.height + 20 ) > dim.height;
			if ( displayAboveBar ) {

				$text.attr( 'y', dim.y - 10 )
					.attr( 'dominant-baseline', 'text-after-edge' )
					.style( 'fill', this.colors.lightBlue );

			}

			// text should be displayed vertically
			const displayVertically = ( textDim.width + 10 ) > dim.width;
			if ( displayVertically ) {

				const y = $text.attr( 'y' );

				$text.attr( 'transform', `rotate( -90 ${x} ${y} )` )
					.attr( 'text-anchor', displayAboveBar ? 'start' : 'end' )
					.attr( 'dominant-baseline', 'middle' );

			}

		},

		showArc( $donut, d ) {

			$donut.append( 'path' )
				.attr( 'class', `hover-element ${this.id} ${this.id}-hover-element` )
				.attr( 'd', () => {
					const { innerRadius, outerRadius, startAngle } = d;
					const start = {
						innerRadius,
						outerRadius,
						startAngle,
						endAngle : startAngle
					};

					return d3.arc()( start );
				} )
				.style( 'fill', d.color )
				.transition()
				.duration( 200 )
				.attrTween( 'd', () => {
					const arc = d3.arc();

					const interpolate = d3.interpolate( d.startAngle, d.endAngle );

					return ( a ) => {
						d.endAngle = interpolate( a ); // eslint-disable-line

						return arc( d );
					};
				} );

		},

		addCircleText( translate, text, maxRadius ) {
			const $svg  = d3.select( `#${this.id}` );
			const $text = $svg.append( 'text' )
				.attr( 'class', `${this.id}-hover-element` )
				.attr( 'x', translate.x )
				.attr( 'y', translate.y )
				.attr( 'text-anchor', 'middle' )
				.attr( 'dominant-baseline', 'middle' )
				.style( 'fill', this.colors.lightBlue )
				.style( 'font-size', '24px' )
				.text( text );

			let fontSize = 24;
			while ( $text.node().getBBox().width > ( maxRadius * 2 ) ) {

				fontSize -= 1;

				$text.style( 'font-size', `${fontSize}px` );

				if ( fontSize === 10 ) {
					break;
				}

			}
		},

		getColor : ( i, length ) => d3.scaleLinear()
			.domain( [0, length] )
			.range( ['rgb(46,84,145)', 'rgb(183, 198, 218)'] )( i ),

		// meta

		setScrollState( e ) {

			const graph = ( () => {
				if ( e ) {
					return e.target;
				}

				return this.$refs.graph;
			} )();

			const { scrollLeft, clientWidth, scrollWidth } = graph;
			const state = ( () => {
				if ( clientWidth === scrollWidth ) {
					return 'neither';
				}

				if ( ( scrollLeft + clientWidth ) === scrollWidth ) {
					return 'left';
				}

				if ( scrollLeft === 0 ) {
					return 'right';
				}

				return 'both';
			} )();

			this.scrollState = state;
		},

		scrollTo( direction ) {

			const { scrollLeft, scrollWidth, clientWidth } = this.$refs.graph;

			const increment = ( num ) => {
				if ( direction === 'right' ) {
					return Math.min( num + 10, ( scrollWidth - clientWidth ) );
				}

				return Math.max( num - 10, 0 );
			};

			const newScrollLeft  = increment( scrollLeft );

			this.$refs.graph.scrollLeft = newScrollLeft;

			const scrolledCompletelyRight = ( newScrollLeft === ( scrollWidth - clientWidth ) && direction === 'right' );
			const scrolledCompletelyLeft  = ( newScrollLeft === 0 && direction === 'left' );
			const doneScrolling           = scrolledCompletelyLeft || scrolledCompletelyRight;

			if ( !doneScrolling ) {
				window.requestAnimationFrame( () => this.scrollTo( direction ) );
			}

		}

	}
}
</script>

<style lang="scss">

</style>

