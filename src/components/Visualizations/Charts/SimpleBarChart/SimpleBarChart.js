import React, { useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { color, create, useTheme } from '@amcharts/amcharts4/core'
import {
    CategoryAxis,
    ColumnSeries,
    ValueAxis,
    XYChart
} from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import { barColorValue } from '../../../../constants/Theme'

const SimpleBarChart = (props) => {
    const barchartDiv = useRef(null)
    const { data, height, chartKey, chartValue, axisRotation, className } =
        props

    useLayoutEffect(() => {
        /* Chart code */
        // Themes begin
        useTheme(am4themes_animated)
        // Themes end

        // Create chart instance
        let chart = create(barchartDiv.current, XYChart)

        // Create axes
        let categoryAxis = chart.xAxes.push(new CategoryAxis())
        categoryAxis.dataFields.category = chartKey
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.renderer.minGridDistance = 30
        categoryAxis.renderer.labels.template.rotation = axisRotation || 0
        categoryAxis.renderer.labels.template.fontSize = 12
        categoryAxis.renderer.grid.template.disabled = true

        let valueAxis = chart.yAxes.push(new ValueAxis())
        valueAxis.renderer.grid.template.disabled = true
        valueAxis.renderer.labels.template.disabled = true

        // Create series
        let series = chart.series.push(new ColumnSeries())
        series.dataFields.valueY = chartValue
        series.dataFields.categoryX = chartKey
        series.name = 'Value'
        series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]'
        series.columns.template.fillOpacity = 0.8
        series.columns.template.fill = color(barColorValue)

        let columnTemplate = series.columns.template
        columnTemplate.strokeWidth = 1
        columnTemplate.strokeOpacity = 1
        columnTemplate.stroke = '#ABBABF'

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
            ref={barchartDiv}
            className={className}
            style={{ width: '100%', height: `${height || ''}` }}
        />
    )
}

SimpleBarChart.propTypes = {
    data: PropTypes.array,
    height: PropTypes.string,
    chartKey: PropTypes.string,
    chartValue: PropTypes.string,
    axisRotation: PropTypes.string,
    className: PropTypes.string
}

export default SimpleBarChart
