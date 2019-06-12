import ReactPaginate from 'react-paginate';
import Head from './components/Head';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Msg from './components/Msg';
import './chat.scss';

class Index extends React.Component {
  static async getInitialProps({
    query: {
      group, msgs, totalPageCount, currentPage,
    },
  }) {
    return {
      group, msgs, totalPageCount, currentPage,
    };
  }

  render() {
    const {
      group, msgs, totalPageCount, currentPage,
    } = this.props;

    return (
      <div>
        <Head />
        <Nav />
        <div className="chat-section section">
          <br />
          <div className="container">

            <div className="columns">
              <div className="column is-four-fifths ">
                <div className="">
                  <p className="title is-5">{group.name}</p>
                  <p className="subtitle is-6">{group.description}</p>
                  <div className="tabs">
                    <ul>
                      <li className="is-active"><a>Messages</a></li>
                      <li><a>Members</a></li>
                      <li><a>Topics</a></li>
                      <li><a>Statistics</a></li>
                    </ul>
                  </div>
                </div>

                <ReactPaginate
                  pageCount={totalPageCount}
                  initialPage={currentPage - 1}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={4}
                  previousLabel="←"
                  nextLabel="→"
                  containerClassName="paginate-container"
                  pageLinkClassName="button is-small"
                  previousLinkClassName="button is-small"
                  nextLinkClassName="button is-small"
                  breakLinkClassName="button is-small is-white"
                  disabledLinkClassName="button is-small disabled"
                  activeLinkClassName="is-dark active-link-mark"
                  hrefBuilder={num => `./${num}`}
                  // to enable redirect
                  // ref: https://github.com/AdeleD/react-paginate/issues/213
                  onPageChange={({ selected }) => {
                    if (selected !== currentPage - 1) {
                      setTimeout(() => {
                        document.querySelector('.active-link-mark').classList.remove('is-dark');
                        document.querySelector('.active-link-mark').classList.add('is-loading');
                        window.location = `/chat/${group.name}/page/${selected + 1}`;
                      }, 0);
                    }
                  }}
                />

                <div className="msg-section">

                  {
                    msgs.map(msg => (
                      <Msg
                        id={msg.id}
                        text={msg.text}
                        from={msg.from}
                        date={msg.date}
                      />
                    ))
                  }

                </div>
                <br />

              </div>
              <div className="column">
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder" />
                    </figure>
                  </div>
                  <div className="content has-text-centered">
                    <a className="has-text-grey" href="/advertise">ads</a>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
        <Footer />
      </div>
    );
  }
}

export default Index;
