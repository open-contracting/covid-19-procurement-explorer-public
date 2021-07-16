import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useHistory } from 'react-router-dom'
import { identity, get, pickBy } from 'lodash'
import ReactPaginate from 'react-paginate'
import { T } from '@transifex/react'
import { t } from '@transifex/native'
import VisualizationService from '../../services/VisualizationService'
import { Loader, TableLoader } from '../Utilities'
import useContractFilters from '../../hooks/useContractFilters'
import { hasValidProperty } from '../../helpers/general'
import Default from '../../constants/Default'
import { formatDecimal } from '../../helpers/number'
import useTableSorting from '../../hooks/useTableSorting'
import Icon from '../../assets/img/icons'

const limit = Default.PAGE_SIZE

const SupplierTable = (props) => {
    // ===========================================================================
    // State and variables
    // ===========================================================================
    const { params } = props
    const [originalData, setOriginalData] = useState([])
    const [selectedFilters, setSelectedFilters] = useState({})
    const [supplierNameParameter, setSupplierNameParameter] = useState('')
    const [supplierIdParameter, setSupplierIdParameter] = useState('')
    const [loading, setLoading] = useState(true)
    const [totalItems, setTotalItems] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [tableLoading, setTableLoading] = useState(false)
    const { countrySelectList, productSelectList, valueRanges } =
        useContractFilters()
    const history = useHistory()
    const [showFilter, setShowFilter] = useState('hidden')
    const { sortedItems, sorting, tableHeaderSpan } = useTableSorting({
        items: originalData,
        defaultSorting: {
            column: 'supplier_name',
            direction: ''
        },
        sortTableData: false
    })

    useEffect(() => {
        LoadSuppliersList()

        return () => {
            setOriginalData([])
        }
    }, [params?.country, selectedFilters, sorting])

    // ===========================================================================
    // Helpers and functions
    // ===========================================================================
    const hasCountry = () => {
        return hasValidProperty(params, 'country')
    }

    const tableRowClass = (redFlagCount) => {
        return redFlagCount
            ? 'table-row has-red-flag cursor-pointer'
            : 'table-row cursor-pointer'
    }

    const LoadSuppliersList = (page) => {
        const filterParams = {
            ...identity(pickBy(params)),
            ...selectedFilters,
            order: sorting.direction + sorting.column,
            limit: limit,
            offset: page && page.selected * limit
        }
        setTableLoading(true)
        setCurrentPage(get(page, 'selected', 0))
        VisualizationService.SupplierTableList(filterParams).then(
            (response) => {
                if (response) {
                    setOriginalData([...response.results])
                    setTotalItems(response.count)
                    setTableLoading(false)
                }
                setLoading(false)
            }
        )
    }

    const appendFilter = (selected) => {
        setTableLoading(true)
        setSelectedFilters((previous) => {
            return {
                ...previous,
                ...selected
            }
        })
    }

    const showDetail = (id) => {
        let path = `/suppliers/${id}`
        history.push(path)
    }

    const handleInputSubmit = (event, parameters) => {
        event.preventDefault()
        appendFilter(parameters)
    }

    const handleFilterToggle = () => {
        setShowFilter(showFilter === 'hidden' ? 'block' : 'hidden')
    }

    const handleCloseFilter = () => {
        setShowFilter('hidden')
    }

    return loading ? (
        <Loader />
    ) : (
        <div className="relative">
            <div
                className="cursor-pointer md:hidden"
                onClick={handleFilterToggle}>
                <div className="filter-ui">
                    <Icon.Filter />
                </div>
            </div>

            {showFilter ? (
                <div
                    className={`bg-primary-blue absolute top-0 filter-ui-content z-20 p-4 mr-10 ${showFilter}`}>
                    <div className="flex justify-between mb-4 text-white md:mb-0">
                        <span className="text-sm font-bold uppercase">
                            <T _str="Filter" />
                        </span>
                        <span
                            className="text-sm font-bold uppercase cursor-pointer filter-close"
                            onClick={handleCloseFilter}>
                            <Icon.FilterClose />
                        </span>
                    </div>
                    <div className="flex flex-wrap -mx-2 -mb-5">
                        <div className="w-1/2 px-2 mb-5 md:w-40">
                            <p className="text-xs leading-none text-white uppercase opacity-50 md:text-primary-dark">
                                <T _str="Supplier" />
                            </p>
                            <form
                                className="mt-2 select-filter--input"
                                onSubmit={(event) =>
                                    handleInputSubmit(event, {
                                        supplier_name: supplierNameParameter
                                    })
                                }>
                                <input
                                    type="text"
                                    className="select-filter"
                                    placeholder={t('Enter supplier name')}
                                    value={supplierNameParameter}
                                    onChange={(e) =>
                                        setSupplierNameParameter(e.target.value)
                                    }
                                />
                            </form>
                        </div>
                        <div className="w-1/2 px-2 mb-5 md:w-40">
                            <p className="text-xs leading-none text-white uppercase opacity-50 md:text-primary-dark">
                                <T _str="Supplier ID" />
                            </p>
                            <form
                                className="mt-2 select-filter--input"
                                onSubmit={(event) =>
                                    handleInputSubmit(event, {
                                        supplier_id: supplierIdParameter
                                    })
                                }>
                                <input
                                    type="text"
                                    className="select-filter"
                                    placeholder={t('Enter supplier Id')}
                                    value={supplierIdParameter}
                                    onChange={(e) =>
                                        setSupplierIdParameter(e.target.value)
                                    }
                                />
                            </form>
                        </div>
                        {!hasCountry() && (
                            <div className="w-1/2 px-2 mb-5 md:w-40">
                                <p className="text-xs leading-none text-white uppercase opacity-50 md:text-primary-dark">
                                    <T _str="Country" />
                                </p>
                                <Select
                                    className="mt-2 text-sm select-filter"
                                    classNamePrefix="select-filter"
                                    options={countrySelectList}
                                    onChange={(selectedOption) =>
                                        appendFilter({
                                            country: selectedOption.value
                                        })
                                    }
                                />
                            </div>
                        )}
                        <div className="w-1/2 px-2 mb-5 md:w-40">
                            <p className="text-xs leading-none text-white uppercase opacity-50 md:text-primary-dark">
                                <T _str="Product category" />
                            </p>
                            <Select
                                className="mt-2 text-sm select-filter"
                                classNamePrefix="select-filter"
                                options={productSelectList}
                                onChange={(selectedOption) =>
                                    appendFilter({
                                        product: selectedOption.value
                                    })
                                }
                            />
                        </div>

                        <div className="w-1/2 px-2 mb-5 md:w-40">
                            <p className="text-xs leading-none text-white uppercase opacity-50 md:text-primary-dark">
                                <T _str="Value range" />
                            </p>
                            <Select
                                className="mt-2 text-sm select-filter"
                                classNamePrefix="select-filter"
                                options={valueRanges}
                                onChange={(selectedOption) =>
                                    appendFilter({
                                        contract_value_usd:
                                            selectedOption.value.value,
                                        value_comparison:
                                            selectedOption.value.sign
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
            ) : (
                ''
            )}

            <div className="flex flex-wrap items-center justify-end mb-6 md:justify-between md:mb-12">
                <div className="hidden gap-8 md:flex">
                    <div className="w-40">
                        <p className="text-xs leading-none uppercase opacity-50">
                            <T _str="Supplier Name" />
                        </p>
                        <form
                            className="mt-2 select-filter--input"
                            onSubmit={(event) =>
                                handleInputSubmit(event, {
                                    supplier_name: supplierNameParameter
                                })
                            }>
                            <input
                                type="text"
                                className="select-filter"
                                placeholder={t('Enter supplier name')}
                                value={supplierNameParameter}
                                onChange={(e) =>
                                    setSupplierNameParameter(e.target.value)
                                }
                            />
                        </form>
                    </div>
                    <div className="w-40">
                        <p className="text-xs leading-none uppercase opacity-50">
                            <T _str="Supplier ID" />
                        </p>
                        <form
                            className="mt-2 select-filter--input"
                            onSubmit={(event) =>
                                handleInputSubmit(event, {
                                    supplier_code: supplierIdParameter
                                })
                            }>
                            <input
                                type="text"
                                className="select-filter"
                                placeholder={t('Enter supplier Id')}
                                value={supplierIdParameter}
                                onChange={(e) =>
                                    setSupplierIdParameter(e.target.value)
                                }
                            />
                        </form>
                    </div>
                    {!hasCountry() && (
                        <div className="w-40">
                            <p className="text-xs leading-none uppercase opacity-50">
                                <T _str="Country" />
                            </p>
                            <Select
                                className="mt-2 text-sm select-filter"
                                classNamePrefix="select-filter"
                                options={countrySelectList}
                                onChange={(selectedOption) =>
                                    appendFilter({
                                        country: selectedOption.value
                                    })
                                }
                            />
                        </div>
                    )}
                    <div className="w-40">
                        <p className="text-xs leading-none uppercase opacity-50">
                            <T _str="Product category" />
                        </p>
                        <Select
                            className="mt-2 text-sm select-filter"
                            classNamePrefix="select-filter"
                            options={productSelectList}
                            onChange={(selectedOption) =>
                                appendFilter({
                                    product: selectedOption.value
                                })
                            }
                        />
                    </div>

                    <div className="w-40">
                        <p className="text-xs leading-none uppercase opacity-50">
                            <T _str="Value range" />
                        </p>
                        <Select
                            className="mt-2 text-sm select-filter"
                            classNamePrefix="select-filter"
                            options={valueRanges}
                            onChange={(selectedOption) =>
                                appendFilter({
                                    contract_value_usd:
                                        selectedOption.value.value,
                                    value_comparison: selectedOption.value.sign
                                })
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <div className="custom-scrollbar table-scroll">
                    <table className="table">
                        <thead>
                            <tr className="whitespace-no-wrap">
                                <th style={{ width: '20%' }}>
                                    {tableHeaderSpan(
                                        'supplier_name',
                                        <T _str="Supplier" />
                                    )}
                                </th>
                                <th style={{ width: '20%' }}>
                                    {tableHeaderSpan(
                                        'supplier_id',
                                        <T _str="Supplier ID" />
                                    )}
                                </th>
                                {!hasCountry() && (
                                    <th style={{ width: '10%' }}>
                                        {tableHeaderSpan(
                                            'country__name',
                                            <T _str="Country" />
                                        )}
                                    </th>
                                )}
                                <th style={{ width: '6%' }}>
                                    {tableHeaderSpan(
                                        'tender_count',
                                        <T _str="# of contracts" />
                                    )}
                                </th>
                                <th style={{ width: '6%' }}>
                                    {tableHeaderSpan(
                                        'buyer_count',
                                        <T _str="# of buyers" />
                                    )}
                                </th>
                                <th style={{ width: '10%' }}>
                                    {tableHeaderSpan(
                                        'product_category_count',
                                        <T _str="product categories" />
                                    )}
                                </th>
                                <th style={{ width: '10%' }}>
                                    {tableHeaderSpan(
                                        'amount_usd',
                                        <T _str="value (usd)" />
                                    )}
                                </th>
                                <th style={{ width: '8%' }}>
                                    {tableHeaderSpan(
                                        'red_flag_tender_percentage',
                                        <T _str="% red flags" />
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedItems.map((supplier, index) => {
                                return (
                                    <tr
                                        key={index}
                                        onClick={() =>
                                            showDetail(supplier.supplier_id)
                                        }
                                        className={tableRowClass(
                                            supplier.red_flag_tender_count
                                        )}>
                                        <td className="hover:text-primary-blue">
                                            <p
                                                className="truncate-text"
                                                title={get(
                                                    supplier,
                                                    'supplier_name'
                                                )}>
                                                {get(supplier, 'supplier_name')}
                                            </p>
                                        </td>
                                        <td className="hover:text-primary-blue">
                                            <p
                                                className="truncate-text"
                                                title={get(
                                                    supplier,
                                                    'supplier_code'
                                                )}>
                                                {get(supplier, 'supplier_code')}
                                            </p>
                                        </td>
                                        {!hasCountry() && (
                                            <td>
                                                {get(
                                                    supplier,
                                                    'country_name',
                                                    '-'
                                                )}
                                            </td>
                                        )}
                                        <td>
                                            {get(
                                                supplier,
                                                Default.TENDER_COUNT
                                            )}
                                        </td>
                                        <td>
                                            {get(supplier, 'buyer_count', 0)}
                                        </td>
                                        <td>
                                            {get(
                                                supplier,
                                                'product_category_count',
                                                0
                                            )}
                                        </td>
                                        <td>
                                            {supplier[Default.AMOUNT_USD] &&
                                                supplier[
                                                    Default.AMOUNT_USD
                                                ].toLocaleString('en')}
                                        </td>
                                        <td className="text-center">
                                            {formatDecimal(
                                                get(
                                                    supplier,
                                                    'red_flag_tender_percentage',
                                                    0
                                                )
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {!originalData.length && (
                        <div
                            className="flex items-center justify-center bg-white rounded-md"
                            style={{
                                height: '75%',
                                minHeight: '250px'
                            }}>
                            <p>
                                <T _str="No data available" />
                            </p>
                        </div>
                    )}
                </div>
                {tableLoading && <TableLoader />}
            </div>

            <div>
                <div className="mt-2 text-sm text-right">
                    <p className="text-opacity-50 text-primary-dark">
                        <T _str="Showing" />{' '}
                        <span className="text-opacity-75 text-primary-dark">
                            {1 + currentPage * limit}
                        </span>{' '}
                        -{' '}
                        <span className="text-opacity-75 text-primary-dark">
                            {limit + currentPage * limit > totalItems
                                ? totalItems
                                : limit + currentPage * limit}
                        </span>{' '}
                        of{' '}
                        <span className="text-opacity-75 text-primary-dark">
                            {totalItems}
                        </span>{' '}
                        <T _str="suppliers" />
                    </p>
                </div>

                <div className="pagination-container">
                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={totalItems / limit}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={10}
                        onPageChange={LoadSuppliersList}
                        containerClassName={'pagination-items'}
                        pageClassName={'pagination-item'}
                        previousClassName={'pagination-item prev'}
                        nextClassName={'pagination-item next'}
                        activeClassName={'active'}
                    />
                </div>
            </div>
        </div>
    )
}

SupplierTable.propTypes = {
    params: PropTypes.object
}

export default SupplierTable
