import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import VisualizationService from '../../services/VisualizationService'
import { GlobalMap } from './index'
import { CONTINENTS, continentSelectList } from '../../helpers/country'
import ContractView from '../../constants/ContractView'
import {
    Loader,
    ChartFooter,
    ContractViewSwitcher,
    PerCapitaSwitcher,
    ErrorHandler
} from '../Utilities'
import Default from '../../constants/Default'

const options = continentSelectList

const WorldMap = (props) => {
    // ===========================================================================
    // State and variables
    // ===========================================================================
    const { params } = props
    const [originalData, setOriginalData] = useState({})
    const countries = useSelector((state) => state.general.countries)
    const [mapData, setMapData] = useState([])
    const [selectedContinent, setSelectedContinent] = useState(options[0])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [viewType, setViewType] = useState(ContractView.VALUE)
    const [showPerCapita, setShowPerCapita] = useState(() => false)
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

    // ===========================================================================
    // Hooks
    // ===========================================================================
    useEffect(() => {
        VisualizationService.GlobalMap(params)
            .then((result) => {
                if (result) {
                    setOriginalData(result)
                } else {
                    throw new Error()
                }
            })
            .catch(() => {
                setError(true)
            })

        return () => {
            setOriginalData({})
        }
    }, [params])

    useEffect(() => {
        let mapData = {}
        const parsedMapData =
            originalData.result &&
            originalData.result.map((data) => {
                return (mapData = {
                    ...mapData,
                    id: data.country_code,
                    value:
                        viewType === ContractView.VALUE
                            ? showPerCapita
                                ? data[Default.AMOUNT_USD] /
                                  countriesPopulation[data.country_code]
                                : data[Default.AMOUNT_USD]
                            : data[Default.TENDER_COUNT],
                    url: `/country/${data.country
                        .toLowerCase()
                        .replace(' ', '-')}/data`
                })
            })
        setMapData(parsedMapData)
        setLoading(false)
    }, [originalData, viewType, showPerCapita])

    // ===========================================================================
    // Handler and functions
    // ===========================================================================
    const handleContinentSelection = (selectedOption) => {
        setSelectedContinent(selectedOption)
    }

    return (
        <div className="flex flex-wrap -mx-4 -mb-4">
            <div className="w-full px-4 mb-4">
                <div className="">
                    <FullScreen handle={fullScreenHandler}>
                        <div className="relative p-4 bg-white rounded rounded-b-none">
                            <div className="flex flex-wrap md:flex-no-wrap md:justify-between world-map-chart mb-4">
                                <div className="w-full md:w-1/5">
                                    <Select
                                        className="select-filter text-sm"
                                        classNamePrefix="select-filter"
                                        options={options}
                                        value={selectedContinent}
                                        defaultValue={options[0]}
                                        onChange={(selectedOption) =>
                                            handleContinentSelection(
                                                selectedOption
                                            )
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
                            <div>
                                {loading ? (
                                    <Loader />
                                ) : !error ? (
                                    <GlobalMap
                                        data={mapData}
                                        viewType={viewType}
                                        coordinates={
                                            CONTINENTS[selectedContinent.value]
                                        }
                                    />
                                ) : (
                                    <ErrorHandler />
                                )}
                            </div>
                        </div>
                    </FullScreen>

                    <ChartFooter fullScreenHandler={fullScreenHandler} />
                </div>
            </div>
        </div>
    )
}

WorldMap.propTypes = {
    params: PropTypes.object
}

export default WorldMap
