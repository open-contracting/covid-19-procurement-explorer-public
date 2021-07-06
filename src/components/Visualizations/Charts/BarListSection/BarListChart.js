import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { T } from '@transifex/react'
import Default from '../../../../constants/Default'
import { formatNumber } from '../../../../helpers/number'

function BarListChart(props) {
    const { data, forwardUrl, currency, viewType } = props
    const countryCurrency = useSelector(
        (state) => state.general.countryCurrency
    )

    return (
        <div className="custom-horizontal-bar">
            <ul className="custom-scrollbar h-80 overflow-y-auto pr-4">
                {data.length < 1 || false ? (
                    <li>
                        <T _str="No data available" />
                    </li>
                ) : (
                    data &&
                    data.map((bar_value, index) => {
                        return (
                            <li key={index}>
                                <div className="flex flex-wrap md:flex-no-wrap items-center">
                                    <div className="custom-horizontal-bar-text">
                                        <Link
                                            className="hover:text-primary-blue"
                                            to={`/${forwardUrl}/${bar_value.id}`}>
                                            <h3 title={bar_value.name}>
                                                {bar_value.name}
                                            </h3>
                                        </Link>
                                    </div>
                                    <div className="custom-horizontal-bar-progress">
                                        <span
                                            style={{
                                                width: `${bar_value.value}%`
                                            }}></span>
                                    </div>
                                    <div className="md:ml-2 custom-horizontal-bar-amount">
                                        <p>
                                            {viewType === 'value' &&
                                            currency !== Default.CURRENCY_LOCAL
                                                ? '$'
                                                : ''}
                                            {formatNumber(bar_value.amount) ||
                                                '-'}
                                            {viewType === 'value' && (
                                                <span className="uppercase ml-1">
                                                    {currency ===
                                                    Default.CURRENCY_LOCAL
                                                        ? countryCurrency
                                                        : Default.CURRENCY_USD}
                                                </span>
                                            )}
                                            {viewType === 'buyer' && (
                                                <span className="uppercase ml-1">
                                                    <T _str="buyers" />
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        )
                    })
                )}
            </ul>
        </div>
    )
}

BarListChart.propTypes = {
    data: PropTypes.array,
    forwardUrl: PropTypes.string,
    currency: PropTypes.string,
    viewType: PropTypes.string
}

export default BarListChart
