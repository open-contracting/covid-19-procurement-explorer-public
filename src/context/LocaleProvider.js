import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useLanguages } from '@transifex/react'

const LocaleContext = React.createContext()
const SwitchLocaleContext = React.createContext()
const MultiLocaleContext = React.createContext()

export function useLocale() {
    return useContext(LocaleContext)
}

export function useSwitchLocale() {
    return useContext(SwitchLocaleContext)
}

export function useAvailableLocales() {
    return useContext(MultiLocaleContext)
}

export function LocaleProvider({ children }) {
    const availableLocales = useLanguages()
    const [locale, setLocale] = useState(window.localStorage.getItem('locale'))

    function switchLocale(locale) {
        window.localStorage.setItem('locale', locale)
        setLocale(locale)
    }

    return (
        <MultiLocaleContext.Provider value={availableLocales}>
            <LocaleContext.Provider value={locale}>
                <SwitchLocaleContext.Provider value={switchLocale}>
                    {children}
                </SwitchLocaleContext.Provider>
            </LocaleContext.Provider>
        </MultiLocaleContext.Provider>
    )
}

LocaleProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string
    ]).isRequired
}
