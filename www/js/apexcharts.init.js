// data for the sparklines that appear below header area
var sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];

// the default colorPalette for this dashboard
//var colorPalette = ['#01BFD6', '#5564BE', '#F7A600', '#EDCD24', '#F74F58'];
// var colorPalette = ['#00D8B6', '#008FFB', '#FEB019', '#FF4560', '#775DD0']

var spark1 = {
  chart: {
      type: 'area',
      height: 120,
      sparkline: {
          enabled: true
      },
  },
  stroke: {
      width: 2,
      curve: 'smooth'
  },
  fill: {
      opacity: 0.2,
  },
  series: [{
      name: sparklineData,
      data: sparklineData
  }],
  yaxis: {
      min: 0
  },
  colors: ['#f7931a'],
  tooltip: {
    fixed: {
        enabled: true
    },
   
}
}
new ApexCharts(document.querySelector("#spark1"), spark1).render();

var spark2 = {
    chart: {
        type: 'area',
        height: 120,
        sparkline: {
            enabled: true
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    fill: {
        opacity: 0.2,
    },
    series: [{
        name: 'Frogetor Sales ',
        data: sparklineData
    }],
    yaxis: {
        min: 0
    },
    colors: ['#c42626'],
    tooltip: {
      fixed: {
          enabled: false
      },
     
  }
  }
  new ApexCharts(document.querySelector("#spark2"), spark2).render();

  var spark3 = {
    chart: {
        type: 'area',
        height: 120,
        sparkline: {
            enabled: true
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    fill: {
        opacity: 0.2,
    },
    series: [{
        name: 'Frogetor Sales ',
        data: sparklineData
    }],
    yaxis: {
        min: 0
    },
    colors: ['aqua'],
    tooltip: {
      fixed: {
          enabled: false
      },
     
  }
  }
  new ApexCharts(document.querySelector("#spark3"), spark3).render();

  var spark4 = {
    chart: {
        type: 'area',
        height: 120,
        sparkline: {
            enabled: true
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    fill: {
        opacity: 0.1,
    },
    series: [{
        name: 'Frogetor Sales ',
        data: sparklineData
    }],
    yaxis: {
        min: 0
    },
    colors: ['#345c9c'],
    tooltip: {
      fixed: {
          enabled: false
      },
     
  }
  }
  new ApexCharts(document.querySelector("#spark4"), spark4).render();

  var spark5 = {
    chart: {
        type: 'area',
        height: 120,
        sparkline: {
            enabled: true
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    fill: {
        opacity: 0.2,
    },
    series: [{
        name: 'Frogetor Sales ',
        data: sparklineData
    }],
    yaxis: {
        min: 0
    },
    colors: ['green'],
    tooltip: {
      fixed: {
          enabled: false
      },
     
  }
  }
  new ApexCharts(document.querySelector("#spark5"), spark5).render();
