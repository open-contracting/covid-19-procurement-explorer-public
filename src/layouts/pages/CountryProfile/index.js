import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import {
    setCountryCurrency,
    setCurrency
} from '../../../store/reducers/general/action'
import {
    DATA,
    INSIGHTS,
    CONTRACTS,
    EQUITY,
    BUYERS,
    SUPPLIERS,
    PRODUCTS,
    METHODOLOGY
} from '../../../constants/Tab'
import Default from '../../../constants/Default'
import {
    CountryBuyers,
    CountryContracts,
    CountryData,
    CountryEquity,
    CountryInsights,
    CountryMethodology,
    CountryProducts,
    CountrySuppliers
} from './tabs'
import { CountrySelector, MetaInformation } from '../../../components/Utilities'

const TabNavigator = React.lazy(() =>
    import(/* webpackChunkName: "app-data-page" */ './sections/TabNavigator')
)
const CountryMapElement = React.lazy(() =>
    import(
        /* webpackChunkName: "app-data-page" */ './sections/CountryMapElement'
    )
)
const CountryInfo = React.lazy(() =>
    import(/* webpackChunkName: "app-data-page" */ './sections/CountryInfo')
)
const DataDisclaimerInfo = React.lazy(() =>
    import(
        /* webpackChunkName: "app-data-page" */ './partials/DataDisclaimerInfo'
    )
)

const CountryProfile = () => {
    const countries = useSelector((state) => state.general.countries)
    const [countryData, setCountryData] = useState({})
    const { countrySlug } = useParams()
    const { tabSlug } = useParams()
    const dispatch = useDispatch()

    // ===========================================================================
    // Hooks
    // ===========================================================================
    useEffect(() => {
        let country = countries.find((country) => country.slug === countrySlug)

        if (country) {
            setCountryData(country)
            dispatch(setCountryCurrency(country.currency))
        }

        return () => {
            dispatch(setCurrency(Default.CURRENCY_USD))
        }
    }, [countries, countrySlug])
    const disclaimerInfo = (
        <DataDisclaimerInfo
            forwardUrl={`/country/${countrySlug}/methodology`}
        />
    )

    const renderTab = () => {
        switch (tabSlug) {
            case DATA:
                return (
                    <CountryData
                        countryCode={countryData.country_code_alpha_2}
                        disclaimerInfo={disclaimerInfo}
                    />
                )
            case INSIGHTS:
                return <CountryInsights countryId={countryData.id} />
            case CONTRACTS:
                return (
                    <CountryContracts
                        countryCode={countryData.country_code_alpha_2}
                        disclaimerInfo={disclaimerInfo}
                    />
                )
            case EQUITY:
                return (
                    <CountryEquity
                        countryCode={countryData.country_code_alpha_2}
                        disclaimerInfo={disclaimerInfo}
                    />
                )
            case BUYERS:
                return (
                    <CountryBuyers
                        countryCode={countryData.country_code_alpha_2}
                        disclaimerInfo={disclaimerInfo}
                    />
                )
            case SUPPLIERS:
                return (
                    <CountrySuppliers
                        countryCode={countryData.country_code_alpha_2}
                        disclaimerInfo={disclaimerInfo}
                    />
                )
            case PRODUCTS:
                return (
                    <CountryProducts
                        countryCode={countryData.country_code_alpha_2}
                        disclaimerInfo={disclaimerInfo}
                    />
                )
            case METHODOLOGY:
                return (
                    countryData.id && (
                        <CountryMethodology countryId={countryData.id} />
                    )
                )
            default:
                return (
                    <CountryData
                        countryCode={countryData.country_code_alpha_2}
                        disclaimerInfo={disclaimerInfo}
                    />
                )
        }
    }

    return (
        <section className="pt-10 md:pt-20 -mt-8 bg-blue-0">
            <MetaInformation
                title={countryData.name}
                description={countryData.name}
            />
            {!isEmpty(countryData) && (
                <section className="px-4">
                    <div className="container mx-auto">
                        <CountrySelector />

                        <div className="relative flex flex-wrap -mx-2 -mb-4">
                            <CountryMapElement
                                countryCode={countryData.country_code_alpha_2}
                            />
                            <CountryInfo country={countryData} />
                        </div>
                    </div>
                </section>
            )}

            <TabNavigator endpoint={'country'} countrySlug={countrySlug} />

            <div
                style={{
                    borderTop: '5px solid #1fbbec'
                }}
                className="py-6 md:py-16 bg-primary-gray px-4">
                <div className="container mx-auto">{renderTab()}</div>
            </div>
        </section>
    )
}
export default CountryProfile
