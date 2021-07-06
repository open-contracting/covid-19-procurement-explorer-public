import React, { useState, useEffect, useMemo, Fragment } from 'react'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { isEmpty } from 'lodash'
import { T } from '@transifex/react'
import { BarChartRace } from './Charts'
import CountryService from '../../services/CountryService'
import { continentSelectList, countryFlag } from '../../helpers/country'
import Default from '../../constants/Default'
import {
    Loader,
    ChartFooter,
    ContractViewSwitcher,
    PerCapitaSwitcher
} from '../Utilities'
import Visualization from '../../constants/Visualization'
import ContractView from '../../constants/ContractView'
import { mediaUrl } from '../../helpers/general'

const WorldTimelineRaceBarChart = () => {
    // ===========================================================================
    // State and variables
    // ===========================================================================
    const [loading, setLoading] = useState(true)
    const countries = useSelector((state) => state.general.countries)
    const [originalData, setOriginalData] = useState(null)
    const [viewType, setViewType] = useState(ContractView.VALUE)
    const [showPerCapita, setShowPerCapita] = useState(() => false)
    const [chartData, setChartData] = useState({})
    const [selectedContinent, setSelectedContinent] = useState(null)
    const fullScreenHandler = useFullScreenHandle()
    const countriesPopulation = useMemo(() => {
        return countries.reduce((acc, current) => {
            return current.country_code_alpha_2 !== 'gl'
                ? {
                      ...acc,
                      [current.country_code_alpha_2.toUpperCase()]:
                          current.population
                  }
                : acc
        }, {})
    }, [countries])
    const options = continentSelectList

    useEffect(() => {
        CountryService.GetGlobalMapData().then((response) => {
            setOriginalData(response.result)
            setLoading(false)
        })

        return () => {
            setOriginalData({})
        }
    }, [])

    useEffect(() => {
        let chartData
        if (!isEmpty(originalData)) {
            chartData = originalData.reduce((formattedData, item) => {
                let filtered = item.details
                    .filter((country) => country.country_code !== 'gl')
                    .filter((country) =>
                        !selectedContinent || selectedContinent.value === 'all'
                            ? true
                            : country.country_continent ===
                              selectedContinent.value
                    )
                    .map((country) => ({
                        country: country.country,
                        value:
                            viewType === ContractView.VALUE
                                ? showPerCapita
                                    ? country[Default.AMOUNT_USD] /
                                      countriesPopulation[country.country_code]
                                    : country[Default.AMOUNT_USD]
                                : country[Default.TENDER_COUNT],
                        href: countryFlag(country.country_code)
                    }))
                const sum = filtered.reduce(
                    (total, item) => (total += item.value),
                    0
                )

                return sum > 0
                    ? { ...formattedData, [item.month]: filtered }
                    : { ...formattedData }
            }, {})
            setChartData(chartData)
        }

        return () => {
            chartData = null
        }
    }, [originalData, selectedContinent, viewType, showPerCapita])

    const handleContinentSelection = (selectedOption) => {
        setSelectedContinent(selectedOption)
    }

    return (
        <Fragment>
            <FullScreen handle={fullScreenHandler}>
                <div className="p-4 bg-white rounded rounded-b-none world-map-chart-container">
                    <div className="flex flex-wrap md:flex-no-wrap md:justify-between world-map-chart md:mb-4">
                        <div className="w-full mb-4 md:w-1/5 md:mb-0">
                            <Select
                                className="text-sm select-filter"
                                classNamePrefix="select-filter"
                                options={options}
                                defaultValue={options[0]}
                                isSearchable={false}
                                onChange={(selectedOption) =>
                                    handleContinentSelection(selectedOption)
                                }
                            />
                        </div>

                        {viewType === ContractView.VALUE && (
                            <PerCapitaSwitcher
                                show={showPerCapita}
                                handleToggle={setShowPerCapita}
                            />
                        )}

                        <ContractViewSwitcher
                            style={'short'}
                            viewType={viewType}
                            viewHandler={(value) => {
                                setViewType(value)
                                setShowPerCapita(false)
                            }}
                        />
                    </div>
                    {loading ? (
                        <Loader />
                    ) : isEmpty(chartData) ? (
                        <T _str="No data available" />
                    ) : (
                        !isEmpty(chartData) && (
                            <BarChartRace
                                data={chartData}
                                viewType={viewType}
                            />
                        )
                    )}
                </div>
            </FullScreen>
            <ChartFooter
                fullScreenHandler={fullScreenHandler}
                embeddedVisualization={{
                    key: Visualization.WORLD_TIMELINE_RACE_BAR
                }}
                downloadUrl={mediaUrl('export/Overall Country Summary.xlsx')}
            />
        </Fragment>
    )
}

export default WorldTimelineRaceBarChart
