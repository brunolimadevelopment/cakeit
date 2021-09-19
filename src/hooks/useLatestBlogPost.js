import { useStaticQuery, graphql } from 'gatsby'

export const useLatestBlogPost = () => {
    
    const data = useStaticQuery(graphql`

        query LatestBlogPostQuery {
            allWpPost(sort: {fields: date, order: DESC}) {
                edges {
                    node {
                        excerpt
                        title
                        uri
                    }
                }
            }
        }

    `)

    return data;
}