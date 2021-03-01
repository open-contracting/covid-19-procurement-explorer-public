import React from 'react'
import { useParams } from 'react-router-dom'
import {
    WorldTimelineMap,
    ProductsTimeline,
    ContractsCorrelation,
    ContractEquityIndicators,
    RedFlagSummary
} from "../../../components/Visualizations"
import NotFound from "../../../components/NotFound/NotFound"
import { useQuery } from "../../../helpers/general"
import Visualization from "../../../constants/Visualization"

const queryString = useQuery()

const EmbeddedVisualization = () => {
    const { visualizationId } = useParams()

    switch (visualizationId) {
        case Visualization.WORLD_MAP_RACE:
            return (<WorldTimelineMap />)
        case Visualization.PRODUCTS_TIMELINE:
            return (<ProductsTimeline params={{ country: queryString.get('country') }} />)
        case Visualization.CONTRACTS_CORRELATION:
            return (<ContractsCorrelation params={{ country: queryString.get('country') }} />)
        case Visualization.EQUITY_INDICATORS:
            return (<ContractEquityIndicators params={{ country: queryString.get('country') }} />)
        case Visualization.RED_FLAG_SUMMARY:
            return (<RedFlagSummary params={{ country: queryString.get('country') }} />)
        default:
            return (<NotFound />)
    }
}

export default EmbeddedVisualization