import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { useSelector } from 'react-redux'
import { T } from '@transifex/react'
import CountryService from '../../services/CountryService'
import { Loader, PerCapitaSwitcher } from '../Utilities'
import { BarChartRace } from './Charts'
import ContractView from '../../constants/ContractView'
import { countryFlag } from '../../helpers/country'

const BuyerTrend = (props) => {
    // ===========================================================================
    // State and variables
    // ===========================================================================
    const { viewType = ContractView.VALUE, selectedContinent } = props
    const [originalData, setOriginalData] = useState({})
    const [chartData, setChartData] = useState({})
    const [loading, setLoading] = useState(true)
    const dataColumn = 'buyer_count'
    const countries = useSelector((state) => state.general.countries)
    const [showPerCapita, setShowPerCapita] = useState(() => false)
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

    useEffect(() => {
        CountryService.BuyerTrend().then((response) => {
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
                        value: showPerCapita
                            ? country[dataColumn] /
                              countriesPopulation[country.country_code]
                            : country[dataColumn],
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
    }, [originalData, selectedContinent, showPerCapita])

    return (
        <div>
            {loading ? (
                <Loader />
            ) : isEmpty(chartData) ? (
                <div className="mt-4">
                    <T _str="No data available" />
                </div>
            ) : (
                !isEmpty(chartData) && (
                    <div className="-mt-10">
                        <PerCapitaSwitcher
                            show={showPerCapita}
                            handleToggle={setShowPerCapita}
                            id="directOpenTogglePerCapita"
                        />
                        <BarChartRace data={chartData} viewType={viewType} />
                    </div>
                )
            )}
        </div>
    )
}

BuyerTrend.propTypes = {
    viewType: PropTypes.string,
    selectedContinent: PropTypes.object
}

export default BuyerTrend
