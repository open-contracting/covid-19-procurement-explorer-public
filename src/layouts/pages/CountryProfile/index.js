import React, { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import * as dayjs from 'dayjs'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import Tender from '../../../components/country/tender'
import Insights from '../../../components/country/insights'
import CountryDataCharts from '../../../components/country/CountryDataChart'
import CountryDetailProfile from '../../../components/country/countryDetailProfile'
import Loader from '../../../components/Loader/Loader'
import CountryProfileServices from '../../../services/countryProfileServices'
import useTrans from '../../../hooks/useTrans'
import CountryServices from '../../../services/countryServices'
import VisualizationServices from '../../../services/visualizationServices'
import formatNumber from '../../../components/formatNumber/FormatNumber'
import CountryMap from '../../../components/Charts/CountryMap/CountryMap'
import Buyers from '../../../components/country/buyers'
import { ReactComponent as DownloadIcon } from '../../../assets/img/icons/ic_download.svg'
import { ReactComponent as ShareIcon } from '../../../assets/img/icons/ic_share.svg'
import { ReactComponent as FullViewIcon } from '../../../assets/img/icons/ic_fullscreen.svg'
import Suppliers from '../../../components/country/suppliers'
import CountryProductTab from './tabs/CountryProductTab'
import CountryDataTab from './tabs/CountryDataTab'

function CountryProfile() {
    // ===========================================================================
    // State and variables
    // ===========================================================================
    const [data, setData] = useState({}) // Country specific data
    const [loading, setLoading] = useState(false)
    const [countryData, setCountryData] = useState([]) // List of all countries
    const [contractType, setContractType] = useState('value')
    const [countryVisualizationData, setCountryVisualizationData] = useState()
    const [mapData, setMapData] = useState()
    const { trans } = useTrans()
    const handle = useFullScreenHandle()
    let { slug } = useParams()

    // ===========================================================================
    // Hooks
    // ===========================================================================
    useEffect(() => {
        // Fetch list of all countries
        CountryServices.CountryData().then((response) => {
            if (response) {
                const countries = response.reduce((acc, current) => {
                    return { [current.name]: current, ...acc }
                }, {})
                setCountryData(countries)
            }
        })
    }, [])

    useEffect(() => {
        // Fetch country specific data
        CountryProfileServices.CountryProfileData(slug).then((response) => {
            if (response) {
                setData(response)
            }
            setLoading(true)
            VisualizationServices.CountryMap(
                response.country_code_alpha_2
            ).then((response) => {
                setCountryVisualizationData(response)
            })
        })
    }, [slug])

    useEffect(() => {
        let countryMapData = {}
        const parsedCountryMapData =
            countryVisualizationData &&
            countryVisualizationData.result.map((data) => {
                return (countryMapData = {
                    id: data.country_code,
                    value:
                        contractType == 'value'
                            ? data.amount_usd
                            : data.tender_count
                })
            })
        setMapData(parsedCountryMapData)
    }, [countryVisualizationData, contractType])

    return (
        <section className="pt-20 -mt-8 bg-blue-0">
            {loading ? (
                <Fragment>
                    <section className="px-4">
                        <div className="container mx-auto">
                            {/* <div className="mb-6">
                                <ul className="flex text-sm">
                                    {Object.keys(countryData).map(
                                        (country, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    className="mr-6">
                                                    <Link
                                                        className={`opacity-50 hover:opacity-100 ${
                                                            countryData[country]
                                                                .slug == slug
                                                                ? 'opacity-100 font-bold'
                                                                : ''
                                                        }`}
                                                        to={`/country/${countryData[country].slug}`}>
                                                        {
                                                            countryData[country]
                                                                .name
                                                        }
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    )}
                                </ul>
                            </div> */}
                            <h2 className="font-normal mb-5 text-2xl  text-primary-dark">
                                {data.name}
                            </h2>
                            <div className="flex flex-wrap -mb-4">
                                <div className="w-full md:w-1/2 lg:w-62 px-4 mb-4 bg-white rounded p-6">
                                    <FullScreen handle={handle}>
                                        <div className="relative">
                                            <div className="flex justify-end">
                                                <ul className="contract-switch flex">
                                                    <li
                                                        className={`mr-4 cursor-pointer ${
                                                            contractType ===
                                                            'value'
                                                                ? 'active'
                                                                : ''
                                                        }`}
                                                        onClick={() =>
                                                            setContractType(
                                                                'value'
                                                            )
                                                        }>
                                                        {trans(
                                                            'By contract value'
                                                        )}
                                                    </li>
                                                    <li
                                                        className={`cursor-pointer ${
                                                            contractType ===
                                                            'number'
                                                                ? 'active'
                                                                : ''
                                                        }`}
                                                        onClick={() =>
                                                            setContractType(
                                                                'number'
                                                            )
                                                        }>
                                                        {trans(
                                                            'By number of contracts'
                                                        )}
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="h-full">
                                                <CountryMap
                                                    data={mapData}
                                                    countryCode={
                                                        data &&
                                                        data.country_code_alpha_2
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </FullScreen>
                                    <div
                                        className="flex items-center justify-between pt-4 border-t border-blue-0 text-sm
                                             text-primary-blue -mx-6 px-6">
                                        <div className="flex">
                                            <span className="flex items-center">
                                                <DownloadIcon className="mr-2 inline-block" />{' '}
                                                <span className="cursor-pointer">
                                                    Download
                                                </span>
                                            </span>
                                            <span className="ml-8 flex items-center">
                                                <ShareIcon className="mr-2 inline-block" />{' '}
                                                <span className="cursor-pointer">
                                                    Share
                                                </span>
                                            </span>
                                        </div>
                                        <div>
                                            <span className="flex items-center">
                                                <button onClick={handle.enter}>
                                                    <span className="cursor-pointer">
                                                        View full screen
                                                    </span>
                                                    <FullViewIcon className="ml-2 inline-block" />
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 lg:w-38 px-4 pl-2 mb-4 relative">
                                    <div className="flex flex-col  text-primary-dark font-bold">
                                        <div className="p-8 py-6 bg-yellow-20 rounded-t-md ">
                                            <div className="flex flex-wrap -mx-4 -mb-4">
                                                <div className="w-full xs:w-1/2 px-4 mb-4 lg:mb-6">
                                                    <div>
                                                        <span className="font-normal inline-block">
                                                            {trans(
                                                                'Population'
                                                            )}{' '}
                                                        </span>
                                                        <h2 className="text-xl">
                                                            {formatNumber(
                                                                data.population
                                                            )}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div className="w-full xs:w-1/2 px-4 mb-4 lg:mb-6">
                                                    <div>
                                                        <span className="font-normal inline-block">
                                                            {trans('GDP')}
                                                        </span>
                                                        <h2 className="text-xl">
                                                            $
                                                            {formatNumber(
                                                                data.gdp
                                                            )}
                                                            {/* <span className="inline-block uppercase text-xl tracking-tight">
                                                                {data.currency}
                                                            </span> */}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div className="w-full xs:w-1/2 px-4 mb-4 lg:mb-6">
                                                    <div>
                                                        <span className="font-normal inline-block">
                                                            {trans(
                                                                'Healthcare budget'
                                                            )}
                                                        </span>
                                                        <h2 className="text-xl">
                                                            $
                                                            {formatNumber(
                                                                data.healthcare_budget
                                                            )}
                                                            {/* <span className="inline-block uppercase text-sm tracking-tight">
                                                                {data.currency}
                                                            </span> */}
                                                        </h2>
                                                        <span className="block font-normal">
                                                            {trans(
                                                                'per capita'
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-full xs:w-1/2 px-4 mb-4 lg:mb-6">
                                                    <div>
                                                        <span className="font-normal inline-block">
                                                            {trans(
                                                                '% of GDP to healthcare'
                                                            )}
                                                        </span>
                                                        <h2 className="text-xl">
                                                            {
                                                                data.healthcare_gdp_pc
                                                            }
                                                            <span className="inline-block uppercase text-sm tracking-tight">
                                                                %
                                                            </span>
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div className="w-full px-4 mb-4">
                                                    <div>
                                                        <p className="text-sm font-normal">
                                                            {trans('Source')}:
                                                            <a
                                                                href={
                                                                    data.source
                                                                }
                                                                className="ml-1 underline font-bold"
                                                                title="John Hopkins University">
                                                                {trans(
                                                                    'John Hopkins University'
                                                                )}
                                                            </a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-8 py-16 text-white bg-primary-dark rounded-b-md">
                                            <div className="flex flex-wrap -mx-4 -mb-4">
                                                <div className="w-full xs:w-1/2 px-4 mb-12">
                                                    <div>
                                                        <span className="font-normal inline-block mb-4">
                                                            {trans(
                                                                'Covid-19 cases'
                                                            )}
                                                        </span>
                                                        <h2 className="text-xl">
                                                            {data.covid_cases_total &&
                                                                data.covid_cases_total.toLocaleString(
                                                                    'en'
                                                                )}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div className="w-full xs:w-1/2 px-4 mb-12">
                                                    <div>
                                                        <span className="font-normal inline-block mb-4">
                                                            {trans(
                                                                'Deaths by Covid-19'
                                                            )}
                                                        </span>
                                                        <h2 className="text-xl">
                                                            {data.covid_deaths_total &&
                                                                data.covid_deaths_total.toLocaleString(
                                                                    'en'
                                                                )}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div className="w-full px-4 mb-4">
                                                    <div>
                                                        <p className="text-sm font-normal">
                                                            {trans('Source')}:
                                                            <a
                                                                href={
                                                                    data.source
                                                                }
                                                                className="ml-1 text-white underline font-bold"
                                                                title="John Hopkins University">
                                                                {trans(
                                                                    'John Hopkins University'
                                                                )}
                                                            </a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="absolute"
                                        style={{ top: '-30px', right: '25px' }}>
                                        <p className="text-blue-40">
                                            <span className="opacity-75">
                                                Last updated on{' '}
                                            </span>
                                            <span>
                                                {dayjs(
                                                    data.covid_data_last_updated
                                                ).format('h:mm a MMM D, YYYY')}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <Tabs>
                        <div className="container mx-auto">
                            <TabList>
                                <Tab>{trans('Data')}</Tab>
                                <Tab>{trans('Insights')}</Tab>
                                <Tab>{trans('Contracts')}</Tab>
                                <Tab>{trans('Equity')}</Tab>
                                <Tab>{trans('Buyers')}</Tab>
                                <Tab>{trans('Suppliers')}</Tab>
                                <Tab>{trans('Products')}</Tab>
                            </TabList>
                        </div>
                        <div
                            style={{
                                borderTop: '5px solid #1fbbec'
                            }}
                            className="py-16 bg-primary-gray px-4">
                            <div className="container mx-auto">
                                <TabPanel>
                                    <CountryDataTab
                                        countryCode={data.country_code_alpha_2}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <Insights />
                                </TabPanel>
                                <TabPanel>
                                    <Tender
                                        selectedCountry={data && data.name}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <CountryDetailProfile profileData={data} />
                                </TabPanel>
                                <TabPanel>
                                    <Buyers />
                                </TabPanel>
                                <TabPanel>
                                    <Suppliers />
                                </TabPanel>
                                <TabPanel>
                                    <CountryProductTab />
                                </TabPanel>
                            </div>
                        </div>
                    </Tabs>
                </Fragment>
            ) : (
                <Loader />
            )}
        </section>
    )
}

export default CountryProfile