import React, { useEffect, useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import CmsPageService from '../../../../services/CmsPageService'
import useTrans from '../../../../hooks/useTrans'
import { formatDate, formatTime } from '../../../../helpers/date'
import Loader from '../../../../components/Loader/Loader'

const LibraryUpcomingEvents = () => {
    const [eventList, setEventsData] = useState([])
    const [loading, setLoading] = useState(true)
    const { trans } = useTrans()

    useEffect(() => {
        CmsPageService.EventList({ limit: 3 })
            .then((response) => {
                setEventsData(response.items)
                setLoading(false)
            })
    }, [])

    return (
        <section className="px-4 events bg-primary-gray py-24">
            <div className="container mx-auto">
                <div className="text-center">
                    <p className="text-xl blue-50 pb-10">
                        {trans('Upcoming Events')}
                    </p>
                </div>
                {loading ? (<Loader />) : eventList.length ? (
                    <Fragment>
                        <div className="grid grid-cols-12 gap-x-0 gap-y-4 sm:gap-4 card">
                            {eventList && eventList.map((event) => {
                                return (
                                    <Link
                                        className="events-thumbnail"
                                        to={`/events/${event.id}`}
                                        key={event.id}>
                                        <div className="card__item h-full px-8 py-8">
                                            <div className="card__day text-4xl leading-none">
                                                {formatDate(event.event_date, 'DD')}
                                            </div>
                                            <div className="card__month text-base uppercase">
                                                {formatDate(event.event_date, 'MMMM')}
                                            </div>
                                            <div className="card__caption">
                                                <h3 className="card__title mt-8 mb-4 text-lg">
                                                    {event.title}
                                                </h3>
                                                <div className="card__time opacity-50 text-base mb-4 uppercase flex">
                                                    <p className="from mr-1">
                                                        {formatTime(event.time_from)}
                                                    </p>
                                                    {event.time_to && (
                                                        <p className="to ml-1">
                                                            - {formatTime(event.time_to)}
                                                        </p>
                                                    )}
                                                </div>

                                                <p className="card__venue text-base">
                                                    {event.location}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                        <div className="flex justify-center pt-10">
                            <Link to="/events" className="text-blue-20">
                                {trans('View all events')} --&gt;{' '}
                            </Link>
                        </div>
                    </Fragment>
                ) : (
                    <p>{trans('There are no events')}</p>
                )}
            </div>
        </section>
    )
}

export default LibraryUpcomingEvents