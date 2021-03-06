import React from 'react'
import PropTypes from 'prop-types'
import { T } from '@transifex/react'

const PerCapitaSwitcher = (props) => {
    const { show = false, handleToggle, id = 'togglePerCapita' } = props

    return (
        <div className="my-4 w-full md:w-auto justify-center md:my-0 items-center text-center">
            <span className="mr-2 text-sm">
                <T _str="Spending USD" />
            </span>
            <div className="toggle-switch">
                <input
                    type="checkbox"
                    className="toggle-switch-checkbox"
                    name={id}
                    id={id}
                    onChange={() => handleToggle(!show)}
                />
                <label className="toggle-switch-label" htmlFor={id}>
                    <span className="toggle-switch-inner" />
                    <span className="toggle-switch-switch" />
                </label>
            </div>
            <span className="ml-2 text-sm">
                <T _str="Spending USD per capita" />
            </span>
        </div>
    )
}

PerCapitaSwitcher.propTypes = {
    show: PropTypes.bool,
    handleToggle: PropTypes.func,
    id: PropTypes.string
}

export default PerCapitaSwitcher
