import Api from './api'
import { getURI } from '../helpers/api'

class CountryService {
    static async Countries() {
        try {
            const response = await Api.get(getURI('countries'))
            return response.body
        } catch (error) {
            console.log(error)
        }
    }

    static async CountryProfileData(slug) {
        try {
            const response = await Api.get(getURI('countries') + `/${slug}`)
            return response.body
        } catch (error) {
            console.log(error)
        }
    }

    static async ContractDetail(contractsId) {
        try {
            const response = await Api.get(
                `${getURI('contracts')}/${contractsId}`
            )
            return response.body
        } catch (error) {
            console.log(error)
        }
    }

    static async GetGlobalMapData() {
        try {
            const res = await Api.get(getURI('visualization.world-map-race'))

            return res.body
        } catch (error) {
            console.log(error)
        }
    }

    static async DirectOpenContractTrend() {
        try {
            const res = await Api.get(
                getURI('visualization.direct-open-contract-trend')
            )

            return res.body
        } catch (error) {
            console.log(error)
        }
    }

    static async BuyerTrend() {
        try {
            const res = await Api.get(getURI('visualization.buyer-trend'))

            return res.body
        } catch (error) {
            console.log(error)
        }
    }

    static async SupplierTrend() {
        try {
            const res = await Api.get(getURI('visualization.supplier-trend'))

            return res.body
        } catch (error) {
            console.log(error)
        }
    }

    static async getLanguages() {
        try {
            const res = await Api.get(getURI('languages'))
            return res.body
        } catch (error) {
            console.log(error)
        }
    }

    static async DataProviders(params) {
        try {
            const res = await Api.get(getURI('country-data-providers'), params)

            return res.body
        } catch (error) {
            console.log(error)
        }
    }
}

export default CountryService
