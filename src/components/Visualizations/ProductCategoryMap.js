import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { T } from '@transifex/react'
import {
    Loader,
    ChartFooter,
    ContractViewSwitcher,
    ErrorHandler
} from '../Utilities'
import { TreeMapChart } from './Charts'
import VisualizationService from '../../services/VisualizationService'
import ContractView from '../../constants/ContractView'
import Default from '../../constants/Default'

const ProductCategoryMap = (props) => {
    // ===========================================================================
    // State and variables
    // ===========================================================================
    const { label = 'Product Category Map', params } = props
    const [loading, setLoading] = useState(true)
    const [viewType, setViewType] = useState(ContractView.VALUE)
    const [originalData, setOriginalData] = useState([])
    const [chartData, setChartData] = useState([])
    const [error, setError] = useState(false)
    const fullScreenHandler = useFullScreenHandle()

    // ===========================================================================
    // Hooks
    // ===========================================================================
    useEffect(() => {
        VisualizationService.ProductSummary(params)
            .then((result) => {
                setLoading(false)
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
            setOriginalData([])
        }
    }, [params?.country])

    useEffect(() => {
        if (!isEmpty(originalData)) {
            let chartDataFormatted = originalData.map((item) => {
                return {
                    name: item.product_name,
                    value:
                        viewType === ContractView.VALUE
                            ? item[Default.AMOUNT_USD]
                            : item[Default.TENDER_COUNT]
                }
            })

            setChartData(chartDataFormatted)
        }
    }, [originalData, viewType])

    return (
        <div>
            <FullScreen handle={fullScreenHandler}>
                <div className="p-4 bg-white rounded rounded-b-none h-full">
                    <div className="flex flex-wrap items-center justify-between md:mb-4">
                        <h3 className="mb-4 md:mb-0 w-full md:w-auto uppercase font-bold  text-primary-dark">
                            <T _str={label} />
                        </h3>
                        <ContractViewSwitcher
                            style={'short'}
                            viewType={viewType}
                            viewHandler={(value) => {
                                setViewType(value)
                            }}
                        />
                    </div>

                    {loading ? (
                        <Loader />
                    ) : !error ? (
                        <TreeMapChart data={chartData} />
                    ) : (
                        <ErrorHandler />
                    )}
                </div>
            </FullScreen>
            <ChartFooter fullScreenHandler={fullScreenHandler} />
        </div>
    )
}

ProductCategoryMap.propTypes = {
    label: PropTypes.string,
    params: PropTypes.object
}

export default ProductCategoryMap
