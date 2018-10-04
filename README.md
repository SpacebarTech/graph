Graph
========

vue graph component

## Installation

  `npm install @spacebartech/graph`

  ```
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
  }

  graph(
    :data='content.data'
    :type='content.graphType'
    :use-percentage='content.usePercentage'
    :axis-label='content.axisLabel'
    :should-redraw='shouldRedraw'
    :width='520'
  )

  ```

## Usage

## Tests

`npm test`
