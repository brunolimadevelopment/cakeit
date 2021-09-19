import React from 'react'
import { Link, graphql } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'


import Layout from '../components/Layout/Layout'
import BreadCrumb from '../components/Breadcrumb/Breadcrumb'
import ArchiveSidebar from '../components/ArchiveSidebar/ArchiveSidebar'
import Pagination from '../components/Pagination/Pagination'

import { 
    Wrapper, 
    ContentWrapper, 
    PageContent, 
    StyledH2, 
    StyledDate, 
    StyledReadMore 
} from './archive.styles'

const archiveTemplate = ({ 
    data: { allWpPost }, 
    pageContext: {
        catId, 
        catName, 
        catUri, 
        categories, 
        numPages, 
        currentPage
    }
}) => (
    <Layout>
        <StaticImage
            src="../images/archive_headerimage.png"
            placeholder="TRACED_SVG"
            width={1920}
            height={300}
            alt="Archive Hero"
        />
        <Wrapper>
            <BreadCrumb parent={{
                uri: "/blog/all-posts",
                title: "blog"
            }} />
            <ContentWrapper>
                <ArchiveSidebar catId={catId} categories={categories.edges} />
                <PageContent>
                    <h1 dangerouslySetInnerHTML={{ __html: catName }} />
                    {allWpPost.edges.map(post => (
                        <article key={post.node.id} className="entry-content">
                            <Link to={`/blog${post.node.uri}`}>
                                <StyledH2 dangerouslySetInnerHTML={{ __html: post.node.title }} />
                            </Link>
                            <StyledDate dangerouslySetInnerHTML={{ __html: post.node.date }} />
                            <p dangerouslySetInnerHTML={{ __html: post.node.excerpt }} />
                            <StyledReadMore to={`/blog${post.node.uri}`}>
                                Read more
                            </StyledReadMore>
                            <div className="dot-divider" />
                        </article>
                    ))}

                    <Pagination 
                        catUri={catUri}
                        page={currentPage}
                        totalPages={numPages}
                    />
                </PageContent>
            </ContentWrapper>
        </Wrapper>
    </Layout>
)

export default archiveTemplate

export const pageQuery = graphql`

    # o uso da ! indica que o valor da variavel não pode ser nulo.
    query($catId: String!, $skip: Int!, $limit: Int!) {
        allWpPost(
            filter: { # pega a categoria especifica filtrando pelo ID
                categories: { 
                    nodes: { 
                        elemMatch: { 
                            id: { 
                                eq: $catId 
                            } 
                        } 
                    } 
                } 
            } 
            skip: $skip # Paginação
            limit: $limit # Limite
        ) {
            edges {
                node {
                    id
                    title
                    excerpt
                    uri
                    slug
                    date(formatString: "DD MM YYYY")
                }
            }
        }
    }
`