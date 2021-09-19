const path = require("path")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const archiveTemplate = path.resolve("./src/templates/archive.js")

  const result = await graphql(`
    {
      wp {
        readingSettings {
          postsPerPage
        }
      }
      allWpCategory {
        edges {
          node {
            id
            name
            count
            uri
            slug
          }
        }
      }
    }
  `)

  // Check for errors
  if (result.errors) {
    reporter.panicOnBuild(`Something went horrible wrong!`, result.errors)
    return
  }

  const { allWpCategory, wp } = result.data

    // LOOP PARA PERCORRER TODAS AS CATEGORIAS QUE FORAM BUSCADAS COM A CONSULTA GRAPHQL
    allWpCategory.edges.forEach(category => {
    const postsPerPage  = wp.readingSettings.postsPerPage // Quantidade de posts por página
    const numberOfPosts = category.node.count // Quantidade total de posts
    const numPages      = Math.ceil(numberOfPosts / postsPerPage) // quantidade total de páginas para cada categoria

    // Alugmas categorias talvez estejam vazias e não queremos criar páginas para elas
    if (numberOfPosts > 0 || category.node.name !== "uncategorized") {
      Array.from({ length: numPages }).forEach((_, i) => {
        createPage({
          path:
            i === 0 ? `${category.node.uri}` : `${category.node.uri}${i + 1}`,
          component: archiveTemplate,
          context: { // contexto das páginas
            limit: postsPerPage,
            skip: i * postsPerPage,
            numPages,
            currentPage: i + 1,
            catId: category.node.id,
            catName: category.node.name,
            catUri: category.node.uri,
            categories: allWpCategory,
          },
        })
      })
    }
  })
}
