import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { isEmpty, sumBy } from 'lodash'
import VisualizationService from '../../services/VisualizationService'
import BarListChart from '../BarListSection/BarListChart'
import ContractView from '../../constants/ContractView'
import Default from '../../constants/Default'
import ErrorHandler from '../ErrorHandler'
import CardContainer from '../Utilities/CardContainer'

const TopSuppliers = (props) => {
    // ===========================================================================
    // State and variables
    // ===========================================================================
    const { label = 'Top Suppliers', params } = props
    const [loading, setLoading] = useState(true)
    const currency = useSelector((state) => state.general.currency)
    const [originalData, setOriginalData] = useState({})
    const [chartData, setChartData] = useState([])
    const [viewType, setViewType] = useState(ContractView.VALUE)
    const [error, setError] = useState(false)

    // ===========================================================================
    // Hooks
    // ===========================================================================
    useEffect(() => {
        VisualizationService.TopSuppliers(params)
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
            setOriginalData({})
        }
    }, [params?.country, params?.buyer])

    useEffect(() => {
        if (!isEmpty(originalData)) {
            let dataSet =
                viewType === ContractView.VALUE
                    ? originalData.by_value
                    : originalData.by_number

            let total = sumBy(dataSet, (item) => {
                return viewType === ContractView.NUMBER
                    ? item[Default.TENDER_COUNT]
                    : currency === Default.CURRENCY_LOCAL
                    ? item[Default.AMOUNT_LOCAL]
                    : item[Default.AMOUNT_USD]
            })

            let chartDataFormatted = dataSet.map((item) => {
                let actualValue =
                    viewType === ContractView.NUMBER
                        ? item[Default.TENDER_COUNT]
                        : currency === Default.CURRENCY_LOCAL
                        ? item[Default.AMOUNT_LOCAL]
                        : item[Default.AMOUNT_USD]
                return {
                    name: item.supplier_name,
                    value: Math.ceil((actualValue / total) * 100),
                    amount: actualValue,
                    id: item.supplier_id
                }
            })
            setChartData(chartDataFormatted)
        }
    }, [originalData, viewType, currency])

    return (
        <CardContainer
            label={label}
            appendClass="pb-12"
            loading={loading}
            viewType={viewType}
            viewHandler={setViewType}>
            <div className="custom-horizontal-bar">
                {!error ? (
                    <BarListChart
                        data={chartData}
                        text="suppliers"
                        currency={currency}
                        viewType={viewType}
                    />
                ) : (
                    <ErrorHandler />
                )}
            </div>
        </CardContainer>
    )
}

export default TopSuppliers
