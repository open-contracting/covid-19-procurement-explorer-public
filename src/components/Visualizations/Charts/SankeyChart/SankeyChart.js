import React, { useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { create, MouseCursorStyle, useTheme } from '@amcharts/amcharts4/core'
import { SankeyDiagram } from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import Default from '../../../../constants/Default'

const SankeyChart = ({ data, currency, viewType }) => {
    const sankeyChart = useRef(null)

    useLayoutEffect(() => {
        /* Chart code */
        // Themes begin
        useTheme(am4themes_animated)
        // Themes end

        // Create chart instance
        let chart = create(sankeyChart.current, SankeyDiagram)
        chart.hiddenState.properties.opacity = 0
        chart.responsive.enabled = true

        let hoverState = chart.links.template.states.create('hover')
        hoverState.properties.fillOpacity = 0.6

        chart.dataFields.fromName = 'from'
        chart.dataFields.toName = 'to'
        chart.dataFields.value = 'value'
        chart.links.template.tooltipText = `{from} -> {to} : ${
            viewType === 'value'
                ? currency === Default.CURRENCY_USD
                    ? '$'
                    : ''
                : ''
        }{value} [text-transform: uppercase]${
            viewType === 'value' ? currency : ''
        }`

        // for right-most label to fit
        // chart.paddingRight = 10

        // make nodes draggable
        let nodeTemplate = chart.nodes.template
        nodeTemplate.inert = true
        nodeTemplate.readerTitle = 'Drag me!'
        nodeTemplate.showSystemTooltip = true
        nodeTemplate.width = 20

        // make nodes draggable
        nodeTemplate.readerTitle = 'Click to show/hide or drag to rearrange'
        nodeTemplate.showSystemTooltip = true
        nodeTemplate.cursorOverStyle = MouseCursorStyle.pointer

        nodeTemplate.nameLabel.height = undefined
        nodeTemplate.nameLabel.label.hideOversized = true

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

    return <div ref={sankeyChart} className="h-400" />
}

SankeyChart.propTypes = {
    data: PropTypes.array,
    currency: PropTypes.string,
    viewType: PropTypes.string
}

export default SankeyChart
