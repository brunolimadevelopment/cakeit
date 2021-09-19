import { useStaticQuery, graphql } from "gatsby"

export const useMenuQuery = () => {
    
    const data = useStaticQuery(graphql`
    
        query HeaderQuery {
            site {
                siteMetadata {
                    title
                }
            }
            # renomeei wpMenu para menu
            menu: wpMenu(name: {eq: "mainMenu"}) {
                menuItems {
                nodes {
                    label
                    url
                    parentId
                    id
                    childItems {
                        nodes {
                            label
                            id
                            url
                        }
                    }
                }
                }
            }
        }
    `)

    return data;
}