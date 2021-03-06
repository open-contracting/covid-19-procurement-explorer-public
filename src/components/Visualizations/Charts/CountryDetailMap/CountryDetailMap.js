import React, { useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { color, create, useTheme } from '@amcharts/amcharts4/core'
import {
    MapChart,
    MapPolygonSeries,
    projections,
    ZoomControl
} from '@amcharts/amcharts4/maps'
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow'
import am4geodata_data_countries2 from '@amcharts/amcharts4-geodata/data/countries2'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'

const CountryDetailMap = ({ data, countryCode }) => {
    const countryMapChartDiv = useRef(null)

    useLayoutEffect(() => {
        /* Chart code */
        // Themes begin
        useTheme(am4themes_animated)
        // Themes end

        // Create chart instance
        let chart = create(countryMapChartDiv.current, MapChart)
        chart.chartContainer.wheelable = false

        // Set map definition
        chart.geodata = am4geodata_worldLow

        // Set projection
        chart.projection = new projections.Miller()

        // Create map polygon series
        let countrySeries = chart.series.push(new MapPolygonSeries())

        // Make map load polygon (like country names) data from GeoJSON
        countrySeries.useGeodata = true

        // Exclude Antartica
        countrySeries.exclude = ['AQ']

        // Configure series tooltip
        let countryPolygon = countrySeries.mapPolygons.template
        countryPolygon.tooltipText = '{name}'
        countryPolygon.nonScalingStroke = true
        countryPolygon.strokeOpacity = 0.5
        countryPolygon.fill = color('#2B8CBE')

        chart.colors.list = [color('#C8D419')]

        let hs = countryPolygon.states.create('hover')
        hs.properties.fill = chart.colors.getIndex(0)

        // Set up data for countries
        let data = []

        let id = countryCode

        if (id in am4geodata_data_countries2) {
            let country = am4geodata_data_countries2[id]
            if (country.maps.length) {
                data.push({
                    id: id,
                    map: country.maps[0]
                })

                countrySeries.geodataSource.url = `https://www.amcharts.com/lib/4/geodata/json/${country.maps[0]}.json`
                countrySeries.geodataSource.load()
            }
        }

        countrySeries.data = data

        // Zoom control
        chart.zoomControl = new ZoomControl()
        chart.zoomControl.valign = 'top'
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
    }, [data, countryCode])

    return (
        <div className="map-wrapper bg-white rounded-md h-full">
            <div ref={countryMapChartDiv} className="country-map-section" />
        </div>
    )
}

CountryDetailMap.propTypes = {
    data: PropTypes.array,
    countryCode: PropTypes.string
}

export default CountryDetailMap
