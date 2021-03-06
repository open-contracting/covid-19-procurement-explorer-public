import React, { useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
    color,
    create,
    LinearGradient,
    LinearGradientModifier,
    useTheme
} from '@amcharts/amcharts4/core'
import {
    CategoryAxis,
    LineSeries,
    ValueAxis,
    XYChart,
    XYCursor
} from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'

const AreaChart = ({ data, apiData, colorValue }) => {
    const areaChartDiv = useRef(null)

    useLayoutEffect(() => {
        /* Chart code */
        // Themes begin
        useTheme(am4themes_animated)
        // Themes end

        // Create chart instance
        let chart = create(areaChartDiv.current, XYChart)

        let categoryAxis = chart.xAxes.push(new CategoryAxis())
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.renderer.ticks.template.disabled = true
        categoryAxis.renderer.line.opacity = 0
        categoryAxis.renderer.grid.template.disabled = true
        categoryAxis.renderer.labels.template.disabled = true
        categoryAxis.renderer.minGridDistance = 40
        categoryAxis.dataFields.category = apiData ? 'date' : 'month'
        categoryAxis.startLocation = 0.4
        categoryAxis.endLocation = 0.6

        let valueAxis = chart.yAxes.push(new ValueAxis())
        valueAxis.tooltip.disabled = true
        valueAxis.renderer.line.opacity = 0
        valueAxis.renderer.ticks.template.disabled = true
        valueAxis.renderer.grid.template.disabled = true
        valueAxis.renderer.labels.template.disabled = true
        valueAxis.min = 0

        let lineSeries = chart.series.push(new LineSeries())
        lineSeries.dataFields.categoryX = apiData ? 'date' : 'month'
        lineSeries.dataFields.valueY = 'value'
        lineSeries.tooltipText = 'value: {valueY.value}'
        lineSeries.fillOpacity = 1
        lineSeries.strokeWidth = 1
        lineSeries.stroke = colorValue
        lineSeries.fill = colorValue

        var gradient = new LinearGradient()
        gradient.addColor(color(''))

        var fillModifier = new LinearGradientModifier()
        fillModifier.opacities = [1, 0]
        fillModifier.offsets = [0, 1]
        fillModifier.gradient.rotation = 90
        lineSeries.segments.template.fillModifier = fillModifier

        chart.cursor = new XYCursor()
        chart.cursor.lineX.opacity = 0
        chart.cursor.lineY.opacity = 0

        chart.data = data
        chart.logo.disabled = true
        chart.numberFormatter.numberFormat = '#.##a'
        chart.numberFormatter.bigNumberPrefixes = [
            { number: 1e3, suffix: 'K' },
            { number: 1e6, suffix: 'M' },
            { number: 1e9, suffix: 'B' }
        ]

        return () => {
            chart.dispose()

            chart = null
        }
    }, [data])

    return (
        <div
            ref={areaChartDiv}
            className="relative z-10"
            style={{
                width: '100%',
                height: '90px'
            }}
        />
    )
}

AreaChart.propTypes = {
    data: PropTypes.array,
    apiData: PropTypes.bool,
    colorValue: PropTypes.string
}

export default AreaChart
