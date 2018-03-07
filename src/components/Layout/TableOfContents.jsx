import React from "react"
import Link from 'gatsby-link'
import styled from 'styled-components'
import config from "../../../data/SiteConfig"



// This class should not be used for listing posts, but for chapter based Docs. See PostListing for that.
// You'll also need to add your chapters to siteConfig

class TableOfContents extends React.Component {
  buildChapters() {
    const type = this.props.contentsType
    const chapterOrdering = config.chapterOrdering;
    chapterOrdering.push("Misc"); /* catch-all */

    /* step 1 - get the details of all posts matching this type */
    const posts = this.props.posts.filter(
      (post) => post.node.frontmatter.type === type.toLowerCase()
    ).map((post) => ({
      title: post.node.frontmatter.title,
      path: post.node.fields.slug,
      order: post.node.frontmatter.order,
      chapter: post.node.frontmatter.chapter
    }));

    /* step 2 - place them into chapters */
    const postsPerChapter = chapterOrdering.map(() => []);
    posts.forEach((post) => {
      let chapterIdx = chapterOrdering.indexOf(post.chapter);
      if (chapterIdx === -1) chapterIdx = chapterOrdering.length - 1;
      postsPerChapter[chapterIdx].push(post);
    })

    /* step 3 - sort within each chapter on "order" set in frontmatter */
    postsPerChapter.forEach((postsInChapter) => {
      postsInChapter.sort((a, b) => a.order > b.order)
    })

    console.log("postsPerChapter", postsPerChapter)
    return {chapterOrdering, postsPerChapter}
  }

  generateItems() {
    const {chapterOrdering, postsPerChapter} = this.buildChapters()
    const chaptersAndItems = []

    for (let i = 0; i < chapterOrdering.length; i++) {
      if (postsPerChapter[i].length) {
        const items = postsPerChapter[i].map((post) => (
          <LessonContainer key={post.path}>
            <Link to={post.path}>
              <li>
                <span>
                  <p>{post.order} &nbsp;</p>
                  <h6>{post.title}</h6>
                </span>
              </li>
            </Link>
          </LessonContainer>
        ))
        const chapterName = chapterOrdering[i].toUpperCase();
        chaptersAndItems.push(
          <li key={chapterName} className='chapter'>
            <h5 className='tocHeading'>
              {chapterName}
            </h5>
            <ul className='chapterItems'>
              {items}
            </ul>
          </li>
        )
      }
    }
    return chaptersAndItems
  }

  render() {
    return (
      <TableOfContentsContainer>
        <ul>
          {this.generateItems()}
        </ul>
      </TableOfContentsContainer>
    )
  }
}

const TableOfContentsContainer = styled.div`
  padding: ${props => props.theme.sitePadding};

  & > ul, .chapterItems {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  p, h6 {
    display: inline-block;
    font-weight: 200;
    margin: 0;
  }

  .tocHeading {
     font-weight: 200;
     color: ${props => props.theme.brand};
     margin-bottom: 10px;
  }
`

const LessonContainer = styled.div`
  h6, p {
    color: black;
    margin: 0;
    line-height: 1.5;
  }
  li {
    margin: 0;
  }
  &:hover {
    li {
      span {
        border-bottom: 1px solid black;
      }
    }
  }
`

export default TableOfContents
