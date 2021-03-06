import Api from './api'
import { getURI } from '../helpers/api'

class CmsPageService {
    static async NewsList(queryParams) {
        try {
            const res = await Api.get(getURI('pages'), {
                type: 'content.InsightsPage',
                // fields: "*",
                fields: '_,title,id,slug,content_image,featured,news_date',
                contents_type: 'News',
                order: '-news_date',
                ...queryParams
            })

            return res.body
        } catch (error) {
            return error
        }
    }

    static async NewsDetail(id) {
        const res = await Api.get(getURI('pages') + `/${id}`)

        return res.body
    }

    static async BlogList(queryParams) {
        try {
            const res = await Api.get(getURI('pages'), {
                type: 'content.InsightsPage',
                fields: '_,title,id,slug,content_image,news_date,country,contents_type,author,rendered_body',
                contents_type: 'Blog',
                order: '-news_date',
                ...queryParams
            })

            return res.body
        } catch (error) {
            return error
        }
    }

    static async BlogDetail(id) {
        const res = await Api.get(getURI('pages') + `/${id}`)

        return res.body
    }

    static async EventList(queryParams) {
        try {
            const res = await Api.get(getURI('pages'), {
                type: 'content.EventsPage',
                fields: '*',
                order: '-event_date',
                ...queryParams
            })

            return res.body
        } catch (error) {
            return error
        }
    }

    static async EventDetail(id) {
        const res = await Api.get(getURI('pages') + `/${id}`)

        return res.body
    }

    static async InsightList(queryParams) {
        try {
            const res = await Api.get(getURI('insights'), {
                order: '-year',
                ...queryParams
            })

            return res.body
        } catch (error) {
            return error
        }
    }

    static async StaticPageDetailBySlug(slug) {
        const response = await Api.get(getURI('pages'), { slug })

        if (
            response.body !== undefined &&
            response.body.items !== undefined &&
            response.body.items.length
        ) {
            const result = await Api.get(
                getURI('pages') + response.body.items[0].id
            )
            return result.body
        }

        return response.body
    }

    static async ResourceList(queryParams) {
        try {
            const res = await Api.get(getURI('pages'), {
                type: 'content.ResourcesPage',
                fields: '_,title,id,slug,published_date,country,resource_type,lang,topics,document,link',
                order: '-published_date',
                ...queryParams
            })

            return res.body
        } catch (error) {
            return error
        }
    }

    static async StaticMenuList(queryParams) {
        try {
            const res = await Api.get(getURI('pages'), {
                type: 'content.StaticPage',
                fields: '_,title,id,slug,show_in_header_menu,show_in_footer_menu',
                ...queryParams
            })

            return res.body
        } catch (error) {
            return error
        }
    }

    static async ResourceDetail(id) {
        const res = await Api.get(getURI('pages') + `/${id}`)

        return res.body
    }

    static async InsightSearch(queryParams) {
        try {
            const res = await Api.get(getURI('pages'), {
                type: 'content.InsightsPage',
                fields: '*',
                // order: "-news_date",
                ...queryParams
            })

            return res.body
        } catch (error) {
            return error
        }
    }

    static async MethodologyContent(params) {
        const response = await Api.get(getURI('pages'), {
            type: 'content.StaticPage',
            ...params
        })

        if (
            response.body !== undefined &&
            response.body.items !== undefined &&
            response.body.meta.total_count > 0
        ) {
            const result = await Api.get(
                getURI('pages') + response.body.items[0].id
            )

            return result.body
        }
        return {}
    }
}

export default CmsPageService
