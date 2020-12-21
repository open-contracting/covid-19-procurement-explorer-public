// import React from 'react'
// import newsImage from '../assets/img/news.jpg'
// import { Link } from 'react-router-dom'
// import Insights from '../components/country/insights'

// function Resources() {
//     return (
//         <div className="resources px-4 pb-16 pt-24 bg-primary-gray -mt-8">
//             <div className="container mx-auto">
//                 <Insights/>
//             </div> 
//         </div>
        
//     )
// }

// export default Resources

import React, { Fragment, useState } from 'react'
import CountryProfileServices from '../services/countryProfileServices'
import { Link } from 'react-router-dom'
import { ReactComponent as SortIcon } from '../assets/img/icons/ic_sort.svg'
import { ReactComponent as FlagIcon } from '../assets/img/icons/ic_flag.svg'
import Select from 'react-select'
import newsImage from '../assets/img/news.jpg'

const Resources = () => {
    const options = [
        { value: 'option-1', label: 'Option 1' },
        { value: 'option-2', label: 'Option 2' },
        { value: 'option-3', label: 'Option 3' }
    ]

    let tempArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const tempTableData = tempArray.map((index) => {
        return (
            <tr className="table-row" key={index}>
                <td className="uppercase">
                    Health sector emergency response plan
                </td>
                <td>Mexico</td>
                <td className="uppercase">Open</td>
            </tr>
        )
    })

    return (
        <div className=" resources">
            <section className="px-4 resources__cards pt-24 pb-12 -mt-8">
                <div className="container mx-auto">
                    <h2 className="text-2xl mb-10">
                        Resources
                    </h2>
                    <div className="grid grid-cols-2 gap-x-20">
                        <div className="display__item">
                            <p className="text-xl mb-6 ">
                                News
                            </p>
                            <div className="news__item">
                                <div className="img-wrapper relative">
                                    <img src={newsImage} alt="" />
                                    <div className="news__caption px-6 py-6 text-white">
                                        <h3 className="news-caption__title">
                                            How COVID-19 has advanced the case for
                                            procurement reform
                                        </h3>
                                        <p className="news-caption__date mt-2">Nov 19, 2020</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="list__item">
                        <p className="text-lg mb-6 mt-4 uppercase">
                            Recent Posts
                        </p>
                            <div className="news__item flex">
                                <div className="img-wrapper h-auto">
                                    <img src={newsImage} alt="" />
                                </div>
                                <div className="news__caption pl-6">
                                    <h3 className="news-caption__title">
                                        How COVID-19 has advanced the case for
                                        procurement reform
                                    </h3>
                                    <p className="news-caption__date mt-2">Nov 19, 2020</p>
                                </div>
                            </div>
                            <div className="news__item flex">
                                <div className="img-wrapper h-auto">
                                    <img src={newsImage} alt="" />
                                </div>
                                <div className="news__caption pl-6">
                                    <h3 className="news-caption__title">
                                        How COVID-19 has advanced the case for
                                        procurement reform
                                    </h3>
                                    <p className="news-caption__date mt-2">Nov 19, 2020</p>
                                </div>
                            </div>
                            <div className="news__item flex">
                                <div className="img-wrapper h-auto">
                                    <img src={newsImage} alt="" />
                                </div>
                                <div className="news__caption pl-6">
                                    <h3 className="news-caption__title">
                                        How COVID-19 has advanced the case for
                                        procurement reform
                                    </h3>
                                    <p className="news-caption__date mt-2">Nov 19, 2020</p>
                                </div>
                            </div>
                        </div>
                            
                       
                    </div>
                </div>
            </section>
            <section className="resources__table py-12 bg-primary-gray">
                <div className="container mx-auto">
                    <h2 className="font-normal text-lg mb-6">
                        Best practices and solutions from our database
                    </h2>
                    <div className="mb-12 flex gap-8 ">
                        <div className="w-40">
                            <p className="uppercase text-xs opacity-50 leading-none">
                                Titles
                            </p>
                            <Select
                                className="select-filter text-sm"
                                classNamePrefix="select-filter"
                                options={options}
                                defaultValue={options[0]}
                            />
                        </div>
                        <div className="w-40">
                            <p className="uppercase text-xs opacity-50 leading-none">
                                Country
                            </p>
                            <Select
                                className="select-filter text-sm"
                                classNamePrefix="select-filter"
                                options={options}
                                defaultValue={options[0]}
                            />
                        </div>
                        <div className="w-40">
                            <p className="uppercase text-xs opacity-50 leading-none">
                                Type
                            </p>
                            <Select
                                className="select-filter text-sm"
                                classNamePrefix="select-filter"
                                options={options}
                                defaultValue={options[0]}
                            />
                        </div>
                        <div className="w-40">
                            <p className="uppercase text-xs opacity-50 leading-none">
                                Sector
                            </p>
                            <Select
                                className="select-filter text-sm"
                                classNamePrefix="select-filter"
                                options={options}
                                defaultValue={options[0]}
                            />
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '35%' }}>
                                    <span className="flex items-center">
                                        Title{' '}
                                        <SortIcon className="ml-1 cursor-pointer" />
                                    </span>
                                </th>
                                <th style={{ width: '15%' }}>
                                    <span className="flex items-center">
                                        Country{' '}
                                        <SortIcon className="ml-1 cursor-pointer" />
                                    </span>
                                </th>
                                <th style={{ width: '10%' }}>
                                    <span className="flex items-center">
                                        Type{' '}
                                        <SortIcon className="ml-1 cursor-pointer" />
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="table-row">
                                <td className="uppercase">
                                    Health sector emergency response plan
                                </td>
                                <td>Mexico</td>
                                <td className="uppercase">Open</td>
                            </tr>
                            {tempTableData}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

export default Resources