import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Breadcrumb from '../components/breadcrumb/breadcrumb';
import ProfileBadge from '../components/profile-badge/profile-badge';
import ProfileContent from '../components/profile-content/profile-content';
import ProfileFilterMenu from '../components/profile-filter-menu/profile-filter-menu';
import GitHubIcon from '-!svg-react-loader!../images/github.svg';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = ({ data }) => {
  const [selectedFilter, setSelectedFilter] = useState(1);
  const [listChange, setListChange] = useState(0);
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  const [bookmarkedRulesCount, setBookmarkedRulesCount] = useState();
  const [likedRulesCount, setLikedRulesCount] = useState();
  const [dislikedRulesCount, setDislikedRulesCount] = useState();

  useEffect(() => {}, [listChange, user]);
  if (isAuthenticated) {
    return (
      <>
        <Breadcrumb title="Profile" />
        <div className="rule-category rounded">
          <section className="mb-20 pb-2 rounded">
            <div className="profile-header rounded-t">
              <div className="grid-container">
                <div className="profile-image">
                  <ProfileBadge size="6.25rem" />
                </div>
                <div className="profile-large-name">
                  {isAuthenticated ? user.name : ''}
                </div>
                <div className="username">@{user ? user.nickname : ''}</div>
                <a
                  className="github-link"
                  href={`https://www.github.com/${user.nickname}`}
                >
                  <GitHubIcon className="profile-github-icon" />
                  Manage GitHub account
                </a>
              </div>
              <ProfileFilterMenu
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                bookmarkedRulesCount={bookmarkedRulesCount}
                likedRulesCount={likedRulesCount}
                dislikedRulesCount={dislikedRulesCount}
                change={listChange}
              />
            </div>
            <div>
              <ProfileContent
                data={data}
                filter={selectedFilter}
                setListChangeCallback={setListChange}
                listChange={listChange}
                setBookmarkedRulesCount={setBookmarkedRulesCount}
                setLikedRulesCount={setLikedRulesCount}
                setDislikedRulesCount={setDislikedRulesCount}
              />
            </div>
          </section>
        </div>
      </>
    );
  } else {
    return (
      <div className="logged-out-message">
        <button
          onClick={async () => {
            const currentPage =
              typeof window !== 'undefined'
                ? window.location.pathname.split('/').pop()
                : null;
            await loginWithRedirect({
              appState: {
                targetUrl: currentPage,
              },
            });
          }}
        >
          Login to view profile
        </button>
      </div>
    );
  }
};
Profile.propTypes = {
  data: PropTypes.object.isRequired,
};

const ProfileWithQuery = (props) => (
  <StaticQuery
    query={graphql`
      query ProfilePageQuery {
        allMarkdownRemark(filter: { frontmatter: { type: { eq: "rule" } } }) {
          nodes {
            excerpt(format: HTML, pruneLength: 500)
            frontmatter {
              title
              uri
              guid
              authors {
                title
              }
            }
            htmlAst
          }
        }
      }
    `}
    render={(data) => <Profile data={data} {...props} />}
  />
);

export default ProfileWithQuery;