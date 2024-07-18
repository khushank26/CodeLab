import "./Prob_list.css"
import { Link, Navigate } from 'react-router-dom';
import Markdown from 'react-markdown'
export function ProblemContent({ id, description, difficulty, title }) {
  return <>

    <div className="content_copy">
      <div className="back_copy">
        <div className="animation"></div>
        <div className="back_content_copy">


          <div className="Prob_1" style={{ height: 6 }}>
            {title}
          </div>

          <div className="prob_header">

            <Markdown>{ description}</Markdown>
          </div>
          <div className="prob_footer">
            <Link to={`/problem/${id}`}>
              <button className="cssbuttons-io" >
                <span>
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z"
                      fill="currentColor"
                    />
                  </svg>
                  Code
                </span>
              </button>
            </Link>

          </div>
        </div>

      </div>
    </div>
  </>
}