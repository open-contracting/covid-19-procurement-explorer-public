import React, { useEffect, useState } from 'react'
import useTrans from '../../hooks/useTrans'
import VisualizationServices from '../../services/visualizationServices'
import AreaChartBlock from '../Charts/AreaChart/AreaChartBlock'
import Loader from '../Loader/Loader'
import { dateDiff, formatDate } from "../../helpers/date"

const Monopolization = (props) => {
    // ===========================================================================
    // State and variables
    // ===========================================================================
    const { label, params } = props
    const [loading, setLoading] = useState(true)
    const [monopolization, setMonopolization] = useState()
    const { trans } = useTrans()

    // ===========================================================================
    // Hooks
    // ===========================================================================
    useEffect(() => {
        VisualizationServices.monopolization(params)
            .then((response) => {
                setMonopolization(response)
                setLoading(false)
            })
    }, [params?.country, params?.buyer])

    // ===========================================================================
    // Handlers and functions
    // ===========================================================================
    // const totalSpendingLineChartData = get(totalSpending, 'usd.line_chart')
    // Function to manage data for line chart
    const lineChartData = (chartData) => {
        return (
            chartData &&
            chartData.map((data) => {
                return {
                    date: formatDate(data.date, 'MMMM YYYY'),
                    value: data.value
                }
            })
        )
    }

    // Function to sort by date
    const sortDate = (data) => {
        return data.sort((date1, date2) => {
            return dateDiff(date1.date, date2.date)
        })
    }

    const monopolizationLineChartDataRaw =
        monopolization && lineChartData(monopolization.line_chart)
    const monopolizationLineChartData =
        monopolizationLineChartDataRaw &&
        sortDate(monopolizationLineChartDataRaw)
    const monopolizationAmount = monopolization && monopolization.average
    const monopolizationPercentage = monopolization && monopolization.difference

    return (
        <div className="bg-white rounded p-4 h-full">
            <div>
                <h3 className="uppercase font-bold  text-primary-dark">
                    {trans(label)}
                </h3>
                {loading ? (
                    <Loader sm />
                ) : (
                    <div className="flex items-end">
                        <AreaChartBlock
                            chartData={monopolizationLineChartData}
                            totalAmount={monopolizationAmount}
                            percentage={monopolizationPercentage}
                            colorValue={
                                monopolizationPercentage <= 0
                                    ? '#3EEDA4'
                                    : '#FE5151 '
                            }
                            monopolization
                        />
                        <div className="flex-1" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Monopolization
